export type Category = 'ELECTRONICS' | 'PRINTER' | 'FURNITURE' | 'TEXTILE';

export interface Product {
  id: number;
  name: string;
  category: Category;
  specs: string; // JSON string
  warrantyPeriod: string;
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
