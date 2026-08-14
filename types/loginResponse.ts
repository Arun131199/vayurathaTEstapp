export interface LoginResponse {
    token: string;
    userId: string;
    fullName: string;
    email: string;
    role: "ADMIN" | "USER";
}