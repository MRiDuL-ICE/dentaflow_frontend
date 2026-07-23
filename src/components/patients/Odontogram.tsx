"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";

type ToothStatus =
  | "healthy"
  | "cavity"
  | "missing"
  | "crowned"
  | "implant"
  | "bridge"
  | "root_canal"
  | "extracted"
  | "fracture"
  | "watch";

interface ToothData {
  tooth_number: number;
  status: ToothStatus;
  pocket_depth: number[] | null;
  mobility: number;
  furcation: number;
  bleeding: boolean[] | null;
  notes: string | null;
}

interface OdontogramProps {
  patientId: string;
  teeth: ToothData[];
  onUpdate?: (tooth: Partial<ToothData>) => void;
  readOnly?: boolean;
}

const STATUS_COLORS: Record<ToothStatus, string> = {
  healthy: "#1D9E75",
  cavity: "#EF4444",
  missing: "#6B7280",
  crowned: "#F59E0B",
  implant: "#3B82F6",
  bridge: "#8B5CF6",
  root_canal: "#EC4899",
  extracted: "#374151",
  fracture: "#DC2626",
  watch: "#D97706",
};

const UPPER_TEETH = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
];
const LOWER_TEETH = [
  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];

function ToothSVG({
  number,
  data,
  onClick,
}: {
  number: number;
  data?: ToothData;
  onClick: () => void;
}) {
  const status = data?.status ?? "healthy";
  const color = STATUS_COLORS[status];
  const hasIssue = status !== "healthy";

  return (
    <motion.div
      className="d-flex flex-column align-items-center"
      style={{
        cursor: "pointer",
        padding: "4px 2px",
        borderRadius: 6,
        minWidth: 32,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <span
        className="small mb-1"
        style={{ fontSize: 9, color: "var(--df-text-muted)" }}
      >
        {number}
      </span>
      <svg width="24" height="28" viewBox="0 0 24 28">
        {/* Tooth shape */}
        <path
          d="M12 2 C7 2 3 6 3 11 C3 16 5 20 7 24 C8 26 9 26 10 25 C11 24 12 24 12 24 C12 24 13 24 14 25 C15 26 16 26 17 24 C19 20 21 16 21 11 C21 6 17 2 12 2Z"
          fill={hasIssue ? color : "var(--df-bg-secondary)"}
          stroke={color}
          strokeWidth="1.5"
          opacity={hasIssue ? 0.9 : 0.5}
        />
        {/* Bleeding indicator */}
        {data?.bleeding?.some((b) => b) && (
          <circle cx="12" cy="6" r="3" fill="#EF4444" opacity={0.8} />
        )}
      </svg>
      {/* Mobility indicator */}
      {data?.mobility !== undefined && data.mobility > 0 && (
        <span style={{ fontSize: 8, color: "#F59E0B", fontWeight: 700 }}>
          M{data.mobility}
        </span>
      )}
    </motion.div>
  );
}

export function Odontogram({
  patientId,
  teeth,
  onUpdate,
  readOnly = false,
}: OdontogramProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<ToothData>>({});

  const toothMap = new Map(teeth.map((t) => [t.tooth_number, t]));

  function handleToothClick(number: number) {
    if (readOnly) return;
    const existing = toothMap.get(number);
    setSelected(number);
    setEditData({
      tooth_number: number,
      status: existing?.status ?? "healthy",
      mobility: existing?.mobility ?? 0,
      furcation: existing?.furcation ?? 0,
      notes: existing?.notes ?? "",
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (onUpdate && editData) {
      onUpdate(editData);
    }
    setModalOpen(false);
  }

  const selectedData = selected ? toothMap.get(selected) : undefined;

  return (
    <div>
      {/* Legend */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <span key={status} className="d-flex align-items-center gap-1 small">
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: color,
                display: "inline-block",
              }}
            />
            <span style={{ color: "var(--df-text-secondary)" }}>
              {status.replace("_", " ")}
            </span>
          </span>
        ))}
      </div>

      {/* Upper teeth */}
      <div
        className="d-flex justify-content-center mb-2 p-3"
        style={{
          background: "var(--df-bg)",
          borderRadius: "var(--df-radius)",
          border: "1px solid var(--df-border)",
        }}
      >
        <div className="d-flex flex-wrap justify-content-center gap-1">
          {UPPER_TEETH.map((n) => (
            <ToothSVG
              key={n}
              number={n}
              data={toothMap.get(n)}
              onClick={() => handleToothClick(n)}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        className="my-2 text-center small"
        style={{ color: "var(--df-text-muted)" }}
      >
        ── Upper / Lower ──
      </div>

      {/* Lower teeth */}
      <div
        className="d-flex justify-content-center p-3"
        style={{
          background: "var(--df-bg)",
          borderRadius: "var(--df-radius)",
          border: "1px solid var(--df-border)",
        }}
      >
        <div className="d-flex flex-wrap justify-content-center gap-1">
          {LOWER_TEETH.map((n) => (
            <ToothSVG
              key={n}
              number={n}
              data={toothMap.get(n)}
              onClick={() => handleToothClick(n)}
            />
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {!readOnly && (
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
          <ModalHeader toggle={() => setModalOpen(false)}>
            Tooth {selected} — {editData.status}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col xs={12} className="mb-3">
                <Label>Status</Label>
                <Input
                  type="select"
                  value={editData.status}
                  onChange={(e) =>
                    setEditData((d) => ({
                      ...d,
                      status: e.target.value as ToothStatus,
                    }))
                  }
                >
                  {Object.keys(STATUS_COLORS).map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label>Mobility (0–3)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={3}
                    value={editData.mobility ?? 0}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        mobility: parseInt(e.target.value),
                      }))
                    }
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label>Furcation (0–3)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={3}
                    value={editData.furcation ?? 0}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        furcation: parseInt(e.target.value),
                      }))
                    }
                  />
                </FormGroup>
              </Col>
              <Col xs={12}>
                <FormGroup>
                  <Label>Notes</Label>
                  <Input
                    type="textarea"
                    rows={3}
                    value={editData.notes ?? ""}
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, notes: e.target.value }))
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button
              color="secondary"
              outline
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
