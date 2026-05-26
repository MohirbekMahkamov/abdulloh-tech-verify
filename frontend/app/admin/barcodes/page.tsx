'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { adminApi } from '../../../lib/api';
import { Barcode } from '../../../types';
import { toast } from 'react-hot-toast';
import { 
  ScanBarcode, 
  Upload, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  FileSpreadsheet,
  CheckCircle,
  AlertOctagon,
  X,
  Printer
} from 'lucide-react';
import { BarcodePrintLabel } from '../../../components/BarcodePrintLabel';

export default function AdminBarcodes() {
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection and Print states
  const [selectedBarcodeIds, setSelectedBarcodeIds] = useState<number[]>([]);
  const [barcodesToPrint, setBarcodesToPrint] = useState<Barcode[]>([]);
  
  // Upload modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    successCount: number;
    duplicateCount: number;
    errors: string[];
  } | null>(null);

  useEffect(() => {
    fetchBarcodes();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBarcodeIds(filteredBarcodes.map(b => b.id));
    } else {
      setSelectedBarcodeIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedBarcodeIds([...selectedBarcodeIds, id]);
    } else {
      setSelectedBarcodeIds(selectedBarcodeIds.filter(x => x !== id));
    }
  };

  const handlePrintSingle = (barcode: Barcode) => {
    toast.success('Chop etilmoqda...');
    setBarcodesToPrint([barcode]);
  };

  const handlePrintBulk = () => {
    const toPrint = barcodes.filter(b => selectedBarcodeIds.includes(b.id));
    if (toPrint.length === 0) {
      toast.error('Iltimos, avval chop etmoqchi bo\'lgan shtrix-kodlarni tanlang!');
      return;
    }
    toast.success(`${toPrint.length} ta shtrix-kod chop etilmoqda...`);
    setBarcodesToPrint(toPrint);
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

  async function fetchBarcodes() {
    setLoading(true);
    try {
      const data = await adminApi.getBarcodes();
      setBarcodes(data);
    } catch (e: any) {
      toast.error('Shtrix-kodlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith('.xlsx')) {
        toast.error('Faqat Excel (.xlsx) faylini yuklashingiz mumkin!');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Iltimos, fayl tanlang');
      return;
    }

    setUploading(true);
    try {
      const res = await adminApi.uploadBarcodes(file);
      setUploadResult(res);
      toast.success('Excel yuklash muvaffaqiyatli yakunlandi!');
      fetchBarcodes();
    } catch (err: any) {
      toast.error(err.message || 'Yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setFile(null);
    setUploadResult(null);
  };

  // Filtered barcodes based on search input
  const filteredBarcodes = barcodes.filter(barcode => 
    barcode.code.includes(searchQuery) || 
    barcode.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (barcode.dealer && barcode.dealer.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">SHTRIX-KODLAR</h1>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mt-1">
              Barcodes tracking va ommaviy yuklash
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {selectedBarcodeIds.length > 0 && (
              <button
                onClick={handlePrintBulk}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 active:scale-98 transition-all font-bold uppercase tracking-wider font-mono text-xs cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <Printer size={16} />
                Tanlanganlarni chop etish ({selectedBarcodeIds.length})
              </button>
            )}

            <button
              onClick={() => setUploadModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 active:scale-98 transition-all font-bold uppercase tracking-wider font-mono text-xs cursor-pointer shadow-lg shadow-sky-500/10"
            >
              <Upload size={16} />
              Excel yuklash (.xlsx)
            </button>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Shtrix-kod, diler yoki mahsulot nomi bo'yicha qidirish..."
            className="w-full py-2.5 pl-10 pr-4 glass-input text-sm focus:outline-none"
          />
        </div>

        {/* Barcode Table */}
        <div className="glass-card rounded-3xl p-6 border-white/10 shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-mono uppercase text-slate-500">Yuklanmoqda...</span>
            </div>
          ) : filteredBarcodes.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                    <th className="pb-3 font-semibold w-10">
                      <input
                        type="checkbox"
                        checked={filteredBarcodes.length > 0 && selectedBarcodeIds.length === filteredBarcodes.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-white/10 bg-white/5 text-sky-500 focus:ring-sky-500 focus:ring-opacity-25 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="pb-3 font-semibold">Shtrix-kod (EAN-13)</th>
                    <th className="pb-3 font-semibold">Bog'langan Mahsulot</th>
                    <th className="pb-3 font-semibold">Ishlab Chiqarish Partiyasi</th>
                    <th className="pb-3 font-semibold">Birlashtirilgan Diler</th>
                    <th className="pb-3 font-semibold">Tekshiruvlar Soni</th>
                    <th className="pb-3 font-semibold">Holati</th>
                    <th className="pb-3 font-semibold text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBarcodes.map((barcode) => (
                    <tr key={barcode.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={selectedBarcodeIds.includes(barcode.id)}
                          onChange={(e) => handleSelectOne(barcode.id, e.target.checked)}
                          className="rounded border-white/10 bg-white/5 text-sky-500 focus:ring-sky-500 focus:ring-opacity-25 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-4 font-mono font-bold text-sky-400 text-md">{barcode.code}</td>
                      <td className="py-4 font-semibold text-white">{barcode.product.name}</td>
                      <td className="py-4 font-mono text-xs text-slate-400">
                        {barcode.batch ? barcode.batch.batchCode : <span className="text-slate-600">Noma'lum</span>}
                      </td>
                      <td className="py-4 text-xs font-semibold text-slate-300">
                        {barcode.dealer ? barcode.dealer.name : <span className="text-slate-600">Biriktirilmagan</span>}
                      </td>
                      <td className="py-4 font-mono text-xs font-bold text-slate-400">
                        {barcode.scanCount} ta skan
                      </td>
                      <td className="py-4 text-xs font-mono">
                        {barcode.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider">
                            <ShieldCheck size={12} />
                            Faol
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-white/5 text-[9px] font-bold uppercase tracking-wider">
                            <ShieldAlert size={12} />
                            Bloklangan
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handlePrintSingle(barcode)}
                          className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer inline-flex"
                          title="Chop etish"
                        >
                          <Printer size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 font-medium">
              Shtrix-kodlar topilmadi.
            </div>
          )}
        </div>

        {/* Upload excel sheet Modal */}
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-white/10 flex flex-col p-6 shadow-2xl relative animate-scale-up">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet size={20} className="text-sky-400" />
                  Excel orqali ommaviy yuklash
                </h3>
                <button
                  onClick={handleCloseUploadModal}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {!uploadResult ? (
                /* File Picker Form */
                <form onSubmit={handleUploadSubmit} className="space-y-6">
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-4 bg-white/3 hover:bg-white/5 hover:border-sky-500/30 transition-all cursor-pointer relative overflow-hidden">
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <Upload size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        {file ? file.name : 'Excel faylini tanlang (.xlsx)'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">
                        Maksimal hajm: 5MB
                      </p>
                    </div>
                  </div>

                  {/* Sample Excel Format Suggestion */}
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-left space-y-1.5 text-[11px] text-slate-400 leading-relaxed font-mono">
                    <strong className="text-slate-300 block mb-1">Excel formati quyidagicha bo'lishi lozim:</strong>
                    1-Ustun: barcode_code (EAN-13 formatida)<br />
                    2-Ustun: product_id (Mahsulot ID)<br />
                    3-Ustun: batch_id (Partiya ID, ixtiyoriy)<br />
                    4-Ustun: dealer_id (Diler ID, ixtiyoriy)<br />
                    <span className="text-sky-400 block mt-1">Ushbu ustunlar 2-qatordan boshlanib yuklanishi shart.</span>
                  </div>

                  {/* Submit upload */}
                  <button
                    type="submit"
                    disabled={!file || uploading}
                    className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider font-mono text-xs transition-all cursor-pointer ${
                      !file || uploading
                        ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                        : 'bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 shadow-lg shadow-sky-500/10 text-white'
                    }`}
                  >
                    {uploading ? 'Fayl yuklanmoqda va tahlil qilinmoqda...' : 'Faylni yuklash'}
                  </button>
                </form>
              ) : (
                /* Result of the parsing session */
                <div className="space-y-6 animate-scale-up text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                    <CheckCircle size={36} />
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider font-sans">
                    Tahlil natijalari
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Yuklanganlar</div>
                      <div className="text-2xl font-black text-emerald-400 mt-1">{uploadResult.successCount} ta</div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Dublikatlar (O'tkazildi)</div>
                      <div className="text-2xl font-black text-amber-400 mt-1">{uploadResult.duplicateCount} ta</div>
                    </div>
                  </div>

                  {uploadResult.errors.length > 0 && (
                    <div className="space-y-2 text-left">
                      <h5 className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5">
                        <AlertOctagon size={14} className="text-rose-400" />
                        Yuklashdagi xatoliklar ({uploadResult.errors.length} ta)
                      </h5>
                      <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-2xl max-h-40 overflow-y-auto text-xs font-mono text-rose-400/85 leading-relaxed space-y-1.5">
                        {uploadResult.errors.map((err, idx) => (
                          <div key={idx}>• {err}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleCloseUploadModal}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-bold uppercase tracking-wider font-mono text-xs cursor-pointer"
                  >
                    Yopish
                  </button>
                </div>
              )}
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
