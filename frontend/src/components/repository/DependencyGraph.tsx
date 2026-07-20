import { useMemo, useState } from "react";
import clsx from "clsx";

import type { GraphNode, GraphEdge } from "../../api/repository";

interface Props {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

const typeColor: Record<GraphNode["type"], string> = {
    file: "#4fae8a",
    function: "#d9a34e",
    class: "#f0c17a",
};

const kindStroke: Record<GraphEdge["kind"], string> = {
    imports: "#245c46",
    calls: "#8a5f24",
    inherits: "#99a3b1",
};

export default function DependencyGraph({ nodes, edges }: Props) {

    const [active, setActive] = useState<string | null>(null);

    const size = 480;
    const center = size / 2;
    const radius = size / 2 - 64;

    const positions = useMemo(() => {
        const map = new Map<string, { x: number; y: number }>();
        nodes.forEach((node, i) => {
            const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
            map.set(node.id, {
                x: center + radius * Math.cos(angle),
                y: center + radius * Math.sin(angle),
            });
        });
        return map;
    }, [nodes, center, radius]);

    return (
        <div className="flex h-full flex-col">

            <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-parchment-faint">
                <span>Dependency graph</span>
                <div className="flex items-center gap-3.5 normal-case">
                    {Object.entries(typeColor).map(([type, color]) => (
                        <span key={type} className="flex items-center gap-1.5 text-parchment-dim">
                            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                            {type}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-auto p-6">

                <svg width="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-xl">

                    {edges.map((edge, i) => {

                        const from = positions.get(edge.source);
                        const to = positions.get(edge.target);
                        if (!from || !to) return null;

                        const isRelated = active === edge.source || active === edge.target;

                        return (
                            <line
                                key={i}
                                x1={from.x}
                                y1={from.y}
                                x2={to.x}
                                y2={to.y}
                                stroke={kindStroke[edge.kind]}
                                strokeWidth={isRelated ? 1.6 : 0.8}
                                opacity={active ? (isRelated ? 0.9 : 0.15) : 0.5}
                            />
                        );

                    })}

                    {nodes.map((node) => {

                        const pos = positions.get(node.id);
                        if (!pos) return null;

                        const isActive = active === node.id;

                        return (
                            <g
                                key={node.id}
                                onMouseEnter={() => setActive(node.id)}
                                onMouseLeave={() => setActive(null)}
                                className="cursor-pointer"
                            >
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={isActive ? 8 : 6}
                                    fill={typeColor[node.type]}
                                    opacity={active && !isActive ? 0.35 : 1}
                                />
                                <text
                                    x={pos.x}
                                    y={pos.y - 13}
                                    textAnchor="middle"
                                    className={clsx(
                                        "font-mono text-[10px]",
                                        isActive ? "fill-parchment" : "fill-parchment-faint"
                                    )}
                                >
                                    {node.label}
                                </text>
                            </g>
                        );

                    })}

                </svg>

            </div>

        </div>
    );
}
