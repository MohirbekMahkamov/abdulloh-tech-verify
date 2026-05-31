export type Category = 'ELECTRONICS' | 'PRINTER' | 'FURNITURE' | 'TEXTILE';

export interface SupplierInfo {
  name: string;
  phone: string;
  inn: string;
}

export interface ReceiverInfo {
  name: string;
  phone: string;
  inn: string;
}

export interface Product {
  id: number;
  name: string;
  category: Category;
  specs: string; // JSON string
  warrantyPeriod: string;
  manufacturer?: string; // Always 'Xenor-X'
  supplier?: SupplierInfo;
  receiver?: ReceiverInfo;
  createdAt?: string;
  updatedAt?: string;
}

export interface Batch {
  id: number;
  batchCode: string;
  product: Product;
  productionDate: string;
  totalCount: number;
  isoStandardStatus: boolean;
  createdAt?: string;
}

export interface Dealer {
  id: number;
  name: string;
  region: string;
  contactInfo: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Barcode {
  id: number;
  code: string;
  product: Product;
  batch?: Batch;
  dealer?: Dealer;
  isActive: boolean;
  scanCount: number;
  lastScannedAt?: string;
  createdAt?: string;
}

export interface ScanLog {
  id: number;
  barcode: Barcode;
  scannedAt: string;
  ipAddress: string;
  userAgent: string;
}

export interface VerificationResponse {
  status: 'ORIGINAL' | 'INVALID';
  product?: {
    name: string;
    category: string;
    warranty: string;
    specs: Record<string, any>;
  };
  manufacturer?: string;
  supplier?: SupplierInfo;
  receiver?: ReceiverInfo;
  certificates?: string[];
  dealer?: {
    name: string;
    region: string;
    contactInfo: string;
  };
  batch?: {
    batchCode: string;
    productionDate: string;
    totalCount: number;
    isoStandardStatus: boolean;
  };
  scanInfo?: {
    totalScans: number;
    lastScannedAt: string | null;
    firstScannedAt: string;
  };
}

export interface AdminUser {
  email: string;
  fullName: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface DashboardStats {
  totalProducts: number;
  totalBatches: number;
  totalDealers: number;
  totalBarcodes: number;
  totalScans: number;
  recentScans: Array<{
    barcode: string;
    productName: string;
    scannedAt: string;
    ipAddress: string;
    userAgent: string;
  }>;
}

// ===== Store Product (Do'kon uchun alohida) =====
export type StoreCategory = 'monoblok' | 'panel' | 'printer' | 'furniture' | 'accessory';

export interface StoreProductItem {
  id: number;
  name: string;
  category: StoreCategory;
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  specs: Record<string, string>;
  description: string;
  inStock: boolean;
  warranty: string;
  rating: number;
  reviews: number;
}
