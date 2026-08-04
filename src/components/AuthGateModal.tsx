"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { User, Phone, Search, Loader2, Sparkles, Lock, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";

export default function AuthGateModal() {
  const { user, login } = useCart();

  const [mode, setMode] = useState<"login" | "register" | "forgot" | "admin">("register");
  
  // Campos de Formulário
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

  // Esqueceu a Senha / Resgate via SMS
  const [smsStep, setSmsStep] = useState<"send_phone" | "verify_code" | "new_password">("send_phone");
  const [smsCode, setSmsCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingSms, setLoadingSms] = useState(false);

  const [loadingCep, setLoadingCep] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  // Envio de código SMS simulado com código dinâmico de 6 dígitos
  const handleSendSmsCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!phone.trim()) {
      setErrorMsg("Informe seu número de celular com DDD.");
      return;
    }

    setLoadingSms(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setLoadingSms(false);
      setSmsStep("verify_code");
      setSuccessMsg(`Código SMS enviado para ${phone}! (Código de Teste: ${code})`);
    }, 1200);
  };

  const handleVerifySmsCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (smsCode.trim() !== generatedCode) {
      setErrorMsg("Código de verificação SMS incorreto. Tente novamente.");
      return;
    }

    setSmsStep("new_password");
    setSuccessMsg("Código verificado! Crie sua nova senha abaixo.");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newPassword || newPassword.length < 4) {
      setErrorMsg("A nova senha deve ter no mínimo 4 caracteres.");
      return;
    }

    setSuccessMsg("Senha alterada com sucesso! Entre agora com sua nova senha.");
    setMode("login");
    setPassword(newPassword);
    setSmsStep("send_phone");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (mode === "admin") {
      if (password === "admin123" || password === "adminnyatelie") {
        login("91984829252", "Administrador NyAtelie", { role: "admin" });
        window.location.href = "/admin/dashboard";
      } else {
        setErrorMsg("Senha de administrador incorreta.");
      }
      return;
    }

    if (mode === "login") {
      if (!name.trim()) {
        setErrorMsg("Por favor, informe seu nome cadastrado.");
        return;
      }
      if (!password || password.length < 4) {
        setErrorMsg("Por favor, digite sua senha de acesso.");
        return;
      }

      login(phone.trim() || "91999999999", name.trim(), {
        password,
        role: "customer",
      });
      return;
    }

    if (mode === "register") {
      if (!name.trim() || !phone.trim() || !password || !cep.trim() || !street.trim() || !number.trim()) {
        setErrorMsg("Por favor, preencha nome, celular, senha e endereço completo.");
        return;
      }

      if (password.length < 4) {
        setErrorMsg("Crie uma senha de no mínimo 4 dígitos.");
        return;
      }

      login(phone.trim(), name.trim(), {
        password,
        cep: cep.trim(),
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        uf: uf.trim(),
        role: "customer",
      });
    }
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
            {mode === "register"
              ? "Criar sua Conta"
              : mode === "login"
              ? "Entrar na sua Conta"
              : mode === "forgot"
              ? "Recuperar Senha por SMS"
              : "Acesso Administrativo"}
          </h2>
          <p className="text-xs text-[#4A6B82] mt-1">
            {mode === "register"
              ? "Cadastre-se com senha para personalizar e salvar seus pedidos de crochê"
              : mode === "login"
              ? "Digite seu nome e senha para acessar sua conta"
              : mode === "forgot"
              ? "Enviaremos um código SMS para confirmar seu celular"
              : "Digite a senha de gestão para abrir o painel"}
          </p>
        </div>

        {/* Abas de Navegação */}
        {mode !== "forgot" && (
          <div className="flex bg-[#EBF3FA] p-1 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => { setMode("register"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "register" ? "bg-white text-[#38A9E4] shadow-xs" : "text-[#4A6B82]"
              }`}
            >
              Criar Conta
            </button>
            <button
              type="button"
              onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "login" ? "bg-white text-[#38A9E4] shadow-xs" : "text-[#4A6B82]"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setMode("admin"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                mode === "admin" ? "bg-white text-[#38A9E4] shadow-xs" : "text-[#4A6B82]"
              }`}
            >
              <Lock className="w-3 h-3" /> Admin
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 bg-[#4A6B52]/15 border border-[#4A6B52] text-[#4A6B52] rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {mode === "forgot" ? (
          /* Fluxo de Esqueci Minha Senha com Envio de Código por SMS */
          <div className="space-y-4">
            {smsStep === "send_phone" && (
              <form onSubmit={handleSendSmsCode} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider mb-1">
                    Celular / WhatsApp Cadastrado *
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

                <button
                  type="submit"
                  disabled={loadingSms}
                  className="w-full py-3.5 px-4 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingSms ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Enviar Código SMS de Confirmação
                </button>
              </form>
            )}

            {smsStep === "verify_code" && (
              <form onSubmit={handleVerifySmsCode} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider mb-1">
                    Código SMS de 6 dígitos *
                  </label>
                  <input
                    type="text"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    placeholder="Digite os 6 dígitos recebidos"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A] text-center font-mono font-bold tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Validar Código SMS
                </button>
              </form>
            )}

            {smsStep === "new_password" && (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider mb-1">
                    Crie sua Nova Senha *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nova senha (min. 4 caracteres)"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Salvar Nova Senha & Entrar
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
              className="w-full py-2 text-xs font-semibold text-[#4A6B82] hover:text-[#38A9E4] flex items-center justify-center gap-1 mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Login
            </button>
          </div>
        ) : (
          /* Formulários de Cadastro, Login ou Admin */
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
                {/* Nome para Cadastro e para Login */}
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

                {mode === "register" && (
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
                )}

                {/* Campo de Senha em Ambos */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider">
                      Sua Senha de Acesso *
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => { setMode("forgot"); setErrorMsg(""); setSuccessMsg(""); }}
                        className="text-[11px] font-semibold text-[#38A9E4] hover:underline"
                      >
                        Esqueci minha senha
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                    />
                    <KeyRound className="w-4 h-4 text-[#38A9E4] absolute left-3 top-3" />
                  </div>
                </div>

                {mode === "register" && (
                  <div className="pt-2 border-t border-[#CBE3F5]/60 space-y-2">
                    <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider">
                      Endereço Completo para Entrega
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
                ? "Criar Minha Conta & Entrar"
                : mode === "login"
                ? "Entrar no Site"
                : "Acessar Painel Admin"}
            </button>
          </form>
        )}

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
