"use client";

import { Row, Col, Card, CardBody, Badge, Spinner, Button } from "reactstrap";
import { motion } from "framer-motion";
import { FiCalendar, FiFileText, FiDollarSign, FiImage } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { portalApi } from "@/lib/api/endpoints";
import Link from "next/link";

export default function PortalDashboardPage() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["portal", "profile"],
    queryFn: async () => {
      const res = await portalApi.getProfile();
      return (res as any).data.data;
    },
  });

  const { data: appointments } = useQuery({
    queryKey: ["portal", "appointments"],
    queryFn: async () => {
      const res = await portalApi.getAppointments({ limit: 3 });
      return (res as any).data.data;
    },
  });

  const { data: invoices } = useQuery({
    queryKey: ["portal", "invoices"],
    queryFn: async () => {
      const res = await portalApi.getInvoices();
      return (res as any).data.data;
    },
  });

  if (profileLoading) {
    return (
      <div className="text-center py-5">
        <Spinner style={{ color: "var(--df-primary)" }} />
      </div>
    );
  }

  const upcomingAppts = ((appointments?.data ?? []) as any[])
    .filter(
      (a: any) =>
        new Date(a.scheduled_at) > new Date() &&
        ["scheduled", "confirmed"].includes(a.status),
    )
    .slice(0, 3);

  const unpaidInvoices = ((invoices ?? []) as any[]).filter(
    (i: any) => i.status !== "paid" && i.status !== "cancelled",
  );

  return (
    <div className="df-fade-in">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h4 className="fw-bold">
          Welcome back, {profile?.first_name ?? "Patient"} 👋
        </h4>
        <p style={{ color: "var(--df-text-secondary)" }}>
          Here's your health summary
        </p>
      </motion.div>

      {/* Quick stats */}
      <Row className="g-3 mb-4">
        {[
          {
            icon: <FiCalendar />,
            label: "Upcoming Appointments",
            value: upcomingAppts.length,
            color: "#3B82F6",
            href: "/portal/appointments",
          },
          {
            icon: <FiDollarSign />,
            label: "Unpaid Invoices",
            value: unpaidInvoices.length,
            color: "#EF4444",
            href: "/portal/invoices",
          },
          {
            icon: <FiImage />,
            label: "X-Rays",
            value: "—",
            color: "#8B5CF6",
            href: "/portal/records",
          },
          {
            icon: <FiFileText />,
            label: "Clinical Notes",
            value: "—",
            color: "#1D9E75",
            href: "/portal/records",
          },
        ].map((stat, i) => (
          <Col key={i} xs={12} sm={6} xl={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={stat.href} style={{ textDecoration: "none" }}>
                <div className="df-kpi-card">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: stat.color + "20",
                        color: stat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <div
                        className="small"
                        style={{ color: "var(--df-text-secondary)" }}
                      >
                        {stat.label}
                      </div>
                      <div className="fw-bold fs-4">{stat.value}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Upcoming appointments */}
      <Row className="g-3">
        <Col xs={12} lg={6}>
          <Card>
            <CardBody>
              <div
                className="d-flex align-items-center
                              justify-content-between mb-3"
              >
                <h6 className="fw-semibold mb-0">Upcoming Appointments</h6>
                <Link
                  href="/portal/appointments"
                  className="small"
                  style={{ color: "var(--df-primary)" }}
                >
                  View all →
                </Link>
              </div>

              {upcomingAppts.length === 0 ? (
                <p
                  className="small text-center py-3"
                  style={{ color: "var(--df-text-muted)" }}
                >
                  No upcoming appointments
                </p>
              ) : (
                upcomingAppts.map((appt: any) => (
                  <div
                    key={appt.id}
                    className="d-flex align-items-center
                               justify-content-between py-2"
                    style={{ borderBottom: "1px solid var(--df-border)" }}
                  >
                    <div>
                      <div className="fw-medium small">
                        {appt.treatment_type}
                      </div>
                      <div
                        className="small"
                        style={{ color: "var(--df-text-muted)" }}
                      >
                        {new Date(appt.scheduled_at).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>
                    <Badge color="primary">{appt.status}</Badge>
                  </div>
                ))
              )}

              <Button
                color="primary"
                className="w-100 mt-3"
                tag={Link}
                href="/portal/appointments"
              >
                Book New Appointment
              </Button>
            </CardBody>
          </Card>
        </Col>

        {/* Unpaid invoices */}
        <Col xs={12} lg={6}>
          <Card>
            <CardBody>
              <div
                className="d-flex align-items-center
                              justify-content-between mb-3"
              >
                <h6 className="fw-semibold mb-0">Outstanding Balances</h6>
                <Link
                  href="/portal/invoices"
                  className="small"
                  style={{ color: "var(--df-primary)" }}
                >
                  View all →
                </Link>
              </div>

              {unpaidInvoices.length === 0 ? (
                <p
                  className="small text-center py-3"
                  style={{ color: "var(--df-text-muted)" }}
                >
                  ✅ All invoices paid
                </p>
              ) : (
                unpaidInvoices.slice(0, 3).map((inv: any) => (
                  <div
                    key={inv.id}
                    className="d-flex align-items-center
                               justify-content-between py-2"
                    style={{ borderBottom: "1px solid var(--df-border)" }}
                  >
                    <div>
                      <div className="fw-medium small">
                        {inv.invoice_number}
                      </div>
                      <div
                        className="small"
                        style={{ color: "var(--df-text-muted)" }}
                      >
                        Due:{" "}
                        {inv.due_date
                          ? new Date(inv.due_date).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold" style={{ color: "#EF4444" }}>
                        ${parseFloat(inv.balance).toFixed(2)}
                      </div>
                      <Badge
                        color={inv.status === "partial" ? "warning" : "danger"}
                        className="small"
                      >
                        {inv.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
