class RetrievalMetrics:

    @staticmethod
    def top_k_hit(retrieved_chunks, expected_symbols, k):

        retrieved = retrieved_chunks[:k]

        retrieved_names = {

            chunk.name

            for chunk in retrieved

        }

        return any(

            symbol in retrieved_names

            for symbol in expected_symbols

        )

    @staticmethod
    def evaluate_question(retrieved_chunks, expected_symbols):

        return {

            "top1": RetrievalMetrics.top_k_hit(

                retrieved_chunks,

                expected_symbols,

                1

            ),

            "top3": RetrievalMetrics.top_k_hit(

                retrieved_chunks,

                expected_symbols,

                3

            ),

            "top5": RetrievalMetrics.top_k_hit(

                retrieved_chunks,

                expected_symbols,

                5

            )

        }

    @staticmethod
    def summarize(results):

        total = len(results)

        top1 = sum(result["top1"] for result in results)

        top3 = sum(result["top3"] for result in results)

        top5 = sum(result["top5"] for result in results)

        return {

            "questions": total,

            "top1_accuracy": round(

                100 * top1 / total,

                2

            ),

            "top3_accuracy": round(

                100 * top3 / total,

                2

            ),

            "top5_accuracy": round(

                100 * top5 / total,

                2

            )

        }