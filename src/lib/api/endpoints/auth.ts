import apiClient from "../client";

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId?: number;
  }) => apiClient.post("/auth/register", data),

  logout: (refreshToken: string) =>
    apiClient.post("/auth/logout", { refreshToken }),

  refresh: (refreshToken: string) =>
    apiClient.post("/auth/refresh", { refreshToken }),

  requestMagicLink: (email: string, clinicSlug: string) =>
    apiClient.post("/auth/magic-link", { email, clinicSlug }),

  verifyMagicLink: (token: string, clinic: string) =>
    apiClient.get("/auth/magic-link/verify", { params: { token, clinic } }),

  resolveClinic: (email: string) =>
    apiClient.get("/auth/resolve-clinic", { params: { email } }),

  me: () => apiClient.get("/auth/me"),
};

export const superAdminApi = {
  login: (email: string, password: string) =>
    apiClient.post("/super-admin/login", { email, password }),

  createClinic: (data: Record<string, string>) =>
    apiClient.post("/super-admin/clinics", data),

  listClinics: (page = 1, limit = 20) =>
    apiClient.get(`/super-admin/clinics?page=${page}&limit=${limit}`),
  getClinic: (slug: string) => apiClient.get(`/super-admin/clinics/${slug}`),

  deactivateClinic: (slug: string) =>
    apiClient.patch(`/super-admin/clinics/${slug}/deactivate`),
};

export default authApi;

export type AuthApi = typeof authApi;
export type SuperAdminApi = typeof superAdminApi;
