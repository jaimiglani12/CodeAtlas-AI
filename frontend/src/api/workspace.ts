import api from "./axios";

export interface Workspace {
    id: number;
    name: string;
    description: string;
    repository_count: number;
    created_at: string;
}

export async function listWorkspaces(): Promise<Workspace[]> {
    const response = await api.get("/workspace");
    return response.data;
}

export async function getWorkspace(id: number): Promise<Workspace> {
    const response = await api.get(`/workspace/${id}`);
    return response.data;
}

export async function createWorkspace(data: {
    name: string;
    description?: string;
}): Promise<Workspace> {
    const response = await api.post("/workspace", data);
    return response.data;
}

export async function updateWorkspace(
    id: number,
    data: { name?: string; description?: string }
): Promise<Workspace> {
    const response = await api.put(`/workspace/${id}`, data);
    return response.data;
}

export async function deleteWorkspace(id: number): Promise<void> {
    await api.delete(`/workspace/${id}`);
}
