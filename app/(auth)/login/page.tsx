import DroneGraphic from "@/components/svg/droneGraphic";
import LoginForm from "./_component/login";
import logo from "../../../public/rpto1-logo.png"
import Image from "next/image";

export default function Login() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#063b2d]">
            <div
                className="
                    absolute inset-0 bg-[linear-gradient(rgba(255,190,30,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,190,30,0.055)_1px,transparent_1px)]
                    bg-size-[77px_77px]
                "
            />
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <DroneGraphic />
            </div>
            <div className="absolute left-12 bottom-20 z-10 max-w-md">
                <p className="mb-4 text-sm font-bold tracking-[0.3em] text-[#f5a623]">
                    DRONE PILOT ACADEMY · INDIA
                </p>
                <h1 className="text-5xl font-bold leading-[1.5] text-white">
                    <span>Certified.</span>
                    <br />
                    <span>Qualified.</span>
                    <br />
                    <span>Airborne.</span>
                </h1>

                <p className="mt-6 text-lg leading-7 text-white/50">
                    DGCA-aligned assessment platform for
                    professional drone operators.
                </p>
            </div>
            <div className="absolute right-10 top-1/2 z-20 w-105 -translate-y-1/2 space-y-3">
                <div className="flex items-center gap-4">
                    <Image
                        src={logo}
                        alt="logo"
                        height={120}
                        width={120}
                    />
                    <div>
                        <h1 className="text-lg font-semibold text-gray-200">Vayuratha Test Portal</h1>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        Welcome back
                    </h2>

                    <p className="mt-2 text-white/50">
                        Sign in to your assessment account
                    </p>
                </div>
                <LoginForm />
            </div>
        </div >
    )
}