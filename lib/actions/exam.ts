"use server";

import {
    createExam as createExamApi,
    CreateExamPayload,
} from "@/lib/api/exam";
import { cookies, headers } from "next/headers";
import api from "../axios";

export async function createExam(
    payload: CreateExamPayload
) {
    return await createExamApi(payload);
}


async function getToken() {
    const cookieStore = await cookies();

    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Authentication token not found");
    }

    return token;
}


// ========================================
// START EXAM
// ========================================

export async function startExam(examId: number) {

    const token = await getToken();

    const response = await api.post(
        `/exam/start?examId=${examId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const attempt = response.data;

    const cookieStore = await cookies();

    cookieStore.set(
        "exam_attempt_id",
        String(attempt.id),
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        }
    );

    return attempt;
}


// ========================================
// GET QUESTION
// ========================================

export async function getQuestionByIndex(
    index: number
) {

    const token = await getToken();

    const cookieStore = await cookies();

    const attemptId =
        cookieStore.get("exam_attempt_id")?.value;

    if (!attemptId) {
        throw new Error("Exam attempt not found");
    }

    console.log("ATTEMPT ID:", attemptId);
    console.log("QUESTION INDEX:", index);

    const response = await api.get(
        `/exam/${attemptId}/question/${index}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}


// ========================================
// SAVE ANSWER
// ========================================

export async function saveAnswer(
    questionId: number,
    selectedOption: string
) {

    const token = await getToken();

    const cookieStore = await cookies();

    const attemptId =
        cookieStore.get("exam_attempt_id")?.value;

    if (!attemptId) {
        throw new Error("Exam attempt not found");
    }

    const response = await api.post(
        `/exam/${attemptId}/answer`,
        {
            questionId: String(questionId),
            selectedOption,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}


// ========================================
// SUBMIT EXAM
// ========================================

export async function submitExam() {

    const token = await getToken();

    const cookieStore = await cookies();

    const attemptId =
        cookieStore.get("exam_attempt_id")?.value;

    if (!attemptId) {
        throw new Error("Exam attempt not found");
    }

    const response = await api.post(
        `/exam/${attemptId}/submit`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    cookieStore.delete("exam_attempt_id");

    return response.data;
}


// ========================================
// VIOLATION
// ========================================

export async function registerViolation() {

    const token = await getToken();

    const cookieStore = await cookies();

    const attemptId =
        cookieStore.get("exam_attempt_id")?.value;

    if (!attemptId) {
        throw new Error("Exam attempt not found");
    }

    const response = await api.post(
        `/exam/${attemptId}/violation`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}


export async function getMyResults() {
    const cookieStore=await cookies();
    const accessToken=cookieStore.get("access_token")?.value;

    if(!accessToken){
        throw new Error("Authendication token was not found")
    }

    const response=await api.get("/results/me",{
        headers:{
            Cookie: `access_token=${accessToken}`,
        }
    })

    return response.data;
}

export async function assignExamToAll(examId: number) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error("Authentication token was not found");
    }

    const response = await api.post(
        `/admin/exams/${examId}/assign-all`,
        {},   // empty body (POST needs a body argument even if unused)
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return response.data;
}

export async function getAdminResults() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    if (!accessToken) throw new Error("Authentication token not found");

    const response = await api.get("/admin/results", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
}

export async function getAdminResultDetails(
    attemptId: number
) {
    const token = await getToken();

    const response = await api.get(
        `/admin/results/${attemptId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}