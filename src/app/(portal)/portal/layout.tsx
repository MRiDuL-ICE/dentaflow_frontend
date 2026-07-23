"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { Navbar } from "@/components/layout/Navbar";
import { Container, Nav, NavItem, NavLink } from "reactstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiCalendar, FiFileText, FiDollarSign } from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Home", href: "/portal/dashboard", icon: <FiHome /> },
  { label: "Appointments", href: "/portal/appointments", icon: <FiCalendar /> },
  { label: "Records", href: "/portal/records", icon: <FiFileText /> },
  { label: "Invoices", href: "/portal/invoices", icon: <FiDollarSign /> },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasRole } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !hasRole("patient")) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--df-bg)" }}>
      <Navbar title="Patient Portal" />

      {/* Portal nav */}
      <div
        style={{
          background: "var(--df-bg-card)",
          borderBottom: "1px solid var(--df-border)",
        }}
      >
        <Container>
          <Nav className="py-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.href}>
                <NavLink
                  tag={Link}
                  href={item.href}
                  className="d-flex align-items-center gap-2 small"
                  style={{
                    color: pathname.startsWith(item.href)
                      ? "var(--df-primary)"
                      : "var(--df-text-secondary)",
                    fontWeight: pathname.startsWith(item.href) ? 600 : 400,
                    padding: "8px 12px",
                    borderRadius: "var(--df-radius)",
                    background: pathname.startsWith(item.href)
                      ? "var(--df-primary-light)"
                      : "transparent",
                  }}
                >
                  {item.icon} {item.label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Container>
      </div>

      <Container className="py-4">{children}</Container>
    </div>
  );
}
