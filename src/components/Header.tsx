"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Lock, MessageCircle, ShoppingBag, UserCheck } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";

interface HeaderProps {
  whatsappNumber?: string;
  isAdmin?: boolean;
}

export default function Header({ whatsappNumber = "5591984829252", isAdmin = false }: HeaderProps) {
  const { totalItems, setIsCartOpen, user, logout } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#F6FAFD]/95 backdrop-blur-md border-b border-[#CBE3F5] shadow-xs">
      {/* Top Banner minimalista com Instagram e Usuário Logado */}
      <div className="bg-[#38A9E4] text-white py-1.5 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {user ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <UserCheck className="w-3.5 h-3.5 text-[#E1F2FB] shrink-0" />
              <span className="truncate font-semibold text-white">
                Olá, {user.name.split(" ")[0]} {user.role === "admin" ? "(Admin)" : ""}
              </span>
              <button
                onClick={logout}
                className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md font-semibold transition-colors shrink-0"
              >
                Sair
              </button>
            </div>
          ) : (
            <span className="text-[11px] opacity-90">Ateliê Artesanal de Crochê</span>
          )}

          <a
            href="https://instagram.com/nyatelie_"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#E1F2FB] transition-colors font-semibold py-0.5 px-2.5 rounded-full bg-white/10 hover:bg-white/20 shrink-0"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-white shrink-0" />
            <span>@nyatelie_</span>
          </a>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-3 shrink-0 group">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 border-[#38A9E4] shadow-xs group-hover:scale-105 transition-transform bg-[#38A9E4] shrink-0">
            <Image
              src="/logo.png"
              alt="Logo NyAteliê"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-serif-craft text-2xl font-bold tracking-tight text-[#1A364A] leading-tight group-hover:text-[#38A9E4] transition-colors">
              NyAteliê
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#4A6B82] font-bold leading-none mt-0.5">
              Crochê Artesanal
            </span>
          </div>
        </Link>

        {/* Action Buttons */}
        <nav className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {!isAdmin ? (
            <>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#EBF3FA] hover:bg-[#CBE3F5] text-[#1A364A] text-xs font-semibold transition-all border border-[#CBE3F5] shadow-xs shrink-0"
                title="Ver Meu Carrinho"
              >
                <ShoppingBag className="w-4 h-4 text-[#38A9E4] shrink-0" />
                <span className="hidden sm:inline">Carrinho</span>
                {totalItems > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#38A9E4] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {totalItems}
                  </span>
                )}
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Vim pelo site da NyAteliê e gostaria de tirar uma dúvida sobre as peças em crochê.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4.5 py-2 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white text-xs font-semibold tracking-wide transition-all shadow-xs shrink-0"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {user?.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="p-2 rounded-full text-[#4A6B82] hover:text-[#38A9E4] hover:bg-[#EBF3FA] transition-colors shrink-0"
                  title="Área Administrativa"
                >
                  <Lock className="w-4.5 h-4.5" />
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/"
              className="text-xs font-semibold text-[#38A9E4] hover:underline flex items-center gap-1.5"
            >
              Ver Loja Pública &rarr;
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
