import api from "./axios";

export type IndexStatus = "pending" | "indexing" | "ready" | "failed";

export interface Repository {
    id: number;
    workspace_id: number;
    name: string;
    source: "zip" | "github" | "local";
    language_summary: string;
    file_count: number;
    index_status: IndexStatus;
    created_at: string;
    updated_at: string;
}

export interface RepositoryStats {
    languages: { name: string; percentage: number }[];
    files: number;
    functions: number;
    classes: number;
    dependencies: number;
    embedding_status: IndexStatus;
}

export interface FileNode {
    name: string;
    path: string;
    type: "folder" | "file";
    children?: FileNode[];
}

export interface GraphNode {
    id: string;
    label: string;
    type: "file" | "function" | "class";
}

export interface GraphEdge {
    source: string;
    target: string;
    kind: "imports" | "calls" | "inherits";
}

export interface FileContent {
    path: string;
    language: string;
    content: string;
    truncated: boolean;
}

export async function listRepositories(
    workspaceId: number
): Promise<Repository[]> {
    const response = await api.get(`/repository/workspace/${workspaceId}`);
    return response.data;
}

export async function uploadRepository(
    workspaceId: number,
    data: { name: string; file?: File; githubUrl?: string }
): Promise<Repository> {
    const form = new FormData();
    form.append("workspace_id", String(workspaceId));
    form.append("name", data.name);
    if (data.file) form.append("file", data.file);
    if (data.githubUrl) form.append("github_url", data.githubUrl);

    const response = await api.post("/repository/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export async function deleteRepository(id: number): Promise<void> {
    await api.delete(`/repository/${id}`);
}

export async function getRepository(id: number): Promise<Repository> {
    const response = await api.get(`/repository/${id}`);
    return response.data;
}

export async function getRepositoryFiles(id: number): Promise<FileNode[]> {
    const response = await api.get(`/repository/${id}/files`);
    return response.data;
}

export async function getRepositoryStats(
    id: number
): Promise<RepositoryStats> {
    const response = await api.get(`/repository/${id}/stats`);
    return response.data;
}

export async function getRepositoryGraph(
    id: number
): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const response = await api.get(`/repository/${id}/graph`);
    return response.data;
}

export async function getFileContent(
    id: number,
    path: string
): Promise<FileContent> {
    const response = await api.get(`/repository/${id}/files/content`, {
        params: { path },
    });
    return response.data;
}
