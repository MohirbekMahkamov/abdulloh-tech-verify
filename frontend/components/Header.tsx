'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard } from 'lucide-react';

export default function Header() {
  return (
    <header className="glass-card sticky top-0 z-50 w-full px-6 py-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center p-1">
            <Image 
              src="/logo.png" 
              alt="XENOR X Logo" 
              width={40} 
              height={40} 
              className="object-contain transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-wider text-slate-100 font-sans group-hover:text-sky-400 transition-colors">
              XENOR X
            </span>
            <span className="text-[10px] text-sky-400 tracking-widest font-mono">
              L-VERIFY PRO
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck size={16} />
            Tekshirish
          </Link>
          <Link 
            href="/admin/login" 
            className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
