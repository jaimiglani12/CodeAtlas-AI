import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: Props) {

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

            <div
                className="absolute inset-0 animate-[overlay-in_150ms_ease-out] bg-ink/80 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-md animate-[modal-in_180ms_ease-out] rounded-sm border border-line bg-ink-raised p-6 shadow-2xl shadow-black/50">

                <div className="flex items-center justify-between border-b border-line pb-4">

                    <h3 className="font-display text-lg font-medium text-parchment">
                        {title}
                    </h3>

                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-sm p-1 text-parchment-dim transition-colors hover:bg-ink hover:text-parchment"
                    >
                        <X size={18} />
                    </button>

                </div>

                <div className="pt-5">
                    {children}
                </div>

            </div>

        </div>,
        document.body
    );
}
