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

        const response = await fetch(`${baseUrl}/admin/results/export`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: "Failed to export results" },
                { status: response.status }
            );
        }

        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type":
                    response.headers.get("content-type") ??
                    "application/octet-stream",
                "Content-Disposition": 'attachment; filename="admin-results.xlsx"',
            },
        });
    } catch (error) {
        console.error("Results export proxy failed:", error);

        return NextResponse.json(
            { message: "Failed to export results" },
            { status: 500 }
        );
    }
}