import { configuration } from 'src/constants';

import agent from './agent/agent';

import type { User, ApiResponse, LoginPayload, LogutResponse } from "./agent/types";

export const authService = {
  login: (payload: LoginPayload) => agent.post<ApiResponse<User>, LoginPayload>("/api/v1/auth/login", payload),
  logout: () => {
    const token = localStorage.getItem(configuration.localStorage) || "";
    console.log('token', token);
    return agent.put<ApiResponse<LogutResponse>, void>('/api/v1/auth/logout', undefined, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
};