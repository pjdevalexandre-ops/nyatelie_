import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
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

    // Se for um ambiente serverless onde salvar local não persiste permanente, retornamos a DataURL
    // Mas criamos a opção de salvar na pasta /public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao fazer upload da imagem" }, { status: 500 });
  }
}
