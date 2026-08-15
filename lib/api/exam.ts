import { cookies } from "next/headers";
import api from "../axios";
import { ExamStats } from "@/types/examStats";

export interface PublishExamPayload {
    startTime: string;
    endTime: string;
}

export interface CreateExamPayload {
    title: string;
    category: string;
    questionCount: number;
    durationMinutes: number;
}

async function getAccessToken() {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error("Authentication token not found");
    }

    return accessToken;
}

export async function getExamStats(): Promise<ExamStats> {
    const accessToken = await getAccessToken();

    const response = await api.get<ExamStats>(
        "/admin/exams/stats",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
}

export async function getUsers() {
    const accessToken = await getAccessToken();

    const response = await api.get(
        "/admin/users",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
}

export async function getExams() {
    const accessToken = await getAccessToken();

    const response = await api.get(
        "/admin/exams",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
}

export async function publishExam(
    examId: number,
    payload: PublishExamPayload
) {
    const accessToken = await getAccessToken();

    console.log("========== PUBLISH EXAM ==========");
    console.log("EXAM ID:", examId);
    console.log("PAYLOAD:", payload);
    console.log("TOKEN EXISTS:", !!accessToken);

    try {
        const response = await api.put(
            `/admin/exams/${examId}/publish`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        console.log("PUBLISH RESPONSE:", response.data);

        return response.data;

    } catch (error: any) {

        console.error("========== PUBLISH ERROR ==========");
        console.error("STATUS:", error?.response?.status);
        console.error("DATA:", error?.response?.data);
        console.error("MESSAGE:", error?.message);

        throw error;
    }
}

export async function createExam(
    payload: CreateExamPayload
) {
    const accessToken = await getAccessToken();

    const response = await api.post(
        "/admin/exams",
        payload,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
}