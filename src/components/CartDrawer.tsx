"use client";

import { useState } from "react";
import { useCart, CustomerData } from "@/context/CartContext";
import { X, ShoppingBag, Trash2, Plus, Minus, Send, MapPin, User, Search, Edit3, Loader2, CheckCircle2 } from "lucide-react";

interface CartDrawerProps {
  whatsappNumber: string;
}

export default function CartDrawer({ whatsappNumber }: CartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
    customerData,
    saveCustomerData,
  } = useCart();

  const [step, setStep] = useState<"cart" | "address">("cart");
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Formulário de Cadastro do Cliente
  const [name, setName] = useState(customerData?.name || "");
  const [phone, setPhone] = useState(customerData?.phone || "");
  const [cep, setCep] = useState(customerData?.cep || "");
  const [street, setStreet] = useState(customerData?.street || "");
  const [number, setNumber] = useState(customerData?.number || "");
  const [complement, setComplement] = useState(customerData?.complement || "");
  const [neighborhood, setNeighborhood] = useState(customerData?.neighborhood || "");
  const [city, setCity] = useState(customerData?.city || "");
  const [uf, setUf] = useState(customerData?.uf || "");

  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  if (!isCartOpen) return null;

  // Busca automática do CEP via API
  const handleFetchCep = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setCepError("Digite 8 números do CEP");
      return;
    }

    setLoadingCep(true);
    setCepError("");

    try {
      const res = await fetch(`/api/cep?cep=${cleanCep}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "CEP não encontrado");
      }

      setStreet(data.logradouro || "");
      setNeighborhood(data.bairro || "");
      setCity(data.cidade || "");
      setUf(data.uf || "");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCepError(err.message || "CEP inválido");
      } else {
        setCepError("CEP inválido");
      }
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !cep.trim() || !street.trim() || !number.trim() || !city.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios de entrega.");
      return;
    }

    const data: CustomerData = {
      name: name.trim(),
      phone: phone.trim(),
      cep: cep.trim(),
      street: street.trim(),
      number: number.trim(),
      complement: complement.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      uf: uf.trim(),
      role: customerData?.role || "customer",
    };

    saveCustomerData(data);
    setIsEditingAddress(false);
    sendWhatsAppOrder(data);
  };

  const sendWhatsAppOrder = (customerInfo: CustomerData) => {
    let text = `🛍️ *NOVO PEDIDO - NYATELIE*\n\n`;
    text += `👤 *Cliente:* ${customerInfo.name}\n`;
    text += `📱 *Telefone:* ${customerInfo.phone}\n`;
    text += `📍 *Endereço de Entrega:*\n`;
    text += `${customerInfo.street}, Nº ${customerInfo.number}${customerInfo.complement ? ` (${customerInfo.complement})` : ""}\n`;
    text += `Bairro: ${customerInfo.neighborhood} - ${customerInfo.city}/${customerInfo.uf}\n`;
    text += `CEP: ${customerInfo.cep}\n\n`;
    text += `📦 *ITENS DO PEDIDO:*\n`;

    items.forEach((item, index) => {
      text += `${index + 1}. *${item.product.name}*\n`;
      text += `   • Tamanho: ${item.variation.size}\n`;
      text += `   • Qtd: ${item.quantity}x | R$ ${item.variation.price.toFixed(2).replace(".", ",")}\n\n`;
    });

    text += `💰 *VALOR TOTAL DAS PEÇAS:* R$ ${totalPrice.toFixed(2).replace(".", ",")}\n`;
    text += `📌 *Status:* Aguardando confirmação da taxa de entrega para São Miguel do Guamá / BR.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");

    clearCart();
    setIsCartOpen(false);
  };

  const handleProceedCheckout = () => {
    if (customerData && !isEditingAddress) {
      sendWhatsAppOrder(customerData);
    } else {
      setStep("address");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-[#F6FAFD] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header do Drawer */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#CBE3F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EBF3FA] text-[#38A9E4] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-craft font-bold text-lg text-[#1A364A]">
                {step === "cart" ? "Seu Carrinho" : "Endereço para Entrega"}
              </h2>
              <p className="text-[11px] text-[#4A6B82]">NyAtelie • Crochê Artesanal</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-[#EBF3FA] text-[#1A364A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#EBF3FA] text-[#4A6B82] flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-[#38A9E4]" />
              </div>
              <h3 className="font-serif-craft font-bold text-lg text-[#1A364A]">
                Seu carrinho está vazio
              </h3>
              <p className="text-xs text-[#4A6B82] mt-1 max-w-xs leading-relaxed">
                Navegue pelas peças na vitrine da NyAtelie e selecione suas favoritas!
              </p>
            </div>
          ) : step === "cart" ? (
            <>
              {/* Lista de Itens */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-[#CBE3F5] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-[#EBF3FA] relative overflow-hidden shrink-0 border border-[#CBE3F5]">
                        <img
                          src={item.variation.imageUrl || item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif-craft font-bold text-sm text-[#1A364A] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] font-medium text-[#38A9E4] bg-[#EBF3FA] px-2 py-0.5 rounded-md inline-block mt-0.5">
                          {item.variation.size}
                        </span>
                        <div className="text-xs font-bold text-[#1A364A] mt-1">
                          R$ {(item.variation.price * item.quantity).toFixed(2).replace(".", ",")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#CBE3F5] rounded-xl bg-[#F6FAFD] p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-[#EBF3FA] rounded-lg text-[#1A364A]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#1A364A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-[#EBF3FA] rounded-lg text-[#1A364A]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card de Dados Salvos do Cliente se existir */}
              {customerData && !isEditingAddress && (
                <div className="p-4 bg-white rounded-2xl border-2 border-[#38A9E4]/40 shadow-xs mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#38A9E4] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dados de Entrega Salvos
                    </span>
                    <button
                      onClick={() => {
                        setIsEditingAddress(true);
                        setStep("address");
                      }}
                      className="text-xs font-semibold text-[#38A9E4] hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Alterar
                    </button>
                  </div>
                  <div className="text-xs text-[#1A364A] font-medium leading-relaxed">
                    <p className="font-bold">{customerData.name} • {customerData.phone}</p>
                    <p className="text-[#4A6B82]">
                      {customerData.street}, Nº {customerData.number} {customerData.complement ? `(${customerData.complement})` : ""}
                    </p>
                    <p className="text-[#4A6B82]">
                      {customerData.neighborhood} - {customerData.city}/{customerData.uf} • CEP {customerData.cep}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Formulário de Cadastro/Entrega */
            <form onSubmit={handleSaveCustomer} id="customer-form" className="space-y-3.5 bg-white p-4 rounded-2xl border border-[#CBE3F5]">
              <div className="flex items-center justify-between pb-2 border-b border-[#CBE3F5]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#38A9E4] flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Seus Dados Pessoais
                </span>
                {customerData && (
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="text-xs text-[#4A6B82] hover:underline"
                  >
                    Voltar ao Carrinho
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A364A] mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A364A] mb-1">
                  Seu WhatsApp / Celular *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (91) 99999-9999"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                />
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#38A9E4] flex items-center gap-1.5 mb-2">
                  <MapPin className="w-4 h-4" /> Endereço Completo
                </span>

                <div className="flex gap-2 mb-2">
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
                    className="px-3.5 py-2 rounded-xl bg-[#38A9E4] text-white text-xs font-semibold hover:bg-[#1E82BC] transition-colors flex items-center gap-1"
                  >
                    {loadingCep ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    Buscar CEP
                  </button>
                </div>
                {cepError && <p className="text-[11px] text-red-500 mb-2">{cepError}</p>}

                <div className="space-y-2">
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
              </div>
            </form>
          )}
        </div>

        {/* Rodapé do Drawer com Resumo e Envio */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#CBE3F5] space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-[#1A364A]">
              <span>Subtotal das Peças:</span>
              <span className="font-serif-craft text-xl text-[#38A9E4]">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>

            {step === "cart" ? (
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-4 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {customerData && !isEditingAddress
                  ? "Enviar Pedido para o WhatsApp"
                  : "Preencher Dados de Entrega"}
              </button>
            ) : (
              <button
                type="submit"
                form="customer-form"
                className="w-full py-3.5 px-4 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Salvar & Enviar Pedido via WhatsApp
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
