class GraphRetriever:

    def __init__(self, index):

        self.index = index

    def expand(self, results, max_depth=None, limit=None):

        expanded = []

        visited = set()

        for result in results:

            chunk = result["chunk"]

            self._dfs(chunk.name, visited, expanded, 0, max_depth, limit)

            if limit is not None and len(expanded) >= limit:
                break

        return expanded

    def _dfs(

        self,

        function_name,

        visited,

        expanded,

        depth=0,

        max_depth=None,

        limit=None,

    ):

        if function_name in visited or (limit is not None and len(expanded) >= limit):
            return

        visited.add(function_name)

        chunk = self.index.get_chunk(function_name)

        if chunk is not None:

            expanded.append(

                {

                    "chunk": chunk,

                    "score": 1.0

                }

            )

        if max_depth is not None and depth >= max_depth:
            return

        related = list(self.index.get_calls(function_name))
        if hasattr(self.index, "get_callers"):
            related.extend(self.index.get_callers(function_name))

        for callee in related:

            self._dfs(callee, visited, expanded, depth + 1, max_depth, limit)
