import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "../api/endpoints";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export const appointmentKeys = {
  all: ["appointments"] as const,
  list: (params?: object) => [...appointmentKeys.all, "list", params] as const,
  detail: (id: string) => [...appointmentKeys.all, "detail", id] as const,
  chairs: ["appointments", "chairs"] as const,
};

export function useAppointments(params?: {
  patientId?: string;
  dentistId?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: async () => {
      const res = await appointmentsApi.list(params);
      return (res as AxiosResponse<ApiResponse<unknown>>).data.data;
    },
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
