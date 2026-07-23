import apiClient from "../client";

export const reportsApi = {
  downloadRevenuePdf: (days?: number) =>
    apiClient.get("/reports/revenue/pdf", {
      params: { days },
      responseType: "blob",
    }),

  downloadRevenueCsv: (days?: number) =>
    apiClient.get("/reports/revenue/csv", {
      params: { days },
      responseType: "blob",
    }),

  downloadPatientsCsv: () =>
    apiClient.get("/reports/patients/csv", { responseType: "blob" }),

  downloadInvoicePdf: (id: string) =>
    apiClient.get(`/reports/invoices/${id}/pdf`, { responseType: "blob" }),
};

export default reportsApi;

export type ReportsApi = typeof reportsApi;
