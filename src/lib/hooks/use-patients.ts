import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { patientsApi } from "../api/endpoints";

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export const patientKeys = {
  all: ["patients"] as const,
  list: (params?: object) => [...patientKeys.all, "list", params] as const,
  detail: (id: string) => [...patientKeys.all, "detail", id] as const,
};

export function usePatients(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: async () => {
      const res = await patientsApi.list(params);
      return (
        res as AxiosResponse<
          ApiResponse<{
            data: unknown[];
            meta: {
              total: number;
              page: number;
              limit: number;
              totalPages: number;
            };
          }>
        >
      ).data.data;
    },
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: async () => {
      const res = await patientsApi.get(id);
      return (res as AxiosResponse<ApiResponse<unknown>>).data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => patientsApi.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}

export function useUpdatePatient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => patientsApi.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: patientKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientsApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}
