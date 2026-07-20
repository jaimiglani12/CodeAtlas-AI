import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlock {
    type: "code";
    language: string;
    content: string;
}

interface TextBlock {
    type: "text";
    content: string;
}

function parseBlocks(content: string): (CodeBlock | TextBlock)[] {

    const blocks: (CodeBlock | TextBlock)[] = [];
    const regex = /```(\w*)\n?([\s\S]*?)```/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {

        if (match.index > lastIndex) {
            blocks.push({ type: "text", content: content.slice(lastIndex, match.index) });
        }

        blocks.push({
            type: "code",
            language: match[1] || "text",
            content: match[2].replace(/\n$/, ""),
        });

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
        blocks.push({ type: "text", content: content.slice(lastIndex) });
    }

    return blocks;
}

function renderInline(text: string): ReactNode[] {

    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter((p) => p !== "");

    return parts.map((part, i) => {

        if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
            return (
                <code
                    key={i}
                    className="rounded-sm bg-ink px-1.5 py-0.5 font-mono text-[12px] text-olive-300"
                >
                    {part.slice(1, -1)}
                </code>
            );
        }

        if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
            return (
                <strong key={i} className="font-semibold text-parchment">
                    {part.slice(2, -2)}
                </strong>
            );
        }

        return part;
    });
}

function CodeBlockView({ language, content }: { language: string; content: string }) {

    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard unavailable — ignore
        }
    }

    return (
        <div className="my-2 overflow-hidden rounded-sm border border-line bg-ink">

            <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-parchment-faint">
                    {language}
                </span>
                <button
                    onClick={copy}
                    className="flex items-center gap-1 text-[11px] text-parchment-faint transition-colors hover:text-parchment"
                >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>

            <pre className="overflow-x-auto p-3 text-[12.5px] leading-[1.6]">
                <code className="font-mono text-parchment">{content}</code>
            </pre>

        </div>
    );
}

export default function Markdown({ content }: { content: string }) {

    const blocks = parseBlocks(content);

    return (
        <div className="space-y-2">
            {blocks.map((block, i) => {

                if (block.type === "code") {
                    return <CodeBlockView key={i} language={block.language} content={block.content} />;
                }

                return block.content
                    .split(/\n\n+/)
                    .filter((para) => para.trim().length > 0)
                    .map((para, j) => (
                        <p key={`${i}-${j}`} className="whitespace-pre-wrap">
                            {renderInline(para.trim())}
                        </p>
                    ));

            })}
        </div>
    );
}
