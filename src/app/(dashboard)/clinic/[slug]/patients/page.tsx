"use client";

import { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Badge,
  Spinner,
  Table,
} from "reactstrap";
import { motion } from "framer-motion";
import { FiPlus, FiSearch, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { usePatients, useDeletePatient } from "@/lib/hooks/use-patients";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  created_at: string;
}

export default function PatientsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePatients({
    search: search || undefined,
    page,
    limit: 20,
  });

  const { mutate: deletePatient } = useDeletePatient();

  const patients = (data?.data ?? []) as Patient[];
  const meta = data?.meta ?? { total: 0, totalPages: 1 };

  const columns: ColumnDef<Patient>[] = [
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
      header: "Phone",
      accessorKey: "phone",
      cell: ({ getValue }) => (getValue() as string) ?? "—",
    },
    {
      header: "DOB",
      accessorKey: "date_of_birth",
      cell: ({ getValue }) => {
        const v = getValue() as string | null;
        return v ? new Date(v).toLocaleDateString() : "—";
      },
    },
    {
      header: "Gender",
      accessorKey: "gender",
      cell: ({ getValue }) => {
        const v = getValue() as string | null;
        return v ? <Badge color="secondary">{v}</Badge> : "—";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Link
            href={`/clinic/${slug}/patients/${row.original.id}`}
            className="btn btn-sm btn-outline-primary"
          >
            <FiEye />
          </Link>
          <Link
            href={`/clinic/${slug}/patients/${row.original.id}/edit`}
            className="btn btn-sm btn-outline-secondary"
          >
            <FiEdit2 />
          </Link>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              if (confirm("Delete this patient?"))
                deletePatient(row.original.id);
            }}
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: patients,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="df-fade-in">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-0">Patients</h4>
          <p
            className="small mb-0"
            style={{ color: "var(--df-text-secondary)" }}
          >
            {meta.total} total patients
          </p>
        </div>
        <Link
          href={`/clinic/${slug}/patients/new`}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <FiPlus /> Add Patient
        </Link>
      </div>

      <Card>
        <CardBody>
          {/* Search */}
          <Row className="mb-3">
            <Col xs={12} md={4}>
              <div className="d-flex align-items-center gap-2">
                <FiSearch style={{ color: "var(--df-text-muted)" }} />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </Col>
          </Row>

          {/* Table */}
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner style={{ color: "var(--df-primary)" }} />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    {table.getHeaderGroups().map((hg) => (
                      <tr key={hg.id}>
                        {hg.headers.map((h) => (
                          <th
                            key={h.id}
                            className="small text-uppercase fw-semibold"
                            style={{
                              color: "var(--df-text-muted)",
                              letterSpacing: "0.05em",
                              borderBottom: "2px solid var(--df-border)",
                            }}
                          >
                            {flexRender(
                              h.column.columnDef.header,
                              h.getContext(),
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-5"
                          style={{ color: "var(--df-text-muted)" }}
                        >
                          No patients found
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
                            <td key={cell.id} className="align-middle">
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

              {/* Pagination */}
              <div className="d-flex align-items-center justify-content-between mt-3">
                <span
                  className="small"
                  style={{ color: "var(--df-text-muted)" }}
                >
                  Page {page} of {meta.totalPages}
                </span>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    outline
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    outline
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
