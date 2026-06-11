import { act, renderHook } from "@testing-library/react";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthApi } from "@/connections/api/auth";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: vi.fn(),
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("useAuthApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handleLogin recibe y procesa los datos del backend correctamente", async () => {
    const mockUser = {
      id: "user-1",
      username: "ana.lopez",
      email: "ana@example.com",
      password: "",
      role: "THERAPIST" as const,
      isActive: true,
    };

    vi.mocked(axios.post).mockResolvedValue({
      data: {
        data_user: mockUser,
        accessToken: "access-token",
        refreshToken: "refresh-token",
      },
    });

    const { result } = renderHook(() => useAuthApi());

    await act(async () => {
      await result.current.handleLogin("ana@example.com", "password123");
    });

    expect(axios.post).toHaveBeenCalledWith("http://localhost:3000/api/auth/login", {
      email: "ana@example.com",
      password: "password123",
    });
    expect(mockLogin).toHaveBeenCalledWith(mockUser, "access-token", "refresh-token");
    expect(mockNavigate).toHaveBeenCalledWith("/terapeuta");
  });
});
