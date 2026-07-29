"use client";

import { FiSun, FiMoon, FiBell, FiSearch, FiX, FiMenu } from "react-icons/fi";
import { useThemeStore } from "@/lib/store/theme.store";
import { useAuthStore } from "@/lib/store/auth.store";
import { Badge } from "reactstrap";
import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";
import { useState } from "react";

interface NavbarProps {
  title: string;
  sidebarWidth: number;
  onMenuToggle?: () => void; // called on mobile to open/close the sidebar
}

export function Navbar({ title, sidebarWidth, onMenuToggle }: NavbarProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [avatarError, setAvatarError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header
        className="df-navbar shadow-sm"
        style={{ display: "flex", alignItems: "center" }}
      >
        {/* Mobile search overlay (sits on top of everything) */}
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

        {/* Hamburger — mobile only, opens sidebar */}
        {/* <button
          className="df-icon-btn df-menu-toggle"
          style={{ display: "none", marginLeft: 8, border: "none" }}
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <FiMenu />
        </button> */}

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

          {/* Right: notifications + avatar + theme toggle */}
          <div
            className="df-navbar-right d-flex align-items-center"
            style={{
              gap: 12,
              flexShrink: 0,
              // marginLeft: "auto",
            }}
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

            {/* Avatar */}
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
            >
              {user && !avatarError ? (
                <Image
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yfGVufDB8fDB8fHww"
                  alt={
                    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                    "User avatar"
                  }
                  width={34}
                  height={34}
                  unoptimized
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
