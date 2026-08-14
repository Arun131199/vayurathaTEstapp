import api from "../axios";

export interface PublishExamPayload {
    startTime: string;
    endTime: string;
}

export async function publishExam(
    examId: number,
    payload: PublishExamPayload
) {
    const response = await api.put(
        `/admin/exams/${examId}/publish`,
        payload
    );

    return response.data;
}


export async function startExam(
    userId: string,
    examId: number
) {
    const response = await api.post(
        "/exam/start",
        null,
        {
            params: {
                userId,
                examId,
            },
        }
    );

    return response.data;
}