from engine.builder.builder import RepositoryBuilder
from engine.retrieval.hybrid_retriever import HybridRetriever
from engine.retrieval.reranker import Reranker
from engine.llm.prompt_builder import PromptBuilder

builder = RepositoryBuilder()

index = builder.build("../")

retriever = HybridRetriever(index)

reranker = Reranker()

results = retriever.retrieve(

    "How does parsing work"

)

results = reranker.rerank(results)

builder = PromptBuilder()

prompt = builder.build(

    "How does authentication work?",

    results

)

print(prompt)