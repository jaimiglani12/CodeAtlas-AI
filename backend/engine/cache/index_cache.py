class IndexCache:

    _cache = {}

    @classmethod
    def add(cls, repository_id, index):
        cls._cache[repository_id] = index

    @classmethod
    def get(cls, repository_id):
        return cls._cache.get(repository_id)

    @classmethod
    def remove(cls, repository_id):
        cls._cache.pop(repository_id, None)

    @classmethod
    def clear(cls):
        cls._cache.clear()