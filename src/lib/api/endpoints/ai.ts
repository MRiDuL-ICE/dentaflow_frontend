import apiClient from "../client";

export const aiApi = {
  startSession: (data: { patientId?: string; context?: string }) =>
    apiClient.post("/ai/chat/sessions", data),

  sendMessage: (sessionId: string, message: string) =>
    apiClient.post(`/ai/chat/sessions/${sessionId}/messages`, { message }),

  getHistory: (sessionId: string) =>
    apiClient.get(`/ai/chat/sessions/${sessionId}/history`),

  getRecommendations: (patientId: string) =>
    apiClient.get(`/ai/recommendations/patient/${patientId}`),

  generateNote: (patientId: string, data: unknown) =>
    apiClient.post(`/clinical-notes/generate/${patientId}`, data),
};

export default aiApi;

export type AIEndpoints = typeof aiApi;
