import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosInstance } from "@/lib/axiosInstance";
import { useTherapistsApi } from "@/connections/api/therapists";

vi.mock("@/lib/axiosInstance", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("useTherapistsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getTherapist recibe y devuelve los datos del terapeuta del backend correctamente", async () => {
    const mockTherapist = {
      id: "therapist-1",
      userId: "user-1",
      specialization: "Psicología clínica",
      createdAt: "2025-01-10T10:00:00.000Z",
    };

    vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockTherapist });

    const { getTherapist } = useTherapistsApi();
    const result = await getTherapist("therapist-1");

    expect(axiosInstance.get).toHaveBeenCalledWith("/therapists/therapist-1");
    expect(result).toEqual(mockTherapist);
    expect(result.specialization).toBe("Psicología clínica");
  });
});
