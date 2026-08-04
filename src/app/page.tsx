"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductModal, { Product } from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import AuthGateModal from "@/components/AuthGateModal";
import { CartProvider, useCart } from "@/context/CartContext";
import { MessageCircle, HeartHandshake, PackageX, RefreshCw, Truck, Search, Star, Quote, Send, CheckCircle2, Loader2 } from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";

interface Settings {
  whatsappNumber: string;
  heroTitle: string;
  heroSubtitle: string;
}

interface Review {
  id: string;
  name: string;
  city: string;
  comment: string;
  rating: number;
  createdAt: string;
}

const CATEGORIES = ["Todos", "Mesa Posta", "Bolsas & Acessórios", "Decoração", "Vestuário"];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: "5591984829252",
    heroTitle: "Peças únicas em crochê, feitas com carinho & afeto",
    heroSubtitle: "Cada ponto carrega dedicação e história. Peças feitas sob encomenda para transformar seu lar ou presentear quem você ama com carinho.",
  });
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Formulário de Nova Avaliação
  const [revName, setRevName] = useState("");
  const [revCity, setRevCity] = useState("");
  const [revComment, setRevComment] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  // Busca e Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const loadReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) setReviews(await res.json());
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, setRes, revRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/settings"),
          fetch("/api/reviews"),
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (setRes.ok) setSettings(await setRes.json());
        if (revRes.ok) setReviews(await revRes.json());
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;

    setSubmittingReview(true);
    setReviewSuccessMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: revName.trim(),
          city: revCity.trim() || "São Miguel do Guamá - PA",
          comment: revComment.trim(),
          rating: revRating,
        }),
      });

      if (res.ok) {
        setReviewSuccessMsg("Sua avaliação foi enviada com sucesso! Obrigada pelo carinho!");
        setRevName("");
        setRevCity("");
        setRevComment("");
        setRevRating(5);
        loadReviews();
        setTimeout(() => setReviewSuccessMsg(""), 6000);
      }
    } catch {
      // Ignore
    } finally {
      setSubmittingReview(false);
    }
  };

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
          {/* Hero Section */}
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

          {/* Vitrine de Produtos */}
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

            {/* Busca */}
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

            {/* Categorias */}
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
                  Nossa oficina está preparando novas peças. Acesse o painel admin para cadastrar ou limpe a busca.
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

          {/* Avaliações de Clientes & Formulário para Deixar Depoimento */}
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
                  Veja o que quem já recebeu nossas peças em casa tem a dizer e deixe sua mensagem também:
                </p>
              </div>

              {/* Lista de Depoimentos Reais */}
              {reviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-3xl border border-[#CBE3F5] shadow-sm flex flex-col justify-between relative">
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
              )}

              {/* Formulário para Deixar um Depoimento / Avaliação */}
              <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#CBE3F5] shadow-md">
                <h3 className="font-serif-craft text-xl font-bold text-[#1A364A] mb-1 text-center">
                  Deixe sua Avaliação / Depoimento
                </h3>
                <p className="text-xs text-[#4A6B82] text-center mb-6">
                  Seu feedback é muito importante para motivar nosso ateliê!
                </p>

                {reviewSuccessMsg && (
                  <div className="p-4 mb-6 bg-[#4A6B52]/15 border border-[#4A6B52] text-[#4A6B52] rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{reviewSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider mb-1">
                        Seu Nome *
                      </label>
                      <input
                        type="text"
                        value={revName}
                        onChange={(e) => setRevName(e.target.value)}
                        placeholder="Ex: Ana Souza"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider mb-1">
                        Sua Cidade / Estado
                      </label>
                      <input
                        type="text"
                        value={revCity}
                        onChange={(e) => setRevCity(e.target.value)}
                        placeholder="Ex: Belém - PA"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider mb-1">
                      Sua Nota (Estrelas)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRevRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${star <= revRating ? "fill-amber-400" : "text-gray-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A364A] uppercase tracking-wider mb-1">
                      Seu Depoimento sobre as peças *
                    </label>
                    <textarea
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      placeholder="Conte para nós como foi receber e usar sua peça de crochê..."
                      rows={3}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-xs text-[#1A364A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-3.5 px-4 rounded-full bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Enviar Meu Depoimento
                  </button>
                </form>
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
