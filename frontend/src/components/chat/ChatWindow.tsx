import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import Message from "./Message";
import ChatInput from "./ChatInput";
import Spinner from "../common/Spinner";
import { sendMessage, getChatHistory, type ChatMessage } from "../../api/chat";

interface Props {
    repositoryId: number;
}

export default function ChatWindow({ repositoryId }: Props) {

    const historyQuery = useQuery({
        queryKey: ["chat", repositoryId, "history"],
        queryFn: () => getChatHistory(repositoryId),
        retry: 1,
        staleTime: Infinity,
    });

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [hydrated, setHydrated] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (historyQuery.data && !hydrated) {
            setMessages(historyQuery.data);
            setHydrated(true);
        }
    }, [historyQuery.data, hydrated]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    const mutation = useMutation({
        mutationFn: (message: string) => sendMessage(repositoryId, message),
        onSuccess: (response) => {
            setMessages((prev) => [...prev, response]);
        },
        onError: () => {
            setMessages((prev) => [
                ...prev,
                {
                    id: `error-${Date.now()}`,
                    role: "assistant",
                    content: "Something went wrong answering that question. Please try again.",
                    created_at: new Date().toISOString(),
                },
            ]);
        },
    });

    function handleSend(text: string) {
        setMessages((prev) => [
            ...prev,
            {
                id: `local-${Date.now()}`,
                role: "user",
                content: text,
                created_at: new Date().toISOString(),
            },
        ]);
        mutation.mutate(text);
    }

    return (
        <div className="flex h-full flex-col">

            <div className="border-b border-line px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-parchment-faint">
                Chat
            </div>

            <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-5">

                {
                    historyQuery.isLoading ? (
                        <div className="flex h-full items-center justify-center">
                            <Spinner size={20} />
                        </div>
                    ) : historyQuery.isError ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                            <AlertCircle size={18} className="text-walnut-300" />
                            <p className="text-xs text-parchment-dim">
                                Couldn't load the conversation history.
                            </p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
                            <p className="text-sm text-parchment-dim">
                                Ask anything about this repository.
                            </p>
                            <p className="text-xs text-parchment-faint">
                                Answers are grounded in the indexed source code, with citations.
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <Message key={message.id} message={message} />
                        ))
                    )
                }

                {mutation.isPending && (
                    <div className="flex items-center gap-2 pl-10 text-xs text-parchment-faint">
                        <Spinner size={13} />
                        Retrieving context...
                    </div>
                )}

            </div>

            <ChatInput onSend={handleSend} disabled={mutation.isPending || historyQuery.isLoading} />

        </div>
    );
}
