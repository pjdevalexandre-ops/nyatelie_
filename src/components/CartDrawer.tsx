"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  whatsappNumber: string;
}

export default function CartDrawer({ whatsappNumber }: CartDrawerProps) {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  if (!isCartOpen) return null;

  const handleFinishWhatsAppOrder = () => {
    if (cart.length === 0) return;

    const itemsText = cart
      .map(
        (item, idx) =>
          `*${idx + 1}. ${item.productName}*\n` +
          `   - Tamanho: ${item.size}\n` +
          `   - Quantidade: ${item.quantity}\n` +
          `   - Preço Unid: R$ ${item.price.toFixed(2).replace(".", ",")}\n` +
          `   - Subtotal: R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}\n` +
          (item.observations ? `   - Obs: ${item.observations}\n` : "")
      )
      .join("\n");

    const message =
      `*Olá, NyAtelie! Gostaria de finalizar meu pedido de crochê com os seguintes itens:*\n\n` +
      `-----------------------------------------\n` +
      `${itemsText}` +
      `-----------------------------------------\n` +
      `📦 *Total de Itens:* ${totalItems}\n` +
      `💵 *VALOR TOTAL:* R$ ${totalPrice.toFixed(2).replace(".", ",")}\n\n` +
      `📍 *Entrega:* São Miguel do Guamá - PA / Envio para o Brasil\n` +
      `Como podemos combinar o pagamento e prazo de confecção?`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F6FAFD] border-l-2 border-[#CBE3F5] shadow-2xl flex flex-col justify-between">
          {/* Cabeçalho do Carrinho */}
          <div className="p-6 bg-[#EBF3FA] border-b border-[#CBE3F5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#38A9E4] text-white flex items-center justify-center shadow">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-craft font-bold text-lg text-[#1A364A]">Meu Carrinho</h2>
                <p className="text-xs text-[#4A6B82]">{totalItems} {totalItems === 1 ? "item selecionado" : "itens selecionados"}</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white text-[#1A364A] transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Itens do Carrinho */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#4A6B82] my-auto py-12">
                <ShoppingBag className="w-16 h-16 text-[#38A9E4]/40 mb-3" />
                <h3 className="font-serif-craft font-bold text-base text-[#1A364A] mb-1">
                  Seu carrinho está vazio
                </h3>
                <p className="text-xs max-w-xs mb-6">
                  Navegue pela vitrine da NyAtelie e escolha suas peças de crochê favoritas sob encomenda!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#38A9E4] text-white text-xs font-semibold hover:bg-[#1E82BC] transition-colors"
                >
                  Ver Vitrine &rarr;
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#CBE3F5] shadow-sm flex items-start gap-3 relative group"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#EBF3FA] flex-shrink-0 border border-[#CBE3F5]">
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif-craft font-bold text-sm text-[#1A364A] truncate">
                      {item.productName}
                    </h4>
                    <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-[#EBF3FA] text-[#38A9E4] font-medium mt-0.5">
                      {item.size}
                    </span>
                    {item.observations && (
                      <p className="text-[11px] text-[#4A6B82] italic mt-1 line-clamp-1">
                        Obs: {item.observations}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Stepper de Quantidade */}
                      <div className="flex items-center border border-[#CBE3F5] bg-[#F6FAFD] rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          className="p-1 rounded hover:bg-white text-[#1A364A]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-[#1A364A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          className="p-1 rounded hover:bg-white text-[#1A364A]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif-craft font-bold text-sm text-[#38A9E4]">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(idx)}
                    className="p-1 text-red-400 hover:text-red-600 rounded"
                    title="Remover do carrinho"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Rodapé com Total e Botão de Finalização no WhatsApp */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#CBE3F5] shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-[#4A6B82] font-semibold">
                  Subtotal ({totalItems} itens)
                </span>
                <span className="font-serif-craft text-2xl font-bold text-[#38A9E4]">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleFinishWhatsAppOrder}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  Finalizar Pedido no WhatsApp
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-center text-xs text-[#4A6B82] hover:text-red-500 transition-colors"
                >
                  Esvaziar carrinho
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
