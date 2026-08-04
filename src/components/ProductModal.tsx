"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, X, Plus, Minus, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

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
  product: Product | null;
  whatsappNumber: string;
  onClose: () => void;
}

export default function ProductModal({ product, whatsappNumber, onClose }: ProductModalProps) {
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addToCart } = useCart();

  if (!product) return null;

  const currentVariation = product.variations[selectedVariationIndex] || product.variations[0];
  const unitPrice = currentVariation ? currentVariation.price : 0;
  const totalPrice = unitPrice * quantity;

  const allImages = [
    product.imageUrl,
    ...product.variations.map((v) => v.imageUrl).filter((url): url is string => Boolean(url) && url !== product.imageUrl),
  ];
  const uniqueImages = Array.from(new Set(allImages));
  const displayImage = currentVariation?.imageUrl || uniqueImages[currentImageIndex] || product.imageUrl;

  const handleVariationChange = (index: number) => {
    setSelectedVariationIndex(index);
    const selectedVar = product.variations[index];
    if (selectedVar?.imageUrl) {
      const imgIdx = uniqueImages.indexOf(selectedVar.imageUrl);
      if (imgIdx !== -1) setCurrentImageIndex(imgIdx);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      imageUrl: displayImage,
      size: currentVariation.size,
      price: unitPrice,
      quantity,
      observations: observations.trim() || undefined,
    });
    onClose();
  };

  const handleFinishDirectWhatsApp = () => {
    const textLines = [
      `*Olá, NyAtelie! Gostaria de encomendar:*`,
      `-----------------------------------------`,
      `🧵 *Produto:* ${product.name}`,
      `📏 *Tamanho/Modelo:* ${currentVariation.size}`,
      `🔢 *Quantidade:* ${quantity}`,
      `💰 *Valor Unitário:* R$ ${unitPrice.toFixed(2).replace(".", ",")}`,
      `💵 *Valor Total:* R$ ${totalPrice.toFixed(2).replace(".", ",")}`,
      observations ? `📝 *Observações:* ${observations}` : null,
      `-----------------------------------------`,
      `📍 *Entrega:* São Miguel do Guamá - PA / Todo o Brasil`,
      `Como podemos acertar o pagamento e prazo de entrega?`,
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textLines)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#F6FAFD] rounded-3xl border-2 border-[#CBE3F5] shadow-2xl overflow-hidden my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#1A364A] hover:text-[#38A9E4] shadow transition-colors"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Galeria de Fotos */}
          <div className="bg-[#EBF3FA] p-6 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[420px]">
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-inner border border-[#CBE3F5]">
              <Image
                src={displayImage}
                alt={product.name}
                fill
                className="object-cover transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {uniqueImages.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full pb-1">
                {uniqueImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      currentImageIndex === idx ? "border-[#38A9E4] scale-105" : "border-transparent opacity-70"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto & Formulário */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#38A9E4] font-semibold">
                Feito Sob Encomenda
              </span>
              <h2 className="font-serif-craft text-2xl sm:text-3xl font-bold text-[#1A364A] mt-1 mb-3">
                {product.name}
              </h2>
              <p className="text-sm text-[#4A6B82] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Seletor de Tamanhos */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-2">
                  Escolha o Tamanho / Opção
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variations.map((variation, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleVariationChange(idx)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedVariationIndex === idx
                          ? "border-[#38A9E4] bg-[#38A9E4]/10 text-[#38A9E4] ring-1 ring-[#38A9E4]"
                          : "border-[#CBE3F5] bg-white text-[#1A364A] hover:border-[#38A9E4]/40"
                      }`}
                    >
                      <div>
                        <span className="block text-sm font-medium">{variation.size}</span>
                        <span className="text-xs text-[#4A6B82]">
                          R$ {variation.price.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                      {selectedVariationIndex === idx && <Check className="w-4 h-4 text-[#38A9E4]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantidade e Observação */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1A364A] uppercase tracking-wider">
                    Quantidade
                  </span>
                  <div className="flex items-center border border-[#CBE3F5] bg-white rounded-lg p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 rounded hover:bg-[#EBF3FA] text-[#1A364A] transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-[#1A364A]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 rounded hover:bg-[#EBF3FA] text-[#1A364A] transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-1.5">
                    Observações ou Cores Desejadas (Opcional)
                  </label>
                  <input
                    type="text"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Ex: Quero na cor azul bebê ou tamanho customizado"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-white focus:outline-none focus:border-[#38A9E4] focus:ring-1 focus:ring-[#38A9E4] text-[#1A364A]"
                  />
                </div>
              </div>
            </div>

            {/* Total e Ações (Adicionar ao Carrinho OU Comprar Já) */}
            <div className="pt-4 border-t border-[#CBE3F5]">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-[#4A6B82] font-medium">
                  Total da Peça
                </span>
                <span className="font-serif-craft text-2xl font-bold text-[#38A9E4]">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-[#EBF3FA] hover:bg-[#CBE3F5] text-[#1A364A] font-semibold text-sm transition-all border border-[#CBE3F5] flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#38A9E4]" />
                  Adicionar ao Carrinho
                </button>

                <button
                  onClick={handleFinishDirectWhatsApp}
                  className="py-3 px-4 rounded-xl bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-semibold text-sm shadow transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Pedir no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
