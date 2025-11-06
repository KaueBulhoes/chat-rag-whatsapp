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

async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.EVOLUTION_API_URL}/message/sendText/${
        process.env.EVOLUTION_INSTANCE || "chat-rag"
      }`,
      {
        method: "POST",
        headers: {
          apikey: process.env.EVOLUTION_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: phoneNumber,
          text: message,
        }),
      }
    );

    if (!response.ok) {
      console.error("Evolution API error:", await response.text());
      return false;
    }

    console.log(`Mensagem enviada para ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error("Erro ao enviar mensagem WhatsApp:", error);
    return false;
  }
}

async function processMessage(
  phoneNumber: string,
  userMessage: string
): Promise<string> {
  try {
    const configs = await selectFromTable<Config>("configs", {
      limit: 1,
      order: { column: "created_at", ascending: false },
    });

    if (!configs || configs.length === 0) {
      return "Sistema não está configurado. Entre em contato com o administrador.";
    }

    const config = configs[0];

    if (!config.api_key_openrouter) {
      return "API de IA não configurada.";
    }

    const documents = await selectFromTable<Document>("documents", {
      limit: 5,
    });

    const documentsContext =
      documents && documents.length > 0
        ? documents
            .map((doc) => `Documento: ${doc.filename}\n${doc.content}`)
            .join("\n\n---\n\n")
        : "Nenhum documento disponível";

    const systemPrompt = `${
      config.system_prompt || "Você é um assistente útil."
    }\n\nContexto dos documentos:\n${documentsContext}`;

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
          "X-Title": "Chat IA com RAG WhatsApp",
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
              content: userMessage,
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
      return "Desculpe, ocorreu um erro ao processar sua mensagem.";
    }

    const aiData = await openRouterResponse.json();
    const response =
      (aiData as { choices?: Array<{ message?: { content?: string } }> })
        .choices?.[0]?.message?.content || "Sem resposta";

    try {
      const conversationData: Conversation = {
        whatsapp_id: phoneNumber,
        user_message: userMessage,
        ai_response: response,
        model_used: config.selected_model || "gpt-3.5-turbo",
        documents_used: documents?.map((d) => String(d.id)) || [],
      };

      await insertIntoTable("conversations", conversationData);
    } catch (saveError) {
      console.error("Erro ao salvar conversa:", saveError);
    }

    return response;
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
    return "Desculpe, ocorreu um erro. Tente novamente.";
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === "GET") {
      const { challenge } = req.query;
      if (challenge) {
        return res.status(200).json({ challenge });
      }
      return res.status(200).json({ ok: true });
    }

    if (req.method === "POST") {
      const { data } = req.body;

      if (!data) {
        return res.status(400).json({ error: "Payload inválido" });
      }

      console.log("Webhook recebido:", data);

      const phoneNumber = data.key?.remoteJid || data.from;
      const messageText = data.message?.text || data.body;

      if (!phoneNumber || !messageText) {
        console.log("Mensagem sem telefone ou texto");
        return res.status(200).json({ ok: true });
      }

      const aiResponse = await processMessage(phoneNumber, messageText);

      const sent = await sendWhatsAppMessage(phoneNumber, aiResponse);

      if (!sent) {
        console.error("Falha ao enviar resposta");
      }

      return res.status(200).json({ ok: true, processed: true });
    }

    res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
