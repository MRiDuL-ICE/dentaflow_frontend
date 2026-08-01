import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
interface Props {
  meta: Meta;
  onPageChange: (p: number) => void;
}

export function AppointmentPagination({ meta, onPageChange }: Props) {
  const { page, totalPages, total, limit } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build page numbers: always show first, last, current ±1, with ellipsis gaps
  const pages: (number | "…")[] = [];
  const add = (n: number) => {
    if (!pages.includes(n)) pages.push(n);
  };
  add(1);
  if (page > 3) pages.push("…");
  if (page > 2) add(page - 1);
  add(page);
  if (page < totalPages - 1) add(page + 1);
  if (page < totalPages - 2) pages.push("…");
  if (totalPages > 1) add(totalPages);

  const btnBase: React.CSSProperties = {
    minWidth: 32,
    height: 32,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    borderRadius: 6,
    border: "1px solid var(--df-border)",
    background: "var(--df-surface)",
    color: "var(--df-text-primary)",
    cursor: "pointer",
    padding: "0 6px",
    fontWeight: 400,
    transition: "all 0.1s",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      {/* Result count */}
      <span style={{ fontSize: 13, color: "var(--df-text-secondary)" }}>
        Showing{" "}
        <strong style={{ color: "var(--df-text-primary)" }}>
          {from}–{to}
        </strong>{" "}
        of <strong style={{ color: "var(--df-text-primary)" }}>{total}</strong>{" "}
        appointments
      </span>

      {/* Page buttons */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          style={{
            ...btnBase,
            opacity: page === 1 ? 0.35 : 1,
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          <FiChevronLeft size={14} />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              style={{
                minWidth: 32,
                textAlign: "center",
                fontSize: 13,
                color: "var(--df-text-muted)",
              }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              style={{
                ...btnBase,
                background: p === page ? "#378ADD" : "var(--df-surface)",
                color: p === page ? "#fff" : "var(--df-text-primary)",
                border:
                  p === page
                    ? "1px solid #378ADD"
                    : "1px solid var(--df-border)",
                fontWeight: p === page ? 600 : 400,
              }}
            >
              {p}
            </button>
          ),
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          style={{
            ...btnBase,
            opacity: page === totalPages ? 0.35 : 1,
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}
        >
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
