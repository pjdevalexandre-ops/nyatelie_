import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { position: "asc" },
      include: { variations: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos no admin:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { name, description, imageUrl, category, variations } = data;

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "Nome do produto é obrigatório" }, { status: 400 });
    }
    if (!description || !String(description).trim()) {
      return NextResponse.json({ error: "Descrição do produto é obrigatória" }, { status: 400 });
    }
    if (!imageUrl || !String(imageUrl).trim()) {
      return NextResponse.json({ error: "Foto do produto é obrigatória" }, { status: 400 });
    }

    let safeImageUrl = String(imageUrl).trim();
    if (safeImageUrl.length > 2000000) {
      return NextResponse.json(
        { error: "A imagem selecionada é muito pesada. Escolha uma foto de até 1.5MB ou link da foto." },
        { status: 400 }
      );
    }

    let safeVariations = Array.isArray(variations) && variations.length > 0
      ? variations.map((v: { size?: string; price?: number | string; imageUrl?: string }) => ({
          size: String(v.size || "Tamanho Único").trim(),
          price: Math.max(0, parseFloat(String(v.price).replace(",", ".")) || 0),
          imageUrl: v.imageUrl ? String(v.imageUrl).trim() : null,
        }))
      : [{ size: "Tamanho Único", price: 50, imageUrl: null }];

    let position = 1;
    try {
      const count = await prisma.product.count();
      position = count + 1;
    } catch {
      position = 1;
    }

    const product = await prisma.product.create({
      data: {
        name: String(name).trim(),
        description: String(description).trim(),
        imageUrl: safeImageUrl,
        category: category ? String(category).trim() : "Geral",
        position,
        variations: {
          create: safeVariations,
        },
      },
      include: { variations: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Erro ao cadastrar produto:", error);
    const msg = error instanceof Error ? error.message : "Erro no banco de dados";
    return NextResponse.json({ error: `Erro ao salvar produto: ${msg}` }, { status: 500 });
  }
}
