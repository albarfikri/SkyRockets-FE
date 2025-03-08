import agent from './agent/agent';

import type { ProductRes, ApiResponse, CategoryRes, ProductPayload, PaginationParams, InventoryWarehouseResponse } from "./agent/types";

export const inventoryWarehouseService = {
    getProducts: (payload: ProductPayload, Pagination: PaginationParams) => 
      agent.get<ApiResponse<ProductRes[]>>(
        `api/v1/product/getProduct?skip=${Pagination.skip}&limit=${Pagination.limit}&categoryId=${payload.categoryId}&companyId=${payload.companyId}`
      ),
    getCategory: (payload: any) =>
      agent.get<ApiResponse<CategoryRes[]>>(
        `api/v1/category/getCategory?companyId=${payload.companyId}`
      ),
    getWarehouse: (payload: any, Pagination: PaginationParams) => 
      agent.get<ApiResponse<InventoryWarehouseResponse[]>>(
        `api/v1/warehouse?company_id=${payload.companyId}&limit=${Pagination.limit}`
      ),
    delWarehouse:(id: string) => agent.delete<ApiResponse<any[]>>(
      `api/v1/warehouse/${id}`
    )
};
  