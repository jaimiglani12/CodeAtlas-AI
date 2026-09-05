import { Link } from "react-router-dom";

import Container from "../common/Container";
import Button from "../common/Button";

export default function CTA() {
    return (
        <section className="border-b border-line bg-ink-raised py-24 text-center">

            <Container>

                <h2 className="font-sans text-4xl font-semibold tracking-[-0.025em] text-parchment">

                    Ready to chart your first repository?

                </h2>

                <p className="mx-auto mt-4 max-w-md text-[15.5px] text-parchment-dim">

                    Free to start. No credit card required.

                </p>

                <div className="mt-8 flex justify-center">

                    <Link to="/signup">

                        <Button>

                            Get started

                        </Button>

                    </Link>

                </div>

            </Container>

        </section>
    );
}
