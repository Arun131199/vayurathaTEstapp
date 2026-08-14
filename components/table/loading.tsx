export function Loading() {
    return (
        <div className="w-full animate-pulse">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="h-5 w-32 rounded-md bg-white/10" />
            </div>

            {/* Search + Filter */}
            <div className="mb-4 flex items-center gap-4">
                <div className="h-10 w-[400px] rounded-md bg-white/10" />

                <div className="flex items-center gap-1 rounded-md border border-gray-700 p-1">
                    <div className="h-8 w-16 rounded-md bg-white/10" />
                    <div className="h-8 w-16 rounded-md bg-white/10" />
                    <div className="h-8 w-16 rounded-md bg-white/10" />
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-hidden rounded-[20px] border border-[#205746] bg-[#0e4938]">

                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 border-b border-[#205746] px-7 py-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-3 w-20 rounded bg-white/10"
                        />
                    ))}
                </div>

                {/* Table Rows */}
                <div>
                    {Array.from({ length: 8 }).map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="grid grid-cols-6 items-center gap-4 border-b border-[#205746] px-7 py-5"
                        >
                            {/* Student */}
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 shrink-0 rounded-full bg-white/10" />

                                <div className="h-4 w-24 rounded bg-white/10" />
                            </div>

                            {/* Exam */}
                            <div className="h-4 w-32 rounded bg-white/10" />

                            {/* Score */}
                            <div className="h-4 w-16 rounded bg-white/10" />

                            {/* Percentage */}
                            <div className="h-3 w-20 rounded bg-white/10" />

                            {/* Date */}
                            <div className="h-4 w-24 rounded bg-white/10" />

                            {/* Action */}
                            <div className="flex justify-end">
                                <div className="h-8 w-16 rounded-md bg-white/10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}