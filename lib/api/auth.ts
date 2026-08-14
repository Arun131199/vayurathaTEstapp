import { LoginResponse } from "@/types/loginResponse";
import { LoginType } from "@/types/loginType";
import api from "../axios";

export async function loginUser(data: LoginType & {
    role: "ADMIN" | "USER";
}) {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        data
    );

    

    return response.data;
}

export async function logout() {
    await api.post("/auth/logout");
}