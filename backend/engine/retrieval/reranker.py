class Reranker:

    def __init__(self):

        pass

    def rerank(self, results):

        results.sort(

            key=lambda x: x["score"],

            reverse=True

        )

        return results