import type { AxiosInstance, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

import axios, { AxiosHeaders } from "axios";

import { getLocalStorage } from "src/utils/local-storage";

import { configuration } from "src/constants";

const { devBaseUrl } = configuration;

export class ApiAgent {
  private instance: AxiosInstance;

  constructor(baseURL: string = devBaseUrl) {
    this.instance = axios.create({ baseURL });

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.Authorization = getLocalStorage() ? `Bearer ${getLocalStorage()}` : ''; 
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        response.headers = {
          ...response.headers,
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        };
        return response;
      },
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T, U>(url: string, data: U, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T, U>(url: string, data: U, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const apiAgent = new ApiAgent();
export default apiAgent;
