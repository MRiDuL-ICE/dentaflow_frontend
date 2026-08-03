import { FiChevronUp, FiChevronDown, FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";
import { Badge, Button } from "reactstrap";

interface Appointment {
  id: string;
  status: string;
  scheduledAt: string;
  treatmentType: string;
  durationMinutes: number;
  patient: { id: string; firstName: string; lastName: string; email: string };
  dentist: { id: string; firstName: string; lastName: string; email: string };
  chair?: { id: string; name: string } | null;
}

interface Props {
  appointments: Appointment[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (col: string) => void;
  onUpdateStatus: (id: string, current: string) => void;
}

const STATUS_BAR: Record<string, string> = {
  scheduled: "#94a3b8",
  confirmed: "#378ADD",
  in_progress: "#EF9F27",
  completed: "#198754",
  cancelled: "#DC3545",
  no_show: "#888780",
};
const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  scheduled: { bg: "#f1f5f9", color: "#475569" },
  confirmed: { bg: "#E6F1FB", color: "#185FA5" },
  in_progress: { bg: "#FAEEDA", color: "#854F0B" },
  completed: { bg: "#EAF3DE", color: "#3B6D11" },
  cancelled: { bg: "#FCEBEB", color: "#A32D2D" },
  no_show: { bg: "#F1EFE8", color: "#5F5E5A" },
};

const STATUS_COLORS: Record<string, string> = {
  scheduled: "secondary",
  confirmed: "primary",
  in_progress: "warning",
  completed: "success",
  cancelled: "danger",
  no_show: "dark",
};

const TH_STYLE: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 11,
  fontWeight: 500,
  color: "var(--df-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
  textAlign: "left",
  userSelect: "none",
};

function SortTh({
  label,
  col,
  sortBy,
  sortOrder,
  onSort,
}: {
  label: string;
  col: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (c: string) => void;
}) {
  const active = sortBy === col;
  return (
    <th style={{ ...TH_STYLE, cursor: "pointer" }} onClick={() => onSort(col)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label}
        <span
          style={{
            display: "inline-flex",
            flexDirection: "column",
            opacity: active ? 1 : 0.3,
          }}
        >
          <FiChevronUp
            size={10}
            style={{
              marginBottom: -3,
              color:
                active && sortOrder === "asc"
                  ? "var(--df-text-primary)"
                  : "var(--df-text-muted)",
            }}
          />
          <FiChevronDown
            size={10}
            style={{
              color:
                active && sortOrder === "desc"
                  ? "var(--df-text-primary)"
                  : "var(--df-text-muted)",
            }}
          />
        </span>
      </span>
    </th>
  );
}

export function AppointmentListTable({
  appointments,
  sortBy,
  sortOrder,
  onSort,
  onUpdateStatus,
}: Props) {
  return (
    <div
      style={{
        background: "var(--df-bg-card)",
        border: "1px solid var(--df-border)",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: 4 }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "14%" }} />
        </colgroup>
        <thead>
          <tr
            style={{
              background: "var(--df-surface)",
              borderBottom: "1px solid var(--df-border)",
            }}
          >
            <th style={{ padding: 0 }} />
            <SortTh
              label="Patient"
              col="patient_name"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortTh
              label="Dentist"
              col="dentist_name"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <th style={TH_STYLE}>Date</th>
            <th style={TH_STYLE}>Duration</th>
            <SortTh
              label="Status"
              col="status"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <th style={TH_STYLE}>Chair</th>
            <th style={{ ...TH_STYLE, textAlign: "left" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, i) => {
            const isDone =
              appt.status === "completed" || appt.status === "cancelled";
            const badge = STATUS_BADGE[appt.status] ?? STATUS_BADGE.scheduled;
            const date = new Date(appt.scheduledAt).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" },
            );
            const [h, m] = appt.scheduledAt
              .slice(11, 16)
              .split(":")
              .map(Number);
            const time = `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;

            return (
              <motion.tr
                key={appt.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.025, duration: 0.18 }}
                style={{ borderBottom: "0.5px solid var(--df-border)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--df-surface)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={{ padding: 0 }}>
                  <div
                    style={{
                      width: 4,
                      minHeight: 56,
                      background: STATUS_BAR[appt.status] ?? "#94a3b8",
                    }}
                  />
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: "var(--df-text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {appt.patient.firstName} {appt.patient.lastName}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--df-text-muted)",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {appt.patient.email}
                  </div>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--df-text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Dr. {appt.dentist.firstName} {appt.dentist.lastName}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--df-text-muted)",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {appt.dentist.email}
                  </div>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--df-text-primary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {date}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--df-text-secondary)",
                      marginTop: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {time}
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    fontSize: 13,
                    color: "var(--df-text-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {appt.durationMinutes} min
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <Badge
                    className="df-badge"
                    color={STATUS_COLORS[appt.status] ?? "secondary"}
                  >
                    {appt.status.replace("_", " ")}
                  </Badge>
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    fontSize: 12,
                    color: "var(--df-text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {appt.chair?.name ?? "—"}
                </td>
                <td style={{ padding: "12px 14px", textAlign: "right" }}>
                  <Button
                    disabled={isDone}
                    onClick={() => onUpdateStatus(appt.id, appt.status)}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      padding: "5px 11px",
                      cursor: isDone ? "not-allowed" : "pointer",
                      transition: "background 0.1s",
                    }}
                    className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                  >
                    <FiEdit style={{ fontSize: 12 }} /> Update Status
                  </Button>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
