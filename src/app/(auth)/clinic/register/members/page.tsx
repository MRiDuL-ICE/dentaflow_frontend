// app/register/members/page.tsx
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
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { CLINIC_MEMBER_ROLES } from "@/lib/constants/roles";
import { authApi } from "@/lib/api/endpoints";

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface MemberFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  roleId: number;
}

export default function RegisterMemberPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MemberFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    roleId: CLINIC_MEMBER_ROLES[0].id,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      await authApi.register({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        roleId: formData.roleId,
      });

      toast.success("Account created! You can now sign in.", {
        id: toastId,
        duration: 4000,
      });

      setTimeout(() => {
        router.replace(`/login`);
      }, 1000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;

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
                  Join your clinic on DentaFlow
                </p>
              </div>

              <Card>
                <CardBody className="p-4">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col xs={6}>
                        <FormGroup>
                          <Label className="small fw-medium">First Name</Label>
                          <Input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData((d) => ({
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
                          <Label className="small fw-medium">Last Name</Label>
                          <Input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData((d) => ({
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
                      <Label className="small fw-medium">Role</Label>
                      <Input
                        type="select"
                        value={formData.roleId}
                        onChange={(e) =>
                          setFormData((d) => ({
                            ...d,
                            roleId: Number(e.target.value),
                          }))
                        }
                        required
                      >
                        {CLINIC_MEMBER_ROLES.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                      <Label className="small fw-medium">Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((d) => ({ ...d, email: e.target.value }))
                        }
                        required
                        autoComplete="email"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label className="small fw-medium">Password</Label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((d) => ({
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
                        value={formData.confirm}
                        onChange={(e) =>
                          setFormData((d) => ({
                            ...d,
                            confirm: e.target.value,
                          }))
                        }
                        required
                        autoComplete="new-password"
                        style={{
                          borderColor:
                            formData.confirm &&
                            formData.password !== formData.confirm
                              ? "#EF4444"
                              : undefined,
                        }}
                      />
                      {formData.confirm &&
                        formData.password !== formData.confirm && (
                          <p
                            className="small mt-1 mb-0"
                            style={{ color: "#EF4444" }}
                          >
                            Passwords do not match
                          </p>
                        )}
                    </FormGroup>

                    <Button
                      color="primary"
                      type="submit"
                      className="w-100"
                      disabled={
                        loading ||
                        !formData.email ||
                        !formData.firstName ||
                        !formData.lastName ||
                        !formData.password ||
                        formData.password !== formData.confirm
                      }
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Creating...
                        </>
                      ) : (
                        "Join Clinic"
                      )}
                    </Button>
                  </Form>
                </CardBody>
              </Card>

              <p
                className="text-center mt-3 small"
                style={{ color: "var(--df-text-muted)" }}
              >
                Registering a new clinic instead?{" "}
                <Link href="/register" style={{ color: "var(--df-primary)" }}>
                  Register a clinic
                </Link>
              </p>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
