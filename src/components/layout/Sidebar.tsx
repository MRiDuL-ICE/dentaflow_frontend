"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiPackage,
  FiBarChart2,
  FiDownload,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/endpoints";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
  badge?: string;
}

interface SidebarProps {
  slug: string;
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

export function Sidebar({ slug, collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hasRole, logout, refreshToken } = useAuthStore();
  const [avatarError, setAvatarError] = useState(false);

  const base = `/clinic/${slug}`;

  const navItems: NavItem[] = [
    { label: "Dashboard", href: `${base}/dashboard`, icon: <FiHome /> },
    { label: "Patients", href: `${base}/patients`, icon: <FiUsers /> },
    {
      label: "Appointments",
      href: `${base}/appointments`,
      icon: <FiCalendar />,
    },
    { label: "Treatments", href: `${base}/treatments`, icon: <FiFileText /> },
    { label: "Billing", href: `${base}/billing`, icon: <FiDollarSign /> },
    {
      label: "Inventory",
      href: `${base}/inventory`,
      icon: <FiPackage />,
      roles: ["clinic_owner", "receptionist"],
    },
    {
      label: "Analytics",
      href: `${base}/analytics`,
      icon: <FiBarChart2 />,
      roles: ["clinic_owner", "dentist"],
    },
    {
      label: "Reports",
      href: `${base}/reports`,
      icon: <FiDownload />,
      roles: ["clinic_owner"],
    },
    { label: "Settings", href: `${base}/settings`, icon: <FiSettings /> },
  ];

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.some((r) => hasRole(r)),
  );

  async function handleLogout() {
    const toastId = toast.loading("Signing out...");
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      /* ignore */
    }
    logout();
    router.push("/login");
    toast.success("Signed out successfully.", { id: toastId });
  }

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const role = user?.roles?.[0]?.replace(/_/g, " ") ?? "";
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  return (
    <motion.aside
      className="df-sidebar d-flex flex-column"
      animate={{ width: collapsed ? 63 : 190 }}
      transition={{ duration: 0.2 }}
    >
      {/* Nav items */}
      <nav className="flex-grow-1 py-3">
        {visibleItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="d-flex align-items-center p-2 py-2 mb-1 text-decoration-none"
              style={{
                color: active
                  ? "var(--df-sidebar-active)"
                  : "var(--df-sidebar-text)",
                background: active ? "var(--df-primary-light)" : "transparent",
                borderRadius: active ? "0 6px 6px 0" : "6px",
                borderLeft: active
                  ? "3px solid var(--df-primary)"
                  : "3px solid transparent",
                margin: "0 10px",
                fontWeight: active ? 500 : 400,
                transition: "var(--df-transition)",
                fontSize: 14,
              }}
            >
              {!collapsed ? (
                <span style={{ fontSize: 18, minWidth: 20 }}>{item.icon}</span>
              ) : (
                <span className="px-1" style={{ fontSize: 18, minWidth: 20 }}>
                  {item.icon}
                </span>
              )}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ms-2"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: "8px 10px 12px" }}>
        {/* User card */}
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                padding: "16px 14px 12px",
                marginBottom: 6,
              }}
            >
              {/* Base darker half */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--df-primary)",
                }}
              />

              {/* Accent lighter half — diagonal clip */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#3d6cc0",
                  clipPath: "polygon(45% 0%, 100% 0%, 100% 100%, 30% 100%)",
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {/* Avatar */}
                <div
                  className="d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                  style={{
                    width: 54,
                    height: 54,
                    border: "2px solid var(--df-primary)",
                    borderRadius: "50%",
                    background: "var(--df-primary)",
                    color: "#fff",
                    fontSize: 13,
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  {user && !avatarError ? (
                    <Image
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yfGVufDB8fDB8fHww"
                      alt={fullName}
                      width={34}
                      height={34}
                      unoptimized
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.18)",
                        border: "1.5px solid rgba(255,255,255,0.35)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                  )}
                </div>

                {/* Name */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                    textAlign: "center",
                  }}
                >
                  {fullName}
                </p>

                {/* Role */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.7)",
                    textTransform: "capitalize",
                    textAlign: "center",
                    marginBottom: 6,
                  }}
                >
                  {role}
                </p>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    width: "100%",
                    padding: "5px 0",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.85)",
                    transition: "var(--df-transition)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.22)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  }}
                >
                  <FiLogOut size={11} />
                  Sign out
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 6,
              }}
            >
              <div
                title={fullName}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#3d6cc0",
                  border: "2px solid #002972",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "default",
                }}
              >
                {initials}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="btn btn-lg"
            style={{
              color: "var(--df-text-secondary)",
              background: "none",
              border: "none",
              padding: "4px 6px",
            }}
            onClick={() => onCollapse(!collapsed)}
          >
            {collapsed ? <GoSidebarCollapse /> : <GoSidebarExpand />}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
