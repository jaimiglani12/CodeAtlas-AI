import api from "./axios";

export interface Source {
    file: string;
    lines: string;
}

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
    created_at: string;
}

export async function sendMessage(
    repositoryId: number,
    message: string
): Promise<ChatMessage> {
    const response = await api.post("/chat", {
        repository_id: repositoryId,
        message,
    });
    return response.data;
}

export async function getChatHistory(
    repositoryId: number
): Promise<ChatMessage[]> {
    const response = await api.get("/chat/history", {
        params: { repository_id: repositoryId },
    });
    return response.data;
}
