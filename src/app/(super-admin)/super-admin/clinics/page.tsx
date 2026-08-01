"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Table, Badge, Spinner, Alert, Button } from "reactstrap";
import { superAdminApi } from "@/lib/api/endpoints";
import ClinicsTableSkeleton from "@/components/skeletons/ClinicsTableSkeleton";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

type Clinic = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  member_count: string;
};

export default function SuperAdminClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await superAdminApi.listClinics();
        const payload = res?.data?.data ?? res?.data;
        const normalizedClinics = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        setClinics(normalizedClinics);
      } catch {
        setError("Failed to load clinics.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  console.log("clinics", clinics);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="mb-0 fw-semibold">Clinics</h5>
        <Link href="/super-admin/clinics/new">
          <Button color="primary" className="btn btn-primary">
            + New Clinic
          </Button>
        </Link>
      </div>

      <div className="py-4">
        {loading && <ClinicsTableSkeleton rows={6} />}
        {error && <Alert color="danger">{error}</Alert>}

        {!loading && clinics.length === 0 && !error && (
          <div
            className="text-center py-5"
            style={{ color: "var(--df-text-muted)" }}
          >
            No clinics found
          </div>
        )}

        {!loading && clinics.length > 0 && (
          <div className="card">
            <Table responsive className="mb-0">
              <thead>
                <tr>
                  <th
                    className="small text-uppercase fw-semibold"
                    style={{
                      color: "var(--df-text-muted)",
                      letterSpacing: "0.05em",
                      borderBottom: "2px solid var(--df-border)",
                    }}
                  >
                    Name
                  </th>
                  <th
                    className="small text-uppercase fw-semibold"
                    style={{
                      color: "var(--df-text-muted)",
                      letterSpacing: "0.05em",
                      borderBottom: "2px solid var(--df-border)",
                    }}
                  >
                    Slug
                  </th>
                  <th
                    className="small text-uppercase fw-semibold"
                    style={{
                      color: "var(--df-text-muted)",
                      letterSpacing: "0.05em",
                      borderBottom: "2px solid var(--df-border)",
                    }}
                  >
                    Members
                  </th>
                  <th
                    className="small text-uppercase fw-semibold"
                    style={{
                      color: "var(--df-text-muted)",
                      letterSpacing: "0.05em",
                      borderBottom: "2px solid var(--df-border)",
                    }}
                  >
                    Status
                  </th>
                  <th
                    className="small text-uppercase fw-semibold"
                    style={{
                      color: "var(--df-text-muted)",
                      letterSpacing: "0.05em",
                      borderBottom: "2px solid var(--df-border)",
                    }}
                  >
                    Created
                  </th>
                  <th
                    className="small text-uppercase fw-semibold"
                    style={{
                      color: "var(--df-text-muted)",
                      letterSpacing: "0.05em",
                      borderBottom: "2px solid var(--df-border)",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((c) => (
                  <tr
                    key={c.id}
                    className="align-middle"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--df-primary-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td className="fw-medium">{c?.name}</td>
                    <td>
                      <code style={{ fontSize: 12 }}>{c?.slug}</code>
                    </td>
                    <td>{c?.member_count}</td>
                    <td>
                      <Badge
                        color={c?.is_active ? "success" : "secondary"}
                        className="df-badge"
                      >
                        {c?.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="text-muted">
                      {new Date(c?.created_at).toLocaleDateString()}
                    </td>
                    <td className="">
                      <Link
                        href={`/super-admin/clinics/${c?.slug}`}
                        style={{ color: "var(--df-primary)" }}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
