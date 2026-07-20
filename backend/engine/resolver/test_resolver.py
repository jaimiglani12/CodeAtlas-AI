from engine.resolver.resolver import SymbolResolver

resolver = SymbolResolver()

resolver.register(

    "login",

    "auth.py",

    12

)

resolver.register(

    "verify_password",

    "utils.py",

    5

)

print(

    resolver.resolve("login")

)

print(

    resolver.resolve("verify_password")

)