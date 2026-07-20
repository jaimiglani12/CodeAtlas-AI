class GraphRetriever:

    def __init__(self, index):

        self.index = index

    def expand(self, results):

        expanded = []

        visited = set()

        for result in results:

            chunk = result["chunk"]

            self._dfs(

                chunk.name,

                visited,

                expanded

            )

        return expanded

    def _dfs(

        self,

        function_name,

        visited,

        expanded

    ):

        if function_name in visited:
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

        for callee in self.index.get_calls(function_name):

            self._dfs(

                callee,

                visited,

                expanded

            )