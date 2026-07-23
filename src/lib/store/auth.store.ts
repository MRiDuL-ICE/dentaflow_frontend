import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  clinicId: string | null;
}

interface AuthStore {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  clinicSlug: string | null;
  isSuperAdmin: boolean;
  isAuthenticated: boolean;

  setAuth: (data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    clinicSlug?: string;
  }) => void;
  setAccessToken: (token: string) => void;
  setClinicSlug: (slug: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

// Write auth state to cookie so middleware can read it
function syncCookie(state: {
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify({ state }));
  // 7 day cookie
  document.cookie = `dentaflow-auth=${value}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

function clearCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "dentaflow-auth=; path=/; max-age=0; SameSite=Lax";
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      clinicSlug: null,
      isSuperAdmin: false,
      isAuthenticated: false,

      setAuth: ({ user, accessToken, refreshToken, clinicSlug }) => {
        const isSuperAdmin = user.roles.includes("super_admin");
        set({
          user,
          accessToken,
          refreshToken,
          clinicSlug: clinicSlug ?? null,
          isSuperAdmin,
          isAuthenticated: true,
        });
        syncCookie({ isAuthenticated: true, isSuperAdmin });
      },

      setAccessToken: (accessToken) => set({ accessToken }),

      setClinicSlug: (clinicSlug) => set({ clinicSlug }),

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          clinicSlug: null,
          isSuperAdmin: false,
          isAuthenticated: false,
        });
        clearCookie();
      },

      hasRole: (role) => get().user?.roles.includes(role) ?? false,
    }),
    {
      name: "dentaflow-auth-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? sessionStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({
        user: state.user,
        clinicSlug: state.clinicSlug,
        isSuperAdmin: state.isSuperAdmin,
        isAuthenticated: state.isAuthenticated,
        refreshToken: state.refreshToken,
        // accessToken intentionally excluded — memory only
      }),
    },
  ),
);
