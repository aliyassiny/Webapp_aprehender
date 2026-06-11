import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosInstance } from "@/lib/axiosInstance";
import { usePatientsApi } from "@/connections/api/patients";

vi.mock("@/lib/axiosInstance", () => ({
  axiosInstance: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("usePatientsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPatient recibe y devuelve los datos del backend correctamente", async () => {
    const mockPatient = {
      id: "patient-1",
      userId: "user-1",
      dateOfBirth: "1990-05-15",
      phone: "+34 600 000 000",
      createdAt: "2025-01-10T10:00:00.000Z",
    };

    vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockPatient });

    const { getPatient } = usePatientsApi();
    const result = await getPatient("patient-1");

    expect(axiosInstance.get).toHaveBeenCalledWith("/patients/patient-1");
    expect(result).toEqual(mockPatient);
  });
});
