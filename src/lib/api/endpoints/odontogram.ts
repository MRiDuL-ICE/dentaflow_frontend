import apiClient from "../client";

export const odontogramApi = {
  getCurrent: (patientId: string) =>
    apiClient.get(`/patients/${patientId}/odontogram`),

  updateTooth: (patientId: string, data: unknown) =>
    apiClient.put(`/patients/${patientId}/odontogram/tooth`, data),

  createSnapshot: (patientId: string, data: unknown) =>
    apiClient.post(`/patients/${patientId}/odontogram/snapshot`, data),

  getSnapshots: (patientId: string, appointmentId?: string) =>
    apiClient.get(`/patients/${patientId}/odontogram/snapshots`, {
      params: { appointmentId },
    }),
};

export default odontogramApi;

export type OdontogramApi = typeof odontogramApi;
