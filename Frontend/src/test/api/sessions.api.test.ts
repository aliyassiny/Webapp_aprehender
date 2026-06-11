import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosInstance } from "@/lib/axiosInstance";
import { useSessionsApi } from "@/connections/api/sessions";

vi.mock("@/lib/axiosInstance", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useSessionsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getSessions recibe y devuelve la lista de sesiones del backend correctamente", async () => {
    const mockSessions = [
      {
        id: "session-1",
        therapistId: "therapist-1",
        patientId: "patient-1",
        startTime: "2025-06-11T10:00:00.000Z",
        endTime: "2025-06-11T11:00:00.000Z",
        meetingLink: "https://meet.example.com/abc",
        isVirtual: true,
        status: "SCHEDULED",
        createdAt: "2025-06-01T08:00:00.000Z",
      },
    ];

    vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockSessions });

    const { getSessions } = useSessionsApi();
    const result = await getSessions();

    expect(axiosInstance.get).toHaveBeenCalledWith("/sessions");
    expect(result).toEqual(mockSessions);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("SCHEDULED");
  });
});
