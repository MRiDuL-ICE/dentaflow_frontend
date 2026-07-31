import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Row,
  Col,
} from "reactstrap";
import toast from "react-hot-toast";
import { useCreateAppointment, useChairs } from "@/lib/hooks/use-appointments";
import { useDentists } from "@/lib/hooks/use-staff";
import { usePatients } from "@/lib/hooks/use-patients";
import { DURATION_OPTIONS, TREATMENT_TYPES } from "../_constants/appointments";

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_FORM = {
  patientId: "",
  dentistId: "",
  chairId: "",
  treatmentType: "",
  customTreatment: "",
  durationMinutes: 30,
  scheduledAt: "",
  notes: "",
};

export function BookAppointmentModal({
  isOpen,
  onClose,
}: BookAppointmentModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: dentists } = useDentists();
  const { data: chairs } = useChairs();
  const { data: patientsData } = usePatients({ limit: 100 });
  const createMutation = useCreateAppointment();

  const dentistList = (dentists ?? []) as {
    id: string;
    first_name: string;
    last_name: string;
  }[];
  const chairList = (chairs ?? []) as { id: string; name: string }[];
  const patientList = (patientsData?.data ?? []) as {
    id: string;
    firstName: string;
    lastName: string;
  }[];

  const minDateTime = new Date(Date.now() + 30 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  function handleClose() {
    setForm(EMPTY_FORM);
    onClose();
  }

  function field<K extends keyof typeof EMPTY_FORM>(
    key: K,
    value: (typeof EMPTY_FORM)[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
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
      handleClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg ?? "Failed to book appointment.", { id: toastId });
    }
  }

  const canSubmit =
    !!form.patientId &&
    !!form.dentistId &&
    !!form.treatmentType &&
    !!form.scheduledAt &&
    !createMutation.isPending;

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>Book New Appointment</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label className="small fw-medium">
                  Patient <span style={{ color: "#EF4444" }}>*</span>
                </Label>
                <Input
                  type="select"
                  value={form.patientId}
                  onChange={(e) => field("patientId", e.target.value)}
                  required
                >
                  <option value="">Select patient...</option>
                  {patientList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>

            <Col xs={12} md={6}>
              <FormGroup>
                <Label className="small fw-medium">
                  Dentist <span style={{ color: "#EF4444" }}>*</span>
                </Label>
                <Input
                  type="select"
                  value={form.dentistId}
                  onChange={(e) => field("dentistId", e.target.value)}
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

            <Col xs={12} md={6}>
              <FormGroup>
                <Label className="small fw-medium">
                  Treatment Type <span style={{ color: "#EF4444" }}>*</span>
                </Label>
                <Input
                  type="select"
                  value={form.treatmentType}
                  onChange={(e) => field("treatmentType", e.target.value)}
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
                    onChange={(e) => field("customTreatment", e.target.value)}
                    placeholder="Describe the treatment"
                    required
                    autoFocus
                  />
                </FormGroup>
              </Col>
            )}

            <Col xs={12} md={6}>
              <FormGroup>
                <Label className="small fw-medium">
                  Date & Time <span style={{ color: "#EF4444" }}>*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={form.scheduledAt}
                  min={minDateTime}
                  onChange={(e) => field("scheduledAt", e.target.value)}
                  required
                />
              </FormGroup>
            </Col>

            <Col xs={12} md={6}>
              <FormGroup>
                <Label className="small fw-medium">Duration (minutes)</Label>
                <Input
                  type="select"
                  value={form.durationMinutes}
                  onChange={(e) =>
                    field("durationMinutes", parseInt(e.target.value))
                  }
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} min
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>

            {chairList.length > 0 && (
              <Col xs={12} md={6}>
                <FormGroup>
                  <Label className="small fw-medium">Chair / Room</Label>
                  <Input
                    type="select"
                    value={form.chairId}
                    onChange={(e) => field("chairId", e.target.value)}
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

            <Col xs={12}>
              <FormGroup>
                <Label className="small fw-medium">Notes</Label>
                <Input
                  type="textarea"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => field("notes", e.target.value)}
                  placeholder="Any special instructions or notes..."
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            disabled={!canSubmit}
            color="primary"
            className="btn btn-primary d-flex align-items-center gap-2"
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
          <Button color="secondary" outline onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
