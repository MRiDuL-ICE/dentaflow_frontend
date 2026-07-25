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
  Spinner,
} from "reactstrap";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/lib/store/auth.store";
import Image from "next/image";
import Link from "next/link";
import StepProgressBar from "@/components/layout/StepProgressBar";

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
  const [magicSent, setMagicSent] = useState(false);

  // ── Step 1: resolve clinic from email ─────────────────
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.resolveClinic(email);
      const found = (res.data as { data: ClinicOption[] }).data;

      if (!found.length) {
        toast.error("No clinic account found for this email.");
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
      toast.error("Could not resolve clinic. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: select clinic ──────────────────────────────
  function handleClinicSelect(slug: string) {
    setSelectedSlug(slug);
    setClinicSlug(slug);
    setStep("password");
  }

  // ── Step 3: password login ─────────────────────────────
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Signing in...");

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

      toast.success(`Welcome back, ${user!.firstName}!`, { id: toastId });

      const destination = redirectTo || `/clinic/${selectedSlug}/dashboard`;

      // Small delay so toast is visible before redirect
      setTimeout(() => router.replace(destination), 800);
    } catch (err: unknown) {
      const msg = (
        err as {
          response?: { data?: { message?: string } };
        }
      )?.response?.data?.message;

      toast.error(msg ?? "Login failed. Check your credentials.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  }

  // ── Magic link ─────────────────────────────────────────
  async function handleMagicLink() {
    setLoading(true);
    const toastId = toast.loading("Sending magic link...");

    try {
      await authApi.requestMagicLink(email, selectedSlug);
      setMagicSent(true);
      toast.success("Magic link sent! Check your email.", { id: toastId });
    } catch {
      toast.error("Failed to send magic link.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "var(--df-bg)" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={6} lg={5} xl={4}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Logo */}
              <div className="text-center mb-4">
                <Image
                  src="/logo.png"
                  alt="DentaFlow"
                  width={160}
                  height={130}
                  unoptimized
                />
                <p
                  className="small mt-2 mb-0"
                  style={{ color: "var(--df-text-secondary)" }}
                >
                  Sign in to your clinic
                </p>
              </div>

              <Card>
                <CardBody className="p-4">
                  {/* Progress bar — hidden on magic-sent screen */}
                  {!magicSent && <StepProgressBar current={step} />}

                  <AnimatePresence mode="wait">
                    {/* ── Magic link sent ── */}
                    {magicSent && (
                      <motion.div
                        key="magic-sent"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-2"
                      >
                        <div style={{ fontSize: 52 }}>📧</div>
                        <h5 className="mt-3 fw-semibold">Check your email</h5>
                        <p
                          className="small"
                          style={{ color: "var(--df-text-secondary)" }}
                        >
                          We sent a magic link to <strong>{email}</strong>
                        </p>
                        <Button
                          color="link"
                          size="sm"
                          onClick={() => setMagicSent(false)}
                        >
                          Use password instead
                        </Button>
                      </motion.div>
                    )}

                    {/* ── Step 1: Email ── */}
                    {!magicSent && step === "email" && (
                      <motion.div
                        key="email"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Form onSubmit={handleEmailSubmit}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Email address
                            </Label>
                            <Input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@clinic.com"
                              required
                              autoFocus
                              autoComplete="email"
                              disabled={loading}
                            />
                          </FormGroup>
                          <Button
                            color="primary"
                            type="submit"
                            className="w-100"
                            disabled={loading || !email.trim()}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" className="me-2" />
                                Checking...
                              </>
                            ) : (
                              "Continue →"
                            )}
                          </Button>
                        </Form>
                      </motion.div>
                    )}

                    {/* ── Step 2: Clinic select ── */}
                    {!magicSent && step === "clinic-select" && (
                      <motion.div
                        key="clinic-select"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p
                          className="small mb-3"
                          style={{ color: "var(--df-text-secondary)" }}
                        >
                          Multiple clinics found for <strong>{email}</strong>.
                          Select one:
                        </p>

                        <div className="d-flex flex-column gap-2 mb-3">
                          {clinics.map((c) => (
                            <button
                              key={c.slug}
                              type="button"
                              className="btn btn-outline-primary text-start"
                              onClick={() => handleClinicSelect(c.slug)}
                            >
                              🏥 {c.name}
                            </button>
                          ))}
                        </div>

                        <Button
                          color="link"
                          size="sm"
                          className="p-0"
                          onClick={() => setStep("email")}
                        >
                          ← Back
                        </Button>
                      </motion.div>
                    )}

                    {/* ── Step 3: Password ── */}
                    {!magicSent && step === "password" && (
                      <motion.div
                        key="password"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Context pill */}
                        <div
                          className="mb-3 px-3 py-2 rounded small d-flex
                                     align-items-center gap-2"
                          style={{
                            background: "var(--df-primary-light)",
                            color: "var(--df-primary-dark)",
                          }}
                        >
                          <span>🏥</span>
                          <span>
                            <strong>{email}</strong>
                            {selectedSlug && <> · {selectedSlug}</>}
                          </span>
                        </div>

                        <Form onSubmit={handlePasswordLogin}>
                          <FormGroup>
                            <div
                              className="d-flex justify-content-between
                                            align-items-center mb-1"
                            >
                              <Label className="small fw-medium mb-0">
                                Password
                              </Label>
                            </div>
                            <Input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Your password"
                              required
                              autoFocus
                              autoComplete="current-password"
                              disabled={loading}
                            />
                          </FormGroup>

                          <Button
                            color="primary"
                            type="submit"
                            className="w-100 mb-2"
                            disabled={loading || !password}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" className="me-2" />
                                Signing in...
                              </>
                            ) : (
                              "Sign In"
                            )}
                          </Button>

                          <Button
                            color="outline-secondary"
                            className="w-100 mb-3"
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
                            onClick={() => {
                              setStep("email");
                              setPassword("");
                            }}
                          >
                            ← Back
                          </Button>
                        </Form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardBody>
              </Card>

              {/* Footer links */}
              <div className="text-center mt-3">
                <p
                  className="small mb-1"
                  style={{ color: "var(--df-text-muted)" }}
                >
                  Super admin?{" "}
                  <Link
                    href="/super-admin/login"
                    style={{ color: "var(--df-primary)" }}
                  >
                    Admin login
                  </Link>
                </p>
                <p
                  className="small mb-0"
                  style={{ color: "var(--df-text-muted)" }}
                >
                  Clinic owner?{" "}
                  <Link
                    href="/clinic/register"
                    style={{ color: "var(--df-primary)" }}
                  >
                    Register your clinic
                  </Link>
                </p>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
