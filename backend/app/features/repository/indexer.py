from engine.builder.builder import RepositoryBuilder
from engine.cache.index_cache import IndexCache


class RepositoryIndexer:

    @staticmethod
    def index(repository_id: int, repository_path: str):

        builder = RepositoryBuilder()

        index = builder.build(repository_path)

        IndexCache.add(repository_id, index)

        print("=" * 60)
        print(IndexCache._cache.keys())
        print("=" * 60)

        return index

    @staticmethod
    def get_or_build(repository_id: int, repository_path: str):
        """
        Returns the cached in-memory index for a repository, rebuilding it
        from disk if the process has restarted and the cache is cold.
        """

        index = IndexCache.get(repository_id)

        if index is not None:
            return index

        return RepositoryIndexer.index(repository_id, repository_path)
