"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductModal, { Product } from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import AuthGateModal from "@/components/AuthGateModal";
import { CartProvider } from "@/context/CartContext";
import { MessageCircle, HeartHandshake, PackageX, RefreshCw, Truck, Search, Star, Quote } from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";

interface Settings {
  whatsappNumber: string;
  heroTitle: string;
  heroSubtitle: string;
}

const CATEGORIES = ["Todos", "Mesa Posta", "Bolsas & Acessórios", "Decoração", "Vestuário"];

const TESTIMONIALS = [
  {
    name: "Cláudia Mendonça",
    city: "Belém - PA",
    comment: "Os sousplats em crochê que encomendei para o meu jantar de Natal ficaram simplesmente deslumbrantes! Acabamento impecável e entrega super carinhosa.",
    rating: 5,
  },
  {
    name: "Juliana Rocha",
    city: "São Miguel do Guamá - PA",
    comment: "A bolsa tote de crochê é maravilhosa! Muito resistente, com forro bem feito e cabe tudo. Já quero encomendar outra cor!",
    rating: 5,
  },
  {
    name: "Patrícia Alencar",
    city: "Ananindeua - PA",
    comment: "Atendimento nota 1000 pelo WhatsApp e as peças em crochê têm um cheirinho e um carinho únicos. Recomendaria mil vezes!",
    rating: 5,
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: "5591984829252",
    heroTitle: "Peças únicas em crochê, feitas com carinho & afeto",
    heroSubtitle: "Cada ponto carrega dedicação e história. Peças feitas sob encomenda para transformar seu lar ou presentear quem você ama com carinho.",
  });
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Estados de Busca e Filtro por Categoria
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

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

  // Filtragem Dinâmica por Categoria e Busca
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || (product.category || "Geral") === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <CartProvider>
      <AuthGateModal />

      <div className="min-h-screen flex flex-col bg-[#F6FAFD]">
        <Header whatsappNumber={settings.whatsappNumber} />

        <main className="flex-1">
          {/* Hero Section Minimalista e Limpo */}
          <section className="relative bg-[#EBF3FA] border-b border-[#CBE3F5] pt-14 pb-18 px-4 sm:px-6 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 className="font-serif-craft text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A364A] leading-[1.15] mb-6">
                {settings.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-[#4A6B82] max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
                {settings.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Olá! Gostaria de encomendar uma peça personalizada em crochê na NyAteliê.")}`}
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

          {/* Vitrine de Produtos com Filtro de Categoria e Barra de Busca */}
          <section id="vitrine" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-widest text-[#38A9E4] font-bold">
                Vitrine NyAteliê
              </span>
              <h2 className="font-serif-craft text-3xl sm:text-4xl font-bold text-[#1A364A] mt-1.5">
                Escolha sua peça artesanal
              </h2>
              <p className="text-sm text-[#4A6B82] mt-2 max-w-lg mx-auto leading-relaxed">
                Navegue pelas categorias ou busque pelo nome para encontrar sua peça de crochê favorita.
              </p>
            </div>

            {/* Barra de Busca de Produtos */}
            <div className="max-w-md mx-auto mb-8 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar peça de crochê (ex: Sousplat, Bolsa)..."
                className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-[#CBE3F5] bg-white text-sm text-[#1A364A] shadow-xs focus:border-[#38A9E4] outline-hidden transition-all"
              />
              <Search className="w-5 h-5 text-[#38A9E4] absolute left-4 top-3.5" />
            </div>

            {/* Filtro por Categorias */}
            <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border shadow-xs ${
                      isSelected
                        ? "bg-[#38A9E4] text-white border-[#38A9E4]"
                        : "bg-white text-[#1A364A] border-[#CBE3F5] hover:bg-[#EBF3FA]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#4A6B82]">
                <RefreshCw className="w-8 h-8 animate-spin text-[#38A9E4] mb-3" />
                <p className="text-sm font-medium">Carregando a vitrine da NyAteliê...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="max-w-md mx-auto my-8 p-8 rounded-3xl bg-[#EBF3FA] border-2 border-dashed border-[#CBE3F5] text-center">
                <div className="w-16 h-16 rounded-full bg-[#38A9E4]/15 text-[#38A9E4] flex items-center justify-center mx-auto mb-4">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="font-serif-craft text-xl font-bold text-[#1A364A] mb-2">
                  Nenhuma peça encontrada
                </h3>
                <p className="text-sm text-[#4A6B82] leading-relaxed mb-6">
                  Tente alterar os termos da busca ou selecionar outra categoria.
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#38A9E4] text-white text-xs font-semibold"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Seção de Depoimentos e Avaliações de Clientes */}
          <section className="py-16 bg-[#EBF3FA]/70 border-t border-[#CBE3F5]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <span className="text-xs uppercase tracking-widest text-[#38A9E4] font-bold">
                  Carinho de Quem Comprou
                </span>
                <h2 className="font-serif-craft text-3xl sm:text-4xl font-bold text-[#1A364A] mt-1.5">
                  Avaliações dos Nossos Clientes
                </h2>
                <p className="text-sm text-[#4A6B82] mt-2 max-w-md mx-auto">
                  Veja o que quem já recebeu nossas peças de crochê em casa tem a dizer:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((review, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-[#CBE3F5] shadow-sm flex flex-col justify-between relative">
                    <Quote className="w-8 h-8 text-[#38A9E4]/20 absolute top-4 right-4" />
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-3">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-[#1A364A] leading-relaxed italic mb-4">
                        "{review.comment}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#CBE3F5]/60 flex items-center justify-between">
                      <div>
                        <h4 className="font-serif-craft font-bold text-sm text-[#1A364A]">
                          {review.name}
                        </h4>
                        <span className="text-[11px] text-[#4A6B82]">{review.city}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#38A9E4] bg-[#EBF3FA] px-2 py-0.5 rounded-full">
                        Cliente Verificada ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
