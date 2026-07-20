from engine.embeddings.embedder import Embedder


class QueryEmbedder:

    def __init__(self, embedder):

        self.embedder = embedder

    def embed(self, query):

        return self.embedder.create_embedding(query)