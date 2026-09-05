import { ArrowRight, Check, GitBranch, Network, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Container from "../common/Container";
import Button from "../common/Button";

export default function Hero() {
    const productAreas = [
        { icon: GitBranch, label: "app" },
        { icon: Search, label: "retrieval" },
        { icon: Network, label: "indexing" },
        { icon: Sparkles, label: "chat" },
    ];

    return (
        <section className="relative overflow-hidden border-b border-line">

            <div className="hairline-grid pointer-events-none absolute inset-0 opacity-40" />

            <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.55]"
                viewBox="0 0 1120 620"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path d="M760,40 C900,30 1040,90 1080,200 C1120,320 1040,440 900,470 C760,500 660,430 660,320 C660,220 700,50 760,40 Z" fill="none" stroke="var(--color-olive-700)" strokeWidth="1" />
                <path d="M780,80 C900,72 1010,120 1040,210 C1070,310 1005,405 895,430 C780,455 700,395 700,310 C700,230 730,88 780,80 Z" fill="none" stroke="var(--color-olive-700)" strokeWidth="1" />
                <path d="M800,120 C900,114 985,150 1005,220 C1025,300 975,375 890,395 C800,415 745,365 745,300 C745,235 765,126 800,120 Z" fill="none" stroke="var(--color-line-strong)" strokeWidth="1" />
                <path d="M820,158 C895,154 960,182 975,232 C990,290 950,345 885,362 C820,378 775,342 775,290 C775,240 790,162 820,158 Z" fill="none" stroke="var(--color-line-strong)" strokeWidth="1" />
                <path d="M120,420 C220,400 330,440 360,510 C390,580 320,630 220,635 C120,640 60,590 65,520 C70,455 60,436 120,420 Z" fill="none" stroke="var(--color-olive-700)" strokeWidth="1" />
                <path d="M140,445 C220,430 305,460 328,515 C352,572 296,612 218,617 C140,622 92,585 96,528 C100,478 92,458 140,445 Z" fill="none" stroke="var(--color-line-strong)" strokeWidth="1" />
            </svg>

            <Container>

                <div className="relative z-10 py-20 lg:py-28">

                    <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">

                        {/* Left */}

                        <div>

                            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink-raised/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-olive-300">

                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                                    <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1" />
                                    <circle cx="6.5" cy="6.5" r="3" stroke="currentColor" strokeWidth="1" />
                                </svg>

                                Repository intelligence for engineers

                            </span>

                            <h1 className="mt-7 font-sans text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-parchment lg:text-[62px]">
                                Go from unfamiliar code to <span className="text-olive-300">working context.</span>

                            </h1>

                            <p className="mt-6 max-w-xl text-[17px] leading-7 text-parchment-dim">

                                CodeAtlas turns a repository into a searchable engineering map—combining syntax-aware parsing, hybrid retrieval, source-grounded answers, and dependency exploration.

                            </p>

                            <div className="mt-9 flex flex-wrap gap-3.5">

                                <Link to="/signup">

                                    <Button>

                                        Get started
                                        <ArrowRight size={15} />

                                    </Button>

                                </Link>

                                <a href="#how-it-works">

                                    <Button variant="secondary">

                                        See the workflow

                                    </Button>

                                </a>

                            </div>

                        </div>

                        {/* Right — field note card */}

                        <div className="panel-shadow overflow-hidden rounded-xl border border-line bg-ink-raised">

                            <div className="flex items-center justify-between border-b border-line bg-ink px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-walnut-500" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-olive-500" />
                                </div>
                                <span className="font-mono text-[10px] text-parchment-faint">codeatlas / backend</span>
                                <span className="w-12" />
                            </div>

                            <div className="grid min-h-[430px] grid-cols-[150px_1fr]">
                                <div className="border-r border-line bg-ink/60 p-3 font-mono text-[10px] text-parchment-faint">
                                    <p className="mb-3 uppercase tracking-wider">Explorer</p>
                                    {productAreas.map(({ icon: ItemIcon, label }) => {
                                        return <div key={label} className="mb-1.5 flex items-center gap-2 rounded px-2 py-1.5 text-parchment-dim"><ItemIcon size={11} /><span>{label}</span></div>;
                                    })}
                                </div>

                                <div className="p-5">

                            <div className="flex items-center justify-between border-b border-line pb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-faint">

                                <span>
                                    <span className="text-olive-500">Grounded answer</span> · 01
                                </span>

                                <span>hybrid retrieval</span>

                            </div>

                            <div className="mt-5">

                                <div className="rounded-md border border-line bg-ink px-3.5 py-3 font-mono text-xs text-olive-300">

                                    &gt; how does authentication work?

                                </div>

                                <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-parchment-faint">
                                    Retrieved sources · 3

                                </p>

                                <div className="mt-2.5 space-y-1.5 font-mono text-[13px] text-parchment-dim">

                                    <div className="flex items-center gap-2 rounded-md bg-ink px-3 py-2">
                                        <Check size={13} className="shrink-0 text-olive-500" />
                                        auth/router.py
                                    </div>

                                    <div className="flex items-center gap-2 rounded-md bg-ink px-3 py-2">
                                        <Check size={13} className="shrink-0 text-olive-500" />
                                        auth/service.py
                                    </div>

                                    <div className="flex items-center gap-2 rounded-md bg-ink px-3 py-2">
                                        <Check size={13} className="shrink-0 text-olive-500" />
                                        auth/security.py
                                    </div>

                                </div>

                                <div className="mt-4 rounded-md border border-olive-700 bg-olive-800/80 p-4 text-[13px] leading-[1.65] text-parchment">

                                    Authentication uses expiring JWT access tokens. Credentials are verified with bcrypt, then protected endpoints resolve the current user through a bearer-token dependency.

                                </div>

                            </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </Container>

        </section>
    );
}
