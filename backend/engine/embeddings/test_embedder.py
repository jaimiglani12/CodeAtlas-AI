from engine.scanner.scanner import RepositoryScanner
from engine.parser.parser import parse_file
from engine.metadata.extractor import MetadataExtractor
from engine.chunker.generator import ChunkGenerator
from engine.embeddings.embedder import Embedder

scanner = RepositoryScanner("../")

files = scanner.scan()

embedder = Embedder()

for file in files:

    tree = parse_file(file)

    extractor = MetadataExtractor(file.content)

    extractor.traverse(tree.root_node)

    generator = ChunkGenerator(file, extractor)

    chunks = generator.generate()

    for chunk in chunks:

        vector = embedder.create_embedding(chunk.content)
        chunk.embedding=vector

        print(chunk.name)

        print(len(vector))

        print("----------------")