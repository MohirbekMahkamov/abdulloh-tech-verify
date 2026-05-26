'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { adminApi } from '../../../lib/api';
import { Dealer } from '../../../types';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, MapPin, Check, Phone, UserCheck, UserMinus } from 'lucide-react';

export default function AdminDealers() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Toshkent');
  const [contactInfo, setContactInfo] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Region list for Uzbek regions
  const regions = [
    'Toshkent', 'Namangan', 'Andijon', 'Farg\'ona', 'Buxoro', 
    'Samarqand', 'Qashqadaryo', 'Surxondaryo', 'Jizzax', 
    'Sirdaryo', 'Xorazm', 'Navoiy', 'Qoraqalpog\'iston'
  ];

  useEffect(() => {
    fetchDealers();
  }, []);

  async function fetchDealers() {
    setLoading(true);
    try {
      const data = await adminApi.getDealers();
      setDealers(data);
    } catch (e: any) {
      toast.error('Dilerlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setName('');
    setRegion('Toshkent');
    setContactInfo('');
    setIsActive(true);
    setEditingId(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (dealer: Dealer) => {
    setName(dealer.name);
    setRegion(dealer.region);
    setContactInfo(dealer.contactInfo);
    setIsActive(dealer.isActive);
    setEditingId(dealer.id);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !region || !contactInfo) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    const payload = {
      name,
      region,
      contactInfo,
      isActive
    };

    try {
      if (editingId !== null) {
        await adminApi.updateDealer(editingId, payload);
        toast.success('Diler ma\'lumotlari yangilandi!');
      } else {
        await adminApi.createDealer(payload);
        toast.success('Yangi diler qo\'shildi!');
      }
      setModalOpen(false);
      fetchDealers();
    } catch (e: any) {
      toast.error(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Ushbu diler hubini o\'chirishga ishonchingiz komilmi? Tegishli shtrix-kodlar diler biriktirilmagan bo\'lib qoladi!')) {
      try {
        await adminApi.deleteDealer(id);
        toast.success('Diler o\'chirildi!');
        fetchDealers();
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
            <h1 className="text-2xl md:text-3xl font-black text-white">DILERLAR</h1>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mt-1">
              Hududiy taqsimot dilerlarini boshqarish (15+ rasmiy dilerlar)
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 active:scale-98 transition-all font-bold uppercase tracking-wider font-mono text-xs cursor-pointer shadow-lg shadow-sky-500/10"
          >
            <Plus size={16} />
            Diler qo'shish
          </button>
        </div>

        {/* Dealers Table */}
        <div className="glass-card rounded-3xl p-6 border-white/10 shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-mono uppercase text-slate-500">Yuklanmoqda...</span>
            </div>
          ) : dealers.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Diler Nomi</th>
                    <th className="pb-3 font-semibold">Hudud (Region)</th>
                    <th className="pb-3 font-semibold">Kontakt Ma'lumoti</th>
                    <th className="pb-3 font-semibold">Holati</th>
                    <th className="pb-3 font-semibold text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dealers.map((dealer) => (
                    <tr key={dealer.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-mono text-xs text-slate-500">#{dealer.id}</td>
                      <td className="py-4 font-bold text-white text-md">{dealer.name}</td>
                      <td className="py-4 font-semibold text-sky-400 flex items-center gap-1.5 pt-5">
                        <MapPin size={14} />
                        {dealer.region}
                      </td>
                      <td className="py-4 font-mono text-xs text-slate-300">
                        {dealer.contactInfo}
                      </td>
                      <td className="py-4 text-xs font-mono">
                        {dealer.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider">
                            <UserCheck size={12} />
                            Faol
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-white/5 text-[9px] font-bold uppercase tracking-wider">
                            <UserMinus size={12} />
                            Nofaol
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(dealer)}
                          className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-sky-400 hover:border-sky-400/30 transition-all cursor-pointer inline-flex"
                          title="Tahrirlash"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(dealer.id)}
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
              Dilerlar ro'yxati bo'sh.
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
                  <MapPin size={20} className="text-sky-400" />
                  {editingId !== null ? 'Diler hubini tahrirlash' : 'Yangi diler qo\'shish'}
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
                {/* Dealer Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Diler Nomi (Hub name)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Toshkent Central Hub"
                    className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none"
                    required
                  />
                </div>

                {/* Region Select */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Dilerlik Hududi (Uzbekistan)</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none bg-[#111827] cursor-pointer"
                  >
                    {regions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1">
                    <Phone size={12} className="text-sky-400" />
                    Kontakt / Telefon raqam
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Masalan: +998901234501"
                    className="w-full py-2.5 px-3.5 glass-input text-sm font-mono focus:outline-none"
                    required
                  />
                </div>

                {/* Active status */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-widest text-slate-400">Dilerlik Faolligi</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isActive} 
                      onChange={(e) => setIsActive(e.target.checked)}
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
