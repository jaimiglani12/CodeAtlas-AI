from engine.graph.graph import DependencyGraph

graph = DependencyGraph()
graph.add_dependency(

    "login",

    "verify_password"

)
graph.add_dependency(

    "login",

    "generate_token"

)
graph.add_dependency(

    "authenticate",

    "login"

)
graph.print_graph()