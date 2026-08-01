"use client";

import { useState, useCallback } from "react";
import { Col, Row } from "reactstrap";
import { AnimatePresence, motion } from "framer-motion";
import { FiCalendar, FiPlus } from "react-icons/fi";
import { Button } from "reactstrap";

import { useAppointments } from "@/lib/hooks/use-appointments";
import { useAppointmentFilters } from "@/lib/hooks/use-appointment-filters";
import { LayoutMode, LayoutToggle } from "./components/LayoutToggle";
import {
  GridSkeletons,
  ListSkeletons,
} from "./components/AppointmentSkeletons";
import { AppointmentGridCard } from "./components/AppointmentGridCard";
import { BookAppointmentModal } from "./components/BookAppointmentModal";
import { StatusUpdateModal } from "./components/StatusUpdateModal";
import { AppointmentListTable } from "./components/AppointmentListTable";
import { AppointmentPagination } from "./components/AppointmentPagination";
import {
  AppointmentToolbarInline,
  AppointmentToolbarPanel,
} from "./components/AppointmentToolbar";

export default function AppointmentsPage() {
  const [layout, setLayout] = useState<LayoutMode>("grid");
  const [bookOpen, setBookOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<{
    id: string;
    current: string;
  } | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const { filters, update, setPage, setSort, reset, activeFilterCount } =
    useAppointmentFilters();
  const { data, isLoading } = useAppointments(filters);

  const appointments = (data?.data ?? []) as Record<string, unknown>[];
  const meta = data?.meta as
    | { total: number; page: number; limit: number; totalPages: number }
    | undefined;

  const openStatusModal = useCallback((id: string, current: string) => {
    setStatusTarget({ id, current });
  }, []);

  return (
    <>
      <div className="df-fade-in">
        {/* Header */}
        <div
          className="d-flex align-items-center justify-content-between mb-3"
          style={{ flexWrap: "wrap", gap: 12 }}
        >
          {/* Left: title */}
          <div style={{ flexShrink: 0 }}>
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
              {isLoading ? "Loading…" : `${meta?.total ?? 0} appointments`}
            </p>
          </div>

          {/* Center: search + filter toggle — grows to fill space */}

          {/* Right: layout toggle + book button */}
          <div
            className="d-flex align-items-center gap-2"
            style={{ flexShrink: 0 }}
          >
            <AppointmentToolbarInline
              filters={filters}
              activeFilterCount={activeFilterCount}
              onUpdate={update}
              onReset={reset}
              filterOpen={filterOpen}
              onFilterToggle={() => setFilterOpen((o) => !o)}
            />
            <LayoutToggle value={layout} onChange={setLayout} />
            <Button
              onClick={() => setBookOpen(true)}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <FiPlus style={{ marginRight: 6 }} /> Book Appointment
            </Button>
          </div>
        </div>

        {/* Filter panel + chips — renders below the header row */}
        <AppointmentToolbarPanel
          filters={filters}
          activeFilterCount={activeFilterCount}
          onUpdate={update}
          onReset={reset}
          open={filterOpen}
        />

        {/* Body */}
        {isLoading ? (
          layout === "grid" ? (
            <GridSkeletons count={6} />
          ) : (
            <ListSkeletons count={8} />
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
            className="d-flex flex-column align-items-center justify-content-center"
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
              No appointments found
            </p>
            <p style={{ fontSize: 13, marginBottom: 20 }}>
              Try adjusting your filters or book a new appointment.
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
                    <Col key={appt.id as string} xs={12} md={6} xl={4}>
                      <AppointmentGridCard
                        appt={appt as any}
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
              >
                <AppointmentListTable
                  appointments={appointments as any[]}
                  sortBy={filters.sortBy ?? "scheduled_at"}
                  sortOrder={filters.sortOrder ?? "desc"}
                  onSort={setSort}
                  onUpdateStatus={openStatusModal}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <AppointmentPagination meta={meta} onPageChange={setPage} />
        )}

        {/* Modals */}
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
