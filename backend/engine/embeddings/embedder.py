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

        for chunk in index.chunks:

            chunk.embedding = self.create_embedding(

                chunk.content

            )