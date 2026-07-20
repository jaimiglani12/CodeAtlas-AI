import Container from "../common/Container";
import Heading from "../common/Heading";

const steps = [
    {
        number: "01",
        title: "Connect a repository",
        description:
            "Point CodeAtlas at a GitHub repo or upload one directly.",
    },
    {
        number: "02",
        title: "It surveys the code",
        description:
            "AST parsing, embeddings and hybrid indexing build a map of the codebase.",
    },
    {
        number: "03",
        title: "Ask, search, explore",
        description:
            "Chat in plain language, run semantic search, or walk the dependency graph.",
    },
    {
        number: "04",
        title: "Ship with context",
        description:
            "Onboard faster and make changes with a clear view of how it all connects.",
    },
];

export default function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="border-b border-line py-24"
        >

            <Container>

                <Heading
                    eyebrow="How it works"
                    title="From repository to answer, in four steps"
                />

                <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    <div
                        className="absolute top-[22px] hidden h-px w-[90%] left-[5%] bg-[repeating-linear-gradient(to_right,var(--color-walnut-700)_0_6px,transparent_6px_14px)] lg:block"
                        aria-hidden="true"
                    />

                    {steps.map((step) => (

                        <div key={step.number} className="relative">

                            <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-walnut-500 font-mono text-sm text-ink">

                                {step.number}

                            </div>

                            <h3 className="mt-6 text-base font-semibold text-parchment">

                                {step.title}

                            </h3>

                            <p className="mt-2.5 text-sm leading-[1.65] text-parchment-dim">

                                {step.description}

                            </p>

                        </div>

                    ))}

                </div>

            </Container>

        </section>
    );
}
