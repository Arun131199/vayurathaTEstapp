import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Authentication token not found" },
                { status: 401 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!baseUrl) {
            return NextResponse.json(
                { message: "API URL is not configured" },
                { status: 500 }
            );
        }

        const response = await fetch(`${baseUrl}/admin/exams`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            cache: "no-store",
        });

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error("Failed to fetch exams:", error);

        return NextResponse.json(
            { message: "Failed to fetch exams" },
            { status: 500 }
        );
    }
}