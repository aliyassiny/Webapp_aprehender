import { axiosInstance } from "@/lib/axiosInstance";
import type { User } from "@/types/index";

export const useUsersApi = () => {
    const getUsers = async () => {
        const response = await axiosInstance.get("/users");
        return response.data;
    };

    const postUser = async (userData: User) => {
        const response = await axiosInstance.post("/users", userData);
        return response.data;
    };

    const getUserById = async (id: string) => {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    };

    const updateUser = async (id: string, userData: User) => {
        const response = await axiosInstance.patch(`/users/${id}`, userData);
        return response.data;
    };

    const deleteUser = async (id: string) => {
        const response = await axiosInstance.delete(`/users/${id}`);
        return response.data;
    };

    return {
        getUsers,
        postUser,
        getUserById,
        updateUser,
        deleteUser
    };
};