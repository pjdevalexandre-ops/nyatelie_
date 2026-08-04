import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { position: "asc" },
    include: { variations: true },
  });

  return NextResponse.json(products);
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

    const count = await prisma.product.count();

    const product = await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        position: count + 1,
        variations: {
          create: variations.map((v: { size: string; price: number; imageUrl?: string }) => ({
            size: v.size,
            price: Number(v.price),
            imageUrl: v.imageUrl || null,
          })),
        },
      },
      include: { variations: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { items } = await request.json(); // Array de { id, position }
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
