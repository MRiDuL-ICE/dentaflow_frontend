import apiClient from "@/lib/api/client";

export const staffApi = {
  getAll: () => apiClient.get("/staff"),

  getDentists: () => apiClient.get("/staff/dentists"),

  invite: (data: { email: string; role: "dentist" | "receptionist" }) =>
    apiClient.post("/staff/invite", data),
};
