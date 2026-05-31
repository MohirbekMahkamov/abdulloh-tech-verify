'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import { 
  Search, X, ShieldCheck, ShoppingBag, CheckCircle, Laptop, Tv,
  Printer as PrinterIcon, Armchair, Keyboard
} from 'lucide-react';
import { getStoreProducts, categories, formatPrice, renderStars, StoreProduct } from '../../lib/store-data';

function StoreCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProducts(getStoreProducts());
    setMounted(true);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && categories.some(c => c.id === cat)) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('all');
    }
    const prodId = searchParams.get('id');
    if (prodId && products.length > 0) {
      const product = products.find(p => p.id === Number(prodId));
      if (product) setSelectedProduct(product);
    }
  }, [searchParams, products]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 'all') params.delete('cat');
    else params.set('cat', categoryId);
    router.push(`/store?${params.toString()}`);
  };

  const handleProductClick = (product: StoreProduct) => {
    setSelectedProduct(product);
    const params = new URLSearchParams(searchParams.toString());
    params.set('id', product.id.toString());
    router.push(`/store?${params.toString()}`);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('id');
    router.push(`/store?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col relative overflow-hidden particle-bg">
      <div className="radial-glow top-[-200px] left-[-200px] opacity-70"></div>
      <div className="radial-glow bottom-[-200px] right-[-200px] opacity-70"></div>

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className={mounted ? 'animate-slide-in-left' : 'opacity-0'}>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Mahsulotlar Katalogi</h1>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mt-1">XENOR X original texnologiyalari</p>
          </div>
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Search size={16} /></span>
            <input type="text" placeholder="Mahsulot qidirish..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-10 pr-4 glass-input text-sm placeholder:text-slate-500 focus:outline-none" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => handleCategorySelect(cat.id)}
              className={`px-5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'
              }`}>
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <div key={product.id} onClick={() => handleProductClick(product)}
                className={`glass-card rounded-2xl border-white/5 overflow-hidden flex flex-col justify-between card-hover-lift group relative cursor-pointer ${mounted ? 'animate-slide-up stagger-' + Math.min(idx+1, 6) : 'opacity-0'}`}>
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-gradient-to-r from-sky-500 to-violet-500 text-white uppercase shadow-lg">
                    {product.badge}
                  </span>
                )}
                <div className="aspect-[4/3] w-full bg-slate-900/50 relative border-b border-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-10 pointer-events-none"></div>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-sky-400 font-mono uppercase tracking-wider">{product.categoryLabel}</span>
                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-sky-400 transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-1 pt-1">
                      <span className="text-yellow-400 text-xs font-mono">{renderStars(product.rating)}</span>
                      <span className="text-[10px] text-slate-500">({product.reviews})</span>
                    </div>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <div className="flex items-baseline justify-between">
                      <div className="flex flex-col">
                        {product.oldPrice && <span className="text-[10px] text-slate-500 line-through font-mono">{formatPrice(product.oldPrice)}</span>}
                        <span className="text-sm font-black text-white font-mono">{formatPrice(product.price)}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${product.inStock ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {product.inStock ? 'Mavjud' : 'Tugagan'}
                      </span>
                    </div>
                    <button className="w-full py-2.5 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider text-center bg-white/5 border border-white/10 group-hover:bg-sky-500 group-hover:text-white transition-all cursor-pointer">
                      Batafsil ma&apos;lumot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center border-white/5 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mx-auto"><ShoppingBag size={24} /></div>
            <h3 className="text-md font-bold text-white">Mahsulot topilmadi</h3>
            <button onClick={() => setSearchQuery('')} className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer">
              Qidiruvni tozalash
            </button>
          </div>
        )}

        {/* Verify Banner */}
        <div className="glass-card rounded-3xl p-6 border-sky-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={18} className="text-emerald-400" /> Haqiqiylikni tekshiring
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">XENOR X mahsulotlari shtrix-kodi orqali tekshirish.</p>
          </div>
          <Link href="/verify" className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold font-mono uppercase tracking-wider shadow-lg shrink-0">
            Skanerlash sahifasi
          </Link>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-2xl rounded-3xl border-white/10 overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh] animate-scale-in">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-sky-400 font-mono uppercase tracking-wider bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">{selectedProduct.categoryLabel}</span>
                <button onClick={handleCloseModal} className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:text-rose-400 transition-all cursor-pointer"><X size={18} /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-5 aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-white/5">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="md:col-span-7 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="text-yellow-400">{renderStars(selectedProduct.rating)}</span>
                        <span>{selectedProduct.rating} / 5 ({selectedProduct.reviews} ta sharh)</span>
                      </div>
                    </div>
                    <div className="space-y-1 pt-4">
                      <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Narx</div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-white font-mono">{formatPrice(selectedProduct.price)}</span>
                        {selectedProduct.oldPrice && <span className="text-xs text-slate-500 line-through font-mono">{formatPrice(selectedProduct.oldPrice)}</span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">Tavsif</h3>
                  <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{selectedProduct.description}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">Texnik Xarakteristikalar</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(selectedProduct.specs).filter(([key]) => key !== '_logistics').map(([key, val]) => (
                      <div key={key} className="p-3 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">{key}</span>
                        <span className="text-xs font-semibold text-slate-200 mt-1 block">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
                    <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">100% Original</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Zavod tekshiruvi va sertifikatlar.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-2xl flex items-start gap-3">
                    <ShieldCheck size={18} className="text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{selectedProduct.warranty} Kafolat</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Rasmiy servis markazi.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/5 flex gap-3">
                <Link href="/verify" className="flex-1 py-3.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-center bg-white/5 border border-white/10 hover:bg-white/10 hover:text-sky-400 transition-all cursor-pointer">
                  QR Tekshirish
                </Link>
                <a href="tel:+998500075500" className="flex-1 py-3.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-center bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 transition-all shadow-lg text-white cursor-pointer">
                  Buyurtma berish
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function StoreCatalog() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-mono tracking-widest text-slate-400">YUKLANMOQDA...</span>
        </div>
      </div>
    }>
      <StoreCatalogContent />
    </Suspense>
  );
}
