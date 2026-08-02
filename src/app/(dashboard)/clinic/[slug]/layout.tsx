"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthStore } from "@/lib/store/auth.store";
import { Spinner } from "reactstrap";

const MOBILE_BREAKPOINT = 768;

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { isAuthenticated, isSuperAdmin, setClinicSlug, clinicSlug } =
    useAuthStore();

  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login/${slug}`);
      return;
    }
    if (isSuperAdmin) {
      router.replace("/super-admin/dashboard");
      return;
    }
    if (clinicSlug !== slug) setClinicSlug(slug);
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

  const sidebarWidth = collapsed ? 63 : 190;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar
        title=""
        sidebarWidth={isMobile ? 0 : sidebarWidth}
        onMobileMenuToggle={
          isMobile ? () => setMobileOpen((o) => !o) : undefined
        }
      />

      <Sidebar
        slug={slug}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          paddingTop: 64,
          background: "var(--df-bg)",
          minHeight: "100vh",
          transition: "margin-left 0.2s ease",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        <div className="p-3 p-md-4">{children}</div>
      </main>
    </div>
  );
}
