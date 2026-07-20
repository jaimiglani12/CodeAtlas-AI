import { Check } from "lucide-react";
import { Link } from "react-router-dom";

import Container from "../common/Container";
import Button from "../common/Button";

export default function Hero() {
    return (
        <section className="relative overflow-hidden border-b border-line">

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

                <div className="relative z-10 py-24 lg:py-28">

                    <div className="grid items-center gap-16 lg:grid-cols-2">

                        {/* Left */}

                        <div>

                            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-olive-500">

                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                                    <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1" />
                                    <circle cx="6.5" cy="6.5" r="3" stroke="currentColor" strokeWidth="1" />
                                </svg>

                                AI-Assisted Repository Survey

                            </span>

                            <h1 className="mt-7 font-display text-5xl font-medium leading-[1.1] text-parchment lg:text-[58px]">

                                Understand any codebase
                                <br />
                                like it's already{" "}
                                <em className="font-medium italic text-olive-300">
                                    mapped
                                </em>
                                .

                            </h1>

                            <p className="mt-6 max-w-xl text-[17px] leading-7 text-parchment-dim">

                                CodeAtlas parses repositories with AST analysis,
                                semantic search and retrieval augmented
                                generation, so you can navigate, explore and
                                chat with any project.

                            </p>

                            <div className="mt-9 flex flex-wrap gap-3.5">

                                <Link to="/signup">

                                    <Button>

                                        Get started

                                    </Button>

                                </Link>

                                <a href="#how-it-works">

                                    <Button variant="secondary">

                                        See how it works

                                    </Button>

                                </a>

                            </div>

                        </div>

                        {/* Right — field note card */}

                        <div className="rounded-sm border border-line bg-ink-raised p-7 shadow-2xl shadow-black/40">

                            <div className="flex items-center justify-between border-b border-line pb-4 font-mono text-xs uppercase tracking-wider text-parchment-faint">

                                <span>
                                    <span className="text-olive-500">Field note</span> — 001
                                </span>

                                <span>auth · service</span>

                            </div>

                            <div className="mt-5">

                                <div className="rounded-sm border border-line bg-ink px-3.5 py-3 font-mono text-sm text-olive-300">

                                    &gt; how does authentication work?

                                </div>

                                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-parchment-faint">

                                    Retrieving context

                                </p>

                                <div className="mt-2.5 space-y-1.5 font-mono text-[13px] text-parchment-dim">

                                    <div className="flex items-center gap-2 rounded-sm bg-ink px-3 py-2">
                                        <Check size={13} className="shrink-0 text-olive-500" />
                                        auth/router.py
                                    </div>

                                    <div className="flex items-center gap-2 rounded-sm bg-ink px-3 py-2">
                                        <Check size={13} className="shrink-0 text-olive-500" />
                                        auth/service.py
                                    </div>

                                    <div className="flex items-center gap-2 rounded-sm bg-ink px-3 py-2">
                                        <Check size={13} className="shrink-0 text-olive-500" />
                                        auth/security.py
                                    </div>

                                </div>

                                <div className="mt-4 rounded-sm border border-olive-700 bg-olive-800 p-4 text-[13.5px] leading-[1.65] text-parchment">

                                    Authentication is handled using JWT tokens.
                                    Credentials are checked against the user
                                    store with bcrypt, and every protected
                                    route validates the token before granting
                                    access.

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </Container>

        </section>
    );
}
