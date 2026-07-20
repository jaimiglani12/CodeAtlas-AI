import re


class SymbolRetriever:

    def __init__(self, index):

        self.index = index

    def retrieve(self, query):

        tokens = self.tokenize(query)

        results = []

        visited = set()

        for token in tokens:

            symbol = self.index.get_symbol(token)

            if symbol is None:
                continue

            chunk = self.index.get_chunk(token)

            if chunk is None:
                continue

            key = f"{chunk.file_path}:{chunk.name}"

            if key in visited:
                continue

            visited.add(key)

            results.append(

                {

                    "score": 1.0,

                    "chunk": chunk

                }

            )

        return results

    def tokenize(self, text):

        return re.findall(r"[A-Za-z_][A-Za-z0-9_]*", text)