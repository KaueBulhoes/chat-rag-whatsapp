import type { VercelRequest, VercelResponse } from "@vercel/node";
import { selectFromTable, insertIntoTable, updateTable } from "./db.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  try {
    if (req.method === "GET") {
      const configs = await selectFromTable("configs", {
        limit: 1,
        order: { column: "created_at", ascending: false },
      });

      return res.status(200).json(configs);
    }

    if (req.method === "POST") {
      const { api_key_openrouter, selected_model, system_prompt } = req.body;

      if (!api_key_openrouter) {
        return res.status(400).json({ error: "API Key é obrigatória" });
      }

      const result = await insertIntoTable("configs", {
        api_key_openrouter,
        selected_model: selected_model || "gpt-3.5-turbo",
        system_prompt: system_prompt || "Você é um assistente útil.",
      });

      return res.status(201).json(result?.[0] || {});
    }

    if (req.method === "PUT") {
      const { id, api_key_openrouter, selected_model, system_prompt } =
        req.body;

      if (!id) {
        return res.status(400).json({ error: "ID é obrigatório" });
      }

      const result = await updateTable(
        "configs",
        {
          api_key_openrouter,
          selected_model,
          system_prompt,
          updated_at: new Date().toISOString(),
        },
        { id }
      );

      return res.status(200).json(result?.[0] || {});
    }

    res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Config API Error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
