export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a2e22]">
            <div className="text-center">
                <h1 className="text-7xl font-bold text-[#f9a825]">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-bold text-white">
                    Page Not Found
                </h2>

                <p className="mt-2 text-gray-400">
                    The page you are looking for doesn't exist.
                </p>
            </div>
        </div>
    );
}