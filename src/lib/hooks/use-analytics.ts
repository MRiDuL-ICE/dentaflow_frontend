import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/endpoints";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export function useDashboard() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      const res = await analyticsApi.getDashboard();
      return (res as AxiosResponse<ApiResponse<unknown>>).data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useRevenueDaily(days?: number) {
  return useQuery({
    queryKey: ["analytics", "revenue", "daily", days],
    queryFn: async () => {
      const res = await analyticsApi.getRevenueDaily(days);
      return (res as AxiosResponse<ApiResponse<unknown>>).data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePatientGrowth(weeks?: number) {
  return useQuery({
    queryKey: ["analytics", "patients", "growth", weeks],
    queryFn: async () => {
      const res = await analyticsApi.getPatientGrowth(weeks);
      return (res as AxiosResponse<ApiResponse<unknown>>).data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useAiInsights() {
  return useQuery({
    queryKey: ["analytics", "ai-insights"],
    queryFn: async () => {
      const res = await analyticsApi.getAiInsights();
      return (res as AxiosResponse<ApiResponse<unknown>>).data.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
