import { cookies } from "next/headers"

export async function Hero() {
    const cookieStore = await cookies();
    const fullName = cookieStore.get("username")?.value
    return (
        <div className="border border-gray-800 bg-white/10 p-6 rounded-md shadow-xl ">
            <div className="flex flex-col gap-2 border-b border-gray-500 pb-6">
                <h1 className="text-xs font-semibold text-[#f5a623] ">READY TO FLY?</h1>
                <p className="text-xl font-semibold text-white">Good morning, {fullName}</p>
                <p className="text-gray-400">
                    You have an exams available. Your assessment was scheduled <br /> at on 15 Aug 2026.
                </p>
            </div>
        </div>
    )
}