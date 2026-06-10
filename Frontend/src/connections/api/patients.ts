import { axiosInstance } from "@/lib/axiosInstance";

export const usePatientsApi = () => {
  const getPatient = async (id: string) => {
    const response = await axiosInstance.get(`/patients/${id}`);
    return response.data;
  };

  const getPatientClinicalNotes = async (id: string) => {
    const response = await axiosInstance.get(`/patients/${id}/clinical-notes`);
    return response.data;
  };

  const getPatientSessions = async (id: string) => {
    const response = await axiosInstance.get(`/patients/${id}/sessions`);
    return response.data;
  };

  const getPatientTherapists = async (id: string) => {
    const response = await axiosInstance.get(`/patients/${id}/therapists`);
    return response.data;
  };

  const updatePatient = async (userId: string, data: { dateOfBirth?: string; phone?: string }) => {
    const response = await axiosInstance.patch(`/patients/${userId}`, data);
    return response.data;
  };

  return {
    getPatient,
    getPatientClinicalNotes,
    getPatientSessions,
    getPatientTherapists,
    updatePatient,
  };
};
