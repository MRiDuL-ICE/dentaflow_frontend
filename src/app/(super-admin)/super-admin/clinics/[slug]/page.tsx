"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  Badge,
  Spinner,
  Alert,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import { superAdminApi } from "@/lib/api/endpoints";

type Member = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

type ClinicDetail = {
  id: string;
  name: string;
  slug: string;
  schema_name: string;
  is_active: boolean;
  created_at: string;
  members: Member[] | null;
};

const ROLE_COLOR: Record<string, string> = {
  clinic_owner: "primary",
  dentist: "info",
  receptionist: "success",
};

export default function ClinicDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [clinic, setClinic] = useState<ClinicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deactivating, setDeactivating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deactivateErr, setDeactivateErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await superAdminApi.getClinic(slug);
        setClinic(res.data);
      } catch {
        setError("Failed to load clinic.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const deactivate = async () => {
    setDeactivating(true);
    setDeactivateErr("");
    try {
      await superAdminApi.deactivateClinic(slug);
      setClinic((prev) => (prev ? { ...prev, is_active: false } : prev));
      setConfirmOpen(false);
    } catch {
      setDeactivateErr("Failed to deactivate. Try again.");
    } finally {
      setDeactivating(false);
    }
  };

  if (loading)
    return (
      <div
        className="df-main d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner />
      </div>
    );

  if (error || !clinic)
    return (
      <div className="df-main p-4">
        <Alert color="danger">{error || "Clinic not found."}</Alert>
      </div>
    );

  return (
    <div>
      <div className="df-page-header d-flex align-items-center gap-3">
        <Button
          color="link"
          className="p-0 text-muted"
          onClick={() => router.back()}
        >
          ←
        </Button>
        <div className="flex-grow-1">
          <h5 className="mb-0 fw-semibold">{clinic.name}</h5>
          <code className="small text-muted">{clinic.slug}</code>
        </div>
        <Badge
          color={clinic.is_active ? "success" : "secondary"}
          className="df-badge"
        >
          {clinic.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="p-4 d-flex flex-column gap-4" style={{ maxWidth: 720 }}>
        {/* Meta */}
        <Card>
          <CardBody>
            <h6 className="fw-semibold mb-3">Details</h6>
            <dl className="row mb-0" style={{ rowGap: "0.5rem" }}>
              <dt className="col-4 text-muted fw-normal small">Schema</dt>
              <dd className="col-8 mb-0">
                <code className="small">{clinic.schema_name}</code>
              </dd>
              <dt className="col-4 text-muted fw-normal small">Created</dt>
              <dd className="col-8 mb-0 small">
                {new Date(clinic.created_at).toLocaleDateString()}
              </dd>
            </dl>
          </CardBody>
        </Card>

        {/* Members */}
        <Card>
          <CardBody>
            <h6 className="fw-semibold mb-3">Members</h6>
            {!clinic.members || clinic.members.length === 0 ? (
              <p className="text-muted small mb-0">No members yet.</p>
            ) : (
              <Table responsive hover className="mb-0 small">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {clinic.members.map((m) => (
                    <tr key={m.id}>
                      <td>
                        {m.firstName} {m.lastName}
                      </td>
                      <td className="text-muted">{m.email}</td>
                      <td>
                        <Badge
                          color={ROLE_COLOR[m.role] ?? "secondary"}
                          className="df-badge"
                        >
                          {m.role}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Danger zone */}
        {clinic.is_active && (
          <Card style={{ borderColor: "#f8d7da" }}>
            <CardBody>
              <h6 className="fw-semibold text-danger mb-1">Danger zone</h6>
              <p className="text-muted small mb-3">
                Deactivating will prevent all staff from logging in to this
                clinic.
              </p>
              {deactivateErr && (
                <Alert color="danger" className="py-2 small">
                  {deactivateErr}
                </Alert>
              )}
              {!confirmOpen ? (
                <Button
                  color="danger"
                  outline
                  size="sm"
                  onClick={() => setConfirmOpen(true)}
                >
                  Deactivate clinic
                </Button>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">Are you sure?</span>
                  <Button
                    color="danger"
                    size="sm"
                    disabled={deactivating}
                    onClick={deactivate}
                  >
                    {deactivating ? (
                      <>
                        <Spinner size="sm" className="me-1" />
                        Deactivating…
                      </>
                    ) : (
                      "Yes, deactivate"
                    )}
                  </Button>
                  <Button
                    color="link"
                    size="sm"
                    className="text-muted p-0"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
