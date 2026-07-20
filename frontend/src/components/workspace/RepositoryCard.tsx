import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GitBranch, FolderGit2, FolderArchive, ChevronRight, Loader2, CheckCircle2, XCircle, Clock, Trash2 } from "lucide-react";
import clsx from "clsx";

import Card from "../common/Card";
import Spinner from "../common/Spinner";
import { deleteRepository, type Repository } from "../../api/repository";

interface Props {
    repository: Repository;
}

const statusMeta = {
    pending: { label: "Pending", icon: Clock, className: "text-parchment-faint" },
    indexing: { label: "Indexing", icon: Loader2, className: "text-walnut-300 animate-spin" },
    ready: { label: "Ready", icon: CheckCircle2, className: "text-olive-500" },
    failed: { label: "Failed", icon: XCircle, className: "text-walnut-300" },
};

const sourceMeta = {
    github: { label: "GitHub", icon: FolderGit2 },
    zip: { label: "Upload", icon: FolderArchive },
    local: { label: "Local", icon: FolderArchive },
};

function relativeTime(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.round(diffMs / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
}

export default function RepositoryCard({ repository }: Props) {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [confirming, setConfirming] = useState(false);
    const status = statusMeta[repository.index_status];
    const StatusIcon = status.icon;

    const deleteMutation = useMutation({
        mutationFn: () => deleteRepository(repository.id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["repositories", repository.workspace_id],
            });
        },
    });

    function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();

        if (!confirming) {
            setConfirming(true);
            return;
        }

        deleteMutation.mutate();
    }

    return (
        <Card
            className="group relative cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:border-line-strong hover:bg-ink-raised-2 hover:shadow-md hover:shadow-black/30"
            onClick={() => navigate(`/repository/${repository.id}`)}
        >

            <div className="flex items-start justify-between">

                <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-line-strong bg-ink text-parchment-dim">
                    <GitBranch size={15} />
                </div>

                <div className="flex items-center gap-1">

                    <button
                        onClick={handleDelete}
                        onMouseLeave={() => setConfirming(false)}
                        disabled={deleteMutation.isPending}
                        aria-label="Delete repository"
                        className={clsx(
                            "flex h-7 w-7 items-center justify-center rounded-sm text-parchment-faint opacity-0 transition-colors group-hover:opacity-100",
                            confirming
                                ? "bg-walnut-700 text-parchment opacity-100"
                                : "hover:bg-ink hover:text-walnut-300"
                        )}
                    >
                        {deleteMutation.isPending ? <Spinner size={13} /> : <Trash2 size={14} />}
                    </button>

                    <ChevronRight
                        size={16}
                        className="mt-0.5 text-parchment-faint transition-transform group-hover:translate-x-1 group-hover:text-parchment-dim"
                    />

                </div>

            </div>

            <h3 className="mt-4 text-[15px] font-semibold text-parchment">
                {repository.name}
            </h3>

            <p className="mt-1 line-clamp-1 text-sm text-parchment-dim">
                {repository.language_summary} · {repository.file_count} files
            </p>

            <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-parchment-faint">
                {(() => {
                    const SourceIcon = sourceMeta[repository.source].icon;
                    return (
                        <span className="flex items-center gap-1.5">
                            <SourceIcon size={11} />
                            {sourceMeta[repository.source].label}
                        </span>
                    );
                })()}
                <span>·</span>
                <span>updated {relativeTime(repository.updated_at)}</span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 font-mono text-xs">
                <span className="flex items-center gap-2">
                    <StatusIcon size={13} className={clsx("shrink-0", status.className)} />
                    <span className={status.className}>{status.label}</span>
                </span>
                {confirming && (
                    <span className="text-walnut-300">Click again to confirm</span>
                )}
            </div>

        </Card>
    );
}
