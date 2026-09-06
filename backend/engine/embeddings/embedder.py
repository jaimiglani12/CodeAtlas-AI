from sentence_transformers import SentenceTransformer


class Embedder:

    _model = None

    def __init__(self):

        if Embedder._model is None:

            Embedder._model = SentenceTransformer(

                "all-MiniLM-L6-v2"

            )

        self.model = Embedder._model

    def create_embedding(self, text):

        return self.model.encode(

            text,

            convert_to_numpy=True

        )

    def generate(self, index):

        if not index.chunks:
            return

        embeddings = self.model.encode(
            [chunk.content for chunk in index.chunks],
            batch_size=32,
            convert_to_numpy=True,
            show_progress_bar=False,
        )

        for chunk, embedding in zip(index.chunks, embeddings):
            chunk.embedding = embedding
