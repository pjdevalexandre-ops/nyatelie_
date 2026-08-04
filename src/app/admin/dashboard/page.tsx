"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import {
  Package,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  LogOut,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  MessageCircle,
} from "lucide-react";

interface Variation {
  id?: string;
  size: string;
  price: number;
  imageUrl?: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  position: number;
  variations: Variation[];
}

interface Settings {
  whatsappNumber: string;
  heroTitle: string;
  heroSubtitle: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "settings">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: "",
    heroTitle: "",
    heroSubtitle: "",
  });

  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formVariations, setFormVariations] = useState<{ size: string; price: number; imageUrl?: string }[]>([
    { size: "Tamanho Único", price: 0 },
  ]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submittingSettings, setSubmittingSettings] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, setRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/settings"),
      ]);

      if (prodRes.status === 401 || setRes.status === 401) {
        window.location.href = "/admin";
        return;
      }

      if (prodRes.ok) setProducts(await prodRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } catch (err) {
      console.error("Erro ao carregar painel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  };

  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 4000);
    } else {
      setSaveMessage(msg);
      setTimeout(() => setSaveMessage(""), 4000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, variationIdx?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (variationIdx !== undefined) {
        const updatedVars = [...formVariations];
        updatedVars[variationIdx].imageUrl = data.url;
        setFormVariations(updatedVars);
      } else {
        setFormImageUrl(data.url);
      }
      showToast("Imagem enviada com sucesso!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Erro no upload", true);
      } else {
        showToast("Erro no upload", true);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormDescription("");
    setFormImageUrl("");
    setFormVariations([{ size: "Tamanho Único", price: 50 }]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormImageUrl(product.imageUrl);
    setFormVariations(
      product.variations.map((v) => ({
        size: v.size,
        price: v.price,
        imageUrl: v.imageUrl || undefined,
      }))
    );
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImageUrl) {
      showToast("Insira a imagem principal do produto", true);
      return;
    }

    setSubmittingProduct(true);
    const payload = {
      name: formName,
      description: formDescription,
      imageUrl: formImageUrl,
      variations: formVariations,
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar produto");

      showToast(editingProduct ? "Produto atualizado!" : "Novo produto cadastrado!");
      setIsModalOpen(false);
      loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Erro ao salvar", true);
      } else {
        showToast("Erro ao salvar", true);
      }
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta peça da vitrine?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");

      showToast("Peça removida da vitrine!");
      loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Erro ao excluir", true);
      } else {
        showToast("Erro ao excluir", true);
      }
    }
  };

  const handleMoveProduct = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= products.length) return;

    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reorderedItems = updated.map((item, i) => ({ id: item.id, position: i + 1 }));

    setProducts(updated);

    try {
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reorderedItems }),
      });
      showToast("Ordem atualizada!");
    } catch (err) {
      showToast("Erro ao reordenar", true);
      loadData();
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSettings(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar configurações");

      showToast("Configurações atualizadas com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Erro ao salvar", true);
      } else {
        showToast("Erro ao salvar", true);
      }
    } finally {
      setSubmittingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6FAFD] text-[#4A6B82]">
        <Loader2 className="w-8 h-8 animate-spin text-[#38A9E4] mr-2" />
        <span>Carregando painel da NyAtelie...</span>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F6FAFD]">
        <Header isAdmin />

        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {saveMessage && (
            <div className="bg-[#4A6B52] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce text-sm">
              <CheckCircle className="w-5 h-5" />
              <span>{saveMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="bg-[#38A9E4] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-pulse text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-[#EBF3FA] p-6 rounded-3xl border border-[#CBE3F5]">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#38A9E4] font-semibold">
                Painel de Gestão
              </span>
              <h1 className="font-serif-craft text-2xl sm:text-3xl font-bold text-[#1A364A]">
                Bem-vinda, NyAtelie!
              </h1>
              <p className="text-xs sm:text-sm text-[#4A6B82] mt-1">
                Gerencie suas peças de crochê, variações de preço e dados da loja em tempo real.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-[#CBE3F5] bg-white text-red-600 hover:bg-red-50 text-xs font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Sair da Conta
            </button>
          </div>

          <div className="flex items-center gap-3 border-b border-[#CBE3F5] mb-8 pb-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "products"
                  ? "bg-[#38A9E4] text-white shadow-md"
                  : "text-[#4A6B82] hover:bg-[#EBF3FA]"
              }`}
            >
              <Package className="w-4 h-4" />
              Peças e Vitrine ({products.length})
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "settings"
                  ? "bg-[#38A9E4] text-white shadow-md"
                  : "text-[#4A6B82] hover:bg-[#EBF3FA]"
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Configurações da Loja
            </button>
          </div>

          {activeTab === "products" && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif-craft text-xl font-bold text-[#1A364A]">
                  Vitrine Atual
                </h2>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-5 py-3 rounded-2xl bg-[#38A9E4] hover:bg-[#1E82BC] text-white text-sm font-medium transition-colors shadow flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Nova Peça
                </button>
              </div>

              {products.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-[#CBE3F5]">
                  <Package className="w-12 h-12 text-[#4A6B82]/40 mx-auto mb-3" />
                  <h3 className="font-serif-craft font-bold text-lg text-[#1A364A]">
                    Sua loja ainda não tem produtos cadastrados
                  </h3>
                  <p className="text-xs text-[#4A6B82] mt-1 mb-4">
                    Clique no botão acima para adicionar a primeira peça de crochê à vitrine!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product, idx) => (
                    <div
                      key={product.id}
                      className="p-4 sm:p-5 bg-white rounded-2xl border border-[#CBE3F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#EBF3FA] flex-shrink-0 border border-[#CBE3F5]">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <h3 className="font-serif-craft font-bold text-base text-[#1A364A]">
                            {product.name}
                          </h3>
                          <p className="text-xs text-[#4A6B82] line-clamp-1 max-w-md">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {product.variations.map((v, i) => (
                              <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-[#EBF3FA] text-[#1A364A]">
                                {v.size}: <strong>R$ {v.price.toFixed(2).replace(".", ",")}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="flex items-center border border-[#CBE3F5] rounded-lg p-0.5 bg-[#F6FAFD]">
                          <button
                            onClick={() => handleMoveProduct(idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 hover:bg-[#EBF3FA] rounded text-[#1A364A] disabled:opacity-30"
                            title="Mover para cima"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveProduct(idx, "down")}
                            disabled={idx === products.length - 1}
                            className="p-1.5 hover:bg-[#EBF3FA] rounded text-[#1A364A] disabled:opacity-30"
                            title="Mover para baixo"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 rounded-lg border border-[#CBE3F5] bg-white hover:bg-[#EBF3FA] text-[#1A364A] transition-colors"
                          title="Editar peça"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Excluir peça"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "settings" && (
            <section className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-[#CBE3F5] shadow-sm">
              <h2 className="font-serif-craft text-xl font-bold text-[#1A364A] mb-6">
                Informações e Contato da Loja
              </h2>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-2">
                    Número do WhatsApp da Loja (DDI + DDD + Número)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="Ex: 5591999999999"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A]"
                    />
                    <MessageCircle className="w-4 h-4 text-[#38A9E4] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-2">
                    Título Principal do Hero (Início do Site)
                  </label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-2">
                    Subtítulo do Hero
                  </label>
                  <textarea
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    rows={3}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A]"
                  />
                </div>

                <div className="pt-6 border-t border-[#CBE3F5]">
                  <h3 className="font-serif-craft font-bold text-base text-[#1A364A] mb-4">
                    Alterar Senha do Admin (Opcional)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-1.5">
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-1.5">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingSettings}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#38A9E4] hover:bg-[#1E82BC] text-white font-medium text-sm transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submittingSettings ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </form>
            </section>
          )}
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-[#CBE3F5] p-6 sm:p-8 shadow-2xl my-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#EBF3FA] text-[#1A364A]"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-serif-craft text-2xl font-bold text-[#1A364A] mb-6">
                {editingProduct ? "Editar Peça de Crochê" : "Cadastrar Nova Peça"}
              </h2>

              <form onSubmit={handleSaveProduct} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-1.5">
                    Nome da Peça
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Sousplat Rendado Algodão"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-1.5">
                    Descrição Artesanal
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detalhes dos pontos, tipo de fio e acabamento..."
                    rows={3}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A364A] uppercase tracking-wider mb-1.5">
                    Foto Principal (URL da imagem ou Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="https://... ou faça upload"
                      required
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#CBE3F5] bg-[#F6FAFD] text-sm text-[#1A364A]"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-[#EBF3FA] hover:bg-[#CBE3F5] text-[#1A364A] text-xs font-medium cursor-pointer flex items-center gap-1.5 border border-[#CBE3F5]">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formImageUrl && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden mt-2 border border-[#CBE3F5]">
                      <Image src={formImageUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#1A364A] uppercase tracking-wider">
                      Variações de Tamanho e Preço
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormVariations([...formVariations, { size: "Novo Tamanho", price: 0 }])
                      }
                      className="text-xs font-medium text-[#38A9E4] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Adicionar Tamanho
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {formVariations.map((v, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 bg-[#EBF3FA]/60 rounded-xl border border-[#CBE3F5]">
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => {
                            const updated = [...formVariations];
                            updated[i].size = e.target.value;
                            setFormVariations(updated);
                          }}
                          placeholder="Tamanho (ex: P, 35cm)"
                          required
                          className="flex-1 px-3 py-1.5 rounded-lg border border-[#CBE3F5] bg-white text-xs text-[#1A364A]"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-[#4A6B82]">R$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={v.price}
                            onChange={(e) => {
                              const updated = [...formVariations];
                              updated[i].price = parseFloat(e.target.value) || 0;
                              setFormVariations(updated);
                            }}
                            required
                            className="w-24 px-3 py-1.5 rounded-lg border border-[#CBE3F5] bg-white text-xs text-[#1A364A]"
                          />
                        </div>
                        {formVariations.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormVariations(formVariations.filter((_, idx) => idx !== i))
                            }
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#CBE3F5] text-xs font-medium text-[#4A6B82] hover:bg-[#EBF3FA]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="px-6 py-2.5 rounded-xl bg-[#38A9E4] hover:bg-[#1E82BC] text-white text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {submittingProduct ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar Peça
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <CartDrawer whatsappNumber={settings.whatsappNumber || "5591999999999"} />
        <Footer />
      </div>
    </CartProvider>
  );
}
