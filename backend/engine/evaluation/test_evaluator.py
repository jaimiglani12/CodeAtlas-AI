from pathlib import Path

from engine.builder.builder import RepositoryBuilder
from engine.retrieval.hybrid_retriever import HybridRetriever
from engine.evaluation.evaluator import Evaluator


def main():

    print("=" * 60)

    print("Building Repository...")

    print("=" * 60)

    project_path = Path(__file__).resolve().parents[2]

    builder = RepositoryBuilder()

    index = builder.build(str(project_path))

    retriever = HybridRetriever(index)

    evaluator = Evaluator(retriever)

    benchmark_path = Path(__file__).parent / "benchmark.json"

    results = evaluator.evaluate(str(benchmark_path))

    print()

    print("=" * 60)

    print("Evaluation Summary")

    print("=" * 60)

    print(f"Questions        : {results['questions']}")
    print(f"Passed           : {results['passed']}")
    print(f"Failed           : {results['failed']}")
    print(f"Accuracy         : {results['accuracy']}%")
    print(f"Average Time     : {results['average_time_ms']} ms")

    print()

    print("=" * 60)

    print("Detailed Results")

    print("=" * 60)

    for result in results["details"]:

        print()

        print(f"Question : {result['question']}")

        print(f"Expected : {', '.join(result['expected'])}")

        print(f"Retrieved: {', '.join(result['retrieved'])}")

        print("Status   :", "PASS" if result["passed"] else "FAIL")

        print("-" * 60)


if __name__ == "__main__":

    main()