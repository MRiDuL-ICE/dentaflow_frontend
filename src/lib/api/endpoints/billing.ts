import apiClient from "../client";

export const billingApi = {
  createInvoice: (data: unknown) => apiClient.post("/billing/invoices", data),

  getInvoice: (id: string) => apiClient.get(`/billing/invoices/${id}`),

  getPatientInvoices: (patientId: string) =>
    apiClient.get(`/billing/invoices/patient/${patientId}`),

  addPayment: (invoiceId: string, data: unknown) =>
    apiClient.post(`/billing/invoices/${invoiceId}/payments`, data),

  getOverdue: () => apiClient.get("/billing/invoices/overdue"),
};

export default billingApi;

export type BillingApi = typeof billingApi;
