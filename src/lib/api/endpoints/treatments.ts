import apiClient from "../client";

export const treatmentsApi = {
  getCategories: () => apiClient.get("/treatments/categories"),

  getCatalog: (search?: string) =>
    apiClient.get("/treatments/catalog", { params: { search } }),

  createTreatment: (data: unknown) =>
    apiClient.post("/treatments/catalog", data),

  createPlan: (data: unknown) => apiClient.post("/treatments/plans", data),

  getPatientPlans: (patientId: string) =>
    apiClient.get(`/treatments/plans/patient/${patientId}`),

  getPlan: (id: string) => apiClient.get(`/treatments/plans/${id}`),

  addItem: (planId: string, data: unknown) =>
    apiClient.post(`/treatments/plans/${planId}/items`, data),

  updateItemStatus: (itemId: string, status: string) =>
    apiClient.patch(`/treatments/plans/items/${itemId}/status`, { status }),
};

export default treatmentsApi;

export type TreatmentsApi = typeof treatmentsApi;
