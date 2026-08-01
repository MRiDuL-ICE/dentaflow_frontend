import { useState, useCallback, useTransition } from "react";
import type { AppointmentQuery } from "./use-appointments";

const DEFAULTS: AppointmentQuery = {
  search: "",
  status: "",
  dentistId: "",
  chairId: "",
  treatmentType: "",
  from: "",
  to: "",
  sortBy: "scheduled_at",
  sortOrder: "desc",
  page: 1,
  limit: 20,
};

export function useAppointmentFilters() {
  const [filters, setFilters] = useState<AppointmentQuery>(DEFAULTS);
  const [, startTransition] = useTransition();

  const update = useCallback((patch: Partial<AppointmentQuery>) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, ...patch, page: 1 }));
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setSort = useCallback((sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  }, []);

  const reset = useCallback(() => setFilters(DEFAULTS), []);

  const activeFilterCount = [
    filters.status,
    filters.dentistId,
    filters.chairId,
    filters.treatmentType,
    filters.from,
    filters.to,
  ].filter(Boolean).length;

  return { filters, update, setPage, setSort, reset, activeFilterCount };
}
