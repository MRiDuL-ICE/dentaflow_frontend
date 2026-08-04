"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import type { Settings } from "../page";

interface AppointmentsSectionProps {
  settings: Settings | null;
  loading: boolean;
  error: string;
  isOwner: boolean;
  onChange: (updated: Settings) => void;
  onSave: (settings: Settings) => Promise<void>;
}

export function AppointmentsSection({
  settings,
  loading,
  error,
  isOwner,
  onChange,
  onSave,
}: AppointmentsSectionProps) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMsg("");
    setSaveErr("");
    try {
      await onSave(settings);
      setMsg("Appointment settings saved.");
    } catch {
      setSaveErr("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const update = (patch: Partial<Settings>) => {
    if (!settings) return;
    onChange({ ...settings, ...patch });
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <div className="mb-4">
        <h5 className="fw-semibold mb-1">Appointments</h5>
        <p className="small mb-0" style={{ color: "var(--df-text-muted)" }}>
          Default scheduling rules for this clinic.
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
                    update({ appt_default_duration: Number(e.target.value) })
                  }
                  style={{ maxWidth: 100 }}
                />
                <span
                  className="small"
                  style={{ color: "var(--df-text-muted)" }}
                >
                  minutes
                </span>
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
                  update({ appt_slot_interval: Number(e.target.value) })
                }
                style={{ maxWidth: 140 }}
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
                  onChange={(e) => update({ appt_start_time: e.target.value })}
                  style={{ width: 130 }}
                />
                <span
                  className="small"
                  style={{ color: "var(--df-text-muted)" }}
                >
                  to
                </span>
                <Input
                  type="time"
                  bsSize="sm"
                  disabled={!isOwner}
                  value={settings.appt_end_time}
                  onChange={(e) => update({ appt_end_time: e.target.value })}
                  style={{ width: 130 }}
                />
              </div>
            </FormGroup>

            {msg && (
              <Alert color="success" className="py-2 small">
                {msg}
              </Alert>
            )}
            {saveErr && (
              <Alert color="danger" className="py-2 small">
                {saveErr}
              </Alert>
            )}

            {isOwner && (
              <Button
                color="primary"
                size="sm"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? <Spinner size="sm" /> : "Save Changes"}
              </Button>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
