import { useNavigate } from "react-router-dom";
import { FolderKanban, ChevronRight } from "lucide-react";

import Card from "../common/Card";
import type { Workspace } from "../../api/workspace";

interface Props {
    workspace: Workspace;
}

export default function WorkspaceCard({ workspace }: Props) {

    const navigate = useNavigate();

    return (
        <Card
            className="group cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:border-line-strong hover:bg-ink-raised-2 hover:shadow-md hover:shadow-black/30"
            onClick={() => navigate(`/workspace/${workspace.id}`)}
        >

            <div className="flex items-start justify-between">

                <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-olive-700 bg-olive-800 text-olive-300">
                    <FolderKanban size={16} />
                </div>

                <ChevronRight
                    size={16}
                    className="mt-1.5 text-parchment-faint transition-transform group-hover:translate-x-1 group-hover:text-parchment-dim"
                />

            </div>

            <h3 className="mt-4 text-[15px] font-semibold text-parchment">
                {workspace.name}
            </h3>

            <p className="mt-1 line-clamp-1 text-sm text-parchment-dim">
                {workspace.description || "No description yet."}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-xs text-parchment-faint">
                <span>{workspace.repository_count} repositories</span>
                <span>{new Date(workspace.created_at).toLocaleDateString()}</span>
            </div>

        </Card>
    );
}
