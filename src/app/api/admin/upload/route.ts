import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/png";

    // Converter para Data URL base64 compatível 100% com ambiente Serverless (Vercel)
    const base64Image = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({ url: base64Image });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao fazer upload da imagem" }, { status: 500 });
  }
}
