import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const data = await request.json();
    const { name, description, imageUrl, variations } = data;

    // Atualiza os dados básicos do produto
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
      },
    });

    // Substituir as variações
    await prisma.productVariation.deleteMany({
      where: { productId: id },
    });

    if (variations && variations.length > 0) {
      await prisma.productVariation.createMany({
        data: variations.map((v: { size: string; price: number; imageUrl?: string }) => ({
          productId: id,
          size: v.size,
          price: Number(v.price),
          imageUrl: v.imageUrl || null,
        })),
      });
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: { variations: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir produto" }, { status: 500 });
  }
}
