import axios from 'axios';
import { 
  VerificationResponse, 
  LoginResponse, 
  DashboardStats, 
  Product, 
  Batch, 
  Dealer, 
  Barcode 
} from '../types';
import { generateEAN13 } from './utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://abdulloh-tech-production.up.railway.app/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('xenor_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Mock Database for Fallback Mode ---
const mockProducts: Product[] = [
  { id: 1, name: 'Monoblok XENOR X 27" 4K', category: 'ELECTRONICS', specs: '{"processor": "Intel Core i7 13700", "ram": "16GB DDR5", "storage": "1TB NVMe SSD", "screen": "27-inch 4K IPS UHD"}', warrantyPeriod: '1 yil', manufacturer: 'Xenor-X', supplier: { name: 'XENOR-X MCHJ', phone: '+998500075500', inn: '123456789' }, receiver: { name: 'Namangan filiali', phone: '+998901234567', inn: '987654321' } },
  { id: 2, name: 'Interaktiv Panel XENOR Pro 86"', category: 'ELECTRONICS', specs: '{"os": "Android 12 / Windows 11", "touch": "40 points Multi-touch", "screen": "86-inch 4K UHD LED", "ram": "8GB", "storage": "128GB"}', warrantyPeriod: '2 yil', manufacturer: 'Xenor-X', supplier: { name: 'XENOR-X MCHJ', phone: '+998500075500', inn: '123456789' }, receiver: { name: 'Toshkent filiali', phone: '+998901234500', inn: '111222333' } },
  { id: 3, name: 'Laser Printer XENOR FastPrint 400', category: 'PRINTER', specs: '{"speed": "40 ppm", "resolution": "1200x1200dpi", "interfaces": "USB, Wi-Fi, Ethernet", "duplex": "Auto Duplex"}', warrantyPeriod: '1 yil', manufacturer: 'Xenor-X', supplier: { name: 'XENOR-X MCHJ', phone: '+998500075500', inn: '123456789' }, receiver: { name: 'Andijon filiali', phone: '+998901234503', inn: '444555666' } },
  { id: 4, name: 'Ofis stoli Ergonomic Premium X', category: 'FURNITURE', specs: '{"material": "Premium MDF, Steel legs", "adjustments": "Electric Height Adjustable (70-120cm)", "load_capacity": "120kg"}', warrantyPeriod: '3 yil', manufacturer: 'Xenor-X', supplier: { name: 'XENOR-X MCHJ', phone: '+998500075500', inn: '123456789' }, receiver: { name: 'Farg\'ona filiali', phone: '+998901234504', inn: '777888999' } },
];

const mockDealers: Dealer[] = [
  { id: 1, name: 'Toshkent Central Hub', region: 'Toshkent', contactInfo: '+998901234501', isActive: true },
  { id: 2, name: 'Namangan Central Hub', region: 'Namangan', contactInfo: '+998901234502', isActive: true },
  { id: 3, name: 'Andijon Tech Store', region: 'Andijon', contactInfo: '+998901234503', isActive: true },
  { id: 4, name: 'Farg\'ona Digital', region: 'Farg\'ona', contactInfo: '+998901234504', isActive: true },
  { id: 5, name: 'Buxoro Electronics', region: 'Buxoro', contactInfo: '+998901234505', isActive: true },
];

const mockBatches: Batch[] = [
  { id: 1, batchCode: 'BATCH-2026-X1', product: mockProducts[0], productionDate: '2026-01-15', totalCount: 100, isoStandardStatus: true },
  { id: 2, batchCode: 'BATCH-2026-X2', product: mockProducts[1], productionDate: '2026-02-10', totalCount: 50, isoStandardStatus: true },
  { id: 3, batchCode: 'BATCH-2026-X3', product: mockProducts[2], productionDate: '2026-03-01', totalCount: 200, isoStandardStatus: true },
];

const mockBarcodes: Barcode[] = [
  { id: 1, code: '4780001234562', product: mockProducts[0], batch: mockBatches[0], dealer: mockDealers[0], isActive: true, scanCount: 3, lastScannedAt: '2026-05-24T21:40:00' },
  { id: 2, code: '4780001234579', product: mockProducts[0], batch: mockBatches[0], dealer: mockDealers[1], isActive: true, scanCount: 1, lastScannedAt: '2026-05-24T21:42:00' },
  { id: 3, code: '4780001234586', product: mockProducts[0], batch: mockBatches[0], dealer: mockDealers[2], isActive: true, scanCount: 0 },
  { id: 4, code: '4780001234593', product: mockProducts[1], batch: mockBatches[1], dealer: mockDealers[0], isActive: true, scanCount: 12, lastScannedAt: '2026-05-24T21:05:00' },
  { id: 5, code: '4780001234609', product: mockProducts[1], batch: mockBatches[1], dealer: mockDealers[3], isActive: true, scanCount: 5, lastScannedAt: '2026-05-24T20:50:00' },
  { id: 6, code: '4780001234616', product: mockProducts[2], batch: mockBatches[2], dealer: mockDealers[4], isActive: true, scanCount: 0 },
  { id: 7, code: '4780001234647', product: mockProducts[3], batch: undefined, dealer: mockDealers[0], isActive: true, scanCount: 2, lastScannedAt: '2026-05-24T18:22:00' },
];

// In-memory logs for mock mode
const mockScanLogs: Array<{
  barcode: string;
  productName: string;
  scannedAt: string;
  ipAddress: string;
  userAgent: string;
}> = [
  { barcode: '4780001234593', productName: 'Interaktiv Panel XENOR Pro 86"', scannedAt: '2026-05-24T21:05:00', ipAddress: '192.168.1.55', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)' },
  { barcode: '4780001234579', productName: 'Monoblok XENOR X 27" 4K', scannedAt: '2026-05-24T21:42:00', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 (Linux; Android 10; K)' },
  { barcode: '4780001234562', productName: 'Monoblok XENOR X 27" 4K', scannedAt: '2026-05-24T21:40:00', ipAddress: '84.54.78.22', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
];

// Helper to determine if we should fallback to mock
const isMockRequired = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return false;
  }
  try {
    // Quick ping to check if server is active (using verify status or similar endpoint)
    await axios.get(`${API_BASE_URL}/verify/health-ping`, { timeout: 1000 }).catch(err => {
      if (err.code === 'ECONNREFUSED' || err.message.includes('timeout') || err.message.includes('Network Error')) {
        throw new Error('Offline');
      }
    });
    return false;
  } catch (e) {
    return true; // Unreachable backend -> Use mock fallback
  }
};

// --- API Implementation with Mock Fallback ---

export const barcodeApi = {
  verify: async (code: string): Promise<VerificationResponse> => {
    const useMock = await isMockRequired();
    if (useMock) {
      console.log('[API] Using mock fallback for verification of code:', code);
      const barcode = mockBarcodes.find(b => b.code === code);
      if (!barcode || !barcode.isActive) {
        return { status: 'INVALID' };
      }
      
      // Increment stats locally in mock
      barcode.scanCount++;
      barcode.lastScannedAt = new Date().toISOString();
      mockScanLogs.unshift({
        barcode: barcode.code,
        productName: barcode.product.name,
        scannedAt: barcode.lastScannedAt,
        ipAddress: '127.0.0.1',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Browser',
      });

      return {
        status: 'ORIGINAL',
        product: {
          name: barcode.product.name,
          category: barcode.product.category,
          warranty: barcode.product.warrantyPeriod,
          specs: JSON.parse(barcode.product.specs),
        },
        manufacturer: barcode.product.manufacturer || 'Xenor-X',
        supplier: barcode.product.supplier,
        receiver: barcode.product.receiver,
        certificates: ['ISO 9001:2015', 'CE'],
        dealer: barcode.dealer ? {
          name: barcode.dealer.name,
          region: barcode.dealer.region,
          contactInfo: barcode.dealer.contactInfo,
        } : undefined,
        batch: barcode.batch ? {
          batchCode: barcode.batch.batchCode,
          productionDate: barcode.batch.productionDate,
          totalCount: barcode.batch.totalCount,
          isoStandardStatus: barcode.batch.isoStandardStatus,
        } : undefined,
        scanInfo: {
          totalScans: barcode.scanCount,
          lastScannedAt: barcode.lastScannedAt,
          firstScannedAt: '2026-04-10T09:00:00',
        }
      };
    }

    const res = await api.post<VerificationResponse>('/verify', { code });
    return res.data;
  },

  verifyByGet: async (code: string): Promise<VerificationResponse> => {
    const useMock = await isMockRequired();
    if (useMock) {
      return barcodeApi.verify(code);
    }
    const res = await api.get<VerificationResponse>(`/verify/${code}`);
    return res.data;
  },

  getPublicProducts: async (): Promise<Product[]> => {
    const useMock = await isMockRequired();
    if (useMock) {
      return mockProducts;
    }
    const res = await api.get<Product[]>('/verify/products');
    return res.data;
  },
};

export const adminApi = {
  login: async (email: string, password: String): Promise<LoginResponse> => {
    const useMock = await isMockRequired();
    if (useMock) {
      if (email === 'admin@abdulloh.tech' && password === 'Admin123!') {
        const token = 'mock_jwt_token_xenor_x_verify_pro_2026';
        if (typeof window !== 'undefined') {
          localStorage.setItem('xenor_token', token);
          localStorage.setItem('xenor_user', JSON.stringify({ email, fullName: 'Abdulloh Admin', role: 'ROLE_ADMIN' }));
        }
        return {
          token,
          user: { email, fullName: 'Abdulloh Admin', role: 'ROLE_ADMIN' },
        };
      }
      throw new Error("Noto'g'ri email yoki parol");
    }

    const res = await api.post<LoginResponse>('/admin/auth/login', { email, password });
    if (typeof window !== 'undefined') {
      localStorage.setItem('xenor_token', res.data.token);
      localStorage.setItem('xenor_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('xenor_token');
      localStorage.removeItem('xenor_user');
    }
  },

  getStats: async (): Promise<DashboardStats> => {
    const useMock = await isMockRequired();
    if (useMock) {
      return {
        totalProducts: mockProducts.length,
        totalBatches: mockBatches.length,
        totalDealers: mockDealers.length,
        totalBarcodes: mockBarcodes.length,
        totalScans: mockBarcodes.reduce((acc, curr) => acc + curr.scanCount, 0),
        recentScans: mockScanLogs.slice(0, 10),
      };
    }

    const res = await api.get<DashboardStats>('/admin/dashboard/stats');
    return res.data;
  },

  // --- CRUD Products ---
  getProducts: async (): Promise<Product[]> => {
    const useMock = await isMockRequired();
    if (useMock) return mockProducts;
    const res = await api.get<Product[]>('/admin/products');
    return res.data;
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const newId = mockProducts.length > 0 ? Math.max(...mockProducts.map(p => p.id)) + 1 : 1;
      const newProduct = { ...product, id: newId };
      mockProducts.push(newProduct);

      // Auto-generate one barcode for the new product
      let code = generateEAN13();
      while (mockBarcodes.some(b => b.code === code)) {
        code = generateEAN13();
      }
      mockBarcodes.push({
        id: mockBarcodes.length > 0 ? Math.max(...mockBarcodes.map(b => b.id)) + 1 : 1,
        code,
        product: newProduct,
        batch: undefined,
        dealer: undefined,
        isActive: true,
        scanCount: 0,
      });

      return newProduct;
    }
    const res = await api.post<Product>('/admin/products', product);
    return res.data;
  },

  updateProduct: async (id: number, product: Omit<Product, 'id'>): Promise<Product> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const idx = mockProducts.findIndex(p => p.id === id);
      if (idx !== -1) {
        mockProducts[idx] = { ...product, id };
        return mockProducts[idx];
      }
      throw new Error('Product not found');
    }
    const res = await api.put<Product>(`/admin/products/${id}`, product);
    return res.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const idx = mockProducts.findIndex(p => p.id === id);
      if (idx !== -1) mockProducts.splice(idx, 1);
      return;
    }
    await api.delete(`/admin/products/${id}`);
  },

  // --- CRUD Batches ---
  getBatches: async (): Promise<Batch[]> => {
    const useMock = await isMockRequired();
    if (useMock) return mockBatches;
    const res = await api.get<Batch[]>('/admin/batches');
    return res.data;
  },

  createBatch: async (batch: any): Promise<Batch> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const product = mockProducts.find(p => p.id === Number(batch.productId)) || mockProducts[0];
      const newBatch: Batch = {
        id: mockBatches.length + 1,
        batchCode: batch.batchCode,
        product,
        productionDate: batch.productionDate,
        totalCount: batch.totalCount,
        isoStandardStatus: batch.isoStandardStatus,
      };
      mockBatches.push(newBatch);
      return newBatch;
    }
    const res = await api.post<Batch>('/admin/batches', batch);
    return res.data;
  },

  updateBatch: async (id: number, batch: any): Promise<Batch> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const idx = mockBatches.findIndex(b => b.id === id);
      if (idx !== -1) {
        const product = mockProducts.find(p => p.id === Number(batch.productId)) || mockProducts[0];
        mockBatches[idx] = {
          id,
          batchCode: batch.batchCode,
          product,
          productionDate: batch.productionDate,
          totalCount: batch.totalCount,
          isoStandardStatus: batch.isoStandardStatus,
        };
        return mockBatches[idx];
      }
      throw new Error('Batch not found');
    }
    const res = await api.put<Batch>(`/admin/batches/${id}`, batch);
    return res.data;
  },

  deleteBatch: async (id: number): Promise<void> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const idx = mockBatches.findIndex(b => b.id === id);
      if (idx !== -1) mockBatches.splice(idx, 1);
      return;
    }
    await api.delete(`/admin/batches/${id}`);
  },

  // --- CRUD Dealers ---
  getDealers: async (): Promise<Dealer[]> => {
    const useMock = await isMockRequired();
    if (useMock) return mockDealers;
    const res = await api.get<Dealer[]>('/admin/dealers');
    return res.data;
  },

  createDealer: async (dealer: Omit<Dealer, 'id'>): Promise<Dealer> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const newDealer = { ...dealer, id: mockDealers.length + 1 };
      mockDealers.push(newDealer);
      return newDealer;
    }
    const res = await api.post<Dealer>('/admin/dealers', dealer);
    return res.data;
  },

  updateDealer: async (id: number, dealer: Omit<Dealer, 'id'>): Promise<Dealer> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const idx = mockDealers.findIndex(d => d.id === id);
      if (idx !== -1) {
        mockDealers[idx] = { ...dealer, id };
        return mockDealers[idx];
      }
      throw new Error('Dealer not found');
    }
    const res = await api.put<Dealer>(`/admin/dealers/${id}`, dealer);
    return res.data;
  },

  deleteDealer: async (id: number): Promise<void> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const idx = mockDealers.findIndex(d => d.id === id);
      if (idx !== -1) mockDealers.splice(idx, 1);
      return;
    }
    await api.delete(`/admin/dealers/${id}`);
  },

  // --- Barcodes ---
  getBarcodes: async (): Promise<Barcode[]> => {
    const useMock = await isMockRequired();
    if (useMock) return mockBarcodes;
    const res = await api.get<Barcode[]>('/admin/barcodes');
    return res.data;
  },

  // Generate a single barcode for a product
  generateBarcode: async (productId: number, batchId?: number, dealerId?: number): Promise<Barcode> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const product = mockProducts.find(p => p.id === productId);
      if (!product) throw new Error('Mahsulot topilmadi');

      const batch = batchId ? mockBatches.find(b => b.id === batchId) : undefined;
      const dealer = dealerId ? mockDealers.find(d => d.id === dealerId) : undefined;

      let code = generateEAN13();
      let attempts = 0;
      while (mockBarcodes.some(b => b.code === code) && attempts < 100) {
        code = generateEAN13();
        attempts++;
      }

      const newBarcode: Barcode = {
        id: mockBarcodes.length > 0 ? Math.max(...mockBarcodes.map(b => b.id)) + 1 : 1,
        code,
        product,
        batch,
        dealer,
        isActive: true,
        scanCount: 0,
      };
      mockBarcodes.push(newBarcode);
      return newBarcode;
    }

    const res = await api.post<Barcode>('/admin/barcodes/generate', { productId, batchId, dealerId });
    return res.data;
  },

  // Generate multiple barcodes for a product
  generateBarcodes: async (productId: number, count: number, batchId?: number, dealerId?: number): Promise<Barcode[]> => {
    const useMock = await isMockRequired();
    if (useMock) {
      const product = mockProducts.find(p => p.id === productId);
      if (!product) throw new Error('Mahsulot topilmadi');

      const batch = batchId ? mockBatches.find(b => b.id === batchId) : undefined;
      const dealer = dealerId ? mockDealers.find(d => d.id === dealerId) : undefined;

      const generated: Barcode[] = [];
      for (let i = 0; i < count; i++) {
        let code = generateEAN13();
        let attempts = 0;
        while ((mockBarcodes.some(b => b.code === code) || generated.some(b => b.code === code)) && attempts < 100) {
          code = generateEAN13();
          attempts++;
        }

        const newBarcode: Barcode = {
          id: (mockBarcodes.length > 0 ? Math.max(...mockBarcodes.map(b => b.id)) : 0) + generated.length + 1,
          code,
          product,
          batch,
          dealer,
          isActive: true,
          scanCount: 0,
        };
        generated.push(newBarcode);
      }

      mockBarcodes.push(...generated);
      return generated;
    }

    const res = await api.post<Barcode[]>('/admin/barcodes/generate-batch', { productId, count, batchId, dealerId });
    return res.data;
  },

  uploadBarcodes: async (file: File): Promise<any> => {
    const useMock = await isMockRequired();
    if (useMock) {
      // Simulate parsing of 5 mock barcodes from a file upload
      const count = Math.floor(Math.random() * 10) + 10;
      const startNum = 4780001235000;
      let added = 0;
      
      for (let i = 0; i < count; i++) {
        // Calculate correct EAN-13 checksum
        const numStr = (startNum + i).toString();
        let sum = 0;
        for (let j = 0; j < 12; j++) {
          const digit = parseInt(numStr[j], 10);
          sum += j % 2 === 0 ? digit : digit * 3;
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        const code = numStr + checkDigit;

        if (!mockBarcodes.some(b => b.code === code)) {
          mockBarcodes.push({
            id: mockBarcodes.length + 1,
            code,
            product: mockProducts[0],
            batch: mockBatches[0],
            dealer: mockDealers[0],
            isActive: true,
            scanCount: 0,
          });
          added++;
        }
      }

      return {
        successCount: added,
        duplicateCount: count - added,
        errors: [],
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/admin/barcodes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
