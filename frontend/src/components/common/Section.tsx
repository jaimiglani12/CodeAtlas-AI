import type { ReactNode } from "react";
import clsx from "clsx";

interface Props {
    children: ReactNode;
    className?: string;
    border?: boolean;
}

export default function Section({
    children,
    className,
    border = true,
}: Props) {
    return (
        <section
            className={clsx(
                "py-24",
                border && "border-b border-line",
                className
            )}
        >
            {children}
        </section>
    );
}
