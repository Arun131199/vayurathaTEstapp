import api from "../axios";

export async function importQuestion(
    file: File,
    examId: number
) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("examId", String(examId));

    const response = await api.post(
        "/admin/questions/import",
        formData
    );

    return response.data;
}