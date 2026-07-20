import { Link } from "react-router-dom";

import Container from "../common/Container";
import Button from "../common/Button";
import ContourMark from "../icons/ContourMark";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur-md">

            <Container>

                <div className="flex h-19 items-center justify-between">

                    <Link
                        to="/"
                        className="flex items-center gap-2 font-display text-xl font-semibold text-parchment"
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

                    <div className="flex items-center gap-3.5">

                        <Link to="/login">

                            <Button variant="secondary">

                                Login

                            </Button>

                        </Link>

                        <Link to="/signup">

                            <Button>

                                Get started

                            </Button>

                        </Link>

                    </div>

                </div>

            </Container>

        </header>
    );
}
