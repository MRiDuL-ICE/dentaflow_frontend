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
} from "reactstrap";
import toast from "react-hot-toast";
import { useUpdateAppointmentStatus } from "@/lib/hooks/use-appointments";
import { STATUS_TRANSITIONS } from "../_constants/appointments";

interface StatusUpdateModalProps {
  appointmentId: string | null;
  currentStatus: string | null;
  onClose: () => void;
}

export function StatusUpdateModal({
  appointmentId,
  currentStatus,
  onClose,
}: StatusUpdateModalProps) {
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const statusMutation = useUpdateAppointmentStatus();

  const isOpen = !!appointmentId && !!currentStatus;
  const transitions = STATUS_TRANSITIONS[currentStatus ?? ""] ?? [];
  const needsReason = newStatus === "cancelled" || newStatus === "no_show";

  function handleClose() {
    setNewStatus("");
    setReason("");
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!appointmentId || !newStatus) return;

    const toastId = toast.loading("Updating status...");
    try {
      await statusMutation.mutateAsync({
        id: appointmentId,
        data: { status: newStatus, reason: reason || undefined },
      });
      toast.success("Status updated.", { id: toastId });
      handleClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg ?? "Failed to update status.", { id: toastId });
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Update Appointment Status</ModalHeader>
      <form onSubmit={handleSubmit}>
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
              {transitions.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </Input>
          </FormGroup>

          {needsReason && (
            <FormGroup>
              <Label className="small fw-medium">Reason (optional)</Label>
              <Input
                type="textarea"
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Patient called to cancel..."
              />
            </FormGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            disabled={!newStatus || statusMutation.isPending}
            color="primary"
            className="btn btn-primary d-flex align-items-center gap-2"
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
          <Button color="secondary" outline onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
