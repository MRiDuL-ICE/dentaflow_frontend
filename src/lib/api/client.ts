import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor ──────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window === "undefined") return config;

    // Read from sessionStorage directly — avoids circular import
    try {
      const raw = sessionStorage.getItem("dentaflow-auth-store");
      if (raw) {
        const state = (
          JSON.parse(raw) as {
            state: {
              accessToken?: string;
              clinicSlug?: string;
            };
          }
        ).state;

        if (state.accessToken)
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        if (state.clinicSlug)
          config.headers["x-clinic-slug"] = state.clinicSlug;
      }
    } catch {
      /* ignore */
    }

    return config;
  },
  (err) => Promise.reject(err),
);

// ── Response interceptor — auto refresh ─────────────
let isRefreshing = false;
let queue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(err: unknown, token: string | null) {
  queue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve(token!)));
  queue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || original._retry)
      return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // Get refresh token from sessionStorage
      const raw = sessionStorage.getItem("dentaflow-auth-store");
      const refreshToken = raw
        ? (
            JSON.parse(raw) as {
              state: { refreshToken?: string };
            }
          ).state.refreshToken
        : null;

      if (!refreshToken) throw new Error("No refresh token");

      const res = await apiClient.post("/auth/refresh", { refreshToken });
      const newToken = (
        res.data as {
          data: { accessToken: string };
        }
      ).data.accessToken;

      // Update sessionStorage with new token
      if (raw) {
        const parsed = JSON.parse(raw) as {
          state: Record<string, unknown>;
        };
        parsed.state.accessToken = newToken;
        sessionStorage.setItem("dentaflow-auth-store", JSON.stringify(parsed));
      }

      processQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshErr) {
      processQueue(refreshErr, null);

      // Clear auth and redirect to login
      sessionStorage.removeItem("dentaflow-auth-store");
      document.cookie = "dentaflow-auth=; path=/; max-age=0";
      window.location.href = "/login";

      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
