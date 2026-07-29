"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Badge,
} from "reactstrap";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCreatePatient } from "@/lib/hooks/use-patients";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import WizardSteps from "@/components/layout/WizardSteps";
import StepButtons from "@/components/layout/StepButtons";

type Step = 1 | 2 | 3 | 4;

const STEP_CONFIG: Record<Step, { label: string; description: string }> = {
  1: { label: "Basic Info", description: "Personal details" },
  2: { label: "Medical History", description: "Allergies & conditions" },
  3: { label: "Insurance", description: "Coverage details" },
  4: { label: "Emergency Contact", description: "In case of emergency" },
};

export default function AddPatientPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Form state per step
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
    allergies: "", // comma-separated
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

      // Only add insurance if provider is filled
      if (insurance.provider) {
        payload["insurance"] = {
          provider: insurance.provider,
          policyNumber: insurance.policyNumber,
          groupNumber: insurance.groupNumber || undefined,
          validFrom: insurance.validFrom || undefined,
          validUntil: insurance.validUntil || undefined,
        };
      }

      // Only add emergency contact if name is filled
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

      setTimeout(() => {
        router.replace(`/clinic/${slug}/patients`);
      }, 800);
    } catch (err: unknown) {
      const msg = (
        err as {
          response?: { data?: { message?: string } };
        }
      )?.response?.data?.message;

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

  return (
    <div className="df-fade-in">
      {/* Page header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link
          href={`/clinic/${slug}/patients`}
          className="btn btn-sm btn-outline-secondary"
        >
          <FiArrowLeft />
        </Link>
        <div>
          <h4 className="fw-bold mb-0">Add New Patient</h4>
          <p
            className="small mb-0"
            style={{ color: "var(--df-text-secondary)" }}
          >
            {STEP_CONFIG[step].description}
          </p>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col xs={12} lg={8} xl={7}>
          <Card>
            <CardBody className="p-4">
              <WizardSteps current={step} />

              <AnimatePresence mode="wait">
                {/* ── Step 1: Basic Info ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form onSubmit={goNext}>
                      <Row>
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              First Name{" "}
                              <span style={{ color: "#EF4444" }}>*</span>
                            </Label>
                            <Input
                              type="text"
                              value={basic.firstName}
                              onChange={(e) =>
                                setBasic((d) => ({
                                  ...d,
                                  firstName: e.target.value,
                                }))
                              }
                              required
                              autoFocus
                            />
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Last Name{" "}
                              <span style={{ color: "#EF4444" }}>*</span>
                            </Label>
                            <Input
                              type="text"
                              value={basic.lastName}
                              onChange={(e) =>
                                setBasic((d) => ({
                                  ...d,
                                  lastName: e.target.value,
                                }))
                              }
                              required
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Date of Birth
                            </Label>
                            <Input
                              type="date"
                              value={basic.dateOfBirth}
                              max={new Date().toISOString().split("T")[0]}
                              onChange={(e) =>
                                setBasic((d) => ({
                                  ...d,
                                  dateOfBirth: e.target.value,
                                }))
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">Gender</Label>
                            <Input
                              type="select"
                              value={basic.gender}
                              onChange={(e) =>
                                setBasic((d) => ({
                                  ...d,
                                  gender: e.target.value,
                                }))
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
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">Phone</Label>
                            <Input
                              type="tel"
                              value={basic.phone}
                              onChange={(e) =>
                                setBasic((d) => ({
                                  ...d,
                                  phone: e.target.value,
                                }))
                              }
                              placeholder="+8801700000000"
                            />
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">Email</Label>
                            <Input
                              type="email"
                              value={basic.email}
                              onChange={(e) =>
                                setBasic((d) => ({
                                  ...d,
                                  email: e.target.value,
                                }))
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <FormGroup>
                        <Label className="small fw-medium">
                          Street Address
                        </Label>
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
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">City</Label>
                            <Input
                              type="text"
                              value={basic.city}
                              onChange={(e) =>
                                setBasic((d) => ({
                                  ...d,
                                  city: e.target.value,
                                }))
                              }
                              placeholder="Dhaka"
                            />
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">Country</Label>
                            <Input
                              type="text"
                              value={basic.country}
                              onChange={(e) =>
                                setBasic((d) => ({
                                  ...d,
                                  country: e.target.value,
                                }))
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <StepButtons
                        step={step}
                        loading={loading}
                        onBack={goBack}
                        disabled={!basic.firstName || !basic.lastName}
                      />
                    </Form>
                  </motion.div>
                )}

                {/* ── Step 2: Medical History ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form onSubmit={goNext}>
                      <p
                        className="small mb-3"
                        style={{ color: "var(--df-text-secondary)" }}
                      >
                        Separate multiple entries with commas. All fields are
                        optional.
                      </p>

                      <FormGroup>
                        <Label className="small fw-medium">Allergies</Label>
                        <Input
                          type="text"
                          value={medical.allergies}
                          onChange={(e) =>
                            setMedical((d) => ({
                              ...d,
                              allergies: e.target.value,
                            }))
                          }
                          placeholder="Penicillin, Aspirin, Latex"
                        />
                        {medical.allergies && (
                          <div className="d-flex flex-wrap gap-1 mt-2">
                            {splitCSV(medical.allergies).map((a) => (
                              <Badge
                                key={a}
                                color="danger"
                                pill
                                className="small"
                              >
                                {a}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <Label className="small fw-medium">
                          Medical Conditions
                        </Label>
                        <Input
                          type="text"
                          value={medical.conditions}
                          onChange={(e) =>
                            setMedical((d) => ({
                              ...d,
                              conditions: e.target.value,
                            }))
                          }
                          placeholder="Hypertension, Diabetes Type 2"
                        />
                        {medical.conditions && (
                          <div className="d-flex flex-wrap gap-1 mt-2">
                            {splitCSV(medical.conditions).map((c) => (
                              <Badge
                                key={c}
                                color="warning"
                                pill
                                className="small"
                              >
                                {c}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <Label className="small fw-medium">
                          Current Medications
                        </Label>
                        <Input
                          type="text"
                          value={medical.medications}
                          onChange={(e) =>
                            setMedical((d) => ({
                              ...d,
                              medications: e.target.value,
                            }))
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
                            setMedical((d) => ({
                              ...d,
                              notes: e.target.value,
                            }))
                          }
                          placeholder="Patient is anxious about injections..."
                        />
                      </FormGroup>

                      <StepButtons
                        step={step}
                        loading={loading}
                        onBack={goBack}
                      />
                    </Form>
                  </motion.div>
                )}

                {/* ── Step 3: Insurance ── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form onSubmit={goNext}>
                      <p
                        className="small mb-3"
                        style={{ color: "var(--df-text-secondary)" }}
                      >
                        Optional. Leave blank if patient has no insurance.
                      </p>

                      <Row>
                        <Col xs={12}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Insurance Provider
                            </Label>
                            <Input
                              type="text"
                              value={insurance.provider}
                              onChange={(e) =>
                                setInsurance((d) => ({
                                  ...d,
                                  provider: e.target.value,
                                }))
                              }
                              placeholder="Green Shield, MetLife..."
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Policy Number
                            </Label>
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
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Group Number
                            </Label>
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
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Valid From
                            </Label>
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
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Valid Until
                            </Label>
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

                      <StepButtons
                        step={step}
                        loading={loading}
                        onBack={goBack}
                      />
                    </Form>
                  </motion.div>
                )}

                {/* ── Step 4: Emergency Contact ── */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form onSubmit={goNext}>
                      <p
                        className="small mb-3"
                        style={{ color: "var(--df-text-secondary)" }}
                      >
                        Optional. Contact person in case of emergency.
                      </p>

                      <Row>
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">Name</Label>
                            <Input
                              type="text"
                              value={emergency.name}
                              onChange={(e) =>
                                setEmergency((d) => ({
                                  ...d,
                                  name: e.target.value,
                                }))
                              }
                              placeholder="Fatima Khan"
                              autoFocus
                            />
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Relationship
                            </Label>
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
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">
                              Phone <span style={{ color: "#EF4444" }}>*</span>
                            </Label>
                            <Input
                              type="tel"
                              value={emergency.phone}
                              onChange={(e) =>
                                setEmergency((d) => ({
                                  ...d,
                                  phone: e.target.value,
                                }))
                              }
                              required={!!emergency.name}
                              disabled={!emergency.name}
                              placeholder="+8801700000000"
                            />
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label className="small fw-medium">Email</Label>
                            <Input
                              type="email"
                              value={emergency.email}
                              onChange={(e) =>
                                setEmergency((d) => ({
                                  ...d,
                                  email: e.target.value,
                                }))
                              }
                              disabled={!emergency.name}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* Summary before submit */}
                      <div
                        className="p-3 rounded mb-3"
                        style={{
                          background: "var(--df-bg)",
                          border: "1px solid var(--df-border)",
                          fontSize: 13,
                        }}
                      >
                        <p className="fw-semibold mb-2">
                          Review before saving:
                        </p>
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
                              ` · Born ${new Date(
                                basic.dateOfBirth,
                              ).toLocaleDateString()}`}
                          </div>
                          {basic.phone && <div>📞 {basic.phone}</div>}
                          {basic.email && <div>✉️ {basic.email}</div>}
                          {medical.allergies && (
                            <div>
                              ⚠️ Allergies:{" "}
                              {splitCSV(medical.allergies).join(", ")}
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

                      <StepButtons
                        step={step}
                        loading={loading}
                        onBack={goBack}
                        submitLabel="Save Patient"
                      />
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
