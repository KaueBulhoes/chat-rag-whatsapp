import type { VercelRequest, VercelResponse } from "@vercel/node";
import { selectFromTable, insertIntoTable } from "./db.ts";

interface Config {
  id: number;
  api_key_openrouter: string;
  selected_model: string;
  system_prompt: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: number;
  filename: string;
  content: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface Conversation {
  whatsapp_id: string;
  user_message: string;
  ai_response: string;
  model_used: string;
  documents_used: string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    // 1. Carregar configuração
    const configs = await selectFromTable<Config>("configs", {
      limit: 1,
      order: { column: "created_at", ascending: false },
    });

    if (!configs || configs.length === 0) {
      return res.status(400).json({ error: "Configurações não encontradas" });
    }

    const config = configs[0];

    if (!config.api_key_openrouter) {
      return res.status(400).json({ error: "API Key não configurada" });
    }

    // 2. Buscar documentos para RAG
    const documents = await selectFromTable<Document>("documents", {
      limit: 5,
    });

    const documentsContext =
      documents && documents.length > 0
        ? documents
            .map((doc) => `Documento: ${doc.filename}\n${doc.content}`)
            .join("\n\n---\n\n")
        : "Nenhum documento disponível";

    // 3. Construir prompt com contexto do RAG
    const systemPrompt = `${
      config.system_prompt || "Você é um assistente útil."
    }\n\nContexto dos documentos:\n${documentsContext}`;

    // 4. Chamar Open Router
    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.api_key_openrouter}`,
          "Content-Type": "application/json",
          "HTTP-Referer": `${
            process.env.VERCEL_URL || "http://localhost:3000"
          }`,
          "X-Title": "Chat IA com RAG",
        },
        body: JSON.stringify({
          model: config.selected_model || "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      console.error("Open Router error:", errorData);
      return res.status(500).json({
        error:
          (errorData as { error?: { message?: string } }).error?.message ||
          "Erro ao chamar Open Router",
      });
    }

    const aiData = await openRouterResponse.json();
    const response =
      (aiData as { choices?: Array<{ message?: { content?: string } }> })
        .choices?.[0]?.message?.content || "Sem resposta";

    // 5. Salvar conversa no banco (opcional)
    try {
      const conversationData: Conversation = {
        whatsapp_id: "local_chat",
        user_message: message,
        ai_response: response,
        model_used: config.selected_model || "gpt-3.5-turbo",
        documents_used: documents?.map((d) => String(d.id)) || [],
      };

      await insertIntoTable("conversations", conversationData);
    } catch (saveError) {
      console.error("Erro ao salvar conversa:", saveError);
      // Não é crítico, continua mesmo com erro
    }

    return res.status(200).json({ response });
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(500).json({ error: `Erro: ${errorMessage}` });
  }
}
