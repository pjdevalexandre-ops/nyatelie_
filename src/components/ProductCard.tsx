"use client";

import Image from "next/image";
import { Product } from "./ProductModal";
import { Sparkles, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const prices = product.variations.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="crochet-card-scallop group cursor-pointer flex flex-col justify-between overflow-hidden bg-white border-2 border-[#CBE3F5] rounded-3xl transition-all duration-300 hover:shadow-xl hover:border-[#38A9E4]/60"
    >
      <div>
        {/* Imagem do Produto com Aspect Ratio Limpo */}
        <div className="relative w-full h-60 sm:h-64 bg-[#EBF3FA] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-[#38A9E4] border border-[#CBE3F5] shadow-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#38A9E4]" />
            <span>Artesanal</span>
          </div>
        </div>

        {/* Informações da Peça */}
        <div className="p-5">
          <h3 className="font-serif-craft text-lg font-bold text-[#1A364A] group-hover:text-[#38A9E4] transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>
          <p className="text-xs text-[#4A6B82] line-clamp-2 leading-relaxed mb-4 font-normal">
            {product.description}
          </p>

          <div className="flex items-center gap-1.5 flex-wrap">
            {product.variations.map((v, i) => (
              <span key={i} className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-[#EBF3FA] text-[#1A364A] border border-[#CBE3F5]/50">
                {v.size}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Rodapé do Card com Alinhamento Perfeito */}
      <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-[#CBE3F5]/50 mt-auto">
        <div className="flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#4A6B82] leading-none mb-1">
            A partir de
          </span>
          <span className="font-serif-craft text-xl font-bold text-[#38A9E4] leading-tight">
            R$ {minPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EBF3FA] group-hover:bg-[#38A9E4] text-[#1A364A] group-hover:text-white text-xs font-semibold transition-all border border-[#CBE3F5] group-hover:border-[#38A9E4] shadow-xs"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Ver Peça</span>
        </button>
      </div>
    </div>
  );
}
