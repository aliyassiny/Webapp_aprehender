import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosInstance } from "@/lib/axiosInstance";
import { useClinicalNotesApi } from "@/connections/api/clinicalNotes";

vi.mock("@/lib/axiosInstance", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useClinicalNotesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getNotesByPatient recibe y devuelve las notas clínicas del backend correctamente", async () => {
    const mockNotes = [
      {
        id: "note-1",
        patientId: "patient-1",
        therapistId: "therapist-1",
        content: "Sesión inicial completada con buena evolución.",
        createdAt: "2025-06-01T09:00:00.000Z",
      },
    ];

    vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockNotes });

    const { getNotesByPatient } = useClinicalNotesApi();
    const result = await getNotesByPatient("patient-1");

    expect(axiosInstance.get).toHaveBeenCalledWith("/clinical-notes/patient/patient-1");
    expect(result).toEqual(mockNotes);
    expect(result[0].content).toContain("Sesión inicial");
  });
});
