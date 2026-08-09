"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
  Button,
  Spinner,
  Row,
  Col,
} from "reactstrap";
import toast from "react-hot-toast";
import { useCreatePatient } from "@/lib/hooks/use-patients";
import WizardSteps from "@/components/layout/WizardSteps";

type Step = 1 | 2 | 3 | 4;

const STEP_CONFIG: Record<Step, { label: string; description: string }> = {
  1: { label: "Basic Info", description: "Personal details" },
  2: { label: "Medical History", description: "Allergies & conditions" },
  3: { label: "Insurance", description: "Coverage details" },
  4: { label: "Emergency Contact", description: "In case of emergency" },
};

interface AddPatientModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddPatientModal({
  open,
  onClose,
}: AddPatientModalProps) {
  const params = useParams();
  const slug = params.slug as string;

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const [basic, setBasic] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    country: "Bangladesh",
  });

  const [medical, setMedical] = useState({
    allergies: "",
    conditions: "",
    medications: "",
    notes: "",
  });

  const [insurance, setInsurance] = useState({
    provider: "",
    policyNumber: "",
    groupNumber: "",
    validFrom: "",
    validUntil: "",
  });

  const [emergency, setEmergency] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  });

  const { mutateAsync: createPatient } = useCreatePatient();

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setBasic({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        street: "",
        city: "",
        country: "Bangladesh",
      });
      setMedical({ allergies: "", conditions: "", medications: "", notes: "" });
      setInsurance({
        provider: "",
        policyNumber: "",
        groupNumber: "",
        validFrom: "",
        validUntil: "",
      });
      setEmergency({ name: "", relationship: "", phone: "", email: "" });
    }
  }, [open]);

  function splitCSV(str: string): string[] {
    return str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleSubmit() {
    setLoading(true);
    const toastId = toast.loading("Creating patient...");
    try {
      const payload: Record<string, unknown> = {
        firstName: basic.firstName,
        lastName: basic.lastName,
        dateOfBirth: basic.dateOfBirth || undefined,
        gender: basic.gender || undefined,
        phone: basic.phone || undefined,
        email: basic.email || undefined,
        address: {
          street: basic.street,
          city: basic.city,
          country: basic.country,
        },
        medicalHistory: {
          allergies: splitCSV(medical.allergies),
          conditions: splitCSV(medical.conditions),
          medications: splitCSV(medical.medications),
          notes: medical.notes,
        },
      };

      if (insurance.provider) {
        payload["insurance"] = {
          provider: insurance.provider,
          policyNumber: insurance.policyNumber,
          groupNumber: insurance.groupNumber || undefined,
          validFrom: insurance.validFrom || undefined,
          validUntil: insurance.validUntil || undefined,
        };
      }

      if (emergency.name) {
        payload["emergencyContacts"] = [
          {
            name: emergency.name,
            relationship: emergency.relationship,
            phone: emergency.phone,
            email: emergency.email || undefined,
          },
        ];
      }

      await createPatient(payload);
      toast.success(
        `${basic.firstName} ${basic.lastName} added successfully!`,
        { id: toastId },
      );
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg ?? "Failed to create patient.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  function goNext(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) setStep((step + 1) as Step);
    else void handleSubmit();
  }

  function goBack() {
    if (step > 1) setStep((step - 1) as Step);
  }

  const isLastStep = step === 4;
  const canProceedStep1 = !!basic.firstName && !!basic.lastName;

  return (
    <Modal isOpen={open} toggle={onClose} size="lg" centered>
      <ModalHeader toggle={onClose}>
        <span>Add New Patient</span>
        <small
          className="d-block fw-normal mt-1"
          style={{ fontSize: 12, color: "var(--df-text-secondary)" }}
        >
          Step {step} of 4 — {STEP_CONFIG[step].description}
        </small>
      </ModalHeader>

      <div style={{ padding: "16px 20px 0" }}>
        <WizardSteps current={step} />
      </div>

      <form onSubmit={goNext}>
        <ModalBody>
          {/* ── Step 1: Basic Info ── */}
          {step === 1 && (
            <>
              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">
                      First Name <span style={{ color: "#EF4444" }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      value={basic.firstName}
                      onChange={(e) =>
                        setBasic((d) => ({ ...d, firstName: e.target.value }))
                      }
                      required
                      autoFocus
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">
                      Last Name <span style={{ color: "#EF4444" }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      value={basic.lastName}
                      onChange={(e) =>
                        setBasic((d) => ({ ...d, lastName: e.target.value }))
                      }
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Date of Birth</Label>
                    <Input
                      type="date"
                      value={basic.dateOfBirth}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setBasic((d) => ({ ...d, dateOfBirth: e.target.value }))
                      }
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Gender</Label>
                    <Input
                      type="select"
                      value={basic.gender}
                      onChange={(e) =>
                        setBasic((d) => ({ ...d, gender: e.target.value }))
                      }
                    >
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Phone</Label>
                    <Input
                      type="tel"
                      value={basic.phone}
                      onChange={(e) =>
                        setBasic((d) => ({ ...d, phone: e.target.value }))
                      }
                      placeholder="+8801700000000"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Email</Label>
                    <Input
                      type="email"
                      value={basic.email}
                      onChange={(e) =>
                        setBasic((d) => ({ ...d, email: e.target.value }))
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label className="small fw-medium">Street Address</Label>
                <Input
                  type="text"
                  value={basic.street}
                  onChange={(e) =>
                    setBasic((d) => ({ ...d, street: e.target.value }))
                  }
                  placeholder="House 12, Road 5, Block B"
                />
              </FormGroup>

              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">City</Label>
                    <Input
                      type="text"
                      value={basic.city}
                      onChange={(e) =>
                        setBasic((d) => ({ ...d, city: e.target.value }))
                      }
                      placeholder="Dhaka"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Country</Label>
                    <Input
                      type="text"
                      value={basic.country}
                      onChange={(e) =>
                        setBasic((d) => ({ ...d, country: e.target.value }))
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}

          {/* ── Step 2: Medical History ── */}
          {step === 2 && (
            <>
              <p
                className="small mb-3"
                style={{ color: "var(--df-text-secondary)" }}
              >
                Separate multiple entries with commas. All fields are optional.
              </p>

              <FormGroup>
                <Label className="small fw-medium">Allergies</Label>
                <Input
                  type="text"
                  value={medical.allergies}
                  onChange={(e) =>
                    setMedical((d) => ({ ...d, allergies: e.target.value }))
                  }
                  placeholder="Penicillin, Aspirin, Latex"
                />
                {medical.allergies && (
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {splitCSV(medical.allergies).map((a) => (
                      <Badge key={a} color="danger" pill className="small">
                        {a}
                      </Badge>
                    ))}
                  </div>
                )}
              </FormGroup>

              <FormGroup>
                <Label className="small fw-medium">Medical Conditions</Label>
                <Input
                  type="text"
                  value={medical.conditions}
                  onChange={(e) =>
                    setMedical((d) => ({ ...d, conditions: e.target.value }))
                  }
                  placeholder="Hypertension, Diabetes Type 2"
                />
                {medical.conditions && (
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {splitCSV(medical.conditions).map((c) => (
                      <Badge key={c} color="warning" pill className="small">
                        {c}
                      </Badge>
                    ))}
                  </div>
                )}
              </FormGroup>

              <FormGroup>
                <Label className="small fw-medium">Current Medications</Label>
                <Input
                  type="text"
                  value={medical.medications}
                  onChange={(e) =>
                    setMedical((d) => ({ ...d, medications: e.target.value }))
                  }
                  placeholder="Lisinopril 10mg, Metformin 500mg"
                />
              </FormGroup>

              <FormGroup>
                <Label className="small fw-medium">Notes</Label>
                <Input
                  type="textarea"
                  rows={3}
                  value={medical.notes}
                  onChange={(e) =>
                    setMedical((d) => ({ ...d, notes: e.target.value }))
                  }
                  placeholder="Patient is anxious about injections..."
                />
              </FormGroup>
            </>
          )}

          {/* ── Step 3: Insurance ── */}
          {step === 3 && (
            <>
              <p
                className="small mb-3"
                style={{ color: "var(--df-text-secondary)" }}
              >
                Optional. Leave blank if patient has no insurance.
              </p>

              <FormGroup>
                <Label className="small fw-medium">Insurance Provider</Label>
                <Input
                  type="text"
                  value={insurance.provider}
                  onChange={(e) =>
                    setInsurance((d) => ({ ...d, provider: e.target.value }))
                  }
                  placeholder="Green Shield, MetLife..."
                />
              </FormGroup>

              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Policy Number</Label>
                    <Input
                      type="text"
                      value={insurance.policyNumber}
                      onChange={(e) =>
                        setInsurance((d) => ({
                          ...d,
                          policyNumber: e.target.value,
                        }))
                      }
                      disabled={!insurance.provider}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Group Number</Label>
                    <Input
                      type="text"
                      value={insurance.groupNumber}
                      onChange={(e) =>
                        setInsurance((d) => ({
                          ...d,
                          groupNumber: e.target.value,
                        }))
                      }
                      disabled={!insurance.provider}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Valid From</Label>
                    <Input
                      type="date"
                      value={insurance.validFrom}
                      onChange={(e) =>
                        setInsurance((d) => ({
                          ...d,
                          validFrom: e.target.value,
                        }))
                      }
                      disabled={!insurance.provider}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Valid Until</Label>
                    <Input
                      type="date"
                      value={insurance.validUntil}
                      onChange={(e) =>
                        setInsurance((d) => ({
                          ...d,
                          validUntil: e.target.value,
                        }))
                      }
                      disabled={!insurance.provider}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}

          {/* ── Step 4: Emergency Contact + Summary ── */}
          {step === 4 && (
            <>
              <p
                className="small mb-3"
                style={{ color: "var(--df-text-secondary)" }}
              >
                Optional. Contact person in case of emergency.
              </p>

              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Name</Label>
                    <Input
                      type="text"
                      value={emergency.name}
                      onChange={(e) =>
                        setEmergency((d) => ({ ...d, name: e.target.value }))
                      }
                      placeholder="Fatima Khan"
                      autoFocus
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Relationship</Label>
                    <Input
                      type="select"
                      value={emergency.relationship}
                      onChange={(e) =>
                        setEmergency((d) => ({
                          ...d,
                          relationship: e.target.value,
                        }))
                      }
                      disabled={!emergency.name}
                    >
                      <option value="">Select...</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">
                      Phone <span style={{ color: "#EF4444" }}>*</span>
                    </Label>
                    <Input
                      type="tel"
                      value={emergency.phone}
                      onChange={(e) =>
                        setEmergency((d) => ({ ...d, phone: e.target.value }))
                      }
                      required={!!emergency.name}
                      disabled={!emergency.name}
                      placeholder="+8801700000000"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label className="small fw-medium">Email</Label>
                    <Input
                      type="email"
                      value={emergency.email}
                      onChange={(e) =>
                        setEmergency((d) => ({ ...d, email: e.target.value }))
                      }
                      disabled={!emergency.name}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* Summary */}
              <div
                className="p-3 rounded mb-1"
                style={{
                  background: "var(--df-bg)",
                  border: "1px solid var(--df-border)",
                  fontSize: 13,
                }}
              >
                <p className="fw-semibold mb-2">Review before saving:</p>
                <div
                  style={{
                    color: "var(--df-text-secondary)",
                    lineHeight: 1.8,
                  }}
                >
                  <div>
                    👤{" "}
                    <strong>
                      {basic.firstName} {basic.lastName}
                    </strong>
                    {basic.gender && ` · ${basic.gender}`}
                    {basic.dateOfBirth &&
                      ` · Born ${new Date(basic.dateOfBirth).toLocaleDateString()}`}
                  </div>
                  {basic.phone && <div>📞 {basic.phone}</div>}
                  {basic.email && <div>✉️ {basic.email}</div>}
                  {medical.allergies && (
                    <div>
                      ⚠️ Allergies: {splitCSV(medical.allergies).join(", ")}
                    </div>
                  )}
                  {insurance.provider && (
                    <div>🏥 Insurance: {insurance.provider}</div>
                  )}
                  {emergency.name && (
                    <div>
                      🆘 Emergency: {emergency.name} ({emergency.phone})
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {/* Primary action: Next / Save */}
          <Button
            type="submit"
            color="primary"
            className="d-flex align-items-center gap-2"
            disabled={loading || (step === 1 && !canProceedStep1)}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                Saving...
              </>
            ) : isLastStep ? (
              "Save Patient"
            ) : (
              "Next"
            )}
          </Button>

          {/* Back button — hidden on step 1 */}
          {step > 1 && (
            <Button type="button" color="secondary" outline onClick={goBack}>
              Back
            </Button>
          )}

          <Button type="button" color="secondary" outline onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
