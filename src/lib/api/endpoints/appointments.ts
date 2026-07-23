import apiClient from "../client";

export const appointmentsApi = {
  list: (params?: {
    patientId?: string;
    dentistId?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get("/appointments", { params }),

  get: (id: string) => apiClient.get(`/appointments/${id}`),

  create: (data: unknown) => apiClient.post("/appointments", data),

  updateStatus: (
    id: string,
    data: {
      status: string;
      reason?: string;
      rescheduledTo?: string;
    },
  ) => apiClient.patch(`/appointments/${id}/status`, data),

  getChairs: () => apiClient.get("/appointments/chairs"),
};

export default appointmentsApi;

export type AppointmentsApi = typeof appointmentsApi;

export type AppointmentsApiMethods = keyof AppointmentsApi;
