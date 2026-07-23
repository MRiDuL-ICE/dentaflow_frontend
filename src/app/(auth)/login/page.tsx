"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Alert,
  Spinner,
} from "reactstrap";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/lib/store/auth.store";
import Link from "next/link";
import Image from "next/image";

type Step = "email" | "clinic-select" | "password";

interface ClinicOption {
  name: string;
  slug: string;
}

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("from") ?? "";
  const { setAuth, setClinicSlug } = useAuthStore();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clinics, setClinics] = useState<ClinicOption[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  // Step 1 — resolve clinic from email
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.resolveClinic(email);
      const found = (res.data as { data: ClinicOption[] }).data;

      if (!found.length) {
        setError("No clinic account found for this email.");
        return;
      }

      setClinics(found);

      if (found.length === 1) {
        setSelectedSlug(found[0].slug);
        setClinicSlug(found[0].slug);
        setStep("password");
      } else {
        setStep("clinic-select");
      }
    } catch {
      setError("Could not resolve clinic. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2 — select clinic (if multiple)
  function handleClinicSelect(slug: string) {
    setSelectedSlug(slug);
    setClinicSlug(slug);
    setStep("password");
  }

  // Step 3 — login with password
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.login(email, password);
      const { user, tokens } = (
        res.data as {
          data: {
            user: ReturnType<typeof useAuthStore.getState>["user"];
            tokens: { accessToken: string; refreshToken: string };
          };
        }
      ).data;

      setAuth({
        user: user!,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        clinicSlug: selectedSlug,
      });

      const destination = redirectTo || `/clinic/${selectedSlug}/dashboard`;
      router.replace(destination);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Magic link request
  async function handleMagicLink() {
    setLoading(true);
    setError("");

    try {
      await authApi.requestMagicLink(email, selectedSlug);
      setMagicSent(true);
    } catch {
      setError("Failed to send magic link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBackToEmail() {
    setStep("email");
    setPassword("");
    setError("");
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "var(--df-bg)" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={6} lg={5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Logo */}
              <div className="text-center mb-4">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={160}
                  height={130}
                  className="mb-3"
                  unoptimized
                />
                <p style={{ color: "var(--df-text-secondary)" }}>
                  Sign in to your clinic
                </p>
              </div>

              <Card>
                <CardBody className="p-4">
                  {error && (
                    <Alert
                      color="danger"
                      className="mb-3"
                      toggle={() => setError("")}
                    >
                      {error}
                    </Alert>
                  )}

                  {magicSent ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-3"
                    >
                      <div style={{ fontSize: 48 }}>📧</div>
                      <h5 className="mt-3">Check your email</h5>
                      <p style={{ color: "var(--df-text-secondary)" }}>
                        We sent a magic link to <strong>{email}</strong>
                      </p>
                      <Button color="link" onClick={() => setMagicSent(false)}>
                        Use password instead
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      {/* Step 1 — Email */}
                      {step === "email" && (
                        <Form onSubmit={handleEmailSubmit}>
                          <FormGroup>
                            <Label>Email address</Label>
                            <Input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              required
                              autoFocus
                              autoComplete="email"
                            />
                          </FormGroup>
                          <Button
                            color="primary"
                            type="submit"
                            className="w-100"
                            disabled={loading || !email}
                          >
                            {loading ? <Spinner size="sm" /> : "Continue"}
                          </Button>
                        </Form>
                      )}

                      {/* Step 2 — Clinic select */}
                      {step === "clinic-select" && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <p className="mb-3">Select your clinic:</p>
                          {clinics.map((c) => (
                            <Button
                              key={c.slug}
                              color="outline-primary"
                              className="w-100 mb-2 text-start"
                              onClick={() => handleClinicSelect(c.slug)}
                            >
                              🏥 {c.name}
                            </Button>
                          ))}
                          <Button
                            color="link"
                            className="w-100 text-primary"
                            onClick={() => setStep("email")}
                          >
                            ← Back
                          </Button>
                        </motion.div>
                      )}

                      {/* Step 3 — Password */}
                      {step === "password" && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <p
                            className="mb-3 small"
                            style={{ color: "var(--df-text-secondary)" }}
                          >
                            Signing in as <strong>{email}</strong>
                            {selectedSlug && (
                              <>
                                {" "}
                                to <strong>{selectedSlug}</strong>
                              </>
                            )}
                          </p>
                          <Form onSubmit={handlePasswordLogin}>
                            <FormGroup>
                              <Label>Password</Label>
                              <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Your password"
                                required
                                autoFocus
                                autoComplete="current-password"
                              />
                            </FormGroup>
                            <Button
                              color="primary"
                              type="submit"
                              className="w-100 mb-2"
                              disabled={loading || !password}
                            >
                              {loading ? <Spinner size="sm" /> : "Sign In"}
                            </Button>
                            <Button
                              color="outline-secondary"
                              className="btn-outline w-100 mb-2"
                              type="button"
                              onClick={handleMagicLink}
                              disabled={loading}
                            >
                              Send magic link instead
                            </Button>
                            <Button
                              color="link"
                              className="w-100 text-primary"
                              type="button"
                              onClick={handleBackToEmail}
                            >
                              ← Back
                            </Button>
                          </Form>
                        </motion.div>
                      )}
                    </>
                  )}
                </CardBody>
              </Card>
              <p
                className="text-center mt-3 small"
                style={{ color: "var(--df-text-muted)" }}
              >
                Super admin?{" "}
                <Link href="/super-admin/login" className="text-primary">
                  Admin login
                </Link>
              </p>

              <span
                className="d-block text-center my-3"
                style={{ color: "var(--df-text-muted)" }}
              >
                OR
              </span>

              <p
                className="text-center mt-3 small"
                style={{ color: "var(--df-text-muted)" }}
              >
                Are you a clinic owner?{" "}
                <Link className="text-primary" href="/clinic/register">
                  Register your clinic
                </Link>
              </p>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
