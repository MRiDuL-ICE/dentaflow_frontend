"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import { clinicSettingsApi } from "@/lib/api/endpoints/clinic-settings";
import { useAuthStore } from "@/lib/store/auth.store";
import { useThemeStore } from "@/lib/store/theme.store";

type Settings = {
  notify_email: boolean;
  notify_sms: boolean;
  notify_appointment_reminder: boolean;
  notify_appointment_confirm: boolean;
  notify_billing: boolean;
  appearance_theme: "light" | "dark" | "system";
  appearance_language: string;
  appt_default_duration: number;
  appt_slot_interval: number;
  appt_start_time: string;
  appt_end_time: string;
};

const FIELD_MAP: Record<string, string> = {
  notify_email: "notifyEmail",
  notify_sms: "notifySms",
  notify_appointment_reminder: "notifyAppointmentReminder",
  notify_appointment_confirm: "notifyAppointmentConfirm",
  notify_billing: "notifyBilling",
  appearance_theme: "appearanceTheme",
  appearance_language: "appearanceLanguage",
  appt_default_duration: "apptDefaultDuration",
  appt_slot_interval: "apptSlotInterval",
  appt_start_time: "apptStartTime",
  appt_end_time: "apptEndTime",
};

const NOTIFY_ROWS: { key: keyof Settings; label: string; desc: string }[] = [
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

export function SystemSection() {
  const { hasRole } = useAuthStore();
  const { setTheme } = useThemeStore();
  const isOwner = hasRole("clinic_owner");

  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [apptSaving, setApptSaving] = useState(false);
  const [apptMsg, setApptMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await clinicSettingsApi.get();
      setSettings(res.data);
    } catch {
      setErr("Could not load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (key: keyof Settings, value: boolean | string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    try {
      await clinicSettingsApi.update({ [FIELD_MAP[key]]: value });
      if (
        key === "appearance_theme" &&
        typeof value === "string" &&
        value !== "system"
      ) {
        setTheme(value as "light" | "dark");
      }
    } catch {
      load();
    }
  };

  const handleSaveAppt = async () => {
    if (!settings) return;
    setApptSaving(true);
    setApptMsg("");
    try {
      await clinicSettingsApi.update({
        apptDefaultDuration: settings.appt_default_duration,
        apptSlotInterval: settings.appt_slot_interval,
        apptStartTime: settings.appt_start_time,
        apptEndTime: settings.appt_end_time,
      });
      setApptMsg("Saved.");
    } catch {
      setErr("Failed to save.");
    } finally {
      setApptSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner size="sm" />
      </div>
    );
  if (err) return <Alert color="danger">{err}</Alert>;
  if (!settings) return null;

  return (
    <div className="d-flex flex-column gap-4" style={{ maxWidth: 560 }}>
      {/* ── Notifications ── */}
      <div>
        <h6 className="fw-semibold mb-1" style={{ fontSize: 13 }}>
          Notifications
        </h6>
        <p className="small text-muted mb-3">
          Control when and how the clinic sends alerts.
        </p>
        <Card>
          <CardBody className="p-0">
            {NOTIFY_ROWS.map(({ key, label, desc }, i) => (
              <div
                key={key}
                className="d-flex align-items-center justify-content-between px-4 py-3"
                style={{
                  borderBottom:
                    i < NOTIFY_ROWS.length - 1
                      ? "1px solid var(--df-border)"
                      : "none",
                }}
              >
                <div>
                  <div className="small fw-medium">{label}</div>
                  <div
                    className="small"
                    style={{ color: "var(--df-text-muted)" }}
                  >
                    {desc}
                  </div>
                </div>
                <div className="form-check form-switch mb-0 ms-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    disabled={!isOwner}
                    checked={settings[key] as boolean}
                    onChange={(e) => handleToggle(key, e.target.checked)}
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
      </div>

      {/* ── Appointment defaults ── */}
      <div>
        <h6 className="fw-semibold mb-1" style={{ fontSize: 13 }}>
          Appointment Defaults
        </h6>
        <p className="small text-muted mb-3">
          Default scheduling rules for this clinic.
        </p>
        <Card>
          <CardBody>
            <FormGroup>
              <Label className="small fw-medium">
                Default appointment duration
              </Label>
              <div className="d-flex align-items-center gap-2">
                <Input
                  type="number"
                  bsSize="sm"
                  min={5}
                  max={240}
                  disabled={!isOwner}
                  value={settings.appt_default_duration}
                  onChange={(e) =>
                    setSettings((p) =>
                      p
                        ? {
                            ...p,
                            appt_default_duration: Number(e.target.value),
                          }
                        : p,
                    )
                  }
                  style={{ maxWidth: 100 }}
                />
                <span className="small text-muted">minutes</span>
              </div>
            </FormGroup>
            <FormGroup>
              <Label className="small fw-medium">Slot interval</Label>
              <Input
                type="select"
                bsSize="sm"
                disabled={!isOwner}
                value={settings.appt_slot_interval}
                onChange={(e) =>
                  setSettings((p) =>
                    p
                      ? { ...p, appt_slot_interval: Number(e.target.value) }
                      : p,
                  )
                }
                style={{ maxWidth: 150 }}
              >
                {[5, 10, 15, 20, 30, 60].map((v) => (
                  <option key={v} value={v}>
                    {v} minutes
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup className="mb-4">
              <Label className="small fw-medium">Working hours</Label>
              <div className="d-flex align-items-center gap-2">
                <Input
                  type="time"
                  bsSize="sm"
                  disabled={!isOwner}
                  value={settings.appt_start_time}
                  onChange={(e) =>
                    setSettings((p) =>
                      p ? { ...p, appt_start_time: e.target.value } : p,
                    )
                  }
                  style={{ width: 130 }}
                />
                <span className="text-muted small">to</span>
                <Input
                  type="time"
                  bsSize="sm"
                  disabled={!isOwner}
                  value={settings.appt_end_time}
                  onChange={(e) =>
                    setSettings((p) =>
                      p ? { ...p, appt_end_time: e.target.value } : p,
                    )
                  }
                  style={{ width: 130 }}
                />
              </div>
            </FormGroup>
            {apptMsg && (
              <Alert color="success" className="py-1 small mb-3">
                {apptMsg}
              </Alert>
            )}
            {isOwner && (
              <Button
                color="primary"
                size="sm"
                disabled={apptSaving}
                onClick={handleSaveAppt}
              >
                {apptSaving ? <Spinner size="sm" /> : "Save Changes"}
              </Button>
            )}
          </CardBody>
        </Card>
      </div>

      {/* ── Appearance ── */}
      <div>
        <h6 className="fw-semibold mb-1" style={{ fontSize: 13 }}>
          Appearance
        </h6>
        <p className="small text-muted mb-3">Theme and language preferences.</p>
        <Card>
          <CardBody>
            <FormGroup className="mb-4">
              <Label className="small fw-medium mb-2 d-block">Theme</Label>
              <div className="d-flex gap-2">
                {(["light", "dark", "system"] as const).map((t) => {
                  const active = settings.appearance_theme === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={!isOwner}
                      onClick={() => handleToggle("appearance_theme", t)}
                      style={{
                        padding: "6px 14px",
                        border: `1px solid ${active ? "var(--df-primary)" : "var(--df-border)"}`,
                        borderRadius: 6,
                        background: active
                          ? "var(--df-primary-light)"
                          : "transparent",
                        color: active
                          ? "var(--df-primary)"
                          : "var(--df-text-secondary)",
                        fontWeight: active ? 600 : 400,
                        fontSize: 13,
                        textTransform: "capitalize",
                        cursor: isOwner ? "pointer" : "default",
                        transition: "all 0.15s",
                      }}
                    >
                      {t === "light"
                        ? "☀️ Light"
                        : t === "dark"
                          ? "🌙 Dark"
                          : "💻 System"}
                    </button>
                  );
                })}
              </div>
            </FormGroup>
            <FormGroup className="mb-0">
              <Label className="small fw-medium">Language</Label>
              <Input
                type="select"
                bsSize="sm"
                disabled={!isOwner}
                value={settings.appearance_language}
                onChange={(e) =>
                  handleToggle("appearance_language", e.target.value)
                }
                style={{ maxWidth: 200 }}
              >
                <option value="en">🇺🇸 English</option>
                <option value="bn">🇧🇩 Bengali</option>
                <option value="ar">🇸🇦 Arabic</option>
                <option value="fr">🇫🇷 French</option>
                <option value="es">🇪🇸 Spanish</option>
              </Input>
            </FormGroup>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
