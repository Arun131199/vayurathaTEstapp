import api from "../axios";

export async function shareResultToWhatsApp(payload: {
    imageBase64: string;
    examTitle: string;
    score: number;
    totalMarks: number;
    percentage: number;
}) {
    const response = await api.post("/results/share-whatsapp", payload);
    return response.data;
}