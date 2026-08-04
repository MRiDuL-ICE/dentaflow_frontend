"use client";

import { Card, Table, Badge, Spinner, Alert, Button } from "reactstrap";
import type { StaffMember } from "../page";

const ROLE_COLOR: Record<string, string> = {
  clinic_owner: "primary",
  dentist: "info",
  receptionist: "success",
};

const ROLE_LABEL: Record<string, string> = {
  clinic_owner: "Owner",
  dentist: "Dentist",
  receptionist: "Receptionist",
};

interface StaffSectionProps {
  staff: StaffMember[];
  loading: boolean;
  error: string;
  isOwner: boolean;
  onAddStaff: () => void;
}

export function StaffSection({
  staff,
  loading,
  error,
  isOwner,
  onAddStaff,
}: StaffSectionProps) {
  return (
    <div>
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div>
          <h5 className="fw-semibold mb-1">Staff</h5>
          <p className="small mb-0" style={{ color: "var(--df-text-muted)" }}>
            People with access to this clinic.
          </p>
        </div>
        {isOwner && (
          <Button color="primary" size="sm" onClick={onAddStaff}>
            + Add Staff
          </Button>
        )}
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner size="sm" />
        </div>
      )}
      {error && <Alert color="danger">{error}</Alert>}

      {!loading && staff.length === 0 && !error && (
        <div
          className="text-center py-5 rounded-3"
          style={{
            border: "1px dashed var(--df-border)",
            color: "var(--df-text-muted)",
          }}
        >
          <p className="mb-2" style={{ fontSize: 32 }}>
            👥
          </p>
          <p className="small mb-0">
            No staff yet. Add your first team member.
          </p>
        </div>
      )}

      {!loading && staff.length > 0 && (
        <Card>
          <Table responsive hover className="mb-0 small align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td className="fw-medium">
                    {s.first_name} {s.last_name}
                  </td>
                  <td style={{ color: "var(--df-text-muted)" }}>{s.email}</td>
                  <td>
                    <Badge
                      color={ROLE_COLOR[s.role] ?? "secondary"}
                      className="df-badge"
                    >
                      {ROLE_LABEL[s.role] ?? s.role}
                    </Badge>
                  </td>
                  <td style={{ color: "var(--df-text-muted)" }}>
                    {new Date(s.joined_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}
