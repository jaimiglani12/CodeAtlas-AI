import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import Container from "../common/Container";
import Button from "../common/Button";
import ContourMark from "../icons/ContourMark";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-xl">

            <Container>

                <div className="flex h-[68px] items-center justify-between">

                    <Link
                        to="/"
                        className="flex items-center gap-2 font-sans text-lg font-semibold tracking-tight text-parchment"
                    >
                        <ContourMark className="text-olive-500" />
                        CodeAtlas AI
                    </Link>

                    <nav className="hidden items-center gap-9 text-sm text-parchment-dim md:flex">

                        <a
                            href="#features"
                            className="transition-colors hover:text-parchment"
                        >
                            Features
                        </a>

                        <a
                            href="#how-it-works"
                            className="transition-colors hover:text-parchment"
                        >
                            How it works
                        </a>

                    </nav>

                    <div className="flex items-center gap-2.5">

                        <Link to="/login">

                            <Button variant="secondary" className="hidden sm:inline-flex">
                                Sign in

                            </Button>

                        </Link>

                        <Link to="/signup">

                            <Button>
                                Open app
                                <ArrowUpRight size={14} />

                            </Button>

                        </Link>

                    </div>

                </div>

            </Container>

        </header>
    );
}
