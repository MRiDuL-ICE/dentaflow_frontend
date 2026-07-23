"use client";

import { FiSun, FiMoon, FiBell, FiSearch } from "react-icons/fi";
import { useThemeStore } from "@/lib/store/theme.store";
import { useAuthStore } from "@/lib/store/auth.store";
import { Badge } from "reactstrap";
import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";
import { useState } from "react";

interface NavbarProps {
  title: string;
  sidebarWidth: number; // 64 when collapsed, 260 when expanded — keeps the brand box aligned with the sidebar underneath it
}

export function Navbar({ title, sidebarWidth }: NavbarProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="df-navbar d-flex shadow-sm">
      {/* Brand — matches sidebar width, sits directly above it */}

      <Image
        src="/logo without text.png"
        alt="Logo"
        width={60}
        height={60}
        unoptimized
        className="p-2"
      />

      {/* Title + right section */}
      <div
        className="d-flex flex-grow-1 px-4 justify-content-between align-items-center"
        // style={{ border: "4px solid black" }}
      >
        <div className="d-flex">
          <Breadcrumbs />
        </div>

        {/* Search */}
        <div
          className="d-flex align-items-center px-3 py-1"
          style={{
            background: "var(--df-primary-light)",
            border: "1px solid var(--df-primary)",
            borderRadius: "var(--df-radius-lg)",
            gap: 8,
          }}
        >
          <FiSearch style={{ color: "var(--df-text-muted)" }} />
          <input
            placeholder="Search"
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              color: "var(--df-text-primary)",
              fontSize: 14,
              width: 360,
            }}
          />
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <button
            className="btn position-relative d-flex align-items-center justify-content-center"
            style={{
              width: 38,
              height: 38,
              color: "var(--df-text-secondary)",
              background: "none",
              border: "1px solid var(--df-border)",
              borderRadius: "50%",
              padding: 0,
            }}
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

          {/* Theme toggle */}
          {/* <button
            className="btn btn-sm"
            onClick={toggleTheme}
            style={{
              color: "var(--df-text-secondary)",
              background: "none",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius)",
            }}
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button> */}

          {/* Avatar */}
          <div
            className="d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--df-primary)",
              color: "#fff",
              fontSize: 14,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {user && !avatarError ? (
              <Image
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yfGVufDB8fDB8fHww"
                alt={
                  `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                  "User avatar"
                }
                width={36}
                height={36}
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
  );
}

export default Navbar;
