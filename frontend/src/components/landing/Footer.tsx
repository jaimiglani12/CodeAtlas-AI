import Container from "../common/Container";
import ContourMark from "../icons/ContourMark";

export default function Footer() {

    return (

        <footer className="py-14">

            <Container>

                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

                    <div>

                        <div className="flex items-center gap-2 font-sans text-lg font-semibold tracking-tight text-parchment">
                            <ContourMark size={17} className="text-olive-500" />
                            CodeAtlas AI
                        </div>

                        <p className="mt-2 text-sm text-parchment-dim">

                            AI-powered repository understanding.

                        </p>

                    </div>

                    <div className="flex gap-7 text-sm text-parchment-dim">

                        <a href="#features" className="transition-colors hover:text-parchment">
                            Features
                        </a>

                        <a href="#how-it-works" className="transition-colors hover:text-parchment">
                            How it works
                        </a>

                    </div>

                </div>

                <div className="mt-10 border-t border-line pt-6 font-mono text-xs text-parchment-faint">

                    © 2026 CodeAtlas AI. Built with React, FastAPI and AI.

                </div>

            </Container>

        </footer>

    );

}
