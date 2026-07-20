from engine.builder.builder import RepositoryBuilder
from engine.retrieval.bm25_retriever import BM25Retriever

builder = RepositoryBuilder()

index = builder.build("../")

retriever = BM25Retriever(index)

results = retriever.retrieve(

    "parse"

)

for score, chunk in results:

    print(score)

    print(chunk.name)

    print("----------------")