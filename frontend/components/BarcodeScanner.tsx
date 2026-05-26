'use client';

import { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onError?: (err: any) => void;
}

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Check if element exists before starting
    const element = document.getElementById("reader");
    if (!element) return;

    const scanner = new Html5Qrcode("reader", {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13]
    });
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" }, // Rear camera
      { 
        fps: 15, 
        qrbox: (width, height) => {
          // Responsive QR scanning box size
          const size = Math.min(width, height) * 0.7;
          return { width: size * 1.5, height: size * 0.9 };
        }
      },
      (decodedText) => {
        onScan(decodedText);
      },
      (errorMessage) => {
        // Suppress noisy logs during frame-by-frame decoding
      }
    ).catch(err => {
      console.error("Skanerni ishga tushirishda xatolik:", err);
      if (onError) onError(err);
    });

    return () => {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop()
            .then(() => console.log("Scanner stopped successfully."))
            .catch(console.error);
        }
      }
    };
  }, [onScan, onError]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl p-2 md:p-4 max-w-lg mx-auto">
      <div id="reader" className="w-full rounded-xl overflow-hidden aspect-video md:aspect-[4/3] bg-black" />
      <div className="absolute top-4 left-4 px-2 py-1 text-[10px] uppercase font-mono tracking-widest bg-emerald-950/80 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
        Kamera Faol
      </div>
      <div className="mt-4 text-center text-xs text-slate-400 font-mono uppercase tracking-widest">
        Shtrix-kodni qizil chiziq doirasiga joylashtiring
      </div>
    </div>
  );
}
