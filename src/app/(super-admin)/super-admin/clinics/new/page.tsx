"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Progress,
} from "reactstrap";
import { superAdminApi } from "@/lib/api/endpoints";

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
};

const STEPS: { title: string; fields: Field[] }[] = [
  {
    title: "Clinic details",
    fields: [
      {
        name: "clinicName",
        label: "Clinic name",
        placeholder: "Bright Smile Dental",
      },
      { name: "slug", label: "URL slug", placeholder: "bright-smile" },
    ],
  },
  {
    title: "Owner account",
    fields: [
      { name: "ownerFirstName", label: "First name", placeholder: "Jane" },
      { name: "ownerLastName", label: "Last name", placeholder: "Doe" },
      {
        name: "ownerEmail",
        label: "Email",
        type: "email",
        placeholder: "jane@clinic.com",
      },
      {
        name: "ownerPassword",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
      },
    ],
  },
];

export default function NewClinicPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const update = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await superAdminApi.createClinic(form);
      router.push(`/super-admin/clinics/${res.data.slug}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to create clinic.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="df-page-header">
        <h5 className="mb-0 fw-semibold">New Clinic</h5>
      </div>

      <div className="p-4" style={{ maxWidth: 520 }}>
        {/* Step indicators */}
        <div className="d-flex gap-3 mb-2">
          {STEPS.map((s, i) => (
            <div key={i} className="d-flex align-items-center gap-2">
              <span
                className="d-flex align-items-center justify-content-center rounded-circle fw-semibold"
                style={{
                  width: 26,
                  height: 26,
                  fontSize: 12,
                  background:
                    i <= step ? "var(--df-primary)" : "var(--df-border)",
                  color: i <= step ? "#fff" : "var(--df-text-muted)",
                }}
              >
                {i + 1}
              </span>
              <span
                className="small"
                style={{
                  color:
                    i === step
                      ? "var(--df-text-primary)"
                      : "var(--df-text-muted)",
                  fontWeight: i === step ? 600 : 400,
                }}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="mb-4" style={{ height: 3 }} />

        <div className="card p-4">
          <Form onSubmit={handleNext}>
            {current.fields.map((f) => (
              <FormGroup key={f.name}>
                <Label>{f.label}</Label>
                <Input
                  type={(f.type ?? "text") as any}
                  required
                  placeholder={f.placeholder}
                  value={form[f.name] ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                />
              </FormGroup>
            ))}

            {error && (
              <Alert color="danger" className="py-2">
                {error}
              </Alert>
            )}

            <div className="d-flex gap-2 mt-2">
              {step > 0 && (
                <Button
                  type="button"
                  outline
                  onClick={() => setStep((s) => s - 1)}
                >
                  ← Back
                </Button>
              )}
              <Button
                type="submit"
                color="primary"
                disabled={submitting}
                className="flex-grow-1"
              >
                {isLast
                  ? submitting
                    ? "Creating…"
                    : "Create Clinic"
                  : "Next →"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
