export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

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

export interface LogutResponse {
  msg: string;
  error: string;
}
