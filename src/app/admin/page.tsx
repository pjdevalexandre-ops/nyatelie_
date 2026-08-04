"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Lock, KeyRound, Sparkles, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao efetuar login");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao efetuar login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAFD]">
      <Header isAdmin />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-3xl border-2 border-[#CBE3F5] p-8 shadow-xl relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#38A9E4] mx-auto mb-3 shadow-md bg-[#38A9E4]">
              <Image src="/logo.png" alt="NyAtelie" fill className="object-cover" />
            </div>
            <span className="text-xs uppercase tracking-widest text-[#38A9E4] font-semibold">
              Área Restrita
            </span>
            <h1 className="font-serif-craft text-2xl font-bold text-[#1A364A] mt-1">
              Painel NyAtelie
            </h1>
            <p className="text-xs text-[#4A6B82] mt-1">
              Digite a senha para gerenciar produtos e configurações.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] focus:outline-none focus:border-[#38A9E4] focus:ring-1 focus:ring-[#38A9E4] text-[#1A364A] text-sm"
                />
                <KeyRound className="w-4 h-4 text-[#4A6B82] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-medium text-sm transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Entrar no Painel
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#CBE3F5] text-center text-xs text-[#4A6B82]">
            <p>Senha inicial padrão: <code className="bg-[#EBF3FA] px-1.5 py-0.5 rounded text-[#38A9E4] font-semibold">admin123</code></p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
