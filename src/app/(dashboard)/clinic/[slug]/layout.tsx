"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthStore } from "@/lib/store/auth.store";
import { Spinner } from "reactstrap";

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { isAuthenticated, isSuperAdmin, hasRole, setClinicSlug, clinicSlug } =
    useAuthStore();

  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Not authenticated at all
    if (!isAuthenticated) {
      router.replace(`/login/${slug}`);
      return;
    }

    // Super admin shouldn't be in clinic dashboard
    if (isSuperAdmin) {
      router.replace("/super-admin/dashboard");
      return;
    }

    // Sync slug into store if not already set
    if (clinicSlug !== slug) {
      setClinicSlug(slug);
    }

    setReady(true);
  }, [isAuthenticated, isSuperAdmin, slug]);

  if (!ready) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: "var(--df-bg)" }}
      >
        <Spinner style={{ color: "var(--df-primary)" }} />
      </div>
    );
  }

  const sidebarWidth = collapsed ? 64 : 260;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navbar is fixed full-width and sits above the sidebar (higher z-index) */}
      <Navbar title="" sidebarWidth={sidebarWidth} />

      {/* Sidebar is fixed, starts at top:0, but padding-top clears the navbar's overlap */}
      <Sidebar slug={slug} collapsed={collapsed} onCollapse={setCollapsed} />

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
