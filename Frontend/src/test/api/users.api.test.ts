import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosInstance } from "@/lib/axiosInstance";
import { useUsersApi } from "@/connections/api/users";

vi.mock("@/lib/axiosInstance", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useUsersApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUsers recibe y devuelve la lista de usuarios del backend correctamente", async () => {
    const mockUsers = [
      {
        id: "user-1",
        username: "maria.garcia",
        email: "maria@example.com",
        password: "",
        role: "THERAPIST",
        isActive: true,
      },
    ];

    vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockUsers });

    const { getUsers } = useUsersApi();
    const result = await getUsers();

    expect(axiosInstance.get).toHaveBeenCalledWith("/users");
    expect(result).toEqual(mockUsers);
    expect(result[0].role).toBe("THERAPIST");
  });
});
