from engine.index.repository_index import RepositoryIndex
from engine.metadata.extractor import MetadataExtractor
from engine.parser.parser import CodeParser
from engine.scanner.scanner import RepositoryScanner

index = RepositoryIndex()

scanner = RepositoryScanner("../")

scanner.scan(index)

parser = CodeParser()

extractor = MetadataExtractor(index)

for file in index.files:

    tree = parser.parse(file)

    extractor.extract(file, tree)

print("Functions :", len(index.functions))
print("Classes   :", len(index.classes))
print("Imports   :", len(index.imports))
print("Calls     :", len(index.calls))