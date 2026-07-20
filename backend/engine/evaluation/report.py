class EvaluationReport:

    @staticmethod
    def print(summary):

        print()

        print("=" * 50)

        print("      CodeAtlas Retrieval Evaluation")

        print("=" * 50)

        print()

        print(

            f"Questions Evaluated : "

            f"{summary['questions']}"

        )

        print(

            f"Top-1 Accuracy      : "

            f"{summary['top1_accuracy']}%"

        )

        print(

            f"Top-3 Accuracy      : "

            f"{summary['top3_accuracy']}%"

        )

        print(

            f"Top-5 Accuracy      : "

            f"{summary['top5_accuracy']}%"

        )

        print(

            f"Average Retrieval   : "

            f"{summary['average_retrieval_time_ms']} ms"

        )

        print()

        print("=" * 50)