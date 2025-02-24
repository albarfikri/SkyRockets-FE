

import agent from './agent/agent';

import type {  PaginationParams, ApiResponse, ProductPayload } from "./agent/types";

export const productService = {
    getProducts: (payload: ProductPayload, Pagination: PaginationParams) => 
      agent.get<ApiResponse<Response>>(
        `api/v1/product/getProduct?skip=${Pagination.skip}&limit=${Pagination.limit}&categoryId=${payload.categoryId}&companyId=${payload.companyId}`
      ),
  };
  