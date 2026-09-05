from types import SimpleNamespace

from engine.retrieval.reranker import Reranker


class FakeCrossEncoder:
    def predict(self, pairs):
        assert pairs == [
            ("where is authentication?", "database connection"),
            ("where is authentication?", "JWT authentication middleware"),
        ]
        return [0.1, 0.9]


def test_cross_encoder_changes_candidate_order():
    results = [
        {"chunk": SimpleNamespace(content="database connection"), "score": 0.8},
        {
            "chunk": SimpleNamespace(content="JWT authentication middleware"),
            "score": 0.7,
        },
    ]

    reranked = Reranker(scorer=FakeCrossEncoder()).rerank(
        "where is authentication?", results, top_k=2
    )

    assert reranked[0]["chunk"].content == "JWT authentication middleware"
    assert reranked[0]["reranker_score"] == 0.9
    assert reranked[0]["hybrid_score"] == 0.7


def test_empty_candidates_do_not_load_model():
    assert Reranker(scorer=FakeCrossEncoder()).rerank("question", []) == []
