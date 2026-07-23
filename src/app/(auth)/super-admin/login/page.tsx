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
  Alert,
  Spinner,
} from "reactstrap";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth.store";
import { superAdminApi } from "@/lib/api/endpoints/auth";
import Link from "next/link";
import Image from "next/image";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await superAdminApi.login(email, password);
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
      });

      router.replace("/super-admin/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Login failed.");
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
          <Col xs={12} sm={8} md={5} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-center mb-4">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={160}
                  height={130}
                  className="mb-3"
                  unoptimized
                />
                <p
                  className="small mb-0"
                  style={{ color: "var(--df-text-secondary)" }}
                >
                  Super Admin Portal
                </p>
              </div>

              <Card>
                <CardBody className="p-4">
                  {error && (
                    <Alert
                      color="danger"
                      className="mb-3 py-2 small"
                      toggle={() => setError("")}
                    >
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label className="small fw-medium">Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                        autoComplete="email"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="small fw-medium">Password</Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                    </FormGroup>
                    <Button
                      color="primary"
                      className="w-100"
                      type="submit"
                      disabled={loading || !email || !password}
                    >
                      {loading ? <Spinner size="sm" /> : "Sign In"}
                    </Button>
                  </Form>
                </CardBody>
              </Card>

              <p
                className="text-center mt-3 small"
                style={{ color: "var(--df-text-muted)" }}
              >
                <Link href="/login" className="text-primary">
                  ← Back to clinic login
                </Link>
              </p>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
