import api from "../axios";

export async function getExamsClient() {
    const response = await api.get("/admin/exams");

    return response.data;
}