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
import { FiPlus, FiCalendar } from "react-icons/fi";
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointmentStatus,
} from "@/lib/hooks/use-appointments";
import { useForm } from "react-hook-form";

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

export default function AppointmentsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    id: string;
    current: string;
  } | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const { data, isLoading } = useAppointments({ limit: 50 });
  const createMutation = useCreateAppointment();
  const statusMutation = useUpdateAppointmentStatus();

  const appointments = (data?.data ?? []) as Record<string, unknown>[];

  const { register, handleSubmit, reset } = useForm();

  async function onCreateSubmit(values: any) {
    await createMutation.mutateAsync(values);
    setCreateOpen(false);
    reset();
  }

  async function onStatusUpdate() {
    if (!statusModal || !newStatus) return;
    await statusMutation.mutateAsync({
      id: statusModal.id,
      data: { status: newStatus },
    });
    setStatusModal(null);
    setNewStatus("");
  }

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
            {appointments.length} appointments
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

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner style={{ color: "var(--df-primary)" }} />
        </div>
      ) : (
        <Row className="g-3">
          {appointments.map((appt, i) => (
            <Col key={appt["id"] as string} xs={12} md={6} xl={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
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
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <h6 className="fw-semibold mb-1">
                      {appt["treatment_type"] as string}
                    </h6>
                    <p
                      className="small mb-2"
                      style={{ color: "var(--df-text-secondary)" }}
                    >
                      <FiCalendar className="me-1" />
                      {new Date(
                        appt["scheduled_at"] as string,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" · "}
                      {appt["duration_minutes"] as number} min
                    </p>

                    {/* Status transitions */}
                    {(STATUS_TRANSITIONS[appt["status"] as string] ?? [])
                      .length > 0 && (
                      <Button
                        size="sm"
                        color="outline-primary"
                        className="w-100 mt-2"
                        onClick={() => {
                          setStatusModal({
                            id: appt["id"] as string,
                            current: appt["status"] as string,
                          });
                          setNewStatus("");
                        }}
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

      {/* Create Modal */}
      <Modal isOpen={createOpen} toggle={() => setCreateOpen(false)}>
        <ModalHeader toggle={() => setCreateOpen(false)}>
          Book Appointment
        </ModalHeader>
        <form onSubmit={handleSubmit(onCreateSubmit)}>
          <ModalBody>
            <FormGroup>
              <Label>Patient ID</Label>
              <Input {...register("patientId")} required />
            </FormGroup>
            <FormGroup>
              <Label>Dentist ID</Label>
              <Input {...register("dentistId")} required />
            </FormGroup>
            <FormGroup>
              <Label>Treatment Type</Label>
              <Input {...register("treatmentType")} required />
            </FormGroup>
            <Row>
              <Col xs={6}>
                <FormGroup>
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    {...register("scheduledAt")}
                    required
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label>Duration (min)</Label>
                  <Input
                    type="number"
                    defaultValue={30}
                    {...register("durationMinutes")}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Notes</Label>
              <Input type="textarea" rows={2} {...register("notes")} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? <Spinner size="sm" /> : "Book"}
            </Button>
            <Button
              color="secondary"
              outline
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Status Update Modal */}
      <Modal isOpen={!!statusModal} toggle={() => setStatusModal(null)}>
        <ModalHeader toggle={() => setStatusModal(null)}>
          Update Status
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>New Status</Label>
            <Input
              type="select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select...</option>
              {(STATUS_TRANSITIONS[statusModal?.current ?? ""] ?? []).map(
                (s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ),
              )}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={onStatusUpdate}
            disabled={!newStatus || statusMutation.isPending}
          >
            {statusMutation.isPending ? <Spinner size="sm" /> : "Update"}
          </Button>
          <Button
            color="secondary"
            outline
            onClick={() => setStatusModal(null)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
