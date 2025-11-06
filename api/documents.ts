import type { VercelRequest, VercelResponse } from "@vercel/node";
import { selectFromTable, insertIntoTable, deleteFromTable } from "./db.ts";
import formidable, { File } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ParsedFile {
  filename: string;
  content: string;
  fileType: string;
  fileSize: number;
}

async function parseUploadedFile(file: File): Promise<ParsedFile | null> {
  try {
    if (!file.filepath) {
      throw new Error("Filepath não disponível");
    }

    const filename = file.originalFilename || "unknown";
    const fileType = file.mimetype?.split("/")[1] || "unknown";

    let content = "";

    if (fileType === "pdf") {
      content = `[PDF] Arquivo: ${filename}`;
    } else {
      content = fs.readFileSync(file.filepath, "utf-8");
    }

    const fileSize = fs.statSync(file.filepath).size;

    return {
      filename,
      content,
      fileType,
      fileSize,
    };
  } catch (error) {
    console.error("Erro ao processar arquivo:", error);
    return null;
  }
}

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
      const documents = await selectFromTable("documents", {
        order: { column: "created_at", ascending: false },
      });
      return res.status(200).json(documents || []);
    }

    if (req.method === "POST") {
      const form = formidable({
        maxFileSize: 10 * 1024 * 1024,
      });

      const [fields, files] = await form.parse(req);
      const fileArray = files.file;

      if (!fileArray || fileArray.length === 0) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      const uploadedFile = fileArray[0];
      const parsed = await parseUploadedFile(uploadedFile);

      if (!parsed) {
        return res.status(400).json({ error: "Erro ao processar arquivo" });
      }

      const result = await insertIntoTable("documents", {
        filename: parsed.filename,
        content: parsed.content,
        file_type: parsed.fileType,
        file_size: parsed.fileSize,
      });

      if (uploadedFile.filepath) {
        fs.unlinkSync(uploadedFile.filepath);
      }

      return res.status(201).json(result?.[0] || {});
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "ID é obrigatório" });
      }

      await deleteFromTable("documents", { id: parseInt(String(id)) });
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Documents API Error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
