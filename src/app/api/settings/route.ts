import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: "default",
          whatsappNumber: "5511999999999",
          heroTitle: "Peças únicas em crochê, tecidas com carinho & afeto",
          heroSubtitle: "Cada ponto carrega dedicação e história. Feitas sob encomenda para transformar seu lar ou presentear quem você ama.",
        },
      });
    }

    // Não retornar a senha em chamadas públicas
    const { adminPassword, ...publicSettings } = settings;
    return NextResponse.json(publicSettings);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar configurações" }, { status: 500 });
  }
}
