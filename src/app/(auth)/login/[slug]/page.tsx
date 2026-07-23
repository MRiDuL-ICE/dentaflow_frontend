"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { authApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/store/auth.store";
import Image from "next/image";

export default function SlugLoginPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { setAuth, setClinicSlug } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      setClinicSlug(slug);
      const res = await authApi.login(email, password);
      const { user, tokens } = (res as any).data.data;

      setAuth({
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        clinicSlug: slug,
      });

      router.push(`/clinic/${slug}/dashboard`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed");
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
          <Col xs={12} sm={10} md={6} lg={5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-4">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  className="mb-3"
                  width={100}
                  height={100}
                />
                <p style={{ color: "var(--df-text-secondary)" }}>
                  Sign in to your account
                </p>
              </div>

              <Card>
                <CardBody className="p-4">
                  {error && <Alert color="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </FormGroup>
                    <Button
                      color="primary"
                      type="submit"
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? <Spinner size="sm" /> : "Sign In"}
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
