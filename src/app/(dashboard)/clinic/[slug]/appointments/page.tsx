"use client";

import { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import { motion } from "framer-motion";
import { FiPlus, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointmentStatus,
  useChairs,
} from "@/lib/hooks/use-appointments";
import { useDentists } from "@/lib/hooks/use-staff";
import { usePatients } from "@/lib/hooks/use-patients";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "secondary",
  confirmed: "primary",
  in_progress: "warning",
  completed: "success",
  cancelled: "danger",
  no_show: "dark",
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  scheduled: ["confirmed", "cancelled", "no_show"],
  confirmed: ["in_progress", "cancelled", "no_show"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  no_show: ["scheduled"],
};

const TREATMENT_TYPES = [
  "General Checkup",
  "Cleaning & Polishing",
  "Cavity Filling",
  "Root Canal",
  "Tooth Extraction",
  "Dental Crown",
  "Teeth Whitening",
  "Orthodontic Consultation",
  "Dental Implant",
  "Emergency",
  "Other",
];

export default function AppointmentsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    id: string;
    current: string;
  } | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");

  // Form state
  const [form, setForm] = useState({
    patientId: "",
    dentistId: "",
    chairId: "",
    treatmentType: "",
    customTreatment: "",
    durationMinutes: 30,
    scheduledAt: "",
    notes: "",
  });

  const { data, isLoading } = useAppointments({ limit: 50 });
  const { data: dentists } = useDentists();
  const { data: chairs } = useChairs();
  const { data: patientsData } = usePatients({ limit: 100 });
  const createMutation = useCreateAppointment();
  const statusMutation = useUpdateAppointmentStatus();

  const appointments = (data?.data ?? []) as Record<string, unknown>[];
  const dentistList = (dentists ?? []) as {
    id: string;
    first_name: string;
    last_name: string;
  }[];
  const chairList = (chairs ?? []) as {
    id: string;
    name: string;
  }[];
  const patientList = (patientsData?.data ?? []) as {
    id: string;
    first_name: string;
    last_name: string;
  }[];

  function resetForm() {
    setForm({
      patientId: "",
      dentistId: "",
      chairId: "",
      treatmentType: "",
      customTreatment: "",
      durationMinutes: 30,
      scheduledAt: "",
      notes: "",
    });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    const treatment =
      form.treatmentType === "Other"
        ? form.customTreatment
        : form.treatmentType;

    if (!treatment) {
      toast.error("Please specify a treatment type.");
      return;
    }

    const toastId = toast.loading("Booking appointment...");

    try {
      await createMutation.mutateAsync({
        patientId: form.patientId,
        dentistId: form.dentistId,
        chairId: form.chairId || undefined,
        treatmentType: treatment,
        durationMinutes: form.durationMinutes,
        scheduledAt: form.scheduledAt,
        notes: form.notes || undefined,
      });

      toast.success("Appointment booked!", { id: toastId });
      setCreateOpen(false);
      resetForm();
    } catch (err: unknown) {
      const msg = (
        err as {
          response?: { data?: { message?: string } };
        }
      )?.response?.data?.message;
      toast.error(msg ?? "Failed to book appointment.", { id: toastId });
    }
  }

  async function handleStatusUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!statusModal || !newStatus) return;

    const toastId = toast.loading("Updating status...");
    try {
      await statusMutation.mutateAsync({
        id: statusModal.id,
        data: {
          status: newStatus,
          reason: statusReason || undefined,
        },
      });
      toast.success("Status updated.", { id: toastId });
      setStatusModal(null);
      setNewStatus("");
      setStatusReason("");
    } catch (err: unknown) {
      const msg = (
        err as {
          response?: { data?: { message?: string } };
        }
      )?.response?.data?.message;
      toast.error(msg ?? "Failed to update status.", { id: toastId });
    }
  }

  // Min datetime for scheduling (no past appointments)
  const minDateTime = new Date(Date.now() + 30 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="df-fade-in">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-0">Appointments</h4>
          <p
            className="small mb-0"
            style={{ color: "var(--df-text-secondary)" }}
          >
            {appointments.length} appointments loaded
          </p>
        </div>
        <Button
          color="primary"
          className="d-flex align-items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <FiPlus /> Book Appointment
        </Button>
      </div>

      {/* Appointment cards */}
      {isLoading ? (
        <div className="text-center py-5">
          <Spinner style={{ color: "var(--df-primary)" }} />
        </div>
      ) : appointments.length === 0 ? (
        <div
          className="text-center py-5"
          style={{ color: "var(--df-text-muted)" }}
        >
          <FiCalendar style={{ fontSize: 48, marginBottom: 12 }} />
          <p>No appointments yet. Book the first one!</p>
        </div>
      ) : (
        <Row className="g-3">
          {appointments.map((appt, i) => (
            <Col key={appt["id"] as string} xs={12} md={6} xl={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="h-100">
                  <CardBody>
                    <div className="d-flex justify-content-between mb-2">
                      <Badge
                        color={
                          STATUS_COLORS[appt["status"] as string] ?? "secondary"
                        }
                      >
                        {(appt["status"] as string).replace("_", " ")}
                      </Badge>
                      <span
                        className="small"
                        style={{ color: "var(--df-text-muted)" }}
                      >
                        {new Date(
                          appt["scheduled_at"] as string,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h6 className="fw-semibold mb-2">
                      {appt["treatment_type"] as string}
                    </h6>

                    <div
                      className="d-flex flex-column gap-1 mb-3"
                      style={{
                        fontSize: 13,
                        color: "var(--df-text-secondary)",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <FiClock style={{ fontSize: 12 }} />
                        {new Date(
                          appt["scheduled_at"] as string,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" · "}
                        {appt["duration_minutes"] as number} min
                      </div>
                      {typeof appt["chair_name"] === "string" && (
                        <div className="d-flex align-items-center gap-2">
                          🪑 {appt["chair_name"] as string}
                        </div>
                      )}
                    </div>

                    {(STATUS_TRANSITIONS[appt["status"] as string] ?? [])
                      .length > 0 && (
                      <Button
                        size="sm"
                        color="outline-primary"
                        className="w-100"
                        onClick={() =>
                          setStatusModal({
                            id: appt["id"] as string,
                            current: appt["status"] as string,
                          })
                        }
                      >
                        Update Status
                      </Button>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}

      {/* ── Book Appointment Modal ── */}
      <Modal
        isOpen={createOpen}
        toggle={() => {
          setCreateOpen(false);
          resetForm();
        }}
        size="lg"
      >
        <ModalHeader
          toggle={() => {
            setCreateOpen(false);
            resetForm();
          }}
        >
          Book New Appointment
        </ModalHeader>
        <form onSubmit={handleCreate}>
          <ModalBody>
            <Row>
              {/* Patient dropdown */}
              <Col xs={12} md={6}>
                <FormGroup>
                  <Label className="small fw-medium">
                    Patient <span style={{ color: "#EF4444" }}>*</span>
                  </Label>
                  <Input
                    type="select"
                    value={form.patientId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, patientId: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select patient...</option>
                    {patientList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              {/* Dentist dropdown */}
              <Col xs={12} md={6}>
                <FormGroup>
                  <Label className="small fw-medium">
                    Dentist <span style={{ color: "#EF4444" }}>*</span>
                  </Label>
                  <Input
                    type="select"
                    value={form.dentistId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dentistId: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select dentist...</option>
                    {dentistList.map((d) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.first_name} {d.last_name}
                      </option>
                    ))}
                  </Input>
                  {dentistList.length === 0 && (
                    <p className="small mt-1 mb-0" style={{ color: "#F59E0B" }}>
                      No dentists found. Add staff members first.
                    </p>
                  )}
                </FormGroup>
              </Col>

              {/* Treatment type */}
              <Col xs={12} md={6}>
                <FormGroup>
                  <Label className="small fw-medium">
                    Treatment Type <span style={{ color: "#EF4444" }}>*</span>
                  </Label>
                  <Input
                    type="select"
                    value={form.treatmentType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, treatmentType: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select treatment...</option>
                    {TREATMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              {/* Custom treatment (if Other selected) */}
              {form.treatmentType === "Other" && (
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">
                      Specify Treatment{" "}
                      <span style={{ color: "#EF4444" }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      value={form.customTreatment}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          customTreatment: e.target.value,
                        }))
                      }
                      placeholder="Describe the treatment"
                      required
                      autoFocus
                    />
                  </FormGroup>
                </Col>
              )}

              {/* Date & time */}
              <Col xs={12} md={6}>
                <FormGroup>
                  <Label className="small fw-medium">
                    Date & Time <span style={{ color: "#EF4444" }}>*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduledAt}
                    min={minDateTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, scheduledAt: e.target.value }))
                    }
                    required
                  />
                </FormGroup>
              </Col>

              {/* Duration */}
              <Col xs={12} md={6}>
                <FormGroup>
                  <Label className="small fw-medium">Duration (minutes)</Label>
                  <Input
                    type="select"
                    value={form.durationMinutes}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        durationMinutes: parseInt(e.target.value),
                      }))
                    }
                  >
                    {[15, 30, 45, 60, 90, 120].map((d) => (
                      <option key={d} value={d}>
                        {d} min
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              {/* Chair */}
              {chairList.length > 0 && (
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Chair / Room</Label>
                    <Input
                      type="select"
                      value={form.chairId}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, chairId: e.target.value }))
                      }
                    >
                      <option value="">Any available</option>
                      {chairList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              )}

              {/* Notes */}
              <Col xs={12}>
                <FormGroup>
                  <Label className="small fw-medium">Notes</Label>
                  <Input
                    type="textarea"
                    rows={2}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    placeholder="Any special instructions or notes..."
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              type="submit"
              disabled={
                createMutation.isPending ||
                !form.patientId ||
                !form.dentistId ||
                !form.treatmentType ||
                !form.scheduledAt
              }
            >
              {createMutation.isPending ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
            <Button
              color="secondary"
              outline
              onClick={() => {
                setCreateOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* ── Status Update Modal ── */}
      <Modal
        isOpen={!!statusModal}
        toggle={() => {
          setStatusModal(null);
          setNewStatus("");
          setStatusReason("");
        }}
      >
        <ModalHeader
          toggle={() => {
            setStatusModal(null);
            setNewStatus("");
            setStatusReason("");
          }}
        >
          Update Appointment Status
        </ModalHeader>
        <form onSubmit={handleStatusUpdate}>
          <ModalBody>
            <FormGroup>
              <Label className="small fw-medium">
                New Status <span style={{ color: "#EF4444" }}>*</span>
              </Label>
              <Input
                type="select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                required
              >
                <option value="">Select status...</option>
                {(STATUS_TRANSITIONS[statusModal?.current ?? ""] ?? []).map(
                  (s) => (
                    <option key={s} value={s}>
                      {s
                        .replace("_", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ),
                )}
              </Input>
            </FormGroup>

            {(newStatus === "cancelled" || newStatus === "no_show") && (
              <FormGroup>
                <Label className="small fw-medium">Reason (optional)</Label>
                <Input
                  type="textarea"
                  rows={2}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Patient called to cancel..."
                />
              </FormGroup>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              type="submit"
              disabled={!newStatus || statusMutation.isPending}
            >
              {statusMutation.isPending ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
            <Button
              color="secondary"
              outline
              onClick={() => {
                setStatusModal(null);
                setNewStatus("");
                setStatusReason("");
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
