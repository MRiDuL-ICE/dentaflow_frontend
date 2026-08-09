"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import apiClient from "@/lib/api/client";
import Image from "next/image";

type Step = 1 | 2;

interface ClinicFormData {
  clinicName: string;
  slug: string;
}

interface OwnerFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirm: string;
}

// Auto-generate slug from clinic name
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: "Clinic Info" },
    { n: 2, label: "Owner Account" },
  ];

  return (
    <div className="d-flex align-items-center justify-content-center mb-4 gap-3">
      {steps.map((s, i) => (
        <div key={s.n} className="d-flex align-items-center gap-3">
          <div className="d-flex flex-column align-items-center gap-1">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background:
                  current >= s.n ? "var(--df-primary)" : "var(--df-border)",
                color: current >= s.n ? "#fff" : "var(--df-text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 13,
                transition: "all 0.3s ease",
              }}
            >
              {current > s.n ? "✓" : s.n}
            </div>
            <span
              style={{
                fontSize: 11,
                color:
                  current >= s.n ? "var(--df-primary)" : "var(--df-text-muted)",
                fontWeight: current === s.n ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </span>
          </div>

          {/* Connector line */}
          {i < steps.length - 1 && (
            <div
              style={{
                width: 60,
                height: 2,
                background:
                  current > s.n ? "var(--df-primary)" : "var(--df-border)",
                marginBottom: 18,
                transition: "background 0.3s ease",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function RegisterClinicPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const [clinicData, setClinicData] = useState<ClinicFormData>({
    clinicName: "",
    slug: "",
  });

  const [ownerData, setOwnerData] = useState<OwnerFormData>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirm: "",
  });

  // Step 1 — clinic info
  function handleStep1(e: React.FormEvent) {
    e.preventDefault();

    if (!clinicData.slug.match(/^[a-z0-9-]+$/)) {
      toast.error(
        "Slug can only contain lowercase letters, numbers and hyphens.",
      );
      return;
    }
    if (clinicData.slug.length < 3) {
      toast.error("Slug must be at least 3 characters.");
      return;
    }

    setStep(2);
  }

  // Step 2 — submit registration
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (ownerData.password !== ownerData.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (ownerData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your clinic...");

    try {
      await apiClient.post("/clinics/register", {
        clinicName: clinicData.clinicName,
        slug: clinicData.slug,
        email: ownerData.email,
        firstName: ownerData.firstName,
        lastName: ownerData.lastName,
        password: ownerData.password,
      });

      toast.success("Clinic registered! You can now sign in.", {
        id: toastId,
        duration: 4000,
      });

      setTimeout(() => {
        router.replace(`/login/${clinicData.slug}`);
      }, 1000);
    } catch (err: unknown) {
      const msg = (
        err as {
          response?: { data?: { message?: string } };
        }
      )?.response?.data?.message;

      toast.error(msg ?? "Registration failed. Please try again.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ background: "var(--df-bg)" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={7} lg={6} xl={5}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Brand */}
              <div className="text-center mb-4">
                <Image
                  src="/logo.png"
                  alt="Dentistry"
                  width={120}
                  height={120}
                />
                <p
                  className="small mb-0"
                  style={{ color: "var(--df-text-secondary)" }}
                >
                  Register your dental clinic
                </p>
              </div>

              <Card>
                <CardBody className="p-4">
                  <StepIndicator current={step} />

                  <AnimatePresence mode="wait">
                    {/* ── Step 1: Clinic Info ── */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Form onSubmit={handleStep1}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Clinic Name
                            </Label>
                            <Input
                              type="text"
                              value={clinicData.clinicName}
                              onChange={(e) => {
                                const name = e.target.value;
                                setClinicData({
                                  clinicName: name,
                                  slug: toSlug(name),
                                });
                              }}
                              placeholder="Bright Smile Dental"
                              required
                              autoFocus
                            />
                          </FormGroup>

                          <FormGroup>
                            <Label className="small fw-medium">
                              Clinic URL Slug
                            </Label>
                            <div
                              className="d-flex align-items-center"
                              style={{
                                border: "1px solid var(--df-border)",
                                borderRadius: "var(--df-radius)",
                                overflow: "hidden",
                              }}
                            >
                              <span
                                className="px-3 small"
                                style={{
                                  background: "var(--df-bg)",
                                  color: "var(--df-text-muted)",
                                  borderRight: "1px solid var(--df-border)",
                                  height: 38,
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                dentaflow.com/
                              </span>
                              <Input
                                type="text"
                                value={clinicData.slug}
                                onChange={(e) =>
                                  setClinicData((d) => ({
                                    ...d,
                                    slug: toSlug(e.target.value),
                                  }))
                                }
                                placeholder="bright-smile"
                                required
                                style={{
                                  border: "none",
                                  borderRadius: 0,
                                }}
                              />
                            </div>
                            <p
                              className="small mt-1 mb-0"
                              style={{ color: "var(--df-text-muted)" }}
                            >
                              Lowercase letters, numbers and hyphens only. This
                              is your clinic's unique identifier.
                            </p>
                          </FormGroup>

                          <Button
                            color="primary"
                            type="submit"
                            className="w-100"
                            disabled={
                              !clinicData.clinicName || !clinicData.slug
                            }
                          >
                            Continue →
                          </Button>
                        </Form>
                      </motion.div>
                    )}

                    {/* ── Step 2: Owner Account ── */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Clinic summary pill */}
                        <div
                          className="mb-3 px-3 py-2 rounded small"
                          style={{
                            background: "var(--df-primary-light)",
                            color: "var(--df-primary-dark)",
                          }}
                        >
                          🏥 <strong>{clinicData.clinicName}</strong>
                          <span
                            style={{ color: "var(--df-text-muted)" }}
                            className="ms-2"
                          >
                            /{clinicData.slug}
                          </span>
                        </div>

                        <Form onSubmit={handleSubmit}>
                          <Row>
                            <Col xs={6}>
                              <FormGroup>
                                <Label className="small fw-medium">
                                  First Name
                                </Label>
                                <Input
                                  type="text"
                                  value={ownerData.firstName}
                                  onChange={(e) =>
                                    setOwnerData((d) => ({
                                      ...d,
                                      firstName: e.target.value,
                                    }))
                                  }
                                  required
                                  autoFocus
                                />
                              </FormGroup>
                            </Col>
                            <Col xs={6}>
                              <FormGroup>
                                <Label className="small fw-medium">
                                  Last Name
                                </Label>
                                <Input
                                  type="text"
                                  value={ownerData.lastName}
                                  onChange={(e) =>
                                    setOwnerData((d) => ({
                                      ...d,
                                      lastName: e.target.value,
                                    }))
                                  }
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </Row>

                          <FormGroup>
                            <Label className="small fw-medium">Email</Label>
                            <Input
                              type="email"
                              value={ownerData.email}
                              onChange={(e) =>
                                setOwnerData((d) => ({
                                  ...d,
                                  email: e.target.value,
                                }))
                              }
                              required
                              autoComplete="email"
                            />
                          </FormGroup>

                          <FormGroup>
                            <Label className="small fw-medium">Password</Label>
                            <Input
                              type="password"
                              value={ownerData.password}
                              onChange={(e) =>
                                setOwnerData((d) => ({
                                  ...d,
                                  password: e.target.value,
                                }))
                              }
                              required
                              minLength={8}
                              autoComplete="new-password"
                            />
                          </FormGroup>

                          <FormGroup>
                            <Label className="small fw-medium">
                              Confirm Password
                            </Label>
                            <Input
                              type="password"
                              value={ownerData.confirm}
                              onChange={(e) =>
                                setOwnerData((d) => ({
                                  ...d,
                                  confirm: e.target.value,
                                }))
                              }
                              required
                              autoComplete="new-password"
                              style={{
                                borderColor:
                                  ownerData.confirm &&
                                  ownerData.password !== ownerData.confirm
                                    ? "#EF4444"
                                    : undefined,
                              }}
                            />
                            {ownerData.confirm &&
                              ownerData.password !== ownerData.confirm && (
                                <p
                                  className="small mt-1 mb-0"
                                  style={{ color: "#EF4444" }}
                                >
                                  Passwords do not match
                                </p>
                              )}
                          </FormGroup>

                          <div className="d-flex gap-2">
                            <Button
                              color="outline-secondary"
                              type="button"
                              onClick={() => setStep(1)}
                              disabled={loading}
                            >
                              ← Back
                            </Button>
                            <Button
                              color="primary"
                              type="submit"
                              className="flex-grow-1"
                              disabled={
                                loading ||
                                !ownerData.email ||
                                !ownerData.firstName ||
                                !ownerData.lastName ||
                                !ownerData.password ||
                                ownerData.password !== ownerData.confirm
                              }
                            >
                              {loading ? (
                                <>
                                  <Spinner size="sm" className="me-2" />
                                  Creating...
                                </>
                              ) : (
                                "🚀 Create Clinic"
                              )}
                            </Button>
                          </div>
                        </Form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardBody>
              </Card>

              <p
                className="text-center mt-3 small"
                style={{ color: "var(--df-text-muted)" }}
              >
                Already have an account?{" "}
                <Link href="/login" style={{ color: "var(--df-primary)" }}>
                  Sign in
                </Link>
              </p>
              <p
                className="text-center mt-3 small"
                style={{ color: "var(--df-text-muted)" }}
              >
                Register as a clinic members?{" "}
                <Link
                  href="/clinic/register/members"
                  style={{ color: "var(--df-primary)" }}
                >
                  Members register
                </Link>
              </p>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
