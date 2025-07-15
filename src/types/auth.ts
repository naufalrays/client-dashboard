export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    status: string;
    message: string;
    data: {
        accessToken: string;
    };
}