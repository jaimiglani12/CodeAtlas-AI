import json
import time


class Evaluator:

    def __init__(self, retriever):

        self.retriever = retriever

    def load_benchmark(self, path):

        with open(path, "r", encoding="utf-8") as file:

            return json.load(file)

    def evaluate(self, benchmark_path):

        benchmark = self.load_benchmark(benchmark_path)

        passed = 0

        total_time = 0

        details = []

        for test in benchmark:

            start = time.perf_counter()

            results = self.retriever.retrieve(

                test["question"],

                top_k=5

            )

            end = time.perf_counter()

            total_time += end - start

            retrieved = []

            for result in results:

                chunk = result["chunk"]

                retrieved.append(
                    {
                        "name": chunk.name,
                        "file": chunk.file_path,
                        "type": chunk.chunk_type
                    }
                )

            success = any(

                expected in retrieved

                for expected in test["expected"]

            )

            if success:

                passed += 1

            details.append(

                {

                    "question": test["question"],

                    "expected": test["expected"],

                    "retrieved": retrieved,

                    "passed": success

                }

            )

        return {

            "questions": len(benchmark),

            "passed": passed,

            "failed": len(benchmark) - passed,

            "accuracy": round(

                passed * 100 / len(benchmark),

                2

            ),

            "average_time_ms": round(

                total_time * 1000 / len(benchmark),

                2

            ),

            "details": details

        }