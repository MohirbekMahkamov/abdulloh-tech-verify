'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Cpu, 
  Calendar, 
  MapPin, 
  ScanBarcode, 
  LogOut, 
  Menu, 
  X, 
  User,
  ShoppingBag 
} from 'lucide-react';
import { adminApi } from '../lib/api';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; fullName: string; role: string } | null>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('xenor_token');
    const userStr = localStorage.getItem('xenor_user');
    
    if (!token || !userStr) {
      router.push('/admin/login');
      return;
    }

    try {
      setAdminUser(JSON.parse(userStr));
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  const handleLogout = () => {
    adminApi.logout();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Mahsulotlar', href: '/admin/products', icon: Cpu },
    { name: 'Partiyalar', href: '/admin/batches', icon: Calendar },
    { name: 'Dilerlar', href: '/admin/dealers', icon: MapPin },
    { name: 'Shtrix-kodlar', href: '/admin/barcodes', icon: ScanBarcode },
    { name: "Do'kon", href: '/admin/store', icon: ShoppingBag },
  ];

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-mono tracking-widest text-slate-400">YUKLANMOQDA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-sky-500 rounded-full text-white shadow-lg cursor-pointer"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111827]/80 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Logo */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="relative w-8 h-8 overflow-hidden rounded bg-slate-900 border border-white/10 flex items-center justify-center p-1">
              <Image 
                src="/logo.png" 
                alt="XENOR X Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-md font-bold tracking-wider text-slate-100 font-sans">
                XENOR X
              </span>
              <span className="text-[9px] text-sky-400 tracking-widest font-mono">
                L-VERIFY PRO
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-sky-500/10 text-sky-400 border-l-4 border-sky-400 shadow-md shadow-sky-500/5' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Identity & Logout */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-9 h-9 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <User size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-200 truncate">{adminUser.fullName}</span>
              <span className="text-[9px] text-slate-400 font-mono truncate">{adminUser.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        {/* Content Wrapper */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
