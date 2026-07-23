import apiClient from "../client";

export const analyticsApi = {
  getDashboard: () => apiClient.get("/analytics/dashboard"),
  getKpis: () => apiClient.get("/analytics/kpis"),

  getRevenueDaily: (days?: number) =>
    apiClient.get("/analytics/revenue/daily", { params: { days } }),

  getRevenueWeekly: (weeks?: number) =>
    apiClient.get("/analytics/revenue/weekly", { params: { weeks } }),

  getAppointmentStats: (days?: number) =>
    apiClient.get("/analytics/appointments/stats", { params: { days } }),

  getPatientGrowth: (weeks?: number) =>
    apiClient.get("/analytics/patients/growth", { params: { weeks } }),

  getRecallPatients: () => apiClient.get("/analytics/patients/recall"),
  getAiInsights: () => apiClient.get("/analytics/ai-insights"),
  getInventorySummary: () => apiClient.get("/analytics/inventory/summary"),
};

export default analyticsApi;

export type AnalyticsApi = typeof analyticsApi;
