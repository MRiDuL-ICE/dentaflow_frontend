"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Table,
  Badge,
  Spinner,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";
import { treatmentsApi } from "@/lib/api/endpoints/treatments";
import type { Category, Treatment } from "../page";

const CATEGORY_COLORS = [
  "#1D9E75",
  "#3B82F6",
  "#EF4444",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#6B7280",
  "#002972",
  "#FF6B35",
];

interface ClinicalSectionProps {
  categories: Category[];
  treatments: Treatment[];
  loading: boolean;
  error: string;
  isOwner: boolean;
  onReload: () => void;
}

export function ClinicalSection({
  categories,
  treatments,
  loading,
  error,
  isOwner,
  onReload,
}: ClinicalSectionProps) {
  const [catForm, setCatForm] = useState({ name: "", color: "#1D9E75" });
  const [catSaving, setCatSaving] = useState(false);
  const [catMsg, setCatMsg] = useState("");
  const [catErr, setCatErr] = useState("");
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [editDuration, setEditDuration] = useState<Record<string, number>>({});
  const [durSaving, setDurSaving] = useState<string | null>(null);

  const catList: Category[] =
    (categories as unknown as { data?: Category[] })?.data ?? categories;
  const treatList: Treatment[] =
    (treatments as unknown as { data?: Treatment[] })?.data ?? treatments;

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatSaving(true);
    setCatMsg("");
    setCatErr("");
    try {
      if (editCat) {
        await treatmentsApi.updateCategory(editCat.id, catForm);
      } else {
        await treatmentsApi.createCategory(catForm);
      }
      setCatMsg(editCat ? "Category updated." : "Category created.");
      setCatForm({ name: "", color: "#1D9E75" });
      setEditCat(null);
      onReload();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setCatErr(msg ?? "Failed to save category.");
    } finally {
      setCatSaving(false);
    }
  };

  const startEditCat = (cat: Category) => {
    setEditCat(cat);
    setCatForm({ name: cat.name, color: cat.color });
    setCatMsg("");
    setCatErr("");
  };

  const handleToggleCategory = async (cat: Category) => {
    try {
      await treatmentsApi.toggleCategory(cat.id, !cat.is_active);
      onReload();
    } catch {
      /* silent */
    }
  };

  const handleSaveDuration = async (id: string) => {
    const val = editDuration[id];
    if (!val) return;
    setDurSaving(id);
    try {
      await treatmentsApi.updateDuration(id, val);
      onReload();
    } catch {
      /* silent */
    } finally {
      setDurSaving(null);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h5 className="fw-semibold mb-1">Clinical</h5>
        <p className="small mb-0" style={{ color: "var(--df-text-muted)" }}>
          Treatment categories and duration defaults.
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner size="sm" />
        </div>
      )}
      {error && <Alert color="danger">{error}</Alert>}

      {!loading && (
        <Row className="g-4">
          {/* ── Categories ── */}
          <Col md={5}>
            <p
              className="small fw-semibold mb-2"
              style={{ color: "var(--df-text-secondary)" }}
            >
              Treatment Categories
            </p>
            <Card className="mb-3">
              <Table responsive className="mb-0 small align-middle">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Status</th>
                    {isOwner && <th />}
                  </tr>
                </thead>
                <tbody>
                  {catList.map((cat) => (
                    <tr key={cat.id}>
                      <td>
                        <span className="d-flex align-items-center gap-2">
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: cat.color,
                              flexShrink: 0,
                            }}
                          />
                          {cat.name}
                        </span>
                      </td>
                      <td>
                        <Badge
                          color={cat.is_active ? "success" : "secondary"}
                          className="df-badge"
                        >
                          {cat.is_active ? "Active" : "Off"}
                        </Badge>
                      </td>
                      {isOwner && (
                        <td className="text-end">
                          <Button
                            color="link"
                            size="sm"
                            className="p-0 me-2"
                            style={{ fontSize: 12 }}
                            onClick={() => startEditCat(cat)}
                          >
                            Edit
                          </Button>
                          <Button
                            color="link"
                            size="sm"
                            className="p-0"
                            style={{
                              fontSize: 12,
                              color: cat.is_active ? "#dc3545" : "#1D9E75",
                            }}
                            onClick={() => handleToggleCategory(cat)}
                          >
                            {cat.is_active ? "Disable" : "Enable"}
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {catList.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-muted text-center py-3 small"
                      >
                        No categories yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>

            {isOwner && (
              <Card>
                <CardBody>
                  <p className="small fw-semibold mb-3">
                    {editCat ? `Edit: ${editCat.name}` : "New Category"}
                  </p>
                  <Form onSubmit={handleSaveCategory}>
                    <FormGroup>
                      <Label className="small fw-medium">Name</Label>
                      <Input
                        bsSize="sm"
                        required
                        value={catForm.name}
                        onChange={(e) =>
                          setCatForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="e.g. Orthodontics"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="small fw-medium">Color</Label>
                      <div className="d-flex gap-1 flex-wrap mb-2">
                        {CATEGORY_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() =>
                              setCatForm((p) => ({ ...p, color: c }))
                            }
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              background: c,
                              border:
                                catForm.color === c
                                  ? "2px solid var(--df-text-primary)"
                                  : "2px solid transparent",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          />
                        ))}
                      </div>
                    </FormGroup>
                    {catMsg && (
                      <Alert color="success" className="py-1 small">
                        {catMsg}
                      </Alert>
                    )}
                    {catErr && (
                      <Alert color="danger" className="py-1 small">
                        {catErr}
                      </Alert>
                    )}
                    <div className="d-flex gap-2">
                      <Button
                        type="submit"
                        color="primary"
                        size="sm"
                        disabled={catSaving}
                      >
                        {catSaving ? (
                          <Spinner size="sm" />
                        ) : editCat ? (
                          "Update"
                        ) : (
                          "Create"
                        )}
                      </Button>
                      {editCat && (
                        <Button
                          type="button"
                          color="link"
                          size="sm"
                          onClick={() => {
                            setEditCat(null);
                            setCatForm({ name: "", color: "#1D9E75" });
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Form>
                </CardBody>
              </Card>
            )}
          </Col>

          {/* ── Treatment durations ── */}
          <Col md={7}>
            <p
              className="small fw-semibold mb-2"
              style={{ color: "var(--df-text-secondary)" }}
            >
              Treatment Duration Defaults
            </p>
            <Card>
              <Table responsive className="mb-0 small align-middle">
                <thead>
                  <tr>
                    <th>Treatment</th>
                    <th>Category</th>
                    <th>Duration (min)</th>
                    {isOwner && <th />}
                  </tr>
                </thead>
                <tbody>
                  {treatList.map((t) => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td style={{ color: "var(--df-text-muted)" }}>
                        {t.category_name ?? "—"}
                      </td>
                      <td style={{ width: 120 }}>
                        <Input
                          type="number"
                          bsSize="sm"
                          min={5}
                          max={240}
                          disabled={!isOwner}
                          value={editDuration[t.id] ?? t.duration_minutes}
                          onChange={(e) =>
                            setEditDuration((p) => ({
                              ...p,
                              [t.id]: Number(e.target.value),
                            }))
                          }
                          style={{ width: 80 }}
                        />
                      </td>
                      {isOwner && (
                        <td>
                          {editDuration[t.id] &&
                            editDuration[t.id] !== t.duration_minutes && (
                              <Button
                                color="link"
                                size="sm"
                                className="p-0"
                                style={{ fontSize: 12 }}
                                disabled={durSaving === t.id}
                                onClick={() => handleSaveDuration(t.id)}
                              >
                                {durSaving === t.id ? (
                                  <Spinner size="sm" />
                                ) : (
                                  "Save"
                                )}
                              </Button>
                            )}
                        </td>
                      )}
                    </tr>
                  ))}
                  {treatList.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-muted text-center py-3 small"
                      >
                        No treatments in catalog yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
