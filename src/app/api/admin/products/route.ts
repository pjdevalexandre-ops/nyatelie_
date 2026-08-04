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
  } catch {
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

    if (!name || !description || !imageUrl || !variations || variations.length === 0) {
      return NextResponse.json(
        { error: "Todos os campos e ao menos uma variação são obrigatórios" },
        { status: 400 }
      );
    }

    let count = 0;
    try {
      count = await prisma.product.count();
    } catch {
      count = 0;
    }

    const product = await prisma.product.create({
      data: {
        name: String(name).trim(),
        description: String(description).trim(),
        imageUrl: String(imageUrl).trim(),
        position: count + 1,
        variations: {
          create: variations.map((v: { size: string; price: number; imageUrl?: string }) => ({
            size: String(v.size || "Tamanho Único").trim(),
            price: Number(v.price) || 0,
            imageUrl: v.imageUrl ? String(v.imageUrl).trim() : null,
          })),
        },
      },
      include: { variations: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json({ error: "Erro interno ao salvar produto no banco de dados" }, { status: 500 });
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
          data: { position: item.position },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao reordenar produtos" }, { status: 500 });
  }
}
