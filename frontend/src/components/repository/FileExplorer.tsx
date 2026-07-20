import { useState } from "react";
import { ChevronRight, Folder, FileCode } from "lucide-react";
import clsx from "clsx";

import type { FileNode } from "../../api/repository";

interface Props {
    files: FileNode[];
    activePath?: string;
    onSelectFile?: (path: string) => void;
}

function Node({
    node,
    depth,
    activePath,
    onSelectFile,
}: {
    node: FileNode;
    depth: number;
    activePath?: string;
    onSelectFile?: (path: string) => void;
}) {

    const [open, setOpen] = useState(depth < 1);

    if (node.type === "folder") {
        return (
            <div>

                <button
                    onClick={() => setOpen((v) => !v)}
                    style={{ paddingLeft: 12 + depth * 14 }}
                    className="flex w-full items-center gap-1.5 py-1.5 pr-3 text-left text-[13px] text-parchment-dim transition-colors hover:text-parchment"
                >
                    <ChevronRight
                        size={13}
                        className={clsx("shrink-0 transition-transform", open && "rotate-90")}
                    />
                    <Folder size={14} className="shrink-0 text-olive-500" />
                    <span className="truncate">{node.name}</span>
                </button>

                {open && node.children && (
                    <div>
                        {node.children.map((child) => (
                            <Node
                                key={child.path}
                                node={child}
                                depth={depth + 1}
                                activePath={activePath}
                                onSelectFile={onSelectFile}
                            />
                        ))}
                    </div>
                )}

            </div>
        );
    }

    return (
        <button
            onClick={() => onSelectFile?.(node.path)}
            style={{ paddingLeft: 12 + depth * 14 + 18 }}
            className={clsx(
                "flex w-full items-center gap-1.5 py-1.5 pr-3 text-left text-[13px] transition-colors",
                activePath === node.path
                    ? "bg-olive-800 text-olive-300"
                    : "text-parchment-dim hover:text-parchment"
            )}
        >
            <FileCode size={13} className="shrink-0" />
            <span className="truncate font-mono">{node.name}</span>
        </button>
    );
}

export default function FileExplorer({ files, activePath, onSelectFile }: Props) {
    return (
        <div className="flex h-full flex-col">

            <div className="border-b border-line px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-parchment-faint">
                Files
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                {files.map((node) => (
                    <Node
                        key={node.path}
                        node={node}
                        depth={0}
                        activePath={activePath}
                        onSelectFile={onSelectFile}
                    />
                ))}
            </div>

        </div>
    );
}
