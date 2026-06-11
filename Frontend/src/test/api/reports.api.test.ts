import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosInstance } from "@/lib/axiosInstance";
import { useReportsApi } from "@/connections/api/reports";

vi.mock("@/lib/axiosInstance", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

describe("useReportsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generateReport recibe y devuelve el reporte del backend correctamente", async () => {
    const params = {
      startDate: "2025-06-01",
      endDate: "2025-06-30",
      therapistId: "therapist-1",
    };

    const mockReport = {
      totalSessions: 12,
      completedSessions: 10,
      canceledSessions: 2,
      sessions: [],
    };

    vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockReport });

    const { generateReport } = useReportsApi();
    const result = await generateReport(params);

    expect(axiosInstance.get).toHaveBeenCalledWith("/reports/generate", { params });
    expect(result).toEqual(mockReport);
    expect(result.totalSessions).toBe(12);
  });
});
