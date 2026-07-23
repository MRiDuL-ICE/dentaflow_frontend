"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";
import { useAuthStore } from "@/lib/store/auth.store";

// Keep this in sync with the labels used in Sidebar's navItems
const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  patients: "Patients",
  appointments: "Appointments",
  treatments: "Treatments",
  billing: "Billing",
  inventory: "Inventory",
  analytics: "Analytics",
  reports: "Reports",
  settings: "Settings",
};

function formatSegment(segment: string) {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug as string;

  // Adjust this if your clinic name lives elsewhere in the store
  //   const { clinicName } = useAuthStore();
  const slugToName = slug
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const base = `/clinic/${slug}`;
  const relative = pathname.startsWith(base)
    ? pathname.slice(base.length)
    : pathname;

  const segments = relative.split("/").filter(Boolean);
  const currentSection = segments[0]; // e.g. "patients", ignores nested ids

  const sectionLabel = currentSection
    ? formatSegment(currentSection)
    : "Dashboard";
  const sectionHref = currentSection
    ? `${base}/${currentSection}`
    : `${base}/dashboard`;

  return (
    <nav
      className="d-flex align-items-center"
      aria-label="breadcrumb"
      style={{ fontSize: 14 }}
    >
      <Link
        href={`${base}/dashboard`}
        className="text-decoration-none df-badge-primary"
        style={{ color: "var(--df-primary-light)" }}
      >
        {slugToName || "Clinic"}
      </Link>

      <FiChevronRight
        className="mx-2"
        style={{ color: "var(--df-text-muted)", fontSize: 12 }}
      />

      <span className="fw-semibold" style={{ color: "var(--df-text-primary)" }}>
        {sectionLabel}
      </span>
    </nav>
  );
}

export default Breadcrumbs;
