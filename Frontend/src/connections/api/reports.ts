import { axiosInstance } from "@/lib/axiosInstance";

export interface GenerateReportParams {
  startDate: string;
  endDate: string;
  therapistId?: string;
  patientId?: string;
}

export const useReportsApi = () => {
  const generateReport = async (params: GenerateReportParams) => {
    const response = await axiosInstance.get("/reports/generate", { params });
    return response.data;
  };

  return {
    generateReport,
  };
};
