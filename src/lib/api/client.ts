import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const STORE_KEY = "dentaflow-auth-store";

// ── Helpers to read/write sessionStorage directly ───────
// Avoids circular imports with Zustand store

function getStoredState(): {
  accessToken?: string;
  refreshToken?: string;
  clinicSlug?: string;
} {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (!raw) return {};
    return (JSON.parse(raw) as { state: Record<string, unknown> }).state as {
      accessToken?: string;
      refreshToken?: string;
      clinicSlug?: string;
    };
  } catch {
    return {};
  }
}

function updateStoredAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { state: Record<string, unknown> };
    parsed.state["accessToken"] = token;
    sessionStorage.setItem(STORE_KEY, JSON.stringify(parsed));
  } catch {
    /* ignore */
  }
}

function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORE_KEY);
  // Also clear cookie so middleware redirects
  document.cookie = "dentaflow-auth=; path=/; max-age=0; SameSite=Lax";
}

// ── Axios instance ───────────────────────────────────────
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// ── Request interceptor — attach token + slug ────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window === "undefined") return config;

    const { accessToken, clinicSlug } = getStoredState();

    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;

    if (clinicSlug) config.headers["x-clinic-slug"] = clinicSlug;

    return config;
  },
  (err) => Promise.reject(err),
);

// ── Response interceptor — handle 401 + refresh ──────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(err: unknown, token: string | null): void {
  failedQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401 — and only once per request
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // If already refreshing — queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          original.headers["Authorization"] = `Bearer ${newToken}`;
          return apiClient(original);
        })
        .catch((err) => Promise.reject(err));
    }

    original._retry = true;
    isRefreshing = true;

    const { refreshToken, clinicSlug } = getStoredState();

    if (!refreshToken) {
      isRefreshing = false;
      processQueue(new Error("No refresh token"), null);
      clearStoredAuth();
      window.location.replace("/login");
      return Promise.reject(error);
    }

    try {
      // Call refresh — needs clinicSlug header if present
      const refreshRes = await axios.post(
        `${API_URL}/api/v1/auth/refresh`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            ...(clinicSlug ? { "x-clinic-slug": clinicSlug } : {}),
          },
          withCredentials: true,
          timeout: 15_000,
        },
      );

      const newAccessToken = (
        refreshRes.data as { data: { accessToken: string } }
      ).data.accessToken;

      // Update stored token
      updateStoredAccessToken(newAccessToken);

      // Retry all queued requests with new token
      processQueue(null, newAccessToken);

      // Retry original request
      original.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return apiClient(original);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearStoredAuth();

      toast.error("Session expired. Please sign in again.");

      // Small delay so toast is visible
      setTimeout(() => {
        window.location.replace("/login");
      }, 1500);

      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
