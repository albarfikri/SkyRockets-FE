import { deleteLocalStorage } from 'src/utils/local-storage';

import { configuration } from 'src/constants';

import agent from './agent/agent';
import { type User, type ApiResponse, type LoginPayload    } from "./agent/types";

export const authService = {
  login: (payload: LoginPayload) => agent.post<ApiResponse<User>, LoginPayload>("/api/v1/auth/login", payload),
  logout: () => agent.put<ApiResponse<Response>, void>('/api/v1/auth/logout', undefined).then(() => deleteLocalStorage(configuration.localStorage)),
  getUser: () => agent.get<ApiResponse<Response>>('api/v1/user/findUser'),
  getCompany: (companyId: string) => agent.get<ApiResponse<Response>>(`api/v1/company/${companyId}`),
};