import { getLocalStorage, deleteLocalStorage } from 'src/utils/local-storage';

import { configuration } from 'src/constants';

import agent from './agent/agent';

import type { User, ApiResponse, LoginPayload, LogutResponse, GetUserReponse } from "./agent/types";

export const authService = {
  login: (payload: LoginPayload) => agent.post<ApiResponse<User>, LoginPayload>("/api/v1/auth/login", payload),
  logout: () => agent.put<ApiResponse<LogutResponse>, void>('/api/v1/auth/logout', undefined, {
      headers: {
        Authorization: `Bearer ${getLocalStorage()}`
      }
    }).then(() => deleteLocalStorage(configuration.localStorage)),
  getUser: () => agent.get<ApiResponse<GetUserReponse>>('api/v1/user/findUser', {
    headers: {
      Authorization: `Bearer ${getLocalStorage()}`
    }
  })
};