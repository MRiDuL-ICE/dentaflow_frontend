import { useRef, useState } from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import type { AppointmentQuery } from "@/lib/hooks/use-appointments";

interface Props {
  filters: AppointmentQuery;
  activeFilterCount: number;
  onUpdate: (patch: Partial<AppointmentQuery>) => void;
  onReset: () => void;
}

const STATUSES = [
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
];

const INPUT_STYLE: React.CSSProperties = {
  height: 40,
  fontSize: 13,
  border: "1px solid var(--df-border)",
  //   borderRadius: 8,
  background: "var(--df-surface)",
  color: "var(--df-text-primary)",
  outline: "none",
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "var(--df-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  display: "block",
  marginBottom: 5,
};

// ── Inline part: search box + filter toggle button ──────────────────────────
export function AppointmentToolbarInline({
  filters,
  activeFilterCount,
  onUpdate,
  onFilterToggle,
  filterOpen,
}: Props & {
  onFilterToggle: () => void;
  filterOpen: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
      {/* Search */}
      <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
        <FiSearch
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--df-primary)",
            fontSize: 14,
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search patient, dentist, treatment…"
          value={filters.search ?? ""}
          onChange={(e) => onUpdate({ search: e.target.value })}
          style={{
            ...INPUT_STYLE,
            width: "100%",
            paddingLeft: 32,
            paddingRight: 32,
          }}
        />
        {filters.search && (
          <button
            onClick={() => onUpdate({ search: "" })}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--df-text-muted)",
              padding: 2,
              display: "flex",
            }}
          >
            <FiX size={13} />
          </button>
        )}
      </div>

      {/* Filter toggle */}
      <button
        onClick={onFilterToggle}
        style={{
          ...INPUT_STYLE,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: 500,
          border: "1px solid var(--df-border)",
          background: filterOpen ? "var(--df-border)" : "var(--df-surface)",
          cursor: "pointer",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <FiSliders size={13} />
        Filters
        {activeFilterCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              width: 16,
              height: 16,
              background: "#378ADD",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}

// ── Block part: filter panel + active chips (renders below the header row) ──
export function AppointmentToolbarPanel({
  filters,
  activeFilterCount,
  onUpdate,
  onReset,
  open,
}: Props & { open: boolean }) {
  if (!open && activeFilterCount === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginTop: 12,
      }}
    >
      {/* Filter panel */}
      {open && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 10,
            padding: "14px 16px",
            background: "var(--df-surface)",
            border: "1px solid var(--df-border)",
            borderRadius: 10,
          }}
        >
          <div>
            <label style={LABEL_STYLE}>Status</label>
            <select
              value={filters.status ?? ""}
              onChange={(e) => onUpdate({ status: e.target.value })}
              style={{ ...INPUT_STYLE, width: "100%", padding: "0 8px" }}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={LABEL_STYLE}>Treatment</label>
            <input
              type="text"
              placeholder="e.g. Root Canal"
              value={filters.treatmentType ?? ""}
              onChange={(e) => onUpdate({ treatmentType: e.target.value })}
              style={{ ...INPUT_STYLE, width: "100%", padding: "0 8px" }}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>From</label>
            <input
              type="date"
              value={filters.from ?? ""}
              onChange={(e) => onUpdate({ from: e.target.value })}
              style={{ ...INPUT_STYLE, width: "100%", padding: "0 8px" }}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>To</label>
            <input
              type="date"
              value={filters.to ?? ""}
              onChange={(e) => onUpdate({ to: e.target.value })}
              style={{ ...INPUT_STYLE, width: "100%", padding: "0 8px" }}
            />
          </div>
        </div>
      )}

      {/* Active chips + clear all */}
      {activeFilterCount > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
          }}
        >
          {filters.status && (
            <FilterChip
              label={`Status: ${filters.status.replace("_", " ")}`}
              onRemove={() => onUpdate({ status: "" })}
            />
          )}
          {filters.treatmentType && (
            <FilterChip
              label={`Treatment: ${filters.treatmentType}`}
              onRemove={() => onUpdate({ treatmentType: "" })}
            />
          )}
          {filters.from && (
            <FilterChip
              label={`From: ${filters.from}`}
              onRemove={() => onUpdate({ from: "" })}
            />
          )}
          {filters.to && (
            <FilterChip
              label={`To: ${filters.to}`}
              onRemove={() => onUpdate({ to: "" })}
            />
          )}
          <button
            onClick={onReset}
            style={{
              fontSize: 12,
              color: "var(--df-text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "3px 6px",
              textDecoration: "underline",
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        padding: "3px 10px",
        borderRadius: 99,
        background: "#E6F1FB",
        color: "#185FA5",
        fontWeight: 500,
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#185FA5",
          padding: 0,
          lineHeight: 1,
          display: "flex",
        }}
      >
        <FiX size={11} />
      </button>
    </span>
  );
}
