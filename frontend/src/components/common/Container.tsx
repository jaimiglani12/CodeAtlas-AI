import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function Container({
    children,
}: Props) {
    return (
        <div className="mx-auto max-w-6xl px-6">
            {children}
        </div>
    );
}
