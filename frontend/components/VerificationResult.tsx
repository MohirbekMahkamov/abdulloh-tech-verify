'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  AlertOctagon, 
  Cpu, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Info, 
  FileText, 
  Activity 
} from 'lucide-react';
import { VerificationResponse } from '../types';

interface VerificationResultProps {
  result: VerificationResponse;
  onReset: () => void;
}

export default function VerificationResult({ result, onReset }: VerificationResultProps) {
  const [activeTab, setActiveTab] = useState<'specs' | 'logistic' | 'batch'>('specs');

  if (result.status === 'INVALID') {
    return (
      <div className="glass-card max-w-lg mx-auto rounded-3xl p-8 border-red-500/20 text-center animate-fade-in">
        <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-500 animate-pulse">
          <AlertOctagon size={44} />
        </div>
        <h2 className="text-2xl font-bold text-red-400 mb-2">MAHSULOT TOPILMADI</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Taqdim etilgan shtrix-kod XENOR X (Abdulloh-tech) original mahsulotlar ro'yxatida aniqlanmadi. Iltimos, kodni qaytadan tekshirib ko'ring yoki rasmiy vakillarga murojaat qiling.
        </p>
        <button
          onClick={onReset}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold hover:opacity-90 active:scale-98 transition-all shadow-lg shadow-red-500/10 cursor-pointer"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  const { product, certificates, dealer, batch, scanInfo, manufacturer, supplier, receiver } = result;

  // Format specs nicely — filter out any legacy _logistics key just in case
  const specs = Object.fromEntries(
    Object.entries(product?.specs || {}).filter(([k]) => k !== '_logistics')
  );

  const supplierInfo = supplier;
  const receiverInfo = receiver;
  const manufacturerInfo = manufacturer || 'Xenor-X';

  return (
    <div className="glass-card max-w-2xl mx-auto rounded-3xl p-6 md:p-8 border-emerald-500/20 animate-fade-in relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
      
      {/* Badge Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-white/10">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/5">
          <CheckCircle2 size={48} className="animate-bounce" />
        </div>
        <div className="text-center md:text-left flex-1 w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest mb-2 font-mono">
            Original XENOR X Mahsuloti
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight">
            {product?.name}
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-mono uppercase tracking-wider">
            Kategoriya: <span className="text-sky-400">{product?.category}</span>
            {manufacturerInfo && <> · Ishlab chiqaruvchi: <span className="text-emerald-400 font-bold">{manufacturerInfo}</span></>}
          </p>
          {(supplierInfo || receiverInfo || dealer) && (
            <div className="mt-4 flex flex-col gap-2.5 text-xs font-mono uppercase">
              {supplierInfo && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/25 shrink-0 font-bold">
                    Beruvchi:
                  </span>
                  <span className="text-slate-200 font-bold tracking-wide">{supplierInfo.name}</span>
                </div>
              )}
              {receiverInfo && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/25 shrink-0 font-bold">
                    Oluvchi:
                  </span>
                  <span className="text-slate-200 font-bold tracking-wide">{receiverInfo.name}</span>
                </div>
              )}
              {dealer && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/25 shrink-0 font-bold">
                    Diler / Tashkilot:
                  </span>
                  <span className="text-sky-400 font-bold tracking-wide">{dealer.name} ({dealer.region})</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mt-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('specs')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'specs'
              ? 'border-sky-400 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Cpu size={16} />
          Xususiyatlari
        </button>
        <button
          onClick={() => setActiveTab('logistic')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'logistic'
              ? 'border-sky-400 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MapPin size={16} />
          Logistika
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'batch'
              ? 'border-sky-400 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Calendar size={16} />
          Partiya va Sertifikatlar
        </button>
      </div>

      {/* Tab Content */}
      <div className="py-6 min-h-48">
        {activeTab === 'specs' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
              <Info size={14} className="text-sky-400" />
              Texnik Xarakteristikalar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(specs).filter(([key]) => key !== '_logistics').map(([key, value]) => (
                <div key={key} className="p-3 bg-white/5 border border-white/5 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    {key.replace('_', ' ')}
                  </div>
                  <div className="text-sm font-medium text-slate-200 mt-1">
                    {String(value)}
                  </div>
                </div>
              ))}
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl col-span-1 md:col-span-2">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  Kafolat muddati
                </div>
                <div className="text-sm font-bold text-sky-400 mt-1 flex items-center gap-1">
                  <ShieldCheck size={16} />
                  {product?.warranty} rasmiy kafolat
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logistic' && (
          <div className="space-y-5 animate-fade-in">
            {/* Ishlab chiqaruvchi */}
            {manufacturerInfo && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Ishlab chiqaruvchi
                </h3>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                  <div className="text-lg font-black text-emerald-400 tracking-wider">{manufacturerInfo}</div>
                </div>
              </div>
            )}

            {/* Yetkazib beruvchi */}
            {supplierInfo && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
                  <MapPin size={14} className="text-violet-400" />
                  Yetkazib beruvchi
                </h3>
                <div className="p-4 bg-violet-500/5 border border-violet-500/15 rounded-xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Nomi</span>
                    <span className="text-sm font-bold text-violet-400">{supplierInfo.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Tel raqam</span>
                    <span className="text-sm text-slate-200 font-mono">{supplierInfo.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">INN</span>
                    <span className="text-sm text-slate-200 font-mono font-bold">{supplierInfo.inn}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Qabul qiluvchi */}
            {receiverInfo && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
                  <MapPin size={14} className="text-amber-400" />
                  Qabul qiluvchi
                </h3>
                <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Nomi</span>
                    <span className="text-sm font-bold text-amber-400">{receiverInfo.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Tel raqam</span>
                    <span className="text-sm text-slate-200 font-mono">{receiverInfo.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">INN</span>
                    <span className="text-sm text-slate-200 font-mono font-bold">{receiverInfo.inn}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Diler */}
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
              <MapPin size={14} className="text-sky-400" />
              Diler ma'lumotlari
            </h3>
            {dealer ? (
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Rasmiy Diler</span>
                  <span className="text-sm font-bold text-sky-400">{dealer.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Hudud</span>
                  <span className="text-sm text-slate-200 font-semibold">{dealer.region}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Kontakt</span>
                  <span className="text-sm text-slate-200 font-mono">{dealer.contactInfo}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center text-slate-400 text-sm">
                Diler ma'lumotlari kiritilmagan.
              </div>
            )}
          </div>
        )}

        {activeTab === 'batch' && (
          <div className="space-y-6 animate-fade-in">
            {batch && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
                  <FileText size={14} className="text-sky-400" />
                  Ishlab chiqarish partiyasi
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Partiya Kodi</div>
                    <div className="text-sm font-bold text-slate-200 mt-1 font-mono">{batch.batchCode}</div>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Chiqarilgan Sana</div>
                    <div className="text-sm font-medium text-slate-200 mt-1">{new Date(batch.productionDate).toLocaleDateString('uz-UZ')}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Certifications and standard displays */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
                <ShieldCheck size={14} className="text-emerald-400" />
                Sertifikat va Sifat Standartlari
              </h3>
              <div className="flex gap-4">
                <div className="flex-1 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                  <div className="text-2xl font-black text-emerald-400 tracking-wider">ISO</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">9001:2015</div>
                  <div className="text-[9px] text-emerald-400/70 font-semibold uppercase tracking-widest mt-1">TASDIQLANGAN</div>
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/20 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-black text-blue-400 leading-none">CE</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-2">EUROPEAN CONFORMITY</div>
                  <div className="text-[9px] text-blue-400/70 font-semibold uppercase tracking-widest mt-1">MUVOFIOQLIK</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scan Statistics Footer */}
      {scanInfo && (
        <div className="mt-4 p-4 rounded-2xl bg-sky-950/20 border border-sky-500/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-sky-400" />
            <span>Skanerlashlar soni: <strong className="text-sky-400">{scanInfo.totalScans} ta</strong></span>
          </div>
          {scanInfo.lastScannedAt && (
            <div>
              Oxirgi skan: <span className="text-slate-300">{new Date(scanInfo.lastScannedAt).toLocaleString('uz-UZ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Action button */}
      <button
        onClick={onReset}
        className="w-full mt-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-98 transition-all font-semibold cursor-pointer text-center block"
      >
        Yangi shtrix-kod tekshirish
      </button>
    </div>
  );
}
