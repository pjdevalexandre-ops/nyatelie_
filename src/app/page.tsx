"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductModal, { Product } from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import Image from "next/image";
import { MessageCircle, HeartHandshake, PackageX, RefreshCw, Truck } from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";

interface Settings {
  whatsappNumber: string;
  heroTitle: string;
  heroSubtitle: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: "5591999999999",
    heroTitle: "Peças únicas em crochê, feitas com carinho & afeto",
    heroSubtitle: "Cada ponto carrega dedicação e história. Peças feitas sob encomenda para transformar seu lar ou presentear quem você ama com carinho.",
  });
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, setRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/settings"),
        ]);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
        if (setRes.ok) {
          const setData = await setRes.json();
          setSettings(setData);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F6FAFD]">
        <Header whatsappNumber={settings.whatsappNumber} />

        <main className="flex-1">
          {/* Hero Section Minimalista e Limpo */}
          <section className="relative bg-[#EBF3FA] border-b border-[#CBE3F5] pt-14 pb-18 px-4 sm:px-6 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              {/* Logo Oficial Centralizada */}
              <div className="relative w-28 h-28 sm:w-34 sm:h-34 mx-auto mb-6 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#38A9E4] transform hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt="Logo NyAtelie"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Título Principal */}
              <h1 className="font-serif-craft text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A364A] leading-[1.15] mb-6">
                {settings.heroTitle}
              </h1>

              {/* Subtítulo */}
              <p className="text-base sm:text-lg text-[#4A6B82] max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
                {settings.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Olá! Gostaria de encomendar uma peça personalizada em crochê na NyAtelie.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  Encomendar pelo WhatsApp
                </a>

                <a
                  href="https://instagram.com/nyatelie_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#F6FAFD] text-[#1A364A] border border-[#CBE3F5] font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2.5"
                >
                  <InstagramIcon className="w-5 h-5 text-[#38A9E4]" />
                  Siga @nyatelie_
                </a>
              </div>
            </div>

            <div className="crochet-border-top" />
          </section>

          {/* Destaques da Marca */}
          <section className="py-10 bg-[#F6FAFD] border-b border-[#CBE3F5]/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-5 rounded-2xl bg-white/60 border border-[#CBE3F5]/40 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#38A9E4]/15 text-[#38A9E4] flex items-center justify-center mb-3">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-serif-craft font-bold text-[#1A364A] text-base mb-1">Produção 100% Manual</h3>
                <p className="text-xs text-[#4A6B82] leading-relaxed">Cada ponto é cuidadosamente trabalhado em São Miguel do Guamá - PA.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/60 border border-[#CBE3F5]/40 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#38A9E4]/15 text-[#38A9E4] flex items-center justify-center mb-3">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-serif-craft font-bold text-[#1A364A] text-base mb-1">Entrega para Todo o Brasil</h3>
                <p className="text-xs text-[#4A6B82] leading-relaxed">Embalagens seguras e carinhosas enviadas para qualquer estado.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/60 border border-[#CBE3F5]/40 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#38A9E4]/15 text-[#38A9E4] flex items-center justify-center mb-3">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-craft font-bold text-[#1A364A] text-base mb-1">Instagram @nyatelie_</h3>
                <p className="text-xs text-[#4A6B82] leading-relaxed">Confira nosso catálogo de fotos, processos de produção e novidades.</p>
              </div>
            </div>
          </section>

          {/* Vitrine de Produtos */}
          <section id="vitrine" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-widest text-[#38A9E4] font-bold">
                Vitrine NyAtelie
              </span>
              <h2 className="font-serif-craft text-3xl sm:text-4xl font-bold text-[#1A364A] mt-1.5">
                Escolha sua peça artesanal
              </h2>
              <p className="text-sm text-[#4A6B82] mt-2 max-w-lg mx-auto leading-relaxed">
                Clique na peça desejada para conferir opções de tamanhos, valores e adicionar ao carrinho.
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#4A6B82]">
                <RefreshCw className="w-8 h-8 animate-spin text-[#38A9E4] mb-3" />
                <p className="text-sm font-medium">Carregando a vitrine da NyAtelie...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="max-w-md mx-auto my-8 p-8 rounded-3xl bg-[#EBF3FA] border-2 border-dashed border-[#CBE3F5] text-center">
                <div className="w-16 h-16 rounded-full bg-[#38A9E4]/15 text-[#38A9E4] flex items-center justify-center mx-auto mb-4">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="font-serif-craft text-xl font-bold text-[#1A364A] mb-2">
                  Nenhuma peça publicada ainda
                </h3>
                <p className="text-sm text-[#4A6B82] leading-relaxed mb-6">
                  Nossa oficina em São Miguel do Guamá está preparando peças incríveis. Acesse o painel admin para cadastrar as primeiras!
                </p>
                <a
                  href="/admin"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  Acessar Painel para Cadastrar
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            whatsappNumber={settings.whatsappNumber}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        <CartDrawer whatsappNumber={settings.whatsappNumber} />
        <Footer />
      </div>
    </CartProvider>
  );
}
