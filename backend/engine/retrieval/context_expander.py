from engine.retrieval.graph_retriever import GraphRetriever
from engine.retrieval.symbol_retriever import SymbolRetriever


class ContextExpander:
    """Add exact symbol matches and nearby call-graph context to retrieval."""

    def __init__(self, index):
        self.symbols = SymbolRetriever(index)
        self.graph = GraphRetriever(index)

    def expand(self, query, results, limit=12):
        candidates = self.symbols.retrieve(query) + list(results)
        seeds = self._deduplicate(candidates)
        related = self.graph.expand(seeds, max_depth=1, limit=limit)
        return self._deduplicate(seeds + related)[:limit]

    @staticmethod
    def _deduplicate(results):
        unique = []
        seen = set()

        for result in results:
            chunk = result["chunk"]
            key = (chunk.file_path, chunk.name, chunk.start_line)
            if key in seen:
                continue
            seen.add(key)
            unique.append(result)

        return unique
