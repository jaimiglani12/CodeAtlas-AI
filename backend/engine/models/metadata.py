class FunctionInfo:

    def __init__(
        self,
        name,
        file_path,
        start_line,
        end_line,
        start_byte,
        end_byte
    ):

        self.name = name

        self.file_path = file_path

        self.start_line = start_line

        self.end_line = end_line

        self.start_byte = start_byte

        self.end_byte = end_byte
        
class ClassInfo:

    def __init__(
        self,
        name,
        file_path,
        start_line,
        end_line,
        start_byte,
        end_byte
    ):

        self.name = name

        self.file_path = file_path

        self.start_line = start_line

        self.end_line = end_line

        self.start_byte = start_byte

        self.end_byte = end_byte
        
class ImportInfo:

    def __init__(
        self,
        file_path,
        statement
    ):

        self.file_path = file_path

        self.statement = statement
        
class CallInfo:

    def __init__(
        self,
        caller,
        callee
    ):

        self.caller = caller

        self.callee = callee