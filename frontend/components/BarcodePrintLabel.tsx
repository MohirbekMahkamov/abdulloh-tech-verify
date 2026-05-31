'use client';

import React from 'react';
import { Barcode } from '../types';
import { getEAN13BinaryPattern } from '../lib/utils';

interface BarcodeSVGProps {
  code: string;
  height?: number;
}

export const BarcodeSVG: React.FC<BarcodeSVGProps> = ({ code, height = 40 }) => {
  const binary = getEAN13BinaryPattern(code);
  if (!binary || binary.length !== 95) {
    return <div style={{ color: 'red', fontSize: '6px' }}>EAN-13 Xatolik</div>;
  }
  const mw = 1.5;
  const qL = 4; const qR = 4;
  const totalW = 95 * mw + qL + qR;
  const rects: React.ReactNode[] = [];
  for (let i = 0; i < 95; i++) {
    if (binary[i] === '1') {
      const x = qL + i * mw;
      const isGuard = i <= 2 || (i >= 45 && i <= 49) || i >= 92;
      rects.push(<rect key={i} x={x} y={0} width={mw} height={isGuard ? height - 6 : height - 12} fill="black" />);
    }
  }
  const d1 = code[0]; const lg = code.substring(1,7); const rg = code.substring(7,13);
  return (
    <svg viewBox={`0 0 ${totalW} ${height}`} width="100%" height="100%" style={{ display: 'block' }}>
      <rect width={totalW} height={height} fill="white" />
      {rects}
      <g fill="black" fontFamily="monospace" fontWeight="bold" fontSize="6.5px" textAnchor="middle">
        <text x={2} y={height - 1} textAnchor="start">{d1}</text>
        <text x={qL + 3*mw + 15} y={height - 1}>{lg}</text>
        <text x={qL + 50*mw + 15} y={height - 1}>{rg}</text>
      </g>
    </svg>
  );
};

interface BarcodePrintLabelProps { barcode: Barcode; }

/**
 * BarcodePrintLabel - XPrinter XP-80 termal printer uchun optimallashtirilgan
 * Qog'oz o'lchami: 60mm x 40mm (gorizontal stiker)
 * Brand: Xenor-X
 * Shriftlar: barcha yozuvlar /1.4, manzil /1.7
 */
export const BarcodePrintLabel: React.FC<BarcodePrintLabelProps> = ({ barcode }) => {
  const { code, product, batch } = barcode;
  let rawSpecs: Record<string, string> = {};
  try { rawSpecs = JSON.parse(product?.specs ?? '{}'); } catch {}

  // Filter out store metadata keys AND any non-primitive values (prevents [object Object])
  const metaKeys = ['price','narx','qiymat','oldprice','eski narx','eski_narx','image','rasm','img','description','tavsif','badge','nishon','instock','omborda','mavjud','rating','baholash','baho','reviews','sharhlar','_logistics','logistics'];
  const specs: Record<string, string> = {};
  Object.entries(rawSpecs).forEach(([k, v]) => {
    // Skip metadata keys and any key whose value is an object (would render as [object Object])
    if (metaKeys.includes(k.toLowerCase())) return;
    if (typeof v === 'object' && v !== null) return;
    specs[k] = String(v);
  });

  const verifyUrl = `https://xenorx.uz/verify?code=${code}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verifyUrl)}&margin=1&format=svg`;

  const specMap: Record<string, string> = {
    processor: 'CPU', ram: 'RAM', storage: 'Xotira', screen: 'Ekran',
    os: 'OS', touch: 'Touch', speed: 'Tezlik', resolution: 'Sifat',
    interfaces: 'Port', duplex: 'Duplex', material: 'Material',
    adjustments: 'Sozlash', load_capacity: 'Yuk',
    protsessor: 'CPU', 'operativ xotira (ram)': 'RAM', 'operativ xotira': 'RAM',
    'doimiy xotira': 'HDD/SSD', 'xotira': 'Xotira', 'ekran': 'Ekran',
    'tezlik': 'Tezlik', 'sifat': 'Sifat', 'interfeyslar': 'Port',
    model: 'Model', rang: 'Rang', vazn: 'Vazn', batareya: 'Batareya',
  };

  const cleanKey = (k: string) => {
    const lowerK = k.toLowerCase().trim();
    if (specMap[lowerK]) return specMap[lowerK];
    return k.charAt(0).toUpperCase() + k.slice(1);
  };

  const specEntries = Object.entries(specs);
  
  // Filter out brand and model from the distinct list
  const filteredSpecs = specEntries.filter(([k]) => {
    const keyLower = k.toLowerCase().trim();
    return keyLower !== 'brand' && keyLower !== 'marka';
  });

  // Display the first 4 technical specs as distinct items
  const distinctSpecs = filteredSpecs.slice(0, 4);
  
  // Display subsequent specs as description text if any
  const descSpecs = filteredSpecs.slice(4).map(([k, v]) => `${cleanKey(k)}: ${v}`).join(' ');

  return (
    <div className="barcode-label" style={{
      width: '60mm', height: '40mm', padding: '1.2mm 1.8mm', boxSizing: 'border-box',
      backgroundColor: '#fff', color: '#000', fontFamily: '"Segoe UI", Arial, sans-serif',
      pageBreakAfter: 'always', breakAfter: 'page', overflow: 'hidden',
      border: '0.3px dashed #ccc', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', fontSize: '7.4pt', lineHeight: 1.15,
      position: 'relative'
    }}>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* Row 1: Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '0.6px solid black', paddingBottom: '0.4mm' }}>
          <span style={{ fontSize: '10.3pt', fontWeight: 800, letterSpacing: '-0.2mm' }}>
            {product?.name ? product.name.split(' ')[0] : 'Mahsulot'}
          </span>
          <span style={{ fontSize: '8.6pt', fontWeight: 700, fontFamily: 'monospace' }}>
            {code ? code.substring(code.length - 7) : '0000000'}
          </span>
        </div>

        {/* Row 2: Specs & QR Code */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '0.6mm', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6mm', maxWidth: '72%' }}>
            <div style={{ fontSize: '5.9pt', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <strong>Marka:</strong> Xenor-X
            </div>
            {distinctSpecs.map(([k, v]) => (
              <div key={k} style={{ fontSize: '5.9pt', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <strong>{cleanKey(k)}:</strong> {String(v)}
              </div>
            ))}
            {descSpecs && (
              <div style={{ fontSize: '5.6pt', fontWeight: 500, marginTop: '0.2mm', lineHeight: 1.1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {descSpecs}
              </div>
            )}
          </div>
          <div style={{ width: '13mm', height: '13mm', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2mm', background: 'white' }}>
            <img src={qrSrc} alt="QR" style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>
        </div>

        {/* Row 3: Manufacturer & Barcode */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', height: '13mm', marginTop: '0.8mm' }}>
          <div style={{ maxWidth: '58%', fontSize: '4.5pt', lineHeight: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.2mm' }}>
            <span style={{ fontWeight: 800, fontSize: '4.9pt' }}>XENOR-X</span>
            <span>Namangan viloyati, Namangan shahri, Sohil MFY, Shimoliy aylanma yo&apos;li ko&apos;chasi, 1-uy</span>
            <span>Tel: 50 0075500</span>
          </div>
          <div style={{ width: '38%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', background: 'white', height: '100%' }}>
            <div style={{ width: '100%', height: '10mm' }}>
              <BarcodeSVG code={code} height={36} />
            </div>
            <div style={{ fontSize: '5.1pt', fontFamily: 'monospace', fontWeight: 700, textAlign: 'center', letterSpacing: '0.15mm', marginTop: '-0.2mm' }}>
              {code}
            </div>
          </div>
        </div>

        {/* Row 4: "O'zbekistonda ishlab chiqarilgan" */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', borderTop: '0.4px solid black', paddingTop: '0.4mm', marginTop: '0.6mm' }}>
          <div style={{ fontSize: '4.3pt', fontWeight: 500, color: '#333' }}>O&apos;zbekistonda ishlab chiqarilgan</div>
        </div>

      </div>
    </div>
  );
};
