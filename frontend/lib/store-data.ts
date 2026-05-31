import { StoreProductItem, StoreCategory } from '../types';

export type { StoreProductItem as StoreProduct };

export const categories = [
  { id: 'all', label: "Barcha mahsulotlar", icon: '🏪' },
  { id: 'monoblok', label: 'Monobloklar', icon: '🖥️' },
  { id: 'panel', label: 'Interaktiv Panellar', icon: '📺' },
  { id: 'printer', label: 'Printerlar', icon: '🖨️' },
  { id: 'furniture', label: 'Ofis Mebellari', icon: '🪑' },
  { id: 'accessory', label: 'Aksessuarlar', icon: '⌨️' },
];

// Default store products used when localStorage is empty
export const defaultStoreProducts: StoreProductItem[] = [
  {
    id: 1,
    name: 'XENOR X Monoblok 27" 4K UHD',
    category: 'monoblok',
    categoryLabel: 'Monoblok',
    price: 8_500_000,
    oldPrice: 9_200_000,
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
    badge: 'TOP SOTILGAN',
    specs: {
      'Protsessor': 'Intel Core i7-13700',
      'RAM': '16GB DDR5',
      'Xotira': '1TB NVMe SSD',
      'Ekran': '27" 4K IPS UHD',
    },
    description: "XENOR X brendining eng so'nggi All-in-One monobloki. 4K UHD sifatli 27 dyuymli IPS ekran, kuchli Intel Core i7 protsessori va tezkor DDR5 xotirasi bilan ofis, ta'lim va dizayn ishlari uchun ideal yechim.",
    inStock: true,
    warranty: '1 yil',
    rating: 4.8,
    reviews: 47,
  },
  {
    id: 2,
    name: 'XENOR X Monoblok 24" FHD',
    category: 'monoblok',
    categoryLabel: 'Monoblok',
    price: 5_800_000,
    oldPrice: 6_500_000,
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80',
    specs: {
      'Protsessor': 'Intel Core i5-13400',
      'RAM': '8GB DDR4',
      'Xotira': '512GB NVMe SSD',
      'Ekran': '24" FHD IPS',
    },
    description: "XENOR X brendining byudjet segmentidagi eng samarali monobloki.",
    inStock: true,
    warranty: '1 yil',
    rating: 4.6,
    reviews: 32,
  },
  {
    id: 3,
    name: 'XENOR Pro Interaktiv Panel 86"',
    category: 'panel',
    categoryLabel: 'Interaktiv Panel',
    price: 45_000_000,
    oldPrice: 52_000_000,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    badge: 'PREMIUM',
    specs: {
      'Tizim': 'Android 12 / Windows 11',
      'Sensorli': '40 nuqtali Multi-touch',
      'Ekran': '86" 4K UHD LED',
      'RAM': '8GB',
    },
    description: "Ta'lim muassasalari va biznes konferentsiyalar uchun mo'ljallangan 86 dyuymli interaktiv sensorli panel.",
    inStock: true,
    warranty: '2 yil',
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 4,
    name: 'XENOR Pro Interaktiv Panel 65"',
    category: 'panel',
    categoryLabel: 'Interaktiv Panel',
    price: 28_000_000,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    specs: {
      'Tizim': 'Android 12',
      'Sensorli': '20 nuqtali Multi-touch',
      'Ekran': '65" 4K UHD LED',
      'RAM': '4GB',
    },
    description: "O'rta o'lchamdagi sinf xonalari va yig'ilish xonalari uchun ideal interaktiv panel.",
    inStock: true,
    warranty: '2 yil',
    rating: 4.7,
    reviews: 25,
  },
  {
    id: 5,
    name: 'XENOR FastPrint 400 Laser',
    category: 'printer',
    categoryLabel: 'Laser Printer',
    price: 3_200_000,
    oldPrice: 3_800_000,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
    badge: 'ENG TEZKOR',
    specs: {
      'Tezlik': '40 sahifa/daqiqa',
      'Sifat': '1200x1200dpi',
      'Ulanish': 'USB, Wi-Fi, Ethernet',
      'Duplex': 'Avto Duplex',
    },
    description: "Yuqori tezlikda chop etish uchun mo'ljallangan professional lazer printer.",
    inStock: true,
    warranty: '1 yil',
    rating: 4.5,
    reviews: 64,
  },
  {
    id: 6,
    name: 'XENOR EcoPrint 200 Laser',
    category: 'printer',
    categoryLabel: 'Laser Printer',
    price: 1_800_000,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    specs: {
      'Tezlik': '20 sahifa/daqiqa',
      'Sifat': '600x600dpi',
      'Ulanish': 'USB, Wi-Fi',
      'Duplex': "Qo'lda",
    },
    description: "Kichik ofislar va uy ishlari uchun tejamkor lazer printer.",
    inStock: true,
    warranty: '1 yil',
    rating: 4.3,
    reviews: 89,
  },
  {
    id: 7,
    name: 'Ergonomic Premium X Ofis Stoli',
    category: 'furniture',
    categoryLabel: 'Ofis Mebeli',
    price: 4_500_000,
    oldPrice: 5_200_000,
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=600&q=80',
    badge: 'YANGI',
    specs: {
      'Material': "Premium MDF, Po'lat oyoqlar",
      'Balandlik': 'Elektrik (70-120cm)',
      "Yuk sig'imi": '120kg',
      "O'lcham": '140x70cm',
    },
    description: "Elektrik balandlik sozlanadigan ergonomik ofis stoli.",
    inStock: true,
    warranty: '3 yil',
    rating: 4.7,
    reviews: 35,
  },
  {
    id: 8,
    name: 'XENOR Comfort Ofis Kreslo',
    category: 'furniture',
    categoryLabel: 'Ofis Mebeli',
    price: 2_800_000,
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=600&q=80',
    specs: {
      'Material': "Mesh to'qima, xrom baza",
      'Sozlash': "Boshsuyagi, qo'l dayamalari",
      "Yuk sig'imi": '150kg',
      'Ranglar': 'Qora, Kulrang',
    },
    description: "Uzoq vaqt o'tirib ishlash uchun maxsus ishlab chiqilgan ergonomik ofis kreslosi.",
    inStock: true,
    warranty: '2 yil',
    rating: 4.4,
    reviews: 52,
  },
  {
    id: 9,
    name: 'XENOR Wireless Keyboard + Mouse',
    category: 'accessory',
    categoryLabel: 'Aksessuar',
    price: 450_000,
    oldPrice: 580_000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    specs: {
      'Ulanish': 'Bluetooth 5.0 / 2.4GHz',
      'Batareya': '12 oy ishlash',
      'Tur': 'Slim Design',
      'Moslik': 'Windows / Mac / Linux',
    },
    description: "Simsiz klaviatura va sichqoncha to'plami. Slim dizayn va uzoq batareya muddati.",
    inStock: true,
    warranty: '6 oy',
    rating: 4.2,
    reviews: 110,
  },
  {
    id: 10,
    name: 'XENOR USB-C Hub 7-in-1',
    category: 'accessory',
    categoryLabel: 'Aksessuar',
    price: 320_000,
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80',
    specs: {
      'Portlar': 'HDMI, USB-A x3, SD, Type-C',
      'Tezlik': 'USB 3.0 (5Gbps)',
      'Chiqish': '4K@60Hz HDMI',
      'Material': 'Alyuminiy korpus',
    },
    description: "7 xil portni birlashtirgan universal USB-C hub.",
    inStock: false,
    warranty: '6 oy',
    rating: 4.6,
    reviews: 78,
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ---- Store Products Local Storage API ----
const STORE_KEY = 'xenor_store_products';

export function getStoreProducts(): StoreProductItem[] {
  if (typeof window === 'undefined') return defaultStoreProducts;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultStoreProducts;
}

export function saveStoreProducts(products: StoreProductItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_KEY, JSON.stringify(products));
}

export function addStoreProduct(product: Omit<StoreProductItem, 'id'>): StoreProductItem {
  const existing = getStoreProducts();
  const maxId = existing.length > 0 ? Math.max(...existing.map(p => p.id)) : 0;
  const newProduct: StoreProductItem = { ...product, id: maxId + 1 };
  existing.push(newProduct);
  saveStoreProducts(existing);
  return newProduct;
}

export function updateStoreProduct(id: number, updates: Partial<StoreProductItem>): StoreProductItem | null {
  const existing = getStoreProducts();
  const idx = existing.findIndex(p => p.id === id);
  if (idx === -1) return null;
  existing[idx] = { ...existing[idx], ...updates };
  saveStoreProducts(existing);
  return existing[idx];
}

export function deleteStoreProduct(id: number): boolean {
  const existing = getStoreProducts();
  const filtered = existing.filter(p => p.id !== id);
  if (filtered.length === existing.length) return false;
  saveStoreProducts(filtered);
  return true;
}
