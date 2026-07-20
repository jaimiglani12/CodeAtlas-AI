from engine.builder.builder import RepositoryBuilder
from engine.retrieval.graph_retriever import GraphRetriever

builder = RepositoryBuilder()

index = builder.build("../")

retriever = GraphRetriever(index)

results = retriever.retrieve("parse")

for function in results:

    print(function["name"])
    print("--------------------------------")
    print(function["content"])
    print()
    