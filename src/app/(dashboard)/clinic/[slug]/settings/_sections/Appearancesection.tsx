"use client";

import {
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from "reactstrap";
import type { Settings } from "../page";

interface AppearanceSectionProps {
  settings: Settings | null;
  loading: boolean;
  error: string;
  isOwner: boolean;
  onSettingChange: (key: keyof Settings, value: string) => void;
}

const THEMES = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "system", label: "System", icon: "💻" },
] as const;

export function AppearanceSection({
  settings,
  loading,
  error,
  isOwner,
  onSettingChange,
}: AppearanceSectionProps) {
  return (
    <div style={{ maxWidth: 420 }}>
      <div className="mb-4">
        <h5 className="fw-semibold mb-1">Appearance</h5>
        <p className="small mb-0" style={{ color: "var(--df-text-muted)" }}>
          Theme and language preferences.
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
            <FormGroup className="mb-4">
              <Label className="small fw-medium mb-2">Theme</Label>
              <div className="d-flex gap-2">
                {THEMES.map(({ value, label, icon }) => {
                  const active = settings.appearance_theme === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={!isOwner}
                      onClick={() => onSettingChange("appearance_theme", value)}
                      style={{
                        padding: "6px 16px",
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
                        cursor: isOwner ? "pointer" : "default",
                        transition: "all 0.15s",
                      }}
                    >
                      {icon} {label}
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
                  onSettingChange("appearance_language", e.target.value)
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
      )}
    </div>
  );
}
