import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, AlertCircle, Loader2 } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Spinner from "../components/common/Spinner";
import RepositoryStats from "../components/repository/RepositoryStats";
import ChatWindow from "../components/chat/ChatWindow";
import {
    getRepository,
    getRepositoryStats,
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

    const statsQuery = useQuery({
        queryKey: ["repository", id, "stats"],
        queryFn: () => getRepositoryStats(id),
        retry: 1,
        enabled: Number.isFinite(id) && isReady,
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

                        <div className="flex flex-1 flex-col border-r border-line">

                            <div className="flex border-b border-line">

                                <div className="flex items-center gap-2 border-b-2 border-olive-500 px-4 py-3 text-sm text-parchment">
                                    <MessageSquare size={14} />
                                    Chat
                                </div>

                            </div>

                            <div className="flex-1 overflow-hidden">
                                {
                                    notReadyMessage ? (
                                        <PanelMessage
                                            icon={status === "failed" ? AlertCircle : Loader2}
                                            text={notReadyMessage}
                                        />
                                    ) : (
                                        <ChatWindow repositoryId={id} />
                                    )
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
