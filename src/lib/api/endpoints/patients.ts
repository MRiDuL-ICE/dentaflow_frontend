import apiClient from "../client";

export const patientsApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) =>
    apiClient.get("/patients", { params }),

  get: (id: string) => apiClient.get(`/patients/${id}`),

  create: (data: unknown) => apiClient.post("/patients", data),

  update: (id: string, data: unknown) => apiClient.put(`/patients/${id}`, data),

  delete: (id: string) => apiClient.delete(`/patients/${id}`),
};

export default patientsApi;

export type PatientsApi = typeof patientsApi;
