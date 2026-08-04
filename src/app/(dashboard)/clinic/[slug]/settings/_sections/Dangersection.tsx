"use client";

import { useState } from "react";
import { Alert, Button, Card, CardBody, Spinner } from "reactstrap";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";

export function DangerSection() {
  const { slug } = useParams<{ slug: string }>();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleDeactivate = async () => {
    setLoading(true);
    setErr("");
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/clinics/${slug}/deactivate`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
        },
      );
      window.location.replace(`/login/${slug}`);
    } catch {
      setErr("Failed to deactivate. Contact support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h6
        className="fw-semibold mb-1"
        style={{ fontSize: 13, color: "#dc3545" }}
      >
        Danger Zone
      </h6>
      <p className="small text-muted mb-3">
        Irreversible actions for this clinic.
      </p>

      <Card style={{ borderColor: "#f5c2c7" }}>
        <CardBody>
          <div className="d-flex gap-3">
            <div
              className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 40,
                height: 40,
                background: "rgba(220,53,69,0.08)",
                fontSize: 18,
              }}
            >
              ⚠️
            </div>
            <div>
              <p className="fw-medium mb-1" style={{ color: "#dc3545" }}>
                Deactivate this clinic
              </p>
              <p className="text-muted small mb-3">
                All staff will be signed out immediately and logins will be
                blocked. Clinic data is preserved but inaccessible. Only a super
                admin can reverse this.
              </p>

              {err && (
                <Alert color="danger" className="small py-2 mb-3">
                  {err}
                </Alert>
              )}

              {!confirm ? (
                <Button
                  color="danger"
                  outline
                  size="sm"
                  onClick={() => setConfirm(true)}
                >
                  Deactivate clinic
                </Button>
              ) : (
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="small text-muted">
                    Are you sure? This cannot be undone.
                  </span>
                  <Button
                    color="danger"
                    size="sm"
                    disabled={loading}
                    onClick={handleDeactivate}
                  >
                    {loading ? <Spinner size="sm" /> : "Yes, deactivate"}
                  </Button>
                  <Button
                    color="link"
                    size="sm"
                    className="text-muted p-0"
                    onClick={() => setConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
