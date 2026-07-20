import { Check, User } from "lucide-react";
import clsx from "clsx";

import ContourMark from "../icons/ContourMark";
import Markdown from "./Markdown";
import type { ChatMessage } from "../../api/chat";

interface Props {
    message: ChatMessage;
}

export default function Message({ message }: Props) {

    const isUser = message.role === "user";

    return (
        <div className={clsx("flex gap-3", isUser && "flex-row-reverse")}>

            <div
                className={clsx(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    isUser
                        ? "bg-ink-raised-2 text-parchment-dim"
                        : "border border-olive-700 bg-olive-800 text-olive-300"
                )}
            >
                {isUser ? <User size={13} /> : <ContourMark size={13} />}
            </div>

            <div className={clsx("max-w-[80%]", isUser && "flex flex-col items-end")}>

                <div
                    className={clsx(
                        "rounded-sm px-4 py-3 text-sm leading-[1.65]",
                        isUser
                            ? "bg-ink-raised-2 text-parchment"
                            : "border border-line bg-ink-raised text-parchment"
                    )}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <Markdown content={message.content} />
                    )}
                </div>

                {message.sources && message.sources.length > 0 && (

                    <div className="mt-2 flex flex-wrap gap-1.5">

                        {message.sources.map((source) => (

                            <span
                                key={source.file}
                                className="flex items-center gap-1.5 rounded-sm bg-ink px-2.5 py-1 font-mono text-[11px] text-parchment-dim"
                            >
                                <Check size={11} className="text-olive-500" />
                                {source.file}
                                <span className="text-parchment-faint">{source.lines}</span>
                            </span>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}
