import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Workflow, AlertCircle, Loader2, FileCode, X } from "lucide-react";
import clsx from "clsx";

import DashboardLayout from "../layouts/DashboardLayout";
import Spinner from "../components/common/Spinner";
import FileExplorer from "../components/repository/FileExplorer";
import RepositoryStats from "../components/repository/RepositoryStats";
import DependencyGraph from "../components/repository/DependencyGraph";
import FileViewer from "../components/repository/FileViewer";
import ChatWindow from "../components/chat/ChatWindow";
import {
    getRepository,
    getRepositoryFiles,
    getRepositoryStats,
    getRepositoryGraph,
} from "../api/repository";
import { getWorkspace } from "../api/workspace";

function PanelMessage({
    icon: Icon,
    text,
}: {
    icon: typeof AlertCircle;
    text: string;
}) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <Icon size={18} className="text-parchment-faint" />
            <p className="text-xs text-parchment-dim">{text}</p>
        </div>
    );
}

export default function Repository() {

    const { repositoryId } = useParams();
    const id = Number(repositoryId);
    const [tab, setTab] = useState<"chat" | "graph" | "file">("chat");
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    function openFile(path: string) {
        setSelectedFile(path);
        setTab("file");
    }

    function closeFile() {
        setSelectedFile(null);
        setTab("chat");
    }

    const repoQuery = useQuery({
        queryKey: ["repository", id],
        queryFn: () => getRepository(id),
        retry: 1,
        enabled: Number.isFinite(id),
        refetchInterval: (query) => {
            const status = query.state.data?.index_status;
            return status === "indexing" || status === "pending" ? 3000 : false;
        },
    });

    const status = repoQuery.data?.index_status;
    const isReady = status === "ready";

    const workspaceQuery = useQuery({
        queryKey: ["workspace", repoQuery.data?.workspace_id],
        queryFn: () => getWorkspace(repoQuery.data!.workspace_id),
        enabled: Boolean(repoQuery.data?.workspace_id),
        retry: 1,
    });

    const filesQuery = useQuery({
        queryKey: ["repository", id, "files"],
        queryFn: () => getRepositoryFiles(id),
        retry: 1,
        enabled: Number.isFinite(id) && isReady,
    });

    const statsQuery = useQuery({
        queryKey: ["repository", id, "stats"],
        queryFn: () => getRepositoryStats(id),
        retry: 1,
        enabled: Number.isFinite(id) && isReady,
    });

    const graphQuery = useQuery({
        queryKey: ["repository", id, "graph"],
        queryFn: () => getRepositoryGraph(id),
        retry: 1,
        enabled: tab === "graph" && Number.isFinite(id) && isReady,
    });

    const notReadyMessage =
        status === "failed"
            ? "Indexing failed for this repository. Try re-uploading it."
            : status === "indexing" || status === "pending"
            ? "Indexing in progress. This panel will update automatically."
            : null;

    return (
        <DashboardLayout
            noPadding
            breadcrumb={[
                { label: "Dashboard", to: "/dashboard" },
                {
                    label: workspaceQuery.data?.name ?? "Workspace",
                    to: repoQuery.data ? `/workspace/${repoQuery.data.workspace_id}` : undefined,
                },
                { label: repoQuery.data?.name ?? (repoQuery.isError ? "Not found" : "Loading...") },
            ]}
        >

            {
                repoQuery.isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <Spinner size={24} />
                    </div>
                ) : repoQuery.isError ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3">
                        <AlertCircle size={22} className="text-walnut-300" />
                        <p className="text-sm text-parchment-dim">
                            Couldn't load this repository.
                        </p>
                    </div>
                ) : (

                    <div className="flex h-full">

                        <div className="w-64 shrink-0 border-r border-line">
                            {
                                notReadyMessage ? (
                                    <PanelMessage
                                        icon={status === "failed" ? AlertCircle : Loader2}
                                        text={notReadyMessage}
                                    />
                                ) : filesQuery.isLoading ? (
                                    <div className="flex h-full items-center justify-center">
                                        <Spinner size={20} />
                                    </div>
                                ) : filesQuery.isError ? (
                                    <PanelMessage icon={AlertCircle} text="Couldn't load files." />
                                ) : (
                                    <FileExplorer
                                        files={filesQuery.data ?? []}
                                        activePath={selectedFile ?? undefined}
                                        onSelectFile={openFile}
                                    />
                                )
                            }
                        </div>

                        <div className="flex flex-1 flex-col border-r border-line">

                            <div className="flex border-b border-line">

                                <button
                                    onClick={() => setTab("chat")}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-3 text-sm transition-colors",
                                        tab === "chat"
                                            ? "border-b-2 border-olive-500 text-parchment"
                                            : "text-parchment-dim hover:text-parchment"
                                    )}
                                >
                                    <MessageSquare size={14} />
                                    Chat
                                </button>

                                <button
                                    onClick={() => setTab("graph")}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-3 text-sm transition-colors",
                                        tab === "graph"
                                            ? "border-b-2 border-olive-500 text-parchment"
                                            : "text-parchment-dim hover:text-parchment"
                                    )}
                                >
                                    <Workflow size={14} />
                                    Dependency graph
                                </button>

                                {selectedFile && (
                                    <button
                                        onClick={() => setTab("file")}
                                        className={clsx(
                                            "flex min-w-0 items-center gap-2 border-l border-line px-4 py-3 text-sm transition-colors",
                                            tab === "file"
                                                ? "border-b-2 border-olive-500 text-parchment"
                                                : "text-parchment-dim hover:text-parchment"
                                        )}
                                    >
                                        <FileCode size={14} className="shrink-0" />
                                        <span className="max-w-[160px] truncate font-mono text-xs">
                                            {selectedFile.split("/").pop()}
                                        </span>
                                        <span
                                            role="button"
                                            aria-label="Close file"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                closeFile();
                                            }}
                                            className="ml-1 shrink-0 rounded-sm p-0.5 text-parchment-faint hover:bg-ink hover:text-parchment"
                                        >
                                            <X size={12} />
                                        </span>
                                    </button>
                                )}

                            </div>

                            <div className="flex-1 overflow-hidden">
                                {
                                    notReadyMessage ? (
                                        <PanelMessage
                                            icon={status === "failed" ? AlertCircle : Loader2}
                                            text={notReadyMessage}
                                        />
                                    ) : tab === "chat" ? (
                                        <ChatWindow repositoryId={id} />
                                    ) : tab === "file" && selectedFile ? (
                                        <FileViewer repositoryId={id} path={selectedFile} />
                                    ) : graphQuery.isLoading ? (
                                        <div className="flex h-full items-center justify-center">
                                            <Spinner size={20} />
                                        </div>
                                    ) : graphQuery.isError ? (
                                        <PanelMessage icon={AlertCircle} text="Couldn't load the dependency graph." />
                                    ) : graphQuery.data && graphQuery.data.nodes.length === 0 ? (
                                        <PanelMessage icon={Workflow} text="No call relationships were found in this repository." />
                                    ) : graphQuery.data ? (
                                        <DependencyGraph nodes={graphQuery.data.nodes} edges={graphQuery.data.edges} />
                                    ) : null
                                }
                            </div>

                        </div>

                        <div className="w-72 shrink-0">
                            {
                                notReadyMessage ? (
                                    <PanelMessage
                                        icon={status === "failed" ? AlertCircle : Loader2}
                                        text={notReadyMessage}
                                    />
                                ) : statsQuery.isLoading ? (
                                    <div className="flex h-full items-center justify-center">
                                        <Spinner size={20} />
                                    </div>
                                ) : statsQuery.isError ? (
                                    <PanelMessage icon={AlertCircle} text="Couldn't load statistics." />
                                ) : statsQuery.data ? (
                                    <RepositoryStats stats={statsQuery.data} />
                                ) : null
                            }
                        </div>

                    </div>

                )
            }

        </DashboardLayout>
    );
}
