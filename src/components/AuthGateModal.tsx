"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { User, Phone, MapPin, Search, Loader2, Sparkles, Lock } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";

export default function AuthGateModal() {
  const { user, login } = useCart();

  const [mode, setMode] = useState<"login" | "register" | "admin">("register");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("São Miguel do Guamá");
  const [uf, setUf] = useState("PA");

  const [loadingCep, setLoadingCep] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (user) return null; // Usuário já autenticado

  const handleFetchCep = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setErrorMsg("Digite 8 números no CEP");
      return;
    }

    setLoadingCep(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/cep?cep=${cleanCep}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "CEP não encontrado");

      setStreet(data.logradouro || "");
      setNeighborhood(data.bairro || "");
      setCity(data.cidade || "São Miguel do Guamá");
      setUf(data.uf || "PA");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || "CEP não encontrado");
      } else {
        setErrorMsg("CEP não encontrado");
      }
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (mode === "admin") {
      if (password === "admin123" || password === "adminnyatelie") {
        login("91984829252", "Administrador NyAtelie", { role: "admin" });
        window.location.href = "/admin/dashboard";
      } else {
        setErrorMsg("Senha de administrador incorreta.");
      }
      return;
    }

    if (!phone.trim()) {
      setErrorMsg("Por favor, informe seu celular/WhatsApp.");
      return;
    }

    if (mode === "register") {
      if (!name.trim() || !cep.trim() || !street.trim() || !number.trim()) {
        setErrorMsg("Por favor, preencha nome e endereço completo para seu cadastro.");
        return;
      }
    }

    login(phone.trim(), name.trim() || "Cliente NyAtelie", {
      cep: cep.trim(),
      street: street.trim(),
      number: number.trim(),
      complement: complement.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      uf: uf.trim(),
      role: "customer",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-[#CBE3F5] p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        {/* Header do Portal com Logo */}
        <div className="text-center mb-6">
          <div className="relative w-20 h-20 mx-auto mb-3 rounded-2xl overflow-hidden shadow-md border-2 border-[#38A9E4] bg-[#38A9E4]">
            <Image src="/logo.png" alt="Logo NyAtelie" fill className="object-cover" priority />
          </div>

          <h2 className="font-serif-craft text-2xl font-bold text-[#1A364A]">
            {mode === "register" ? "Boas-vindas à NyAtelie!" : mode === "login" ? "Entrar na sua Conta" : "Acesso Administrativo"}
          </h2>
          <p className="text-xs text-[#4A6B82] mt-1">
            {mode === "register"
              ? "Faça seu cadastro rápido para personalizar seus pedidos de crochê"
              : mode === "login"
              ? "Informe seu WhatsApp cadastrado para acessar o site"
              : "Digite a senha de gestão para abrir o painel"}
          </p>
        </div>

        {/* Abas de Navegação */}
        <div className="flex bg-[#EBF3FA] p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => { setMode("register"); setErrorMsg(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "register" ? "bg-white text-[#38A9E4] shadow-xs" : "text-[#4A6B82]"
            }`}
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => { setMode("login"); setErrorMsg(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "login" ? "bg-white text-[#38A9E4] shadow-xs" : "text-[#4A6B82]"
            }`}
          >
            Já sou Cliente
          </button>
          <button
            type="button"
            onClick={() => { setMode("admin"); setErrorMsg(""); }}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              mode === "admin" ? "bg-white text-[#38A9E4] shadow-xs" : "text-[#4A6B82]"
            }`}
          >
            <Lock className="w-3 h-3" /> Admin
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "admin" ? (
            <div>
              <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider mb-1">
                Senha de Administrador *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A]"
              />
            </div>
          ) : (
            <>
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider mb-1">
                    Seu Nome Completo *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Maria Silva"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                    />
                    <User className="w-4 h-4 text-[#38A9E4] absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider mb-1">
                  Seu WhatsApp / Celular *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: (91) 98482-9252"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                  />
                  <Phone className="w-4 h-4 text-[#38A9E4] absolute left-3 top-3" />
                </div>
              </div>

              {mode === "register" && (
                <div className="pt-2 border-t border-[#CBE3F5]/60 space-y-2">
                  <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider">
                    Endereço de Entrega
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="CEP (ex: 68680000)"
                      required
                      className="flex-1 px-3 py-2 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                    />
                    <button
                      type="button"
                      onClick={handleFetchCep}
                      disabled={loadingCep}
                      className="px-3 py-2 rounded-xl bg-[#38A9E4] text-white text-xs font-semibold hover:bg-[#1E82BC] transition-colors flex items-center gap-1"
                    >
                      {loadingCep ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      CEP
                    </button>
                  </div>

                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Rua / Avenida *"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Número *"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                    />
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Complemento"
                      className="w-full px-3 py-2 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                    />
                  </div>

                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bairro"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cidade *"
                      required
                      className="col-span-2 px-3 py-2 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                    />
                    <input
                      type="text"
                      value={uf}
                      onChange={(e) => setUf(e.target.value)}
                      placeholder="UF *"
                      required
                      className="px-3 py-2 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-semibold text-xs tracking-wide transition-all shadow-md mt-4 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {mode === "register"
              ? "Concluir Cadastro & Entrar"
              : mode === "login"
              ? "Entrar no Site"
              : "Acessar Painel Admin"}
          </button>
        </form>

        <div className="mt-5 text-center border-t border-[#CBE3F5] pt-4">
          <a
            href="https://instagram.com/nyatelie_"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#4A6B82] hover:text-[#38A9E4] font-semibold"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-[#38A9E4]" />
            <span>Siga no Instagram @nyatelie_</span>
          </a>
        </div>
      </div>
    </div>
  );
}
