import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlertCircle, Check, Copy } from "lucide-react";

import Spinner from "../common/Spinner";
import { getFileContent } from "../../api/repository";

interface Props {
    repositoryId: number;
    path: string;
}

export default function FileViewer({ repositoryId, path }: Props) {

    const [copied, setCopied] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["repository", repositoryId, "file", path],
        queryFn: () => getFileContent(repositoryId, path),
        retry: 1,
    });

    async function copy() {
        if (!data) return;
        try {
            await navigator.clipboard.writeText(data.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard unavailable — ignore
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner size={20} />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <AlertCircle size={18} className="text-walnut-300" />
                <p className="text-xs text-parchment-dim">Couldn't load this file.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">

            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <span className="truncate font-mono text-xs text-parchment-dim">{data.path}</span>
                <button
                    onClick={copy}
                    className="flex shrink-0 items-center gap-1.5 text-xs text-parchment-faint transition-colors hover:text-parchment"
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>

            {data.truncated && (
                <div className="border-b border-line bg-ink px-4 py-2 font-mono text-[11px] text-walnut-300">
                    File truncated — showing the first portion only.
                </div>
            )}

            <pre className="flex-1 overflow-auto p-4 text-[12.5px] leading-[1.65]">
                <code className="font-mono text-parchment">{data.content}</code>
            </pre>

        </div>
    );
}
