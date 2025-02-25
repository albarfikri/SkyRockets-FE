

import agent from './agent/agent';

import type {  Response, ApiResponse, ProductPayload, PaginationParams, ProductResponse } from "./agent/types";

export const productService = {
    getProducts: (payload: ProductPayload, Pagination: PaginationParams) => 
      agent.get<ApiResponse<ProductResponse>>(
        `api/v1/product/getProduct?skip=${Pagination.skip}&limit=${Pagination.limit}&categoryId=${payload.categoryId}&companyId=${payload.companyId}`
      ),
  };
  