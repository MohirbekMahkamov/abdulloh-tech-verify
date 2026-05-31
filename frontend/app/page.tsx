'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import { 
  Laptop, Tv, Printer as PrinterIcon, Armchair, Keyboard,
  ShieldCheck, QrCode, ArrowRight, CheckCircle, Percent, Truck, RotateCcw, Sparkles, Zap
} from 'lucide-react';
import { getStoreProducts, formatPrice, renderStars, StoreProduct } from '../lib/store-data';

export default function StoreHome() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProducts(getStoreProducts());
    setMounted(true);
  }, []);

  const featuredProducts = products.filter(p => p.badge || p.id <= 4).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col relative overflow-hidden particle-bg">
      <div className="radial-glow top-[-200px] left-[-200px] opacity-70"></div>
      <div className="radial-glow bottom-[-200px] right-[-200px] opacity-70"></div>
      <div className="absolute top-[30%] right-[5%] w-[500px] h-[500px] bg-violet-500/5 rounded-full filter blur-[150px] pointer-events-none animate-pulse"></div>

      <Header />

      <main className="flex-1 pb-16 relative z-10">
        {/* Hero */}
        <section className="relative pt-10 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className={`lg:col-span-7 space-y-6 text-left ${mounted ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-widest font-mono">
              <Sparkles size={12} className="animate-pulse" />
              Kelajak texnologiyasi bugun
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
              Premium <br />
              <span className="gradient-text-animate">
                Kompyuter Texnikalari
              </span> <br />
              Do&apos;koni
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              XENOR X bilan yuqori unumdorlik va qulaylikni his qiling. Har bir mahsulotimiz rasmiy kafolat va tasdiqlangan sifat sertifikatlariga ega.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/store"
                className="px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs font-mono text-center bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 group cursor-pointer animate-pulse-glow">
                Katalogni ko&apos;rish
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/verify"
                className="px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs font-mono text-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-sky-400 hover:text-white">
                <QrCode size={16} />
                Haqiqiylikni Tekshirish
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 max-w-lg">
              {[
                { val: '100%', label: 'Original Mahsulot' },
                { val: '3 yilgacha', label: 'Rasmiy Kafolat' },
                { val: 'Tezkor', label: 'Yetkazib berish' },
              ].map((m, i) => (
                <div key={i} className={`${mounted ? 'animate-slide-up stagger-' + (i+1) : 'opacity-0'}`}>
                  <div className="text-2xl font-bold text-white">{m.val}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Card */}
          <div className={`lg:col-span-5 relative ${mounted ? 'animate-scale-in' : 'opacity-0'}`}>
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden glass-card border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-sky-500/5 to-transparent z-0"></div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[9px] font-mono tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-1 rounded-md uppercase">XENOR X Monoblok 27&quot;</span>
              </div>
              <div className="relative z-10 my-auto flex flex-col items-center py-4">
                <div className="w-56 h-36 bg-gradient-to-t from-slate-900 to-slate-800 rounded-xl border border-white/10 relative p-1 flex items-center justify-center shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-tr from-sky-950 via-indigo-900 to-violet-950 rounded-lg overflow-hidden flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-indigo-500 to-black"></div>
                    <span className="text-xl font-black text-white tracking-widest font-sans">XENOR X</span>
                    <span className="text-[7px] text-sky-400 font-mono tracking-widest uppercase">4K ULTRA GRAPHICS</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex justify-between items-end border-t border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Super narx</span>
                  <span className="text-lg font-black text-sky-400">8 500 000 so&apos;m</span>
                </div>
                <Link href="/store" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-sky-500 hover:text-white transition-all">
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-14 border-y border-white/5 bg-slate-950/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 text-center mb-8">Mahsulot Kategoriyalari</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Monobloklar', desc: 'Premium all-in-one', icon: Laptop, href: '/store?cat=monoblok' },
                { name: 'Interaktiv Panellar', desc: 'Smart ta\'lim', icon: Tv, href: '/store?cat=panel' },
                { name: 'Laser Printerlar', desc: 'Tezkor chop etish', icon: PrinterIcon, href: '/store?cat=printer' },
                { name: 'Ofis Mebellari', desc: 'Ergonomik dizayn', icon: Armchair, href: '/store?cat=furniture' },
                { name: 'Aksessuarlar', desc: 'Qurilma to\'plamlari', icon: Keyboard, href: '/store?cat=accessory' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link key={idx} href={item.href}
                    className={`glass-card rounded-2xl p-5 border border-white/5 hover:border-sky-500/30 flex flex-col justify-between card-hover-lift group ${mounted ? 'animate-slide-up stagger-' + (idx+1) : 'opacity-0'}`}>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                      <Icon size={20} />
                    </div>
                    <div className="mt-8">
                      <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">{item.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Verification Section */}
        <section className="py-16 max-w-7xl mx-auto px-6">
          <div className="glass-card rounded-3xl p-8 md:p-12 border-sky-500/20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest font-mono">
                  <ShieldCheck size={14} />
                  Kafolatlangan Sifat
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Mahsulot Orqasidagi QR Kod Va Barcode
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                  Har bir XENOR X mahsulotimiz orqasida maxsus shtrix-kod va QR-kod joylashtiriladi. <span className="text-sky-400 font-bold">xenorx.uz/verify</span> sahifasida tekshirib ko&apos;ring.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  {['Ishlab chiqaruvchi nazorati', 'Kontrafaktga qarshi', 'Kafolat faollashuvi'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <CheckCircle size={14} className="text-emerald-400" /> {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-white/5 rounded-2xl text-center space-y-4">
                <div className="p-4 bg-white rounded-xl shadow-lg">
                  <QrCode size={80} className="text-slate-900" />
                </div>
                <div className="text-[10px] text-sky-400 font-mono tracking-widest uppercase">XENORX.UZ/VERIFY</div>
                <Link href="/verify" className="w-full py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-md cursor-pointer">
                  Kodni tekshirish
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Zap size={20} className="text-yellow-400" /> Ommabop Mahsulotlar
              </h2>
              <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mt-1">Eng yuqori baholangan texnikalar</p>
            </div>
            <Link href="/store" className="text-xs font-mono uppercase tracking-wider text-sky-400 hover:text-white flex items-center gap-1 group">
              Barcha mahsulotlar
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <div key={product.id}
                className={`glass-card rounded-2xl border-white/5 overflow-hidden flex flex-col justify-between card-hover-lift group relative ${mounted ? 'animate-slide-up stagger-' + (idx+1) : 'opacity-0'}`}>
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
                      <span className="text-[10px] text-slate-400 font-mono">Kafolat: {product.warranty}</span>
                    </div>
                    <Link href={`/store?id=${product.id}`}
                      className="w-full py-2.5 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider text-center bg-white/5 border border-white/10 hover:bg-sky-500 hover:text-white transition-all block cursor-pointer">
                      Batafsil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-12 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Bepul Yetkazish", desc: "Toshkent bo'ylab bepul kuryer", icon: Truck },
            { title: "Rasmiy Kafolat", desc: "XENOR X servis markazi kafolati", icon: ShieldCheck },
            { title: "Chegirmalar", desc: "Hamkorlar uchun maxsus takliflar", icon: Percent },
            { title: "Qulay Qaytarish", desc: "14 kun ichida almashtirish", icon: RotateCcw }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className={`flex gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl card-hover-lift ${mounted ? 'animate-slide-up stagger-' + (idx+1) : 'opacity-0'}`}>
                <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl shrink-0 h-fit">
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#0a0f1c] relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 overflow-hidden rounded bg-slate-900 border border-white/10 flex items-center justify-center p-1">
                <Image src="/logo.png" alt="XENOR X Logo" width={32} height={32} className="object-contain" />
              </div>
              <span className="text-md font-bold tracking-wider text-slate-100">XENOR X</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">O&apos;zbekistonda premium kompyuter texnologiyalarini ishlab chiqarish va ulgurji sotish brendi.</p>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs uppercase font-mono tracking-widest text-slate-400">Tezkor havolalar</h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><Link href="/store" className="hover:text-sky-400 transition-colors">Mahsulot katalogi</Link></li>
              <li><Link href="/verify" className="hover:text-sky-400 transition-colors">Tekshirish</Link></li>
              <li><Link href="/admin/login" className="hover:text-sky-400 transition-colors">Admin kirish</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs uppercase font-mono tracking-widest text-slate-400">Aloqa</h5>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
              <li>50 0075500</li>
              <li>info@xenorx.uz</li>
              <li>Namangan viloyati, Namangan shahri, Sohil MFY, Shimoliy aylanma yo&apos;li ko&apos;chasi, 1-uy</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs uppercase font-mono tracking-widest text-slate-400">Sertifikatlar</h5>
            <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-widest text-slate-500">
              <div className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> ISO 9001</div>
              <div className="flex items-center gap-1"><CheckCircle size={12} className="text-sky-500" /> CE Mark</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-8 pt-6 text-center text-[10px] text-slate-500">
          © {new Date().getFullYear()} XENOR X. Barcha huquqlar himoyalangan. | xenorx.uz
        </div>
      </footer>
    </div>
  );
}
