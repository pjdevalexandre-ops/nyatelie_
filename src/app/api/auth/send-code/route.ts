import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Número de celular é obrigatório" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: "Número de telefone inválido" }, { status: 400 });
    }

    // Gerar código de 6 dígitos no servidor
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Mensagem amigável de suporte
    const message = `Olá! Seu código de verificação para redefinir sua senha na NyAtelie é: *${code}*`;
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      code, // armazenado na sessão segura da API
      whatsappUrl,
      message: "Código de verificação enviado! Clique para receber seu código oficial via WhatsApp.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao gerar código de segurança" }, { status: 500 });
  }
}
