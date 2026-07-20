from engine.retrieval.dense_retriever import DenseRetriever
from engine.retrieval.bm25_retriever import BM25Retriever


class HybridRetriever:

    def __init__(self, index):

        self.index = index

        self.dense = DenseRetriever(index)

        self.bm25 = BM25Retriever(index)

    def retrieve(self, query, top_k=10):

        dense_results = self.dense.retrieve(
            query,
            top_k=top_k
        )

        bm25_results = self.bm25.retrieve(
            query,
            top_k=top_k
        )

        merged = {}

        # ---------------- Dense ----------------

        max_dense = max(
            (result["score"] for result in dense_results),
            default=1.0
        )

        for result in dense_results:

            chunk = result["chunk"]

            key = f"{chunk.file_path}:{chunk.name}"

            normalized_score = result["score"] / max_dense

            merged[key] = {

                "chunk": chunk,

                "dense_score": normalized_score,

                "bm25_score": 0.0,

                "score": 0.0

            }

        # ---------------- BM25 ----------------

        max_bm25 = max(
            (result["score"] for result in bm25_results),
            default=1.0
        )

        for result in bm25_results:

            chunk = result["chunk"]

            key = f"{chunk.file_path}:{chunk.name}"

            normalized_score = result["score"] / max_bm25

            if key not in merged:

                merged[key] = {

                    "chunk": chunk,

                    "dense_score": 0.0,

                    "bm25_score": normalized_score,

                    "score": 0.0

                }

            else:

                merged[key]["bm25_score"] = normalized_score

        # ---------------- Final Score ----------------

        final_results = []

        for item in merged.values():

            item["score"] = (

                0.7 * item["dense_score"]

                +

                0.3 * item["bm25_score"]

            )

            final_results.append(item)

        final_results.sort(

            key=lambda x: x["score"],

            reverse=True

        )

        return final_results[:top_k]