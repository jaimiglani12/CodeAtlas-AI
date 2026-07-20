import React from "react";
import clsx from "clsx";

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export default function Input({
    className,
    ...props
}: InputProps) {
    return (
        <input
            {...props}
            className={clsx(
                "w-full rounded-sm border border-line bg-ink-raised px-4 py-3 text-parchment",
                "placeholder:text-parchment-faint",
                "outline-none transition-all duration-150",
                "focus:border-olive-500 focus:shadow-[0_0_0_3px_var(--color-olive-800)]",
                "disabled:cursor-not-allowed disabled:opacity-60",
                className
            )}
        />
    );
}
