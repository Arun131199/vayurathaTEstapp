import api from "../axios";

export async function getExamsClient() {
    const response = await fetch("/api/admin/exams", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error(`Failed to load exams: ${response.status}`);
    }
    return response.json();
}