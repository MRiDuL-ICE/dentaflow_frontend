import { AppointmentQuery } from "@/lib/hooks/use-appointments";
import apiClient from "../client";

export const appointmentsApi = {
  list: (params?: AppointmentQuery) =>
    apiClient.get("/appointments", { params }),

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
