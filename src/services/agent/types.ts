
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Response {
  msg: string;
  error: string;
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