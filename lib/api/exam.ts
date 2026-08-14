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

export async function getExamStats(): Promise<ExamStats> {
    const cookieStore = await cookies();

    const accessToken =
        cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error("Authentication token not found");
    }

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

    const cookieStore = await cookies();

    const accessToken =
        cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error(
            "Authentication token not found"
        );
    }

    const response = await api.get(
        "/admin/users",
        {
            headers: {
                "Content-Type": "application/json",
                Cookie: `access_token=${accessToken}`,
            },
        }
    );

    return response.data;
}


export async function getExams() {

    const cookieStore = await cookies();

    const accessToken =
        cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error(
            "Authentication token not found"
        );
    }

    const response = await api.get(
        "/admin/exams",
        {
            headers: {
                Cookie: `access_token=${accessToken}`,
            },
        }
    );

    return response.data;
}

export async function publishExam(
    examId: number,
    payload: PublishExamPayload
) {
    const response = await api.post(
        `/admin/exams/${examId}/publish`,
        payload
    );

    return response.data;
}

export async function createExam(
    payload: CreateExamPayload
) {
    const cookieStore = await cookies();

    const accessToken =
        cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error("Authentication token not found");
    }

    const response = await api.post(
        "/admin/exams",
        payload,
        {
            headers: {
                Cookie: `access_token=${accessToken}`,
            },
        }
    );

    return response.data;
}

