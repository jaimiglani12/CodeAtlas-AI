from engine.index.repository_index import RepositoryIndex
from engine.scanner.scanner import RepositoryScanner

index = RepositoryIndex()

scanner = RepositoryScanner("../")

scanner.scan(index)

print()

print("Total Files")

print(len(index.files))

print()

for file in index.files:

    print(file.path)