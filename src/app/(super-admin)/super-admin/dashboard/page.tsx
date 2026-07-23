"use client";

import { Card, CardBody, Container } from "reactstrap";
import { useAuthStore } from "@/lib/store/auth.store";

export default function SuperAdminDashboardPage() {
  const { user, logout } = useAuthStore();
  const router = require("next/navigation").useRouter();

  return (
    <Container className="py-5">
      <h4 className="fw-bold mb-4">Super Admin Dashboard</h4>
      <Card>
        <CardBody>
          <p>
            Welcome,{" "}
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
          </p>
          <p style={{ color: "var(--df-text-secondary)" }}>
            Role: {user?.roles.join(", ")}
          </p>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
          >
            Logout
          </button>
        </CardBody>
      </Card>
    </Container>
  );
}
