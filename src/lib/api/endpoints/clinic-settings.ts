import apiClient from "../client";

export const clinicSettingsApi = {
  get: () => apiClient.get("/clinic-settings"),
  update: (data: unknown) => apiClient.patch("/clinic-settings", data),
};
