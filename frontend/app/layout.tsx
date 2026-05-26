import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'XENOR X L-Verify Pro | Mahsulot Tasdiqlash Tizimi',
  description: 'Abdulloh-tech zavodida ishlab chiqarilgan premium mahsulotlarning haqiqiyligini tekshirish tizimi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111827',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.08)',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
