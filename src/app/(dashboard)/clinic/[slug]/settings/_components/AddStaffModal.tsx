"use client";

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
import { staffApi } from "@/lib/api/endpoints/staff";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_FORM = {
  email: "",
  role: "dentist" as "dentist" | "receptionist",
};

export function AddStaffModal({
  isOpen,
  onClose,
  onSuccess,
}: AddStaffModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    const toastId = toast.loading("Adding staff member...");
    try {
      const res = await staffApi.invite({ email: form.email, role: form.role });
      toast.success(res.data.message ?? "Staff member added!", { id: toastId });
      onSuccess();
      handleClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg ?? "Failed to add staff member.", { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  const canSubmit = !!form.email && !saving;

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="md" centered>
      <ModalHeader toggle={handleClose}>Add Staff Member</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <p className="small text-muted mb-4">
            The person must already have a DentaFlow account. They'll be linked
            to this clinic immediately.
          </p>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className="small fw-medium">
                  Email address <span style={{ color: "#EF4444" }}>*</span>
                </Label>
                <Input
                  type="email"
                  required
                  placeholder="staff@example.com"
                  value={form.email}
                  onChange={(e) => field("email", e.target.value)}
                  autoFocus
                />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup className="mb-0">
                <Label className="small fw-medium">Role</Label>
                <Input
                  type="select"
                  value={form.role}
                  onChange={(e) =>
                    field("role", e.target.value as "dentist" | "receptionist")
                  }
                >
                  <option value="dentist">Dentist</option>
                  <option value="receptionist">Receptionist</option>
                </Input>
                <p
                  className="small mt-2 mb-0"
                  style={{ color: "var(--df-text-muted)" }}
                >
                  {form.role === "dentist"
                    ? "Can manage patients, appointments, and treatments."
                    : "Can manage appointments and view patient records."}
                </p>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            color="primary"
            disabled={!canSubmit}
            className="d-flex align-items-center gap-2"
          >
            {saving ? (
              <>
                <Spinner size="sm" />
                Adding...
              </>
            ) : (
              "Add Staff Member"
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
