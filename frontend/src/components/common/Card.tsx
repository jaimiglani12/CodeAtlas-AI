import type { HTMLAttributes } from "react";
import clsx from "clsx";

type Props = HTMLAttributes<HTMLDivElement>;

export default function Card({
    children,
    className,
    ...props
}: Props) {
    return (
        <div
            {...props}
            className={clsx(
                "rounded-sm border border-line bg-ink-raised p-6 shadow-sm shadow-black/20",
                className
            )}
        >
            {children}
        </div>
    );
}
