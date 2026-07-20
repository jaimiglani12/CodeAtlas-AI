import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
}

export default function Button({
    children,
    variant = "primary",
    className,
    disabled,
    ...props
}: Props) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={clsx(
                "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium transition-all duration-150",
                disabled
                    ? "cursor-not-allowed opacity-50"
                    : "active:scale-[0.98]",
                variant === "primary"
                    ? "bg-walnut-600 text-ink shadow-sm shadow-black/30 hover:bg-walnut-300 hover:shadow-md hover:shadow-black/30"
                    : "border border-line-strong text-parchment hover:border-olive-500 hover:text-olive-300 hover:bg-ink-raised",
                className
            )}
        >
            {children}
        </button>
    );
}
