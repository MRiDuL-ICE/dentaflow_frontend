import { useQuery } from "@tanstack/react-query";
import { staffApi } from "@/lib/api/endpoints/staff";

export interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export function useDentists() {
  return useQuery({
    queryKey: ["staff", "dentists"],
    queryFn: async () => {
      const res = await staffApi.getDentists();
      return (res.data as { data: StaffMember[] }).data;
    },
    staleTime: 10 * 60 * 1000, // 10 min — dentist list rarely changes
  });
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff", "all"],
    queryFn: async () => {
      const res = await staffApi.getAll();
      return (res.data as { data: StaffMember[] }).data;
    },
    staleTime: 10 * 60 * 1000,
  });
}
