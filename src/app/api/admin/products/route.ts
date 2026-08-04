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
    const { name, description, imageUrl, variations } = data;

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "Nome do produto é obrigatório" }, { status: 400 });
    }
    if (!description || !String(description).trim()) {
      return NextResponse.json({ error: "Descrição do produto é obrigatória" }, { status: 400 });
    }
    if (!imageUrl || !String(imageUrl).trim()) {
      return NextResponse.json({ error: "Foto do produto é obrigatória" }, { status: 400 });
    }

    // Se o usuário colocou uma imagem Base64 muito extensa, sanitizamos para evitar estouro no banco
    let safeImageUrl = String(imageUrl).trim();
    if (safeImageUrl.length > 2000000) {
      return NextResponse.json(
        { error: "A imagem selecionada é muito pesada. Por favor, escolha uma imagem menor ou use um link da foto." },
        { status: 400 }
      );
    }

    // Processar variações com valores seguros
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
        position,
        variations: {
          create: safeVariations,
        },
      },
      include: { variations: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Erro crítico ao cadastrar produto:", error);
    const msg = error instanceof Error ? error.message : "Erro no banco de dados";
    return NextResponse.json({ error: `Erro ao salvar no banco de dados: ${msg}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Dados inválidos para reordenação" }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item: { id: string; position: number }) =>
        prisma.product.update({
          where: { id: item.id },
          data: { position: Number(item.position) || 0 },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao reordenar:", error);
    return NextResponse.json({ error: "Erro ao reordenar produtos" }, { status: 500 });
  }
}
