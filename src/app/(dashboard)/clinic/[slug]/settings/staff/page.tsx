"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Badge,
  Spinner,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { staffApi } from "@/lib/api/endpoints/staff";
import { FiPlus } from "react-icons/fi";

type StaffMember = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  joined_at: string;
};

const ROLE_COLOR: Record<string, string> = {
  clinic_owner: "primary",
  dentist: "info",
  receptionist: "success",
};

export default function StaffPage() {
  const { slug } = useParams<{ slug: string }>();

  const [activeTab, setActiveTab] = useState("list");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"dentist" | "receptionist">("dentist");
  const [submitting, setSubmitting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");
  const [inviteErr, setInviteErr] = useState("");

  const fetchStaff = async () => {
    setLoading(true);
    setFetchErr("");
    try {
      const res = await staffApi.getAll();
      setStaff(res.data);
    } catch {
      setFetchErr("Could not load staff.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [slug]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setInviteMsg("");
    setInviteErr("");
    try {
      const res = await staffApi.invite({ email, role });
      setInviteMsg(res.data.message);
      setEmail("");
      fetchStaff();
    } catch (err: any) {
      setInviteErr(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0 fw-semibold">Staff</h5>
          <p className="text-muted">Manage your clinic staff.</p>
        </div>
        <div>
          <Button
            color="primary"
            onClick={() => setActiveTab("invite")}
            className="d-flex align-items-center gap-2"
          >
            <FiPlus /> Add Staff
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* <Nav tabs className="mb-4">
          <NavItem>
            <NavLink
              active={activeTab === "list"}
              onClick={() => setActiveTab("list")}
              style={{ cursor: "pointer" }}
            >
              All Staff
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === "invite"}
              onClick={() => setActiveTab("invite")}
              style={{ cursor: "pointer" }}
            >
              Add Staff
            </NavLink>
          </NavItem>
        </Nav> */}

        <TabContent activeTab={activeTab}>
          {/* ── Staff list ── */}
          <TabPane tabId="list">
            {loading && (
              <div className="text-center py-5">
                <Spinner size="sm" />{" "}
                <span className="ms-2 text-muted">Loading…</span>
              </div>
            )}
            {fetchErr && <Alert color="danger">{fetchErr}</Alert>}
            {!loading && !fetchErr && staff.length === 0 && (
              <p className="text-muted">No staff yet. Use the Add Staff tab.</p>
            )}
            {!loading && staff.length > 0 && (
              <div className="card">
                <Table responsive hover className="mb-0">
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
                        <td className="text-muted">{s.email}</td>
                        <td>
                          <Badge
                            color={ROLE_COLOR[s.role] ?? "secondary"}
                            className="df-badge"
                          >
                            {s.role}
                          </Badge>
                        </td>
                        <td className="text-muted">
                          {new Date(s.joined_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </TabPane>

          {/* ── Invite form ── */}
          <TabPane tabId="invite">
            <div className="card p-4" style={{ maxWidth: 480 }}>
              <Form onSubmit={handleInvite}>
                <FormGroup>
                  <Label>Email address</Label>
                  <Input
                    type="email"
                    required
                    placeholder="staff@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Role</Label>
                  <Input
                    type="select"
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as "dentist" | "receptionist")
                    }
                  >
                    <option value="dentist">Dentist</option>
                    <option value="receptionist">Receptionist</option>
                  </Input>
                </FormGroup>

                {inviteMsg && (
                  <Alert color="success" className="py-2">
                    {inviteMsg}
                  </Alert>
                )}
                {inviteErr && (
                  <Alert color="danger" className="py-2">
                    {inviteErr}
                  </Alert>
                )}

                <Button type="submit" color="primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Spinner size="sm" className="me-1" />
                      Adding…
                    </>
                  ) : (
                    "Add Staff Member"
                  )}
                </Button>

                <p className="text-muted mt-3 mb-0" style={{ fontSize: 13 }}>
                  The user must already have a DentaFlow account.
                </p>
              </Form>
            </div>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
}
