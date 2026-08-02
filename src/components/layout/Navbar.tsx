"use client";

import {
  FiSun,
  FiMoon,
  FiBell,
  FiSearch,
  FiX,
  FiMenu,
  FiUser,
  FiSettings,
  FiLogOut,
  FiPlus,
  FiMoreVertical,
} from "react-icons/fi";
import { useThemeStore } from "@/lib/store/theme.store";
import { useAuthStore } from "@/lib/store/auth.store";
import { Badge, Button } from "reactstrap";
import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";
import { useState, useRef, useEffect } from "react";
import { authApi } from "@/lib/api/endpoints";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { BookAppointmentModal } from "@/app/(dashboard)/clinic/[slug]/appointments/components/BookAppointmentModal";
import Link from "next/link";
import AddPatientModal from "@/app/(dashboard)/clinic/[slug]/patients/components/AddPatientModal";

interface NavbarProps {
  title: string;
  sidebarWidth: number;
  onMenuToggle?: () => void;
  onMobileMenuToggle?: () => void; // hamburger → open sidebar on mobile
}

export function Navbar({
  title,
  sidebarWidth,
  onMenuToggle,
  onMobileMenuToggle,
}: NavbarProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout, refreshToken } = useAuthStore();
  const [avatarError, setAvatarError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User";
  const email = user?.email ?? "";

  const menuItems = [
    { icon: <FiUser size={14} />, label: "Profile", onClick: () => {} },
    { icon: <FiSettings size={14} />, label: "Settings", onClick: () => {} },
  ];

  const dropdownItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 9,
    width: "100%",
    padding: "8px 14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    color: "var(--df-text-primary)",
    textAlign: "left",
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: 200,
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.6)",
    borderRadius: 14,
    boxShadow: `
      0 8px 32px rgba(0,0,0,0.12),
      0 2px 8px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,
    zIndex: 1000,
    overflow: "hidden",
  };

  async function handleLogout() {
    const toastId = toast.loading("Signing out...");
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      /* ignore */
    }
    logout();
    router.push("/login");
    toast.success("Signed out successfully.", { id: toastId });
  }

  return (
    <>
      <header
        className="df-navbar shadow-sm"
        style={{ display: "flex", alignItems: "center" }}
      >
        {/* Mobile search overlay */}
        <div className={`df-search-overlay${searchOpen ? " open" : ""}`}>
          <FiSearch style={{ color: "var(--df-primary)", flexShrink: 0 }} />
          <input placeholder="Search…" autoFocus={searchOpen} />
          <button
            className="df-icon-btn"
            style={{ border: "none" }}
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            <FiX />
          </button>
        </div>

        {/* ── Hamburger — mobile only ── */}
        {onMobileMenuToggle && (
          <button
            className="df-icon-btn d-flex d-md-none align-items-center justify-content-center"
            onClick={onMobileMenuToggle}
            aria-label="Open navigation menu"
            style={{
              flexShrink: 0,
              marginLeft: 8,
              width: 36,
              height: 36,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "var(--df-text-primary)",
              fontSize: 20,
            }}
          >
            <FiMenu />
          </button>
        )}

        {/* Logo */}
        <Image
          src="/logo without text.png"
          alt="DentaFlow"
          width={56}
          height={56}
          unoptimized
          className="df-logo p-2"
          style={{ flexShrink: 0 }}
        />

        {/* Center: breadcrumbs + search */}
        <div
          className="d-flex align-items-center justify-content-between px-3"
          style={{ flex: 1, minWidth: 0, gap: 16 }}
        >
          <div className="df-breadcrumbs-wrap" style={{ minWidth: 0 }}>
            <Breadcrumbs />
          </div>

          {/* Desktop search */}
          <div className="df-search-wrap">
            <FiSearch style={{ color: "var(--df-primary)", flexShrink: 0 }} />
            <input placeholder="Search…" />
          </div>

          {/* Right side */}
          <div
            className="df-navbar-right d-flex align-items-center"
            style={{ gap: 12, flexShrink: 0 }}
          >
            {/* Mobile search toggle */}
            <button
              className="df-icon-btn df-search-toggle"
              style={{ display: "none" }}
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <FiSearch />
            </button>

            {/* Desktop: Book Appointment + Add Patient */}
            <Button
              onClick={() => setBookOpen(true)}
              className="btn btn-primary btn-sm d-none d-md-flex align-items-center gap-1"
            >
              <FiPlus />
              Book Appointment
            </Button>
            {/* <Link
              href={`/clinic/${slug}/patients/new`}
              className="btn btn-primary btn-sm d-none d-md-flex align-items-center gap-1"
            >
              <FiPlus />
              Add Patient
            </Link> */}
            <Button
              onClick={() => setAddPatientOpen(true)}
              className="btn btn-primary btn-sm d-none d-md-flex align-items-center gap-1"
            >
              <FiPlus />
              Add Patient
            </Button>

            {/* Mobile: 3-dot menu */}
            <div
              ref={mobileMenuRef}
              className="d-flex d-md-none"
              style={{ position: "relative" }}
            >
              <button
                className="df-icon-btn"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="More options"
              >
                <FiMoreVertical />
              </button>

              {mobileMenuOpen && (
                <div style={dropdownStyle}>
                  <div style={{ padding: "4px 0" }}>
                    <Button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setBookOpen(true);
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.3)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <span style={{ color: "var(--df-primary)" }}>
                        <FiPlus size={14} />
                      </span>
                      Book Appointment
                    </Button>
                    <Button
                      onClick={() => setMobileMenuOpen(false)}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.3)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <span style={{ color: "var(--df-primary)" }}>
                        <FiPlus size={14} />
                      </span>
                      Add Patient
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              className="df-icon-btn position-relative"
              aria-label="Notifications"
            >
              <FiBell />
              <Badge
                color="success"
                pill
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: 9 }}
              >
                3
              </Badge>
            </button>

            {/* Avatar + Dropdown */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <div
                className="d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                style={{
                  width: 34,
                  height: 34,
                  border: "2px solid var(--df-primary)",
                  borderRadius: "50%",
                  background: "var(--df-primary)",
                  color: "#fff",
                  fontSize: 13,
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => setDropdownOpen((v) => !v)}
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
                  <>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </>
                )}
              </div>

              {dropdownOpen && (
                <div style={dropdownStyle}>
                  <div
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1px solid var(--df-border)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--df-text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {fullName}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11,
                        color: "var(--df-text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {email}
                    </p>
                  </div>

                  <div style={{ padding: "4px 0" }}>
                    {menuItems.map((item) => (
                      <Button
                        key={item.label}
                        onClick={() => {
                          item.onClick();
                          setDropdownOpen(false);
                        }}
                        style={dropdownItemStyle}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(255,255,255,0.3)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                      >
                        <span style={{ color: "var(--df-text-muted)" }}>
                          {item.icon}
                        </span>
                        {item.label}
                      </Button>
                    ))}
                    <div
                      style={{
                        borderTop: "1px solid var(--df-border)",
                        margin: "4px 0",
                      }}
                    />
                    <Button
                      onClick={handleLogout}
                      style={{ ...dropdownItemStyle, color: "#EF4444" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(239,68,68,0.3)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <FiLogOut size={14} />
                      Sign out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <BookAppointmentModal
        isOpen={bookOpen}
        onClose={() => setBookOpen(false)}
      />

      <AddPatientModal
        open={addPatientOpen}
        onClose={() => setAddPatientOpen(false)}
      />
    </>
  );
}

export default Navbar;
