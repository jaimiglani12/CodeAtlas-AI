import re

from rank_bm25 import BM25Okapi


class BM25Retriever:

    def __init__(self, index):

        self.index = index

        self.corpus = []

        for chunk in self.index.chunks:

            tokens = self.tokenize(chunk.content)

            self.corpus.append(tokens)

        self.model = BM25Okapi(self.corpus) if self.corpus else None

    def tokenize(self, text):

        text = text.lower()

        tokens = re.findall(r"[a-zA-Z_]+", text)

        final_tokens = []

        for token in tokens:

            final_tokens.extend(token.split("_"))

        return final_tokens

    def retrieve(

        self,

        query,

        top_k=10

    ):

        if self.model is None:
            return []

        query_tokens = self.tokenize(query)

        scores = self.model.get_scores(query_tokens)

        results = []

        for score, chunk in zip(scores, self.index.chunks):

            if score <= 0:
                continue

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
