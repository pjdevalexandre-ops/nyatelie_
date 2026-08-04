"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, MessageCircle, Sparkles } from "lucide-react";

export interface Variation {
  id?: string;
  size: string;
  price: number;
  imageUrl?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  variations: Variation[];
}

interface ProductModalProps {
  product: Product;
  whatsappNumber: string;
  onClose: () => void;
}

export default function ProductModal({ product, whatsappNumber, onClose }: ProductModalProps) {
  const { addItem } = useCart();

  const [selectedVariation, setSelectedVariation] = useState<Variation>(
    product.variations[0] || { size: "Único", price: 0 }
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const currentImageUrl = selectedVariation.imageUrl || product.imageUrl;

  const handleAddToCart = () => {
    addItem(product, selectedVariation, quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 1200);
  };

  const handleDirectBuyWhatsApp = () => {
    const text = `Olá! Gostaria de encomendar a peça *${product.name}*\n• Tamanho: *${selectedVariation.size}*\n• Quantidade: *${quantity}x*\n• Valor Total: *R$ ${(selectedVariation.price * quantity).toFixed(2).replace(".", ",")}*`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border-2 border-[#CBE3F5] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-[#1A364A] hover:bg-white transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Imagem em Destaque */}
          <div className="relative h-64 sm:h-auto bg-[#EBF3FA]">
            <Image
              src={currentImageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-[#38A9E4] border border-[#CBE3F5] shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#38A9E4]" />
              <span>Artesanal</span>
            </div>
          </div>

          {/* Detalhes da Peça */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-serif-craft text-xl font-bold text-[#1A364A] mb-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-[#4A6B82] leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Variações de Tamanho */}
              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#1A364A] mb-2">
                  Escolha o Tamanho:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((variation, index) => {
                    const isSelected = selectedVariation.size === variation.size;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedVariation(variation)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? "bg-[#38A9E4] text-white border-[#38A9E4] shadow-xs"
                            : "bg-[#F6FAFD] text-[#1A364A] border-[#CBE3F5] hover:bg-[#EBF3FA]"
                        }`}
                      >
                        {variation.size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantidade */}
              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#1A364A] mb-2">
                  Quantidade:
                </label>
                <div className="inline-flex items-center border border-[#CBE3F5] rounded-xl bg-[#F6FAFD] p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-xs font-bold text-[#1A364A] hover:bg-[#EBF3FA] rounded-lg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#1A364A]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-xs font-bold text-[#1A364A] hover:bg-[#EBF3FA] rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Preço e Botões */}
            <div className="pt-4 border-t border-[#CBE3F5]/60 mt-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-[#4A6B82]">
                  Total:
                </span>
                <span className="font-serif-craft text-2xl font-bold text-[#38A9E4]">
                  R$ {(selectedVariation.price * quantity).toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-xl bg-[#EBF3FA] hover:bg-[#CBE3F5] text-[#1A364A] text-xs font-semibold transition-all border border-[#CBE3F5] flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#38A9E4]" />
                  {addedToast ? "Adicionado ao Carrinho! ✓" : "Adicionar ao Carrinho"}
                </button>

                <button
                  onClick={handleDirectBuyWhatsApp}
                  className="w-full py-3 px-4 rounded-xl bg-[#38A9E4] hover:bg-[#1E82BC] text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Pedir no WhatsApp Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
