import { motion } from "framer-motion";
import { FiClock, FiEdit } from "react-icons/fi";
import { StatusBadge } from "./StatusBadge";
import { Badge, Button } from "reactstrap";

interface AppointmentGridCardProps {
  appt: Record<string, unknown>;
  index: number;
  onUpdateStatus: (id: string, current: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "secondary",
  confirmed: "primary",
  in_progress: "warning",
  completed: "success",
  cancelled: "danger",
  no_show: "dark",
};

export function AppointmentGridCard({
  appt,
  index,
  onUpdateStatus,
}: AppointmentGridCardProps) {
  const isDone =
    appt["status"] === "completed" || appt["status"] === "cancelled";

  const scheduledAt = appt["scheduled_at"] as string;
  const date = new Date(scheduledAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const [h, m] = scheduledAt.slice(11, 16).split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const time = `${hour}:${String(m).padStart(2, "0")} ${ampm}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      style={{
        background: "var(--df-bg-card)",
        border: "1px solid var(--df-border)",
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "100%",
      }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <Badge
          className="df-badge"
          color={STATUS_COLORS[appt["status"] as string] ?? "secondary"}
        >
          {" "}
          {(appt["status"] as string).replace("_", " ")}{" "}
        </Badge>
        <span style={{ fontSize: 12, color: "var(--df-text-muted)" }}>
          {date}
        </span>
      </div>

      <div
        style={{
          fontWeight: 600,
          fontSize: 14,
          color: "var(--df-text-primary)",
          lineHeight: 1.3,
        }}
      >
        {appt["treatment_type"] as string}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "var(--df-text-secondary)",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <FiClock style={{ fontSize: 11, flexShrink: 0 }} />
          {time} · {appt["duration_minutes"] as number} min
        </div>
        {typeof appt["chair_name"] === "string" && (
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: 11 }}>🪑</span>
            {appt["chair_name"] as string}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end mt-auto pt-1">
        <Button
          disabled={isDone}
          onClick={() =>
            onUpdateStatus(appt["id"] as string, appt["status"] as string)
          }
          className="btn btn-primary btn-sm d-flex align-items-center gap-2"
          style={{
            cursor: isDone ? "not-allowed" : "pointer",
            transition: "all 0.15s",
          }}
        >
          <FiEdit style={{ fontSize: 11 }} />
          Update Status
        </Button>
      </div>
    </motion.div>
  );
}
