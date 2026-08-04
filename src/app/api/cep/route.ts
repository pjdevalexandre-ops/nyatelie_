import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cep = searchParams.get("cep")?.replace(/\D/g, "");

  if (!cep || cep.length !== 8) {
    return NextResponse.json({ error: "CEP inválido. Digite 8 números." }, { status: 400 });
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      headers: { "User-Agent": "NyAtelie/1.0" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Erro ao consultar CEP" }, { status: 500 });
    }

    const data = await res.json();
    if (data.erro) {
      return NextResponse.json({ error: "CEP não encontrado" }, { status: 444 });
    }

    return NextResponse.json({
      logradouro: data.logradouro || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      uf: data.uf || "",
    });
  } catch (error) {
    return NextResponse.json({ error: "Falha na busca do CEP" }, { status: 500 });
  }
}
