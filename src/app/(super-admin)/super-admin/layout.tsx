"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { Spinner } from "reactstrap";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !isSuperAdmin) {
      router.replace("/super-admin/login");
    }
  }, [isAuthenticated, isSuperAdmin]);

  if (!isAuthenticated || !isSuperAdmin) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner style={{ color: "var(--df-primary)" }} />
      </div>
    );
  }

  return <>{children}</>;
}
