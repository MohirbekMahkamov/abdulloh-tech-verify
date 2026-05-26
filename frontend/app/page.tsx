'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import VerificationResult from '../components/VerificationResult';
import { barcodeApi } from '../lib/api';
import { VerificationResponse } from '../types';
import { isValidEAN13 } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { ScanBarcode, Keyboard, ShieldAlert, CheckCircle } from 'lucide-react';

// Dynamic import for camera-based scanner to prevent SSR issues
const BarcodeScanner = dynamic(() => import('../components/BarcodeScanner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-2xl bg-slate-900 border border-white/5 flex flex-col items-center justify-center text-slate-400 gap-2">
      <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-mono uppercase tracking-wider">Kamera yuklanmoqda...</span>
    </div>
  ),
});

export default function Home() {
  const [activeMode, setActiveMode] = useState<'camera' | 'manual'>('manual');
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);

  const handleScanSuccess = async (scannedCode: string) => {
    if (loading) return;
    setLoading(true);
    toast.success(`Koddagi ma'lumot o'qildi: ${scannedCode}`);
    try {
      const response = await barcodeApi.verify(scannedCode);
      setResult(response);
      if (response.status === 'ORIGINAL') {
        toast.success("Mahsulot tasdiqlandi!");
      } else {
        toast.error("Noma'lum mahsulot!");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Tekshirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEAN13(manualCode)) {
      toast.error("Iltimos, to'g'ri EAN-13 shtrix-kodini kiriting (13 ta raqam)");
      return;
    }

    setLoading(true);
    try {
      const response = await barcodeApi.verify(manualCode);
      setResult(response);
      if (response.status === 'ORIGINAL') {
        toast.success("Mahsulot tasdiqlandi!");
      } else {
        toast.error("Noma'lum mahsulot!");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Tekshirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setManualCode('');
  };

  const sampleCodes = [
    { code: '4780001234562', name: 'Monoblok 27"' },
    { code: '4780001234593', name: 'Interaktiv Panel 86"' },
    { code: '4780001234616', name: 'Laser Printer' },
    { code: '4780001234647', name: 'Ofis Stoli' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="radial-glow top-[-200px] left-[-200px]"></div>
      <div className="radial-glow bottom-[-200px] right-[-200px]"></div>

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center relative z-10">
        {!result ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 uppercase tracking-widest font-mono">
                XENOR X Verification System
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-300 to-sky-400 bg-clip-text text-transparent">
                HAQIQIYLIKNI TASDIQLASH
              </h1>
              <p className="text-slate-400 text-sm md:text-md max-w-lg mx-auto leading-relaxed">
                Abdulloh-tech zavodida ishlab chiqarilgan original elektronika, printer va mebellarning haqiqiyligini real vaqtda tekshiring.
              </p>
            </div>

            {/* Mode Selectors */}
            <div className="flex justify-center max-w-xs mx-auto p-1 bg-white/5 border border-white/10 rounded-2xl">
              <button
                onClick={() => setActiveMode('manual')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono cursor-pointer transition-all ${
                  activeMode === 'manual' 
                    ? 'bg-sky-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Keyboard size={16} />
                Qo'lda Kiritish
              </button>
              <button
                onClick={() => setActiveMode('camera')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono cursor-pointer transition-all ${
                  activeMode === 'camera' 
                    ? 'bg-sky-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ScanBarcode size={16} />
                Kamera
              </button>
            </div>

            {/* Verification Inputs */}
            <div className="max-w-md mx-auto w-full">
              {loading ? (
                <div className="glass-card rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-mono tracking-widest text-slate-400 uppercase">MAHSULOT TEKSHIRILMOQDA...</span>
                </div>
              ) : activeMode === 'camera' ? (
                <div className="space-y-4">
                  <BarcodeScanner onScan={handleScanSuccess} onError={() => {}} />
                  <div className="flex items-center gap-2 justify-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 max-w-xs mx-auto">
                    <ShieldAlert size={14} className="shrink-0" />
                    <span>Orqa kamerani yaxshi yoritilgan joyda ishlating.</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleManualSubmit} className="glass-card rounded-3xl p-6 border-white/10 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-slate-400">
                      Shtrix-kodni Kiriting (EAN-13)
                    </label>
                    <input
                      type="text"
                      maxLength={13}
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Masalan: 4780001234562"
                      className="w-full py-4 px-4 glass-input font-mono tracking-widest text-center text-lg placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={manualCode.length !== 13}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider font-mono transition-all cursor-pointer ${
                      manualCode.length === 13
                        ? 'bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 shadow-lg shadow-sky-500/10 text-white'
                        : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    Tekshirish
                  </button>
                </form>
              )}
            </div>

            {/* UX Helper: Copyable Sample Barcodes */}
            <div className="max-w-lg mx-auto text-center space-y-3">
              <h3 className="text-xs uppercase font-mono tracking-widest text-slate-500">
                Namuna uchun shtrix-kodlar (Bosing)
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {sampleCodes.map((sample) => (
                  <button
                    key={sample.code}
                    onClick={() => {
                      setManualCode(sample.code);
                      setActiveMode('manual');
                      toast.success(`Kopiya qilindi: ${sample.code}`);
                    }}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-mono font-medium hover:bg-white/10 hover:border-sky-400/40 text-slate-300 transition-all cursor-pointer"
                  >
                    {sample.name}: <span className="text-sky-400 font-bold">{sample.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6">
            <VerificationResult result={result} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 bg-[#0a0f1c] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">
              XENOR X BY ABDULLOH-TECH
            </div>
            <div className="text-[10px] text-slate-400">
              © {new Date().getFullYear()} XENOR X. Barcha huquqlar himoyalangan.
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-widest text-slate-400">
            <div className="flex items-center gap-1">
              <CheckCircle size={12} className="text-emerald-400" />
              ISO 9001:2015
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle size={12} className="text-sky-400" />
              CE Mark
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
