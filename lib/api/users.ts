"use server"

import { cookies } from "next/headers";
import api from "../axios";

type RegisterUserPayload = {
    fullName: string;
    email: string;
    password: string;
    role: string;
};

export async function addUsers(data: RegisterUserPayload) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value

    if (!accessToken) {
        throw new Error("Authentication token not found");
    }

    try {
        const response = await api.post(
            "/admin/users",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error;
    }
}