import { axiosInstance } from "@/lib/axiosInstance";

export interface CreateSessionDto {
  therapistId: string;
  patientId: string;
  startTime: Date;
  endTime: Date;
  meetingLink: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED" | "ABSENT";
  notes?: { content: string }[];
}

export interface UpdateSessionDto {
  therapistId?: string;
  patientId?: string;
  startTime?: Date;
  endTime?: Date;
  meetingLink?: string;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELED" | "ABSENT";
  notes?: { content: string }[];
}

export const useSessionsApi = () => {
  const getSessions = async () => {
    const response = await axiosInstance.get("/sessions");
    return response.data;
  };

  const getSessionById = async (id: string) => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  };

  const createSession = async (data: CreateSessionDto) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data;
  };

  const updateSession = async (id: string, data: UpdateSessionDto) => {
    const response = await axiosInstance.patch(`/sessions/${id}`, data);
    return response.data;
  };

  const deleteSession = async (id: string) => {
    const response = await axiosInstance.delete(`/sessions/${id}`);
    return response.data;
  };

  return {
    getSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
  };
};
