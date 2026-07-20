from engine.builder.builder import RepositoryBuilder

builder = RepositoryBuilder()

index = builder.build("../")

print()

print("Files")

print(len(index.files))

print()

print("Functions")

print(len(index.functions))

print()

print("Classes")

print(len(index.classes))