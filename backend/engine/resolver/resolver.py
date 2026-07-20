class SymbolResolver:

    def __init__(self):

        self.symbols = {}
        
    def register(

        self,

        name,

        file_path,

        line

    ):

        self.symbols[name] = {

            "file": file_path,

            "line": line

        }
    def resolve(self, name):

        return self.symbols.get(name)