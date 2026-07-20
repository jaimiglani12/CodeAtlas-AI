from engine.index.repository_index import RepositoryIndex
from engine.scanner.scanner import RepositoryScanner
from engine.parser.parser import CodeParser

index = RepositoryIndex()

scanner = RepositoryScanner("../")

scanner.scan(index)

parser = CodeParser()

for file in index.files:

    tree = parser.parse(file)

    print(file.name)

    print(tree.root_node.type)

    print("-------------------")