import { useState } from "react";
import { ArrowUp } from "lucide-react";

interface Props {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {

    const [value, setValue] = useState("");

    function submit() {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue("");
    }

    return (
        <div className="border-t border-line p-4">

            <div className="flex items-end gap-2 rounded-sm border border-line bg-ink px-3.5 py-2.5 focus-within:border-olive-500">

                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submit();
                        }
                    }}
                    placeholder="Ask about this repository..."
                    rows={1}
                    className="max-h-32 flex-1 resize-none bg-transparent text-sm text-parchment outline-none placeholder:text-parchment-faint"
                />

                <button
                    onClick={submit}
                    disabled={disabled || !value.trim()}
                    aria-label="Send message"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-walnut-600 text-ink shadow-sm shadow-black/30 transition-all hover:bg-walnut-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                    <ArrowUp size={15} />
                </button>

            </div>

        </div>
    );
}
