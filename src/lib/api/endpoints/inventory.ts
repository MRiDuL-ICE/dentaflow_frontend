import apiClient from "../client";

export const inventoryApi = {
  getItems: (search?: string) =>
    apiClient.get("/inventory/items", { params: { search } }),

  getLowStock: () => apiClient.get("/inventory/items/low-stock"),

  getExpiring: (days?: number) =>
    apiClient.get("/inventory/items/expiring", { params: { days } }),

  createItem: (data: unknown) => apiClient.post("/inventory/items", data),

  adjustStock: (id: string, data: { quantity: number; notes?: string }) =>
    apiClient.patch(`/inventory/items/${id}/adjust`, data),

  getSuppliers: () => apiClient.get("/inventory/suppliers"),

  createSupplier: (data: unknown) =>
    apiClient.post("/inventory/suppliers", data),

  createPO: (data: unknown) =>
    apiClient.post("/inventory/purchase-orders", data),

  getPOs: () => apiClient.get("/inventory/purchase-orders"),

  receivePO: (id: string, data: unknown) =>
    apiClient.patch(`/inventory/purchase-orders/${id}/receive`, data),
};

export default inventoryApi;

export type InventoryApi = typeof inventoryApi;
