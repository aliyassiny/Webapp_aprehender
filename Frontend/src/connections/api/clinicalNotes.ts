import { axiosInstance } from "@/lib/axiosInstance";

export interface CreateNoteDto {
  patientId: string;
  therapistId: string;
  sessionId?: string;
  content: string;
}

export const useClinicalNotesApi = () => {
  const getNotesByPatient = async (patientId: string) => {
    const response = await axiosInstance.get(`/clinical-notes/patient/${patientId}`);
    return response.data;
  };

  const createNote = async (data: CreateNoteDto) => {
    const response = await axiosInstance.post(`/clinical-notes`, data);
    return response.data;
  };

  const deleteNote = async (id: string) => {
    const response = await axiosInstance.delete(`/clinical-notes/${id}`);
    return response.data;
  };

  const updateNote = async (id: string, data: CreateNoteDto) => {
    const response = await axiosInstance.patch(`/clinical-notes/${id}`, data);
    return response.data;
  };

  return {
    getNotesByPatient,
    createNote,
    deleteNote,
    updateNote,
  };
};
