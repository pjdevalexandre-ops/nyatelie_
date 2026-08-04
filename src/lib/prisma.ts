import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaInstance() {
  // Em ambientes serverless (Vercel), a gravação direta no diretório de build pode falhar com 'Unable to open the database file' (Error code 14).
  // Copiamos o banco de leitura inicial para o diretório temporário efêmero (/tmp) onde a gravação é permitida.
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const tmpDbPath = path.join("/tmp", "dev.db");
    const sourceDbPath = path.join(process.cwd(), "prisma", "dev.db");

    if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
      try {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      } catch (e) {
        console.error("Erro ao copiar dev.db para /tmp:", e);
      }
    }

    return new PrismaClient({
      datasources: {
        db: {
          url: `file:${tmpDbPath}`,
        },
      },
      log: ["error"],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? getPrismaInstance();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
