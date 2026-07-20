from engine.index.repository_index import RepositoryIndex
from engine.scanner.scanner import RepositoryScanner
from engine.parser.parser import CodeParser
from engine.metadata.extractor import MetadataExtractor
from engine.chunker.generator import ChunkGenerator
from engine.embeddings.embedder import Embedder


class RepositoryBuilder:

    def __init__(self):
        pass

    def build(self, repository_path):

        index = RepositoryIndex()

        scanner = RepositoryScanner(repository_path)
        scanner.scan(index)

        parser = CodeParser()
        extractor = MetadataExtractor(index)

        for file in index.files:

            tree = parser.parse(file)

            extractor.extract(file, tree)

        generator = ChunkGenerator(index)
        generator.generate()

        # Generate embeddings
        embedder = Embedder()
        embedder.generate(index)

        return index