from pathlib import Path

from engine.builder.builder import RepositoryBuilder
from engine.retrieval.hybrid_retriever import HybridRetriever
from engine.retrieval.graph_retriever import GraphRetriever
from engine.llm.prompt_builder import PromptBuilder
from engine.llm.chat_engine import ChatEngine


def main():

    print("=" * 70)
    print("Building Repository Index...")
    print("=" * 70)

    project_path = Path(__file__).resolve().parents[1]

    builder = RepositoryBuilder()

    index = builder.build(str(project_path))

    print("\nRepository Indexed Successfully!\n")

    print("=" * 70)
    print("Repository Statistics")
    print("=" * 70)

    print(f"Files      : {len(index.files)}")
    print(f"Functions  : {len(index.functions)}")
    print(f"Classes    : {len(index.classes)}")
    print(f"Imports    : {len(index.imports)}")
    print(f"Chunks     : {len(index.chunks)}")

    retriever = HybridRetriever(index)
    graph_retriever = GraphRetriever(index)

    prompt_builder = PromptBuilder()

    chat = ChatEngine()

    while True:

        print("\n" + "=" * 70)

        query = input(
            "Ask CodeAtlas (type 'exit' to quit): "
        ).strip()

        if query.lower() == "exit":
            break

        retrieved = retriever.retrieve(
            query,
            top_k=5
        )

        if not retrieved:

            print("\nNo relevant chunks found.\n")

            continue

        print("\nRetrieved Chunks")
        print("=" * 70)

        for i, result in enumerate(retrieved, start=1):

            chunk = result["chunk"]

            print(
                f"{i}. {chunk.name}"
            )

            print(
                f"   File  : {chunk.file_path}"
            )

            print(
                f"   Score : {result['score']:.4f}"
            )

            print()

        expanded = graph_retriever.expand(
            retrieved
        )

        print(
            f"Context Chunks : {len(expanded)}"
        )

        prompt = prompt_builder.build(
            query,
            expanded
        )

        print("\nGenerating Response...\n")

        answer = chat.generate(prompt)

        print("=" * 70)
        print(answer)
        print("=" * 70)


if __name__ == "__main__":
    main()