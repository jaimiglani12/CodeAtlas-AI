import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import ContourMark from "../components/icons/ContourMark";

interface Props {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: Props) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6">

            <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.4]"
                viewBox="0 0 1120 620"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path d="M760,40 C900,30 1040,90 1080,200 C1120,320 1040,440 900,470 C760,500 660,430 660,320 C660,220 700,50 760,40 Z" fill="none" stroke="var(--color-line-strong)" strokeWidth="1" />
                <path d="M120,420 C220,400 330,440 360,510 C390,580 320,630 220,635 C120,640 60,590 65,520 C70,455 60,436 120,420 Z" fill="none" stroke="var(--color-line-strong)" strokeWidth="1" />
            </svg>

            <div className="relative z-10 w-full max-w-sm">

                <Link
                    to="/"
                    className="mb-8 flex items-center justify-center gap-2 font-display text-xl font-semibold text-parchment"
                >
                    <ContourMark className="text-olive-500" />
                    CodeAtlas AI
                </Link>

                <div className="animate-[fade-in_250ms_ease-out] rounded-sm border border-line bg-ink-raised p-8 shadow-xl shadow-black/40">

                    <h1 className="font-display text-2xl font-medium text-parchment">
                        {title}
                    </h1>

                    <p className="mt-2 text-sm text-parchment-dim">
                        {subtitle}
                    </p>

                    <div className="mt-7">
                        {children}
                    </div>

                </div>

            </div>

        </div>
    );
}
