import RegisterUser from "./_components/registerUser";

export default function Users() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col items-start gap-2 ">
                <h1 className="text-2xl font-semibold ">Register New User</h1>
                <p className="text-md text-gray-400">Add a student to the portal</p>
            </div>
            <div >
                <RegisterUser />
            </div>
        </div>
    )
}