"""Model-based reranking for candidates produced by hybrid retrieval."""


class Reranker:
    """Rerank a small candidate set with a query-document cross encoder.

    Model loading is lazy so importing the API does not download weights or
    allocate model memory. Tests can inject a scorer without loading a model.
    """

    DEFAULT_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"

    def __init__(self, model_name=DEFAULT_MODEL, scorer=None):
        self.model_name = model_name
        self._scorer = scorer

    def _get_scorer(self):
        if self._scorer is None:
            from sentence_transformers import CrossEncoder

            self._scorer = CrossEncoder(self.model_name)
        return self._scorer

    def rerank(self, query, results, top_k=10):
        """Return candidates ordered by their model relevance to ``query``."""
        if not results:
            return []

        pairs = [(query, result["chunk"].content) for result in results]
        model_scores = self._get_scorer().predict(pairs)

        reranked = []
        for result, model_score in zip(results, model_scores):
            item = dict(result)
            item["hybrid_score"] = result["score"]
            item["reranker_score"] = float(model_score)
            item["score"] = float(model_score)
            reranked.append(item)

        reranked.sort(key=lambda item: item["score"], reverse=True)
        return reranked[:top_k]
