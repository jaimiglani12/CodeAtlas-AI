import { CheckCircle2, Loader2, Clock, XCircle } from "lucide-react";
import clsx from "clsx";

import type { RepositoryStats as Stats } from "../../api/repository";

interface Props {
    stats: Stats;
}

const statusMeta = {
    pending: { label: "Pending", icon: Clock, className: "text-parchment-faint" },
    indexing: { label: "Indexing", icon: Loader2, className: "text-walnut-300 animate-spin" },
    ready: { label: "Ready", icon: CheckCircle2, className: "text-olive-500" },
    failed: { label: "Failed", icon: XCircle, className: "text-walnut-300" },
};

export default function RepositoryStats({ stats }: Props) {

    const status = statusMeta[stats.embedding_status];
    const StatusIcon = status.icon;

    const counts = [
        { label: "Files", value: stats.files },
        { label: "Functions", value: stats.functions },
        { label: "Classes", value: stats.classes },
        { label: "Dependencies", value: stats.dependencies },
    ];

    return (
        <div className="flex h-full flex-col">

            <div className="border-b border-line px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-parchment-faint">
                Statistics
            </div>

            <div className="flex-1 overflow-y-auto p-4">

                <div className="flex items-center gap-2 rounded-sm border border-line bg-ink px-3.5 py-2.5 font-mono text-xs">
                    <StatusIcon size={13} className={clsx("shrink-0", status.className)} />
                    <span className={status.className}>Embeddings — {status.label}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">

                    {counts.map((count) => (

                        <div key={count.label} className="rounded-sm border border-line p-3.5">
                            <p className="font-display text-2xl font-medium text-parchment">
                                {count.value}
                            </p>
                            <p className="mt-1 text-xs text-parchment-dim">{count.label}</p>
                        </div>

                    ))}

                </div>

                <div className="mt-6">

                    <p className="font-mono text-[11px] uppercase tracking-wider text-parchment-faint">
                        Languages
                    </p>

                    <div className="mt-3 space-y-3">

                        {stats.languages.map((lang) => (

                            <div key={lang.name}>

                                <div className="flex justify-between text-xs">
                                    <span className="text-parchment">{lang.name}</span>
                                    <span className="text-parchment-dim">{lang.percentage}%</span>
                                </div>

                                <div className="mt-1.5 h-1 rounded-full bg-line">
                                    <div
                                        className="h-1 rounded-full bg-olive-500"
                                        style={{ width: `${lang.percentage}%` }}
                                    />
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}
