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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "nowrap", // keep on one row; search box shrinks
        minWidth: 0, // allow flex children to shrink below content size
      }}
    >
      {/* Search */}
      <div style={{ position: "relative", flex: "1 1 0", minWidth: 0 }}>
        <FiSearch
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--df-primary)",
            fontSize: 14,
            pointerEvents: "none",
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          placeholder="Search patient, dentist…"
          value={filters.search ?? ""}
          onChange={(e) => onUpdate({ search: e.target.value })}
          style={{
            ...INPUT_STYLE,
            width: "100%",
            paddingLeft: 32,
            paddingRight: filters.search ? 32 : 10,
            boxSizing: "border-box",
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
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: 500,
          border: "1px solid var(--df-border)",
          background: filterOpen ? "var(--df-border)" : "var(--df-surface)",
          cursor: "pointer",
          position: "relative",
          flexShrink: 0, // never let the button collapse
          whiteSpace: "nowrap",
        }}
      >
        <FiSliders size={13} />
        {/* Hide label text on very narrow screens */}
        <span
          style={{
            display: "inline",
          }}
          className="df-filter-label"
        >
          Filters
        </span>
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

      {/* Inline style for responsive label hide */}
      <style>{`
        @media (max-width: 360px) {
          .df-filter-label { display: none !important; }
        }
      `}</style>
    </div>
  );
}

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
      {open && (
        <div
          style={{
            display: "grid",
            // 2 columns on mobile, auto-fill on larger screens
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
            padding: "14px 12px",
            background: "var(--df-surface)",
            border: "1px solid var(--df-border)",
            borderRadius: 10,
          }}
        >
          <style>{`
            @media (min-width: 480px) {
              .df-filter-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; }
            }
          `}</style>

          <div>
            <label style={LABEL_STYLE}>Status</label>
            <select
              value={filters.status ?? ""}
              onChange={(e) => onUpdate({ status: e.target.value })}
              style={{
                ...INPUT_STYLE,
                width: "100%",
                padding: "0 8px",
                boxSizing: "border-box",
              }}
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
              style={{
                ...INPUT_STYLE,
                width: "100%",
                padding: "0 8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>From</label>
            <input
              type="date"
              value={filters.from ?? ""}
              onChange={(e) => onUpdate({ from: e.target.value })}
              style={{
                ...INPUT_STYLE,
                width: "100%",
                padding: "0 8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>To</label>
            <input
              type="date"
              value={filters.to ?? ""}
              onChange={(e) => onUpdate({ to: e.target.value })}
              style={{
                ...INPUT_STYLE,
                width: "100%",
                padding: "0 8px",
                boxSizing: "border-box",
              }}
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
        // prevent chips from overflowing their container
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
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
          flexShrink: 0,
        }}
      >
        <FiX size={11} />
      </button>
    </span>
  );
}
