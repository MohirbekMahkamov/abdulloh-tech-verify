'use client';

import React from 'react';
import { Barcode } from '../types';
import { getEAN13BinaryPattern } from '../lib/utils';

interface BarcodeSVGProps {
  code: string;
  width?: number;
  height?: number;
}

export const BarcodeSVG: React.FC<BarcodeSVGProps> = ({ code, width = 200, height = 65 }) => {
  const binary = getEAN13BinaryPattern(code);

  if (!binary || binary.length !== 95) {
    return (
      <div className="text-red-500 text-xs font-mono border border-dashed border-red-500 p-2 text-center rounded">
        EAN-13 Xatolik ({code || 'Yo\'q'})
      </div>
    );
  }

  // Barcode parameters
  const moduleWidth = 2; // 2px per module
  const barcodeWidth = 95 * moduleWidth; // 190px
  const quietZoneLeft = 10;
  const quietZoneRight = 10;
  const totalWidth = barcodeWidth + quietZoneLeft + quietZoneRight; // 210px
  const totalHeight = height;

  const rects: React.ReactNode[] = [];

  for (let i = 0; i < 95; i++) {
    if (binary[i] === '1') {
      const x = quietZoneLeft + i * moduleWidth;
      // Determine if guard line (long line) or digit line (short line)
      // Guard line indices:
      // Left guard: 0, 1, 2
      // Center guard: 45, 46, 47, 48, 49
      // Right guard: 92, 93, 94
      const isGuard = 
        i <= 2 || 
        (i >= 45 && i <= 49) || 
        i >= 92;
      
      const rectHeight = isGuard ? totalHeight - 15 : totalHeight - 23;
      rects.push(
        <rect
          key={i}
          x={x}
          y={0}
          width={moduleWidth}
          height={rectHeight}
          fill="black"
        />
      );
    }
  }

  // Split EAN-13 into visual parts
  const firstDigit = code[0];
  const leftGroup = code.substring(1, 7);
  const rightGroup = code.substring(7, 13);

  return (
    <svg 
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      width="100%" 
      height="100%"
      className="select-none"
    >
      {/* Background (ensures scanner readability) */}
      <rect width={totalWidth} height={totalHeight} fill="white" />
      
      {/* Barcode lines */}
      {rects}

      {/* Barcode digits */}
      <g 
        fill="black" 
        fontFamily="monospace, Courier, monospace" 
        fontWeight="bold" 
        fontSize="12px"
        textAnchor="middle"
      >
        {/* First digit (left outside) */}
        <text x={4} y={totalHeight - 4} textAnchor="start">
          {firstDigit}
        </text>

        {/* Left group */}
        <text x={quietZoneLeft + 3 * moduleWidth + 21} y={totalHeight - 4}>
          {leftGroup}
        </text>

        {/* Right group */}
        <text x={quietZoneLeft + 50 * moduleWidth + 21} y={totalHeight - 4}>
          {rightGroup}
        </text>
      </g>
    </svg>
  );
};

interface BarcodePrintLabelProps {
  barcode: Barcode;
  quantity?: number;
}

export const BarcodePrintLabel: React.FC<BarcodePrintLabelProps> = ({ barcode }) => {
  const { code, product, batch } = barcode;

  // Extract primary specifications
  let specsString = '';
  if (product && product.specs) {
    try {
      const parsed = JSON.parse(product.specs);
      // Take first 3 specs
      specsString = Object.entries(parsed)
        .slice(0, 3)
        .map(([k, v]) => `${v}`)
        .join(' / ');
    } catch (e) {
      specsString = product.specs;
    }
  }

  return (
    <div 
      className="barcode-label"
      style={{
        width: '58mm',
        height: '40mm',
        padding: '2mm 3mm',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        pageBreakAfter: 'always',
        breakAfter: 'page',
        overflow: 'hidden',
        border: '1px solid #e2e8f0' // Visible during preview, removed in print styles
      }}
    >
      {/* Brand & Batch row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span style={{ fontSize: '7.5pt', fontWeight: 900, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          XENOR ELECTRONICS
        </span>
        {batch && (
          <span style={{ fontSize: '5.5pt', fontFamily: 'monospace', fontWeight: 'bold', color: '#1e293b' }}>
            {batch.batchCode}
          </span>
        )}
      </div>

      {/* Product Name */}
      <div 
        style={{ 
          fontSize: '8pt', 
          fontWeight: 800, 
          lineHeight: '1.2', 
          maxHeight: '2.4em', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          margin: '1px 0'
        }}
      >
        {product ? product.name : 'Noma\'lum Mahsulot'}
      </div>

      {/* SVG Barcode Graphic */}
      <div style={{ height: '17mm', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <BarcodeSVG code={code} height={60} />
      </div>

      {/* Footer Specs & Warranty */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '1px',
          width: '100%',
          borderTop: '0.5px solid #000000',
          paddingTop: '2px'
        }}
      >
        {specsString && (
          <div 
            style={{ 
              fontSize: '5.5pt', 
              color: '#334155', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              fontWeight: 500
            }}
          >
            {specsString}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '5.5pt', fontWeight: 'bold' }}>
          <span>Kafolat: {product ? product.warrantyPeriod : 'Mavjud emas'}</span>
          <span>UZBEKISTAN</span>
        </div>
      </div>
    </div>
  );
};
