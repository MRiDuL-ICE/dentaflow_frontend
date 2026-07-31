"use client";

import { useState } from "react";
import { Col, Row } from "reactstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiPlus } from "react-icons/fi";
import { Button } from "reactstrap";

import { useAppointments } from "@/lib/hooks/use-appointments";
import { LayoutMode, LayoutToggle } from "./components/LayoutToggle";
import {
  GridSkeletons,
  ListSkeletons,
} from "./components/AppointmentSkeletons";
import { AppointmentGridCard } from "./components/AppointmentGridCard";
import { AppointmentListRow } from "./components/AppointmentListRow";
import { BookAppointmentModal } from "./components/BookAppointmentModal";
import { StatusUpdateModal } from "./components/StatusUpdateModal";

export default function AppointmentsPage() {
  const [layout, setLayout] = useState<LayoutMode>("grid");
  const [bookOpen, setBookOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<{
    id: string;
    current: string;
  } | null>(null);

  const { data, isLoading } = useAppointments({ limit: 50 });
  const appointments = (data?.data ?? []) as Record<string, unknown>[];

  function openStatusModal(id: string, current: string) {
    setStatusTarget({ id, current });
  }

  return (
    <>
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="df-fade-in">
        {/* ── Header ── */}
        <div
          className="d-flex align-items-center justify-content-between mb-4"
          style={{ flexWrap: "wrap", gap: 12 }}
        >
          <div>
            <h4
              className="fw-bold mb-0"
              style={{ color: "var(--df-text-primary)" }}
            >
              Appointments
            </h4>
            <p
              className="small mb-0"
              style={{ color: "var(--df-text-secondary)" }}
            >
              {isLoading ? "Loading..." : `${appointments.length} appointments`}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <LayoutToggle value={layout} onChange={setLayout} />
            <Button
              onClick={() => setBookOpen(true)}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <FiPlus style={{ fontSize: 14 }} /> Book Appointment
            </Button>
          </div>
        </div>

        {/* ── Body ── */}
        {isLoading ? (
          layout === "grid" ? (
            <GridSkeletons count={6} />
          ) : (
            <ListSkeletons count={6} />
          )
        ) : appointments.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              color: "var(--df-text-muted)",
              background: "var(--df-surface)",
              borderRadius: 16,
              border: "1px dashed var(--df-border)",
            }}
          >
            <FiCalendar
              style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}
            />
            <p
              style={{
                fontWeight: 500,
                marginBottom: 4,
                color: "var(--df-text-secondary)",
              }}
            >
              No appointments yet
            </p>
            <p style={{ fontSize: 13, marginBottom: 20 }}>
              Book the first appointment to get started.
            </p>
            <Button
              onClick={() => setBookOpen(true)}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <FiPlus style={{ marginRight: 6 }} /> Book Appointment
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {layout === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Row className="g-3">
                  {appointments.map((appt, i) => (
                    <Col key={appt["id"] as string} xs={12} md={6} xl={4}>
                      <AppointmentGridCard
                        appt={appt}
                        index={i}
                        onUpdateStatus={openStatusModal}
                      />
                    </Col>
                  ))}
                </Row>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="d-flex flex-column gap-2"
              >
                {appointments.map((appt, i) => (
                  <AppointmentListRow
                    key={appt["id"] as string}
                    appt={appt}
                    index={i}
                    onUpdateStatus={openStatusModal}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── Modals ── */}
        <BookAppointmentModal
          isOpen={bookOpen}
          onClose={() => setBookOpen(false)}
        />
        <StatusUpdateModal
          appointmentId={statusTarget?.id ?? null}
          currentStatus={statusTarget?.current ?? null}
          onClose={() => setStatusTarget(null)}
        />
      </div>
    </>
  );
}
