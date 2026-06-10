import { axiosInstance } from "@/lib/axiosInstance";

export interface AddPatientDto {
  therapistId: string;
  patientId: string;
}

export const useTherapistsApi = () => {
  const getTherapist = async (id: string) => {
    const response = await axiosInstance.get(`/therapists/${id}`);
    return response.data;
  };

  const getTherapistPatients = async (id: string) => {
    const response = await axiosInstance.get(`/therapists/${id}/patients`);
    return response.data;
  };

  const getTherapistSessions = async (id: string) => {
    const response = await axiosInstance.get(`/therapists/${id}/sessions`);
    return response.data;
  };

  const getTherapistClinicalNotes = async (id: string) => {
    const response = await axiosInstance.get(`/therapists/${id}/clinical-notes`);
    return response.data;
  };

  const addPatient = async (data: AddPatientDto) => {
    const response = await axiosInstance.post(`/therapists/patients`, data);
    return response.data;
  };

  const updateTherapist = async (userId: string, data: { specialization?: string }) => {
    const response = await axiosInstance.patch(`/therapists/${userId}`, data);
    return response.data;
  };

  return {
    getTherapist,
    getTherapistPatients,
    getTherapistSessions,
    getTherapistClinicalNotes,
    addPatient,
    updateTherapist,
  };
};
