"use client";

import Image from "next/image";
import { Product } from "./ProductModal";
import { Sparkles, MessageCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  // Preço mínimo entre as variações
  const prices = product.variations.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="crochet-card-scallop group cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Imagem do Produto com Efeito Zoom */}
        <div className="relative w-full h-64 bg-[#F5EFE6] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 bg-[#FDFBF7]/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-[#4A6B52] border border-[#E6DCD1] shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D49B35]" />
            Artesanal
          </div>
        </div>

        {/* Informações da Peça */}
        <div className="p-5">
          <h3 className="font-serif-craft text-lg font-bold text-[#382E2B] group-hover:text-[#C85A46] transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>
          <p className="text-xs text-[#695B55] line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap text-xs text-[#695B55] mb-2">
            {product.variations.map((v, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-[#F5EFE6] text-[#382E2B]">
                {v.size}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Rodapé do Card com Preço e Ação */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[#E6DCD1]/60">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-[#695B55]">A partir de</span>
          <span className="font-serif-craft text-xl font-bold text-[#C85A46]">
            R$ {minPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5EFE6] group-hover:bg-[#4A6B52] text-[#382E2B] group-hover:text-white text-xs font-medium transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Encomendar
        </button>
      </div>
    </div>
  );
}
