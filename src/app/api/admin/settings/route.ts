import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const settings = await prisma.storeSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    return NextResponse.json({ error: "Configurações não encontradas" }, { status: 404 });
  }

  const { adminPassword, ...data } = settings;
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { whatsappNumber, heroTitle, heroSubtitle, currentPassword, newPassword } = data;

    const currentSettings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });

    let updatedPassword = currentSettings?.adminPassword;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Senha atual é requerida para alteração" }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(currentPassword, storedPassword(currentSettings?.adminPassword));
      if (!isMatch) {
        return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });
      }

      updatedPassword = await bcrypt.hash(newPassword, 10);
    }

    const updatedSettings = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: {
        whatsappNumber: whatsappNumber || currentSettings?.whatsappNumber,
        heroTitle: heroTitle || currentSettings?.heroTitle,
        heroSubtitle: heroSubtitle || currentSettings?.heroSubtitle,
        ...(newPassword ? { adminPassword: updatedPassword } : {}),
      },
      create: {
        id: "default",
        whatsappNumber: whatsappNumber || "5511999999999",
        heroTitle: heroTitle || "Peças únicas em crochê, tecidas com carinho & afeto",
        heroSubtitle: heroSubtitle || "Cada ponto carrega dedicação e história. Feitas sob encomenda para transformar seu lar ou presentear quem você ama.",
        adminPassword: updatedPassword || await bcrypt.hash("admin123", 10),
      },
    });

    const { adminPassword, ...publicData } = updatedSettings;
    return NextResponse.json(publicData);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar configurações" }, { status: 500 });
  }
}

function storedPassword(hash?: string) {
  return hash || "$2a$10$w8V0r9pE.g1Q9B4S1cZ2eeX7N5V0x.X1zJ4c7.N5q3G1y8Z1xJ4c7";
}
