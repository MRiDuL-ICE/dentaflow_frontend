import apiClient from "../client";

export const portalApi = {
  getProfile: () => apiClient.get("/portal/profile"),

  getAppointments: (params?: { page?: number; limit?: number }) =>
    apiClient.get("/portal/appointments", { params }),

  bookAppointment: (data: unknown) =>
    apiClient.post("/portal/appointments", data),

  getXrays: () => apiClient.get("/portal/xrays"),
  getInvoices: () => apiClient.get("/portal/invoices"),
  getClinicalNotes: () => apiClient.get("/portal/clinical-notes"),
  getReminders: () => apiClient.get("/portal/reminders"),
};

export default portalApi;

export type PortalApi = typeof portalApi;
