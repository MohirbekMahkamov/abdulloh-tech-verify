'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Check, ShoppingBag, Image as ImageIcon } from 'lucide-react';
import { StoreProductItem, StoreCategory } from '../../../types';
import { getStoreProducts, saveStoreProducts, addStoreProduct, updateStoreProduct, deleteStoreProduct, categories, formatPrice } from '../../../lib/store-data';

export default function AdminStoreProducts() {
  const [products, setProducts] = useState<StoreProductItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<StoreCategory>('monoblok');
  const [categoryLabel, setCategoryLabel] = useState('Monoblok');
  const [price, setPrice] = useState('5000000');
  const [oldPrice, setOldPrice] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [warranty, setWarranty] = useState('1 yil');
  const [inStock, setInStock] = useState(true);
  const [rating, setRating] = useState('4.5');
  const [reviews, setReviews] = useState('10');
  const [specsList, setSpecsList] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);

  useEffect(() => { reload(); }, []);

  function reload() {
    setProducts(getStoreProducts());
  }

  const categoryOptions: { id: StoreCategory; label: string }[] = [
    { id: 'monoblok', label: 'Monoblok' },
    { id: 'panel', label: 'Interaktiv Panel' },
    { id: 'printer', label: 'Laser Printer' },
    { id: 'furniture', label: 'Ofis Mebeli' },
    { id: 'accessory', label: 'Aksessuar' },
  ];

  const resetForm = () => {
    setName(''); setCategory('monoblok'); setCategoryLabel('Monoblok');
    setPrice('5000000'); setOldPrice(''); setImage('https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80');
    setBadge(''); setDescription(''); setWarranty('1 yil'); setInStock(true);
    setRating('4.5'); setReviews('10');
    setSpecsList([{ key: '', value: '' }]);
    setEditingId(null);
  };

  const handleOpenAdd = () => { resetForm(); setModalOpen(true); };

  const handleOpenEdit = (p: StoreProductItem) => {
    setName(p.name); setCategory(p.category); setCategoryLabel(p.categoryLabel);
    setPrice(String(p.price)); setOldPrice(p.oldPrice ? String(p.oldPrice) : '');
    setImage(p.image); setBadge(p.badge || ''); setDescription(p.description);
    setWarranty(p.warranty); setInStock(p.inStock); setRating(String(p.rating));
    setReviews(String(p.reviews));
    const sl = Object.entries(p.specs).map(([key, value]) => ({ key, value }));
    setSpecsList(sl.length > 0 ? sl : [{ key: '', value: '' }]);
    setEditingId(p.id);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) { toast.error("Nom va narxni to'ldiring"); return; }
    const specsObj: Record<string, string> = {};
    specsList.forEach(s => { if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim(); });

    const data = {
      name, category, categoryLabel,
      price: Number(price), oldPrice: oldPrice ? Number(oldPrice) : undefined,
      image, badge: badge || undefined, description, warranty, inStock,
      rating: Number(rating), reviews: Number(reviews), specs: specsObj,
    };

    if (editingId !== null) {
      updateStoreProduct(editingId, data);
      toast.success("Do'kon mahsuloti yangilandi!");
    } else {
      addStoreProduct(data);
      toast.success("Yangi do'kon mahsuloti qo'shildi!");
    }
    setModalOpen(false);
    reload();
  };

  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan o'chirmoqchimisiz?")) {
      deleteStoreProduct(id);
      toast.success("Mahsulot o'chirildi");
      reload();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <ShoppingBag size={22} className="text-violet-400" /> Do&apos;kon Mahsulotlari
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-1">Online magazin uchun alohida mahsulot boshqaruvi</p>
          </div>
          <button onClick={handleOpenAdd}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all">
            <Plus size={16} /> Yangi mahsulot
          </button>
        </div>

        {/* Products Table */}
        <div className="glass-card rounded-2xl border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-[10px] uppercase font-mono tracking-widest text-slate-400 border-b border-white/5">
                  <th className="px-4 py-3">Rasm</th>
                  <th className="px-4 py-3">Nomi</th>
                  <th className="px-4 py-3">Kategoriya</th>
                  <th className="px-4 py-3">Narxi</th>
                  <th className="px-4 py-3">Holat</th>
                  <th className="px-4 py-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <img src={p.image} alt={p.name} className="w-12 h-9 object-cover rounded-lg border border-white/10" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-xs">{p.name}</div>
                      {p.badge && <span className="text-[9px] text-violet-400 font-mono">{p.badge}</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{p.categoryLabel}</td>
                    <td className="px-4 py-3 text-xs font-mono text-white font-bold">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${p.inStock ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {p.inStock ? 'Mavjud' : 'Tugagan'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleOpenEdit(p)}
                          className="p-2 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition cursor-pointer">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-500">Hech qanday do&apos;kon mahsuloti topilmadi</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-xl rounded-3xl border-white/10 overflow-hidden shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShoppingBag size={18} className="text-violet-400" />
                  {editingId !== null ? "Mahsulotni tahrirlash" : "Yangi do'kon mahsuloti"}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Mahsulot Nomi</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Masalan: XENOR X Monoblok 27&quot;"
                    className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Kategoriya</label>
                    <select value={category} onChange={e => { setCategory(e.target.value as StoreCategory); setCategoryLabel(categoryOptions.find(c => c.id === e.target.value)?.label || ''); }}
                      className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none cursor-pointer">
                      {categoryOptions.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Kafolat</label>
                    <input type="text" value={warranty} onChange={e => setWarranty(e.target.value)} placeholder="1 yil"
                      className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Narxi</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                      className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Eski narx</label>
                    <input type="number" value={oldPrice} onChange={e => setOldPrice(e.target.value)} placeholder="Ixtiyoriy"
                      className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Badge</label>
                    <input type="text" value={badge} onChange={e => setBadge(e.target.value)} placeholder="YANGI"
                      className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Rasm URL</label>
                  <input type="text" value={image} onChange={e => setImage(e.target.value)}
                    className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Reyting</label>
                    <input type="number" step="0.1" min="0" max="5" value={rating} onChange={e => setRating(e.target.value)}
                      className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Sharhlar</label>
                    <input type="number" value={reviews} onChange={e => setReviews(e.target.value)}
                      className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none" />
                  </div>
                  <div className="space-y-2 flex items-end pb-1">
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                      Omborda
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Tavsif</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Mahsulot haqida..."
                    className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none" />
                </div>

                {/* Specs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Xususiyatlar</label>
                    <button type="button" onClick={() => setSpecsList([...specsList, { key: '', value: '' }])}
                      className="text-[10px] uppercase font-mono tracking-wider font-bold text-sky-400 hover:text-sky-300 cursor-pointer">
                      + Qo&apos;shish
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {specsList.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input type="text" value={item.key} onChange={e => { const l = [...specsList]; l[idx].key = e.target.value; setSpecsList(l); }}
                          placeholder="Nom" className="flex-1 py-2 px-3 glass-input text-xs focus:outline-none" />
                        <input type="text" value={item.value} onChange={e => { const l = [...specsList]; l[idx].value = e.target.value; setSpecsList(l); }}
                          placeholder="Qiymat" className="flex-1 py-2 px-3 glass-input text-xs focus:outline-none" />
                        <button type="button" onClick={() => { const l = [...specsList]; l.splice(idx, 1); setSpecsList(l); }}
                          className="p-2 rounded-lg bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 cursor-pointer" disabled={specsList.length <= 1}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit"
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 hover:opacity-90 shadow-lg font-bold uppercase tracking-wider font-mono text-xs cursor-pointer text-white">
                  <Check size={16} className="inline mr-1" />
                  {editingId !== null ? 'Yangilash' : 'Saqlash'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
