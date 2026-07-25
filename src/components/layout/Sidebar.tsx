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
      <div className="p-1">
        {/* Collapse toggle — sits just below the overlapping navbar */}
        <div
          className="d-flex align-items-center justify-content-end px-1 py-1"
          // style={{ borderBottom: "1px solid var(--df-border)" }}
        >
          <button
            className="btn btn-lg"
            style={{
              color: "var(--df-text-secondary)",
              background: "none",
              border: "none",
            }}
            onClick={() => onCollapse(!collapsed)}
          >
            {collapsed ? <GoSidebarCollapse /> : <GoSidebarExpand />}
          </button>
        </div>
        {/* {!collapsed && (
          <div
            className="mb-2 small"
            style={{ color: "var(--df-text-secondary)" }}
          >
            <div
              className="fw-medium"
              style={{ color: "var(--df-text-primary)" }}
            >
              {user?.firstName} {user?.lastName}
            </div>
            <div>{user?.roles[0]?.replace("_", " ")}</div>
          </div>
        )} */}

        <button
          className="btn btn-outline-sm w-100 d-flex align-items-center"
          style={{
            color: "var(--df-text-secondary)",
            background: "none",
            border: "1px solid var(--df-border)",
            borderRadius: "var(--df-radius)",
          }}
          onClick={handleLogout}
        >
          <FiLogOut />
          {!collapsed && <span className="ms-2">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
