from engine.models.chunk import Chunk
from engine.models.metadata import CallInfo


class RepositoryIndex:

    def __init__(self):

        self.files = []

        self.functions = []

        self.classes = []

        self.imports = []

        self.calls = []

        self.symbols = {}

        self.dependency_graph = {}

        self.chunks = []
        self.reverse_dependency_graph={}


    def add_file(self, file):

        self.files.append(file)


    def add_function(self, function):

        self.functions.append(function)

        self.symbols[function.name] = {

            "file": function.file_path,

            "line": function.start_line

        }



    def add_class(self, class_info):

        self.classes.append(class_info)

        self.symbols[class_info.name] = {

            "file": class_info.file_path,

            "line": class_info.start_line

        }



    def add_import(self, import_info):

        self.imports.append(import_info)


    def add_call(self, caller, callee):

        call = CallInfo(caller, callee)

        self.calls.append(call)

        if caller not in self.dependency_graph:

            self.dependency_graph[caller] = []

        self.dependency_graph[caller].append(callee)
        if callee not in self.reverse_dependency_graph:

            self.reverse_dependency_graph[callee] = []

        self.reverse_dependency_graph[callee].append(caller)

  

    def add_chunk(self, chunk: Chunk):

        self.chunks.append(chunk)



    def get_symbol(self, name):

        return self.symbols.get(name)

    def get_function(self, name):

        for function in self.functions:

            if function.name == name:

                return function

        return None

    def get_calls(self, function_name):

        return self.dependency_graph.get(function_name, [])

    def get_file(self, path):

        for file in self.files:

            if file.path == path:

                return file

        return None
    def get_chunk(self, function_name):

        for chunk in self.chunks:

            if chunk.name == function_name:

                return chunk

        return None
