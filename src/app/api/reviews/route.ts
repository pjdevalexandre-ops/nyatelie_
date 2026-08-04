import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Erro ao carregar avaliações:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const { name, city, comment, rating } = await request.json();

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "Por favor, informe seu nome." }, { status: 400 });
    }
    if (!comment || !String(comment).trim()) {
      return NextResponse.json({ error: "Por favor, escreva seu depoimento." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        name: String(name).trim(),
        city: city ? String(city).trim() : "São Miguel do Guamá - PA",
        comment: String(comment).trim(),
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    return NextResponse.json({ error: "Erro ao salvar avaliação no banco de dados." }, { status: 500 });
  }
}
