
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Response {
  msg: string;
  error: string;
  data: any;
}

export interface DynamicResponse<T = any> {
  msg: string;
  error: string;
  data: T;
}

export interface PaginationParams {
  skip: number;
  limit: number;
}

// ======================================================================
// Login
export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  accessToken: string;
}

// Logout
export interface LogoutPayload {
  token: string;
}

// ======================================================================
// Products
export interface ProductPayload {
  categoryId: string;
  companyId: string;
}

export interface ProductRes {
  id: string;
  name: string;
  stocks: number;
  category_id: string;
  purchase_price: number;
  company_id: string;
  selling_price: number;
  created_at: string;
  updated_at: string | null;
  created_id: string;
  updated_id: string;
  image: string;
  is_deleted: boolean;
  status: 'sale',
  colors: [
    '#00AB55',
    '#000000',
    '#FFFFFF',
    '#FFC0CB',
    '#FF4842',
    '#1890FF',
    '#94D82D',
    '#FFC107',
  ],
}

export interface CategoryRes {
  id: string;
  name: string;
  company_id: string;
  created_at: string; // ISO date string
  updated_at: string | null;
  created_id: string;
  updated_id: string | null;
  is_deleted: boolean;
}


export interface ProductResponse {
  data: ProductRes[],
}
