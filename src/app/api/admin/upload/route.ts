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
      return NextResponse.json({ error: "Nenhum arquivo de foto selecionado" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";

    // Data URL base64 com limitação de tamanho para não estourar payload
    const base64Image = `data:${mimeType};base64,${buffer.toString("base64")}`;

    if (base64Image.length > 2000000) {
      return NextResponse.json(
        { error: "A foto escolhida é muito grande. Escolha uma foto menor (até 1.5MB) ou cole o link da foto." },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: base64Image });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Erro ao processar arquivo de imagem" }, { status: 500 });
  }
}
