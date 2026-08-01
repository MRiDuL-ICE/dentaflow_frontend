"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { Spinner } from "reactstrap";
import { Navbar } from "@/components/layout/Navbar";
import { SuperAdminSidebar } from "@/components/layout/SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

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

  const sidebarWidth = collapsed ? 64 : 190;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar title="" sidebarWidth={sidebarWidth} />
      <SuperAdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <main
        style={{
          marginLeft: sidebarWidth,
          paddingTop: 64,
          background: "var(--df-bg)",
          minHeight: "100vh",
          transition: "margin-left 0.2s ease",
        }}
      >
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
