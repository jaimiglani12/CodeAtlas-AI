from types import SimpleNamespace

from engine.retrieval.context_expander import ContextExpander


def make_chunk(name):
    return SimpleNamespace(
        name=name,
        file_path=f"{name}.py",
        start_line=1,
        content=f"def {name}(): pass",
    )


class FakeIndex:
    def __init__(self):
        self.chunks = [make_chunk("login"), make_chunk("verify_token"), make_chunk("unrelated")]
        self.symbols = {item.name: {"file": item.file_path} for item in self.chunks}
        self.dependency_graph = {"login": ["verify_token"], "verify_token": ["unrelated"]}

    def get_symbol(self, name):
        return self.symbols.get(name)

    def get_chunk(self, name):
        return next((item for item in self.chunks if item.name == name), None)

    def get_calls(self, name):
        return self.dependency_graph.get(name, [])

    def get_callers(self, name):
        return [caller for caller, callees in self.dependency_graph.items() if name in callees]


def test_adds_exact_symbol_and_one_graph_hop():
    index = FakeIndex()
    dense_result = {"chunk": index.get_chunk("unrelated"), "score": 0.8}

    results = ContextExpander(index).expand("How does login work?", [dense_result])

    names = [result["chunk"].name for result in results]
    assert names[0] == "login"
    assert "verify_token" in names
    assert names.count("login") == 1


def test_respects_context_limit():
    results = ContextExpander(FakeIndex()).expand("login", [], limit=1)
    assert [result["chunk"].name for result in results] == ["login"]


def test_adds_direct_caller_context():
    results = ContextExpander(FakeIndex()).expand("verify_token", [], limit=4)
    names = [result["chunk"].name for result in results]
    assert names[:2] == ["verify_token", "unrelated"]
    assert "login" in names
