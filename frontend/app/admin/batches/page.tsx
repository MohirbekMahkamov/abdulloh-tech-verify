'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { adminApi } from '../../../lib/api';
import { Batch, Product } from '../../../types';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Calendar, Check, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function AdminBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [batchCode, setBatchCode] = useState('');
  const [productId, setProductId] = useState('');
  const [productionDate, setProductionDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalCount, setTotalCount] = useState(100);
  const [isoStandardStatus, setIsoStandardStatus] = useState(true);

  useEffect(() => {
    fetchBatchesAndProducts();
  }, []);

  async function fetchBatchesAndProducts() {
    setLoading(true);
    try {
      const batchData = await adminApi.getBatches();
      const productData = await adminApi.getProducts();
      setBatches(batchData);
      setProducts(productData);
      if (productData.length > 0) {
        setProductId(String(productData[0].id));
      }
    } catch (e: any) {
      toast.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setBatchCode(`BATCH-2026-X${batches.length + 1}`);
    if (products.length > 0) {
      setProductId(String(products[0].id));
    }
    setProductionDate(new Date().toISOString().split('T')[0]);
    setTotalCount(100);
    setIsoStandardStatus(true);
    setEditingId(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (batch: Batch) => {
    setBatchCode(batch.batchCode);
    setProductId(String(batch.product.id));
    setProductionDate(batch.productionDate);
    setTotalCount(batch.totalCount);
    setIsoStandardStatus(batch.isoStandardStatus);
    setEditingId(batch.id);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCode || !productId || !productionDate || !totalCount) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    const payload = {
      batchCode,
      productId: Number(productId),
      productionDate,
      totalCount: Number(totalCount),
      isoStandardStatus
    };

    try {
      if (editingId !== null) {
        await adminApi.updateBatch(editingId, payload);
        toast.success('Partiya yangilandi!');
      } else {
        await adminApi.createBatch(payload);
        toast.success('Yangi partiya yaratildi!');
      }
      setModalOpen(false);
      fetchBatchesAndProducts();
    } catch (e: any) {
      toast.error(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Ushbu partiyani o\'chirishga ishonchingiz komilmi? Bu partiyaga tegishli barcha shtrix-kodlar partiyasiz bo\'lib qoladi!')) {
      try {
        await adminApi.deleteBatch(id);
        toast.success('Partiya o\'chirildi!');
        fetchBatchesAndProducts();
      } catch (e: any) {
        toast.error('O\'chirishda xatolik yuz berdi');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">PARTIYALAR</h1>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mt-1">
              Ishlab chiqarish partiyalari va lotlarni boshqarish
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 active:scale-98 transition-all font-bold uppercase tracking-wider font-mono text-xs cursor-pointer shadow-lg shadow-sky-500/10"
            disabled={products.length === 0}
            title={products.length === 0 ? "Avval kamida bitta mahsulot yarating" : ""}
          >
            <Plus size={16} />
            Yangi Partiya
          </button>
        </div>

        {/* Product restriction warning if no products exist */}
        {products.length === 0 && !loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
            <ShieldAlert size={20} className="shrink-0" />
            <span>Diqqat! Partiya yaratishdan oldin mahsulotlar katalogida kamida bitta mahsulot turini yaratishingiz lozim.</span>
          </div>
        )}

        {/* Batch Table */}
        <div className="glass-card rounded-3xl p-6 border-white/10 shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-mono uppercase text-slate-500">Yuklanmoqda...</span>
            </div>
          ) : batches.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                    <th className="pb-3 font-semibold">Lot / Kod</th>
                    <th className="pb-3 font-semibold">Mahsulot</th>
                    <th className="pb-3 font-semibold">Chiqarilgan Sana</th>
                    <th className="pb-3 font-semibold">Miqdori</th>
                    <th className="pb-3 font-semibold">ISO Standardi</th>
                    <th className="pb-3 font-semibold text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-mono font-bold text-sky-400">{batch.batchCode}</td>
                      <td className="py-4 font-semibold text-white">{batch.product.name}</td>
                      <td className="py-4 font-mono text-xs text-slate-400">
                        {new Date(batch.productionDate).toLocaleDateString('uz-UZ')}
                      </td>
                      <td className="py-4 text-slate-300 font-bold font-mono">{batch.totalCount} ta</td>
                      <td className="py-4 text-xs font-mono">
                        {batch.isoStandardStatus ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                            <ShieldCheck size={12} />
                            Muvofiq (ISO)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold">
                            <ShieldAlert size={12} />
                            Kutilmoqda
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(batch)}
                          className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-sky-400 hover:border-sky-400/30 transition-all cursor-pointer inline-flex"
                          title="Tahrirlash"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(batch.id)}
                          className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer inline-flex"
                          title="O'chirish"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 font-medium">
              Ishlab chiqarish partiyalari mavjud emas.
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto border-white/10 flex flex-col p-6 shadow-2xl relative animate-scale-up">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar size={20} className="text-sky-400" />
                  {editingId !== null ? 'Partiyani tahrirlash' : 'Yangi partiya yaratish'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Batch Code */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Partiya Kodi (Lot Number)</label>
                  <input
                    type="text"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    placeholder="Masalan: BATCH-2026-X1"
                    className="w-full py-2.5 px-3.5 glass-input text-sm font-mono focus:outline-none"
                    required
                  />
                </div>

                {/* Product Select */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Mahsulot Turi</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none bg-[#111827] cursor-pointer"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Grid Date & Count */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Chiqarilgan Sana</label>
                    <input
                      type="date"
                      value={productionDate}
                      onChange={(e) => setProductionDate(e.target.value)}
                      className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none bg-[#111827] cursor-pointer"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Miqdori (Jami dona)</label>
                    <input
                      type="number"
                      value={totalCount}
                      onChange={(e) => setTotalCount(Number(e.target.value))}
                      className="w-full py-2.5 px-3.5 glass-input text-sm font-mono focus:outline-none"
                      min={1}
                      required
                    />
                  </div>
                </div>

                {/* ISO standard status check */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-widest text-slate-400">ISO 9001:2015 muvofiqligi</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isoStandardStatus} 
                      onChange={(e) => setIsoStandardStatus(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-sky-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white"></div>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 shadow-lg shadow-sky-500/10 font-bold uppercase tracking-wider font-mono text-xs cursor-pointer text-white"
                >
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
