from engine.index.repository_index import RepositoryIndex

index = RepositoryIndex()

index.add_symbol(

    "login",

    "auth.py",

    10

)

index.add_call(

    "login",

    "verify_password"

)

index.add_function(

    {

        "name":"login"

    }

)

print(index.symbols)

print()

print(index.calls)

print()

print(index.functions)