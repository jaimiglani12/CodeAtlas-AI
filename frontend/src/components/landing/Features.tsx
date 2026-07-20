import {
    Bot,
    Search,
    GitBranch,
    Boxes,
    Workflow,
    Zap,
} from "lucide-react";

import Container from "../common/Container";
import Heading from "../common/Heading";

const features = [
    {
        icon: Bot,
        title: "AI repository chat",
        description:
            "Ask natural language questions about any codebase and receive context-aware answers powered by retrieval-augmented generation.",
    },
    {
        icon: Search,
        title: "Semantic code search",
        description:
            "Find functions, classes and implementations using meaning instead of exact keyword matching.",
    },
    {
        icon: GitBranch,
        title: "AST understanding",
        description:
            "Repository parsing powered by Tree-sitter enables structural understanding instead of plain text search.",
    },
    {
        icon: Workflow,
        title: "Dependency graph",
        description:
            "Visualize relationships between modules, classes and functions across the repository.",
    },
    {
        icon: Boxes,
        title: "Workspace management",
        description:
            "Manage multiple repositories with isolated indexing, embeddings and chat history.",
    },
    {
        icon: Zap,
        title: "Fast hybrid retrieval",
        description:
            "Dense retrieval combined with BM25 delivers accurate answers with minimal latency.",
    },
];

export default function Features() {
    return (
        <section
            id="features"
            className="border-b border-line py-24"
        >

            <Container>

                <Heading
                    align="center"
                    eyebrow="Features"
                    title="Everything you need to survey a large repository"
                    subtitle="Built for engineers who need to navigate unfamiliar projects, onboard faster and understand architecture with AI."
                />

                <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-2 xl:grid-cols-3">

                    {features.map((feature) => {

                        const Icon = feature.icon;

                        return (

                            <div
                                key={feature.title}
                                className="bg-ink p-8 transition-colors duration-150 hover:bg-ink-raised"
                            >

                                <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-olive-700 bg-olive-800 text-olive-300">

                                    <Icon size={19} />

                                </div>

                                <h3 className="mt-6 text-base font-semibold text-parchment">

                                    {feature.title}

                                </h3>

                                <p className="mt-2.5 text-sm leading-[1.65] text-parchment-dim">

                                    {feature.description}

                                </p>

                            </div>

                        );

                    })}

                </div>

            </Container>

        </section>
    );
}
