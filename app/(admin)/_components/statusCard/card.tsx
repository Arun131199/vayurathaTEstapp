import { StatuscardProps } from "@/types/statuscardProps";

export function StatusCard({
    icon: Icon,
    title,
    value,
}: StatuscardProps) {
    return (
        <div
            className="relative h-42.5 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.04] px-6 py-6"
        >
            {/* Background Circle */}
            <div
                className=" pointer-events-none absolute -right-12 -bottom-15.5 h-38.75 w-38.75 rounded-full border-2 border-amber-400/30"
            />

            {/* Top Section */}
            <div className="relative z-10 flex items-start justify-between">
                {/* Icon */}
                <div
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white"
                >
                    <Icon
                        size={21}
                        strokeWidth={1.8}
                    />
                </div>

                {/* Title */}
                <p
                    className="pt-1 text-[13px] font-bold tracking-[1px] text-white/35"
                >
                    {title.toUpperCase()}
                </p>
            </div>

            {/* Value */}
            <div className="relative z-10 mt-4">
                <h1 className="text-[38px] font-bold leading-none tracking-tight text-white">
                    {value}
                </h1>
            </div>
        </div>
    );
}