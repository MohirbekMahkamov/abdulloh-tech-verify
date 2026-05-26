'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminApi } from '../../lib/api';
import { DashboardStats } from '../../types';
import { toast } from 'react-hot-toast';
import { 
  Cpu, 
  Calendar, 
  MapPin, 
  ScanBarcode, 
  Activity, 
  Clock, 
  Laptop, 
  Smartphone 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await adminApi.getStats();
        setStats(response);
      } catch (e: any) {
        toast.error('Statistikalarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Statistikalar yuklanmoqda...</span>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { title: 'Mahsulot turlari', value: stats?.totalProducts || 0, icon: Cpu, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { title: 'Partiyalar soni', value: stats?.totalBatches || 0, icon: Calendar, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    { title: 'Faol Dilerlar', value: stats?.totalDealers || 0, icon: MapPin, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Jami Shtrix-kodlar', value: stats?.totalBarcodes || 0, icon: ScanBarcode, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { title: 'Jami Skanerlashlar', value: stats?.totalScans || 0, icon: Activity, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">DASHBOARD</h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mt-1">
            XENOR X mahsulot nazorati xulosasi
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx} 
                className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between min-h-32 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">{card.title}</span>
                  <div className={`p-2 rounded-lg border ${card.color}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="text-3xl font-black tracking-tight text-white mt-4">
                  {card.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section: Recent Scans */}
        <div className="glass-card rounded-3xl p-6 border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-white/5">
            <Clock className="text-sky-400" size={20} />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-sans">
              So'nggi Skanerlash Faoliyati
            </h2>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                  <th className="pb-3 font-semibold">Shtrix-kod</th>
                  <th className="pb-3 font-semibold">Mahsulot nomi</th>
                  <th className="pb-3 font-semibold">Sana / Vaqt</th>
                  <th className="pb-3 font-semibold">IP Manzil</th>
                  <th className="pb-3 font-semibold">Qurilma / User-Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats && stats.recentScans.length > 0 ? (
                  stats.recentScans.map((scan, idx) => {
                    const isMobile = scan.userAgent.toLowerCase().includes('mobile') || scan.userAgent.toLowerCase().includes('android') || scan.userAgent.toLowerCase().includes('iphone');
                    return (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 font-mono text-sky-400 font-bold">{scan.barcode}</td>
                        <td className="py-3.5 font-medium text-white">{scan.productName}</td>
                        <td className="py-3.5 text-xs font-mono text-slate-400">
                          {new Date(scan.scannedAt).toLocaleString('uz-UZ')}
                        </td>
                        <td className="py-3.5 font-mono text-slate-400 text-xs">{scan.ipAddress}</td>
                        <td className="py-3.5 text-xs text-slate-400 flex items-center gap-1.5 pt-4">
                          {isMobile ? <Smartphone size={14} className="text-emerald-400" /> : <Laptop size={14} className="text-sky-400" />}
                          <span className="truncate max-w-[200px]" title={scan.userAgent}>{scan.userAgent}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                      Hozircha hech qanday skanerlash amalga oshirilmagan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
