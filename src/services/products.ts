

import agent from './agent/agent';

import type { ProductRes, ApiResponse, ProductPayload, PaginationParams, CategoryRes } from "./agent/types";

export const productService = {
    getProducts: (payload: ProductPayload, Pagination: PaginationParams) => 
      agent.get<ApiResponse<ProductRes[]>>(
        `api/v1/product/getProduct?skip=${Pagination.skip}&limit=${Pagination.limit}&categoryId=${payload.categoryId}&companyId=${payload.companyId}`
      ),
    getCategory: (payload: any) =>
      agent.get<ApiResponse<CategoryRes[]>>(
        `api/v1/category/getCategory?companyId=${payload.companyId}`
      )
  };
  