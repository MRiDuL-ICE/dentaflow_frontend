import apiClient from "@/lib/api/client";

export const staffApi = {
  getAll: () => apiClient.get("/staff"),

  getDentists: () => apiClient.get("/staff/dentists"),
};
