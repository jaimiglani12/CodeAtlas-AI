from engine.builder.builder import RepositoryBuilder

builder=RepositoryBuilder()

index=builder.build("../")

print()

print("Total Chunks")

print(len(index.chunks))

print()

for chunk in index.chunks:

    print(chunk.name)

    print(chunk.file_path)

    print(chunk.content[:100])

    print("------------------------")