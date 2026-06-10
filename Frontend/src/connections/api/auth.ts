import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/index";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const useAuthApi = () => {
    const { login, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password
            });
            const { data_user, accessToken, refreshToken } = response.data;

            login(data_user, accessToken, refreshToken);
            console.log(response.data);
            if (data_user.role === "COORDINATOR") {
                navigate("/coordinador");
            } else if (data_user.role === "THERAPIST") {
                navigate("/terapeuta");
            } else if (data_user.role === "PATIENT") {
                navigate("/paciente");
            }
        } catch (err) {
            setError("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleRegister = async (username: string, email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("http://localhost:3000/api/auth/register", {
                username,
                email,
                password
            });
            const data = response.data;
            console.log(data);
            login(data as User, data.accessToken, data.refreshToken);
            navigate("/login");
        } catch (err) {
            setError("Error al registrar usuario");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        handleLogin,
        handleLogout,
        handleRegister
    };
};
