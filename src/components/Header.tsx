"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Lock, MessageCircle, MapPin, Truck, ShoppingBag } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";

interface HeaderProps {
  whatsappNumber?: string;
  isAdmin?: boolean;
}

export default function Header({ whatsappNumber = "5591999999999", isAdmin = false }: HeaderProps) {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#F6FAFD]/95 backdrop-blur-md border-b border-[#CBE3F5] shadow-xs">
      {/* Faixa Superior com destaque em envio e Instagram oficial */}
      <div className="bg-[#38A9E4] text-white py-2 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E1F2FB]" />
              São Miguel do Guamá - PA
            </span>
            <span className="hidden md:inline text-white/50">•</span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#E1F2FB]" />
              Entregamos para todo o Brasil!
            </span>
          </div>

          <a
            href="https://instagram.com/nyatelie_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#E1F2FB] transition-colors font-semibold py-0.5 px-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-white" />
            @nyatelie_
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#38A9E4] shadow-sm group-hover:scale-105 transition-transform bg-[#38A9E4]">
            <Image
              src="/logo.png"
              alt="Logo NyAtelie"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="font-serif-craft text-2xl font-bold tracking-tight text-[#1A364A] group-hover:text-[#38A9E4] transition-colors">
              NyAtelie
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-[#4A6B82] font-semibold -mt-1">
              Crochê Artesanal
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          {!isAdmin ? (
            <>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EBF3FA] hover:bg-[#CBE3F5] text-[#1A364A] text-xs font-semibold transition-all border border-[#CBE3F5] shadow-xs"
                title="Ver Meu Carrinho"
              >
                <ShoppingBag className="w-4 h-4 text-[#38A9E4]" />
                <span className="hidden sm:inline">Carrinho</span>
                {totalItems > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#38A9E4] text-white text-xs flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Vim pelo site da NyAtelie e gostaria de tirar uma dúvida sobre as peças em crochê.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <Link
                href="/admin"
                className="p-2 rounded-full text-[#4A6B82] hover:text-[#38A9E4] hover:bg-[#EBF3FA] transition-colors"
                title="Área Administrativa"
              >
                <Lock className="w-5 h-5" />
              </Link>
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
