'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../lib/api';
import { toast } from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    setLoading(true);
    try {
      const response = await adminApi.login(email, password);
      toast.success(`Xush kelibsiz, ${response.user.fullName}!`);
      router.push('/admin');
    } catch (e: any) {
      toast.error(e.message || 'Email yoki parol xato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Decorative radial glows */}
      <div className="radial-glow top-[-200px] left-[-200px]"></div>
      <div className="radial-glow bottom-[-200px] right-[-200px]"></div>

      <div className="w-full max-w-md relative z-10 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 justify-center group mb-4">
            <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center p-1">
              <Image 
                src="/logo.png" 
                alt="XENOR X Logo" 
                width={48} 
                height={48} 
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black tracking-wider text-slate-100 font-sans">
                XENOR X
              </span>
              <span className="text-[10px] text-sky-400 tracking-widest font-mono">
                L-VERIFY PRO
              </span>
            </div>
          </Link>
          <h2 className="text-xl font-bold">BOSHQARUV PANELIGA KIRISH</h2>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-mono">
            Tizim administratorlari uchun
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 border-white/10 space-y-4 shadow-2xl">
          {/* Email input */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-mono tracking-widest text-slate-400">
              Email Manzil
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@abdulloh.tech"
                className="w-full py-3.5 pl-10 pr-4 glass-input text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-mono tracking-widest text-slate-400">
              Maxfiy Parol
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3.5 pl-10 pr-10 glass-input text-sm focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider font-mono transition-all cursor-pointer ${
              loading
                ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-wait'
                : 'bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 shadow-lg shadow-sky-500/10 text-white'
            }`}
          >
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        {/* Suggest credentials helper */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-sky-950/30 border border-sky-500/10 text-[11px] text-sky-300 max-w-sm mx-auto">
          <ShieldAlert size={16} className="shrink-0 text-sky-400" />
          <div>
            Lokal testlash uchun:<br />
            Email: <strong className="text-white">admin@abdulloh.tech</strong><br />
            Parol: <strong className="text-white">Admin123!</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
