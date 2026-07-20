import api from "./axios";

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export async function signup(data: SignupRequest) {

    const response = await api.post(
        "/auth/signup",
        data
    );

    return response.data;
}

export async function login(data: LoginRequest) {

    const form = new URLSearchParams();

    form.append("username", data.username);
    form.append("password", data.password);

    const response = await api.post(
        "/auth/login",
        form,
        {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data;
}

export async function me() {

    const response = await api.get("/auth/me");

    return response.data;
}

export interface PasswordChangeRequest {
    current_password: string;
    new_password: string;
}

export async function changePassword(data: PasswordChangeRequest) {

    const response = await api.put("/auth/password", data);

    return response.data;
}