'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { adminApi } from '../../../lib/api';
import { Product, Category, Batch, Dealer, Barcode } from '../../../types';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Cpu, Info, Check, AlertTriangle, Printer, Barcode as BarcodeIcon } from 'lucide-react';
import { BarcodePrintLabel } from '../../../components/BarcodePrintLabel';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('ELECTRONICS');
  const [warranty, setWarranty] = useState('1 yil');
  // Specifications as dynamic key-value list
  const [specsList, setSpecsList] = useState<Array<{ key: string; value: string }>>([
    { key: 'processor', value: 'Intel Core i5' },
    { key: 'ram', value: '8GB DDR4' }
  ]);

  // Print Modal states
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printProduct, setPrintProduct] = useState<Product | null>(null);
  const [printCount, setPrintCount] = useState<number>(1);
  const [selectedBatchId, setSelectedBatchId] = useState<number | string>('');
  const [selectedDealerId, setSelectedDealerId] = useState<number | string>('');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [barcodesList, setBarcodesList] = useState<Barcode[]>([]);
  const [barcodesToPrint, setBarcodesToPrint] = useState<Barcode[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewCode, setPreviewCode] = useState('4780001234562');

  useEffect(() => {
    fetchProducts();
    fetchMetadata();
  }, []);

  async function fetchMetadata() {
    try {
      const [batchesData, dealersData, barcodesData] = await Promise.all([
        adminApi.getBatches(),
        adminApi.getDealers(),
        adminApi.getBarcodes()
      ]);
      setBatches(batchesData);
      setDealers(dealersData);
      setBarcodesList(barcodesData);
    } catch (e) {
      console.error('Metadata yuklashda xatolik:', e);
    }
  }

  const handleOpenPrintModal = (product: Product) => {
    setPrintProduct(product);
    setPrintCount(1);
    setSelectedBatchId('');
    setSelectedDealerId('');
    // Generate a temporary EAN-13 code for realistic preview
    const tempCode = '478' + Math.floor(100000000 + Math.random() * 900000000).toString();
    setPreviewCode(tempCode);
    setPrintModalOpen(true);
  };

  const handlePrint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!printProduct) return;

    setIsGenerating(true);
    try {
      const bId = selectedBatchId ? Number(selectedBatchId) : undefined;
      const dId = selectedDealerId ? Number(selectedDealerId) : undefined;

      const generated = await adminApi.generateBarcodes(
        printProduct.id,
        printCount,
        bId,
        dId
      );

      toast.success(`${printCount} ta shtrix-kod muvaffaqiyatli yaratildi! Chop etilmoqda...`);
      setPrintModalOpen(false);
      setBarcodesToPrint(generated);
      fetchMetadata(); // Refresh the barcode counts in real-time!
    } catch (e: any) {
      toast.error(e.message || 'Shtrix-kod yaratishda xatolik yuz berdi');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (barcodesToPrint.length > 0) {
      const timer = setTimeout(() => {
        window.print();
        setBarcodesToPrint([]);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [barcodesToPrint]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (e: any) {
      toast.error('Mahsulotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }

  const handleAddSpecRow = () => {
    setSpecsList([...specsList, { key: '', value: '' }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    const list = [...specsList];
    list.splice(idx, 1);
    setSpecsList(list);
  };

  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) => {
    const list = [...specsList];
    list[idx][field] = val;
    setSpecsList(list);
  };

  const handleOpenAddModal = () => {
    setName('');
    setCategory('ELECTRONICS');
    setWarranty('1 yil');
    setSpecsList([
      { key: 'ishlab chiqaruvchi', value: 'XENOR X' },
      { key: 'model', value: 'Premium Edition' }
    ]);
    setEditingId(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setName(product.name);
    setCategory(product.category);
    setWarranty(product.warrantyPeriod);
    
    // Parse specs JSON
    try {
      const parsed = JSON.parse(product.specs);
      const list = Object.entries(parsed).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      setSpecsList(list.length > 0 ? list : [{ key: '', value: '' }]);
    } catch (e) {
      setSpecsList([{ key: 'xususiyat', value: product.specs }]);
    }

    setEditingId(product.id);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !warranty) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    // Convert specs list to JSON string
    const specsObj: Record<string, string> = {};
    specsList.forEach(item => {
      if (item.key.trim()) {
        specsObj[item.key.trim()] = item.value.trim();
      }
    });
    const specsJson = JSON.stringify(specsObj);

    const payload = {
      name,
      category,
      specs: specsJson,
      warrantyPeriod: warranty
    };

    try {
      if (editingId !== null) {
        await adminApi.updateProduct(editingId, payload);
        toast.success('Mahsulot yangilandi!');
      } else {
        const newProduct = await adminApi.createProduct(payload);
        toast.success('Yangi mahsulot qo\'shildi!');
        // Automatically open the print modal for this newly created product immediately
        setTimeout(() => {
          handleOpenPrintModal(newProduct);
        }, 300);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (e: any) {
      toast.error(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Ushbu mahsulotni o\'chirishga ishonchingiz komilmi? Bu mahsulotga tegishli partiyalar va shtrix-kodlar ham o\'chib ketishi mumkin!')) {
      try {
        await adminApi.deleteProduct(id);
        toast.success('Mahsulot o\'chirildi!');
        fetchProducts();
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
            <h1 className="text-2xl md:text-3xl font-black text-white">MAHSULOTLAR</h1>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mt-1">
              XENOR X mahsulotlar katalogini boshqarish
            </p>
          </div>

          <button
            onClick={handleAddSpecRow} // Standard placeholder fallback to clear inputs
            onClickCapture={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 active:scale-98 transition-all font-bold uppercase tracking-wider font-mono text-xs cursor-pointer shadow-lg shadow-sky-500/10"
          >
            <Plus size={16} />
            Mahsulot qo'shish
          </button>
        </div>

        {/* Product Table */}
        <div className="glass-card rounded-3xl p-6 border-white/10 shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-mono uppercase text-slate-500">Yuklanmoqda...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Mahsulot Nomi</th>
                    <th className="pb-3 font-semibold">Kategoriya</th>
                    <th className="pb-3 font-semibold">Kafolat</th>
                    <th className="pb-3 font-semibold">Texnik Tavsif (Qisqacha)</th>
                    <th className="pb-3 font-semibold text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => {
                    let shortSpecs = '';
                    try {
                      const parsed = JSON.parse(product.specs);
                      shortSpecs = Object.entries(parsed).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ') + '...';
                    } catch (e) {
                      shortSpecs = product.specs.slice(0, 30) + '...';
                    }

                    return (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-mono text-xs text-slate-500">#{product.id}</td>
                        <td className="py-4 text-md">
                          <div className="font-bold text-white">{product.name}</div>
                          <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1 uppercase font-bold tracking-wider">
                            <BarcodeIcon size={10} className="inline shrink-0" />
                            {barcodesList.filter(b => b.product.id === product.id).length} ta shtrix-kod
                          </div>
                        </td>
                        <td className="py-4 text-xs font-mono">
                          <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-widest text-[9px] font-bold">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 text-slate-300 font-medium">{product.warrantyPeriod}</td>
                        <td className="py-4 text-xs text-slate-400 font-mono truncate max-w-[200px]" title={product.specs}>
                          {shortSpecs}
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenPrintModal(product)}
                            className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer inline-flex"
                            title="Shtrix-kod chop etish"
                          >
                            <Printer size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-sky-400 hover:border-sky-400/30 transition-all cursor-pointer inline-flex"
                            title="Tahrirlash"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer inline-flex"
                            title="O'chirish"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 font-medium">
              Katalogda mahsulotlar mavjud emas.
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-white/10 flex flex-col p-6 shadow-2xl relative animate-scale-up">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu size={20} className="text-sky-400" />
                  {editingId !== null ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
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
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Mahsulot Nomi</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Monoblok XENOR X 27''"
                    className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none"
                    required
                  />
                </div>

                {/* Grid Category & Warranty */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Kategoriya</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none bg-[#111827] cursor-pointer"
                    >
                      <option value="ELECTRONICS">ELECTRONICS</option>
                      <option value="PRINTER">PRINTER</option>
                      <option value="FURNITURE">FURNITURE</option>
                      <option value="TEXTILE">TEXTILE</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Kafolat muddati</label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      placeholder="Masalan: 1 yil"
                      className="w-full py-2.5 px-3.5 glass-input text-sm focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Specs List Builder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Info size={14} className="text-sky-400" />
                      Xususiyatlari
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="text-[10px] uppercase font-mono tracking-wider font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                    >
                      + Qator qo'shish
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {specsList.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                          placeholder="Nom (masalan: CPU)"
                          className="flex-1 py-2 px-3 glass-input text-xs focus:outline-none"
                          required
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                          placeholder="Qiymat (masalan: Core i7)"
                          className="flex-1 py-2 px-3 glass-input text-xs focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecRow(idx)}
                          className="p-2 rounded-lg bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                          disabled={specsList.length <= 1}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
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

        {/* Print Modal */}
        {printModalOpen && printProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 flex flex-col p-6 shadow-2xl relative animate-scale-up">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Printer size={20} className="text-emerald-400" />
                  Shtrix-kod Yaratish va Chop Etish
                </h3>
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handlePrint} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Settings Panel */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-bold text-sm">{printProduct.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{printProduct.category}</span>
                  </div>

                  {/* Batch Selector */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Partiya (Batch) - Ixtiyoriy</label>
                    <select
                      value={selectedBatchId}
                      onChange={(e) => setSelectedBatchId(e.target.value)}
                      className="w-full py-2.5 px-3.5 glass-input text-xs focus:outline-none bg-[#111827] cursor-pointer"
                    >
                      <option value="">-- Tanlang (Partiyasiz) --</option>
                      {batches
                        .filter(b => b.product.id === printProduct.id)
                        .map(b => (
                          <option key={b.id} value={b.id}>{b.batchCode} ({b.productionDate})</option>
                        ))
                      }
                    </select>
                  </div>

                  {/* Dealer Selector */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Diler (Dealer) - Ixtiyoriy</label>
                    <select
                      value={selectedDealerId}
                      onChange={(e) => setSelectedDealerId(e.target.value)}
                      className="w-full py-2.5 px-3.5 glass-input text-xs focus:outline-none bg-[#111827] cursor-pointer"
                    >
                      <option value="">-- Tanlang (Dilersiz) --</option>
                      {dealers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.region})</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Input */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">Shtrix-kodlar soni</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={printCount}
                      onChange={(e) => setPrintCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full py-2.5 px-3.5 glass-input text-xs focus:outline-none"
                      required
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 shadow-lg shadow-emerald-500/10 font-bold uppercase tracking-wider font-mono text-xs cursor-pointer text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Printer size={14} />
                    )}
                    Yaratish va Chop etish
                  </button>
                </div>

                {/* Sticker Live Preview */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                    <BarcodeIcon size={12} className="text-emerald-400 animate-pulse" />
                    Etiketka Namuna Ko'rinishi
                  </span>
                  
                  <div className="shadow-2xl rounded-lg overflow-hidden border border-slate-200/20 transform hover:scale-102 transition-transform duration-300">
                    <BarcodePrintLabel 
                      barcode={{
                        id: 0,
                        code: previewCode,
                        product: printProduct,
                        batch: batches.find(b => b.id === Number(selectedBatchId)),
                        dealer: dealers.find(d => d.id === Number(selectedDealerId)),
                        isActive: true,
                        scanCount: 0
                      }} 
                    />
                  </div>
                  
                  <p className="text-[9px] text-slate-500 text-center mt-3 font-mono">
                    Haqiqiy o'lcham: 58mm x 40mm termal etiketka
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Print Root for physical printers */}
      <div id="print-root">
        {barcodesToPrint.map((bc, index) => (
          <BarcodePrintLabel key={`${bc.code}-${index}`} barcode={bc} />
        ))}
      </div>
    </AdminLayout>
  );
}
