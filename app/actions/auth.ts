"use server";

import api from "@/lib/axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    const cookieStore = await cookies();

    const accessToken =
        cookieStore.get("access_token")?.value;

    try {
        await api.post(
            "/auth/logout",
            {},
            {
                headers: {
                    Cookie: `access_token=${accessToken}`,
                },
            }
        );
    } catch (error) {
        console.error("Logout failed:", error);
    }
    redirect("/login");
}

