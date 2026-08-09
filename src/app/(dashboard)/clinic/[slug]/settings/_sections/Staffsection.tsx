"use client";

import { Card, CardBody, Table, Badge, Alert, Button } from "reactstrap";
import { motion } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
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

function StaffRowSkeleton() {
  return (
    <tr>
      {[140, 200, 80, 90].map((w, i) => (
        <td key={i} className="align-middle py-3">
          <div
            style={{
              height: 14,
              width: w,
              borderRadius: 6,
              background: "var(--df-border)",
              opacity: 0.6,
              animation: "skeletonShimmer 1.4s ease-in-out infinite",
            }}
          />
        </td>
      ))}
    </tr>
  );
}

export function StaffSection({
  staff,
  loading,
  error,
  isOwner,
  onAddStaff,
}: StaffSectionProps) {
  const columns: ColumnDef<StaffMember>[] = [
    {
      header: "Name",
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      cell: ({ getValue, row }) => (
        <div>
          <div className="fw-medium">{getValue() as string}</div>
          <div className="small" style={{ color: "var(--df-text-muted)" }}>
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ getValue }) => {
        const role = getValue() as string;
        return (
          <Badge color={ROLE_COLOR[role] ?? "secondary"} className="df-badge">
            {ROLE_LABEL[role] ?? role}
          </Badge>
        );
      },
    },
    {
      header: "Joined",
      accessorKey: "joined_at",
      cell: ({ getValue }) => (
        <span style={{ color: "var(--df-text-muted)" }}>
          {new Date(getValue() as string).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: staff,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="df-fade-in">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
      `}</style>

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-0">Staff</h5>
          <p
            className="small mb-0"
            style={{ color: "var(--df-text-secondary)" }}
          >
            {!loading &&
              `${staff?.length} team member${staff?.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {isOwner && (
          <Button
            color="primary"
            onClick={onAddStaff}
            className="d-flex align-items-center gap-2"
          >
            + Add Staff
          </Button>
        )}
      </div>

      {error && <Alert color="danger">{error}</Alert>}

      <Card>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 small align-middle">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        className="small text-uppercase fw-semibold px-3 py-3"
                        style={{
                          color: "var(--df-text-muted)",
                          letterSpacing: "0.05em",
                          borderBottom: "2px solid var(--df-border)",
                        }}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <StaffRowSkeleton key={i} />
                  ))
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-5"
                      style={{ color: "var(--df-text-muted)" }}
                    >
                      <p className="mb-1" style={{ fontSize: 28 }}>
                        👥
                      </p>
                      <p className="small mb-0">
                        No staff yet. Add your first team member.
                      </p>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="align-middle px-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
