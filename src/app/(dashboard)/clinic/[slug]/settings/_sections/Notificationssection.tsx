"use client";

import { Card, CardBody, Spinner, Alert } from "reactstrap";
import type { Settings } from "../page";

interface NotificationsSectionProps {
  settings: Settings | null;
  loading: boolean;
  error: string;
  isOwner: boolean;
  onSettingToggle: (key: keyof Settings, value: boolean) => void;
}

const TOGGLES: { key: keyof Settings; label: string; desc: string }[] = [
  {
    key: "notify_email",
    label: "Email notifications",
    desc: "Send updates via email",
  },
  {
    key: "notify_sms",
    label: "SMS notifications",
    desc: "Send text message alerts",
  },
  {
    key: "notify_appointment_reminder",
    label: "Appointment reminders",
    desc: "Remind patients before their visit",
  },
  {
    key: "notify_appointment_confirm",
    label: "Appointment confirmations",
    desc: "Confirm when an appointment is booked",
  },
  {
    key: "notify_billing",
    label: "Billing notifications",
    desc: "Alert on invoices and payments",
  },
];

export function NotificationsSection({
  settings,
  loading,
  error,
  isOwner,
  onSettingToggle,
}: NotificationsSectionProps) {
  return (
    <div style={{ maxWidth: 520 }}>
      <div className="mb-4">
        <h5 className="fw-semibold mb-1">Notifications</h5>
        <p className="small mb-0" style={{ color: "var(--df-text-muted)" }}>
          Control when and how the clinic sends alerts.
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner size="sm" />
        </div>
      )}
      {error && <Alert color="danger">{error}</Alert>}

      {!loading && settings && (
        <Card>
          <CardBody className="p-0">
            {TOGGLES.map(({ key, label, desc }, i) => (
              <div
                key={key}
                className="d-flex align-items-center justify-content-between px-4 py-3"
                style={{
                  borderBottom:
                    i < TOGGLES.length - 1
                      ? "1px solid var(--df-border)"
                      : "none",
                }}
              >
                <div>
                  <p className="small fw-medium mb-0">{label}</p>
                  <p
                    className="small mb-0"
                    style={{ color: "var(--df-text-muted)" }}
                  >
                    {desc}
                  </p>
                </div>
                <div className="form-check form-switch mb-0 ms-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    disabled={!isOwner}
                    checked={settings[key] as boolean}
                    onChange={(e) => onSettingToggle(key, e.target.checked)}
                    style={{
                      cursor: isOwner ? "pointer" : "default",
                      width: 40,
                      height: 22,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
