import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ error: "Senha é obrigatória" }, { status: 400 });
    }

    const settings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });

    const storedHash = settings?.adminPassword || "$2a$10$w8V0r9pE.g1Q9B4S1cZ2eeX7N5V0x.X1zJ4c7.N5q3G1y8Z1xJ4c7";
    const isValid = await bcrypt.compare(password, storedHash);

    if (!isValid) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    const token = signAdminToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set("nyatelie_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Falha na autenticação" }, { status: 500 });
  }
}
