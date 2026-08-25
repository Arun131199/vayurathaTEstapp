import { cookies } from "next/headers";
import api from "../axios";

export async function getExamPerUser() {
    const cookieStore = await cookies();

    const userId =
        cookieStore.get("userId")?.value;

    const accessToken =
        cookieStore.get("access_token")?.value;

    if (!userId) {
        throw new Error("User ID not found");
    }

    if (!accessToken) {
        throw new Error("Authentication token not found");
    }
    const response = await api.get(
        `/student/exams/assigned/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
}