from engine.builder.builder import RepositoryBuilder
from engine.retrieval.hybrid_retriever import HybridRetriever
from engine.retrieval.reranker import Reranker

builder = RepositoryBuilder()

index = builder.build("../")

retriever = HybridRetriever(index)

reranker = Reranker()

results = retriever.retrieve(

    "how does dfs and parsing work"

)

results = reranker.rerank(

    "how does dfs and parsing work",

    results

)

for result in results:

    print(result["score"])

    print(result["chunk"].name)

    print("----------------")
