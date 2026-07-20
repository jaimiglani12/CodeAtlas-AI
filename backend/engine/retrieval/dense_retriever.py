from engine.embeddings.embedder import Embedder
from engine.retrieval.query_embedder import QueryEmbedder
from engine.retrieval.similarity import calculate_similarity


class DenseRetriever:

    def __init__(self, index):

        self.index = index

        self.embedder = Embedder()

        self.query_embedder = QueryEmbedder(
            self.embedder
        )

    def retrieve(
        self,
        query,
        top_k=10
    ):

        query_embedding = self.query_embedder.embed(query)

        results = []

        for chunk in self.index.chunks:

            if chunk.embedding is None:
                continue

            score = calculate_similarity(
                query_embedding,
                chunk.embedding
            )

            results.append(
                {
                    "score": float(score),
                    "chunk": chunk
                }
            )

        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return results[:top_k]