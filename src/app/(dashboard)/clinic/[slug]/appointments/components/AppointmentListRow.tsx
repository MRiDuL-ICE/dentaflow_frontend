import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiEdit } from "react-icons/fi";
import { Badge, Button } from "reactstrap";

interface AppointmentListRowProps {
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

export function AppointmentListRow({
  appt,
  index,
  onUpdateStatus,
}: AppointmentListRowProps) {
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
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      style={{
        background: "var(--df-surface)",
        border: "1px solid var(--df-border)",
        borderRadius: 12,
        padding: "13px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <Badge
        className="df-badge"
        color={STATUS_COLORS[appt["status"] as string] ?? "secondary"}
      >
        {" "}
        {(appt["status"] as string).replace("_", " ")}{" "}
      </Badge>

      <div
        style={{
          fontWeight: 600,
          fontSize: 13,
          color: "var(--df-text-primary)",
          flex: "1 1 160px",
          minWidth: 0,
        }}
      >
        {appt["treatment_type"] as string}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "var(--df-text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        <FiCalendar style={{ fontSize: 11 }} /> {date}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "var(--df-text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        <FiClock style={{ fontSize: 11 }} /> {time} ·{" "}
        {appt["duration_minutes"] as number} min
      </div>

      {typeof appt["chair_name"] === "string" && (
        <div
          style={{
            fontSize: 12,
            color: "var(--df-text-secondary)",
            flexShrink: 0,
          }}
        >
          🪑 {appt["chair_name"] as string}
        </div>
      )}

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
    </motion.div>
  );
}
