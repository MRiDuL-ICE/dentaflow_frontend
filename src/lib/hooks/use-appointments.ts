import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "../api/endpoints";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface AppointmentQuery {
  search?: string;
  patientId?: string;
  dentistId?: string;
  status?: string;
  chairId?: string;
  treatmentType?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface AppointmentMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AppointmentListResponse {
  data: Record<string, unknown>[];
  meta: AppointmentMeta;
}

export const appointmentKeys = {
  all: ["appointments"] as const,
  list: (params?: AppointmentQuery) =>
    [...appointmentKeys.all, "list", params] as const,
  detail: (id: string) => [...appointmentKeys.all, "detail", id] as const,
  chairs: ["appointments", "chairs"] as const,
};

export function useAppointments(params?: AppointmentQuery) {
  // Strip empty strings and undefined before sending to API
  const cleanParams = params
    ? (Object.fromEntries(
        Object.entries(params).filter(
          ([, v]) => v !== undefined && v !== "" && v !== null,
        ),
      ) as AppointmentQuery)
    : undefined;

  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: async () => {
      const res = await appointmentsApi.list(cleanParams);
      return (res as AxiosResponse<ApiResponse<AppointmentListResponse>>).data
        .data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: async () => {
      const res = await appointmentsApi.get(id);
      return (res as AxiosResponse<ApiResponse<unknown>>).data.data;
    },
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => appointmentsApi.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status: string; reason?: string };
    }) => appointmentsApi.updateStatus(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useChairs() {
  return useQuery({
    queryKey: appointmentKeys.chairs,
    queryFn: async () => {
      const res = await appointmentsApi.getChairs();
      return (res as AxiosResponse<ApiResponse<unknown>>).data.data;
    },
  });
}
