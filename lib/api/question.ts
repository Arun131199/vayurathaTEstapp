import api from "../axios";

export async function importQuestion(
    file: File,
    examId: number
) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("examId", String(examId));

    const response = await fetch("/api/admin/questions/import", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data?.message || `Question import failed (${response.status})`
        );
    }

    return data;
}