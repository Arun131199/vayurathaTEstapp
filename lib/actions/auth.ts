"use server";

import api from "@/lib/axios";
import { cookies } from "next/headers";

type LoginPayload = {
    email: string;
    password: string;
    role: "ADMIN" | "USER";
};

export async function loginAction(payload: LoginPayload) {
    const response = await api.post("/auth/login", payload);

    const data = response.data;

    const cookieStore = await cookies();

    cookieStore.set("access_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12,
    });

    cookieStore.set("userId", data.userId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12,
    });

    cookieStore.set("username", data.fullName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12,
    });

    return data;
}