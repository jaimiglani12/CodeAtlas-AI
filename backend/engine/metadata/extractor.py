from engine.models.metadata import (
    FunctionInfo,
    ClassInfo,
    ImportInfo,
)


# Node type names differ per tree-sitter grammar. Each profile tells the
# extractor which node types represent a function, a class-like
# declaration, an import, and a call for a given language — verified
# against the actual grammars in engine/parser/parser.py. Languages
# without a profile here (or without an AST at all) are still scanned and
# chunked as plain text, just without this structural breakdown.

LANGUAGE_PROFILES = {

    "python": {
        "function_types": {"function_definition"},
        "class_types": {"class_definition"},
        "import_types": {"import_statement", "import_from_statement"},
        "call_types": {"call"},
    },

    "javascript": {
        "function_types": {
            "function_declaration", "method_definition",
            "function_expression", "generator_function_declaration",
        },
        "class_types": {"class_declaration"},
        "import_types": {"import_statement"},
        "call_types": {"call_expression"},
        "wrapped_function": True,
    },

    "typescript": {
        "function_types": {
            "function_declaration", "method_definition",
            "function_signature", "method_signature", "function_expression",
        },
        "class_types": {"class_declaration", "interface_declaration"},
        "import_types": {"import_statement"},
        "call_types": {"call_expression"},
        "wrapped_function": True,
    },

    "tsx": {
        "function_types": {
            "function_declaration", "method_definition",
            "function_signature", "method_signature", "function_expression",
        },
        "class_types": {"class_declaration", "interface_declaration"},
        "import_types": {"import_statement"},
        "call_types": {"call_expression"},
        "wrapped_function": True,
    },

    "java": {
        "function_types": {"method_declaration", "constructor_declaration"},
        "class_types": {"class_declaration", "interface_declaration", "enum_declaration"},
        "import_types": {"import_declaration"},
        "call_types": {"method_invocation"},
        "call_field": "name",
    },

    "cpp": {
        "function_types": {"function_definition"},
        "class_types": {"class_specifier", "struct_specifier"},
        "import_types": {"preproc_include"},
        "call_types": {"call_expression"},
    },

    "c": {
        "function_types": {"function_definition"},
        "class_types": set(),
        "import_types": {"preproc_include"},
        "call_types": {"call_expression"},
    },

    "go": {
        "function_types": {"function_declaration", "method_declaration"},
        "class_types": set(),
        "import_types": {"import_declaration"},
        "call_types": {"call_expression"},
    },

    "rust": {
        "function_types": {"function_item"},
        "class_types": {"struct_item", "enum_item", "trait_item"},
        "import_types": {"use_declaration"},
        "call_types": {"call_expression"},
    },

}

# Node types that represent a bare identifier-shaped name across grammars —
# used when drilling into a nested "declarator" field (C/C++) to find the
# actual name node.
_IDENTIFIER_TYPES = {
    "identifier", "type_identifier", "field_identifier",
    "property_identifier", "qualified_identifier",
}


class MetadataExtractor:

    def __init__(self, index):

        self.index = index

        self.current_file = None
        self.current_function = None
        self.source_code = ""
        self.profile = None

    def extract(self, file, tree):

        # Files whose language has no AST (see CodeParser) or no profile
        # here are still scanned and chunked elsewhere — just skipped for
        # structural extraction.
        if tree is None:
            return

        profile = LANGUAGE_PROFILES.get(file.language)

        if profile is None:
            return

        self.current_file = file
        self.source_code = file.content
        self.profile = profile
        self.current_function = None

        self.traverse(tree.root_node)

    # =====================================
    # Traversal
    # =====================================

    def traverse(self, node):

        profile = self.profile
        node_type = node.type

        # ---- Function-like declarations ----

        if node_type in profile["function_types"]:

            self._handle_function(node)
            return

        # ---- Variable-assigned functions: const foo = () => {} ----

        if profile.get("wrapped_function") and node_type == "variable_declarator":

            value = node.child_by_field_name("value")

            if value is not None and value.type in (
                "arrow_function", "function_expression", "function"
            ):

                name_node = node.child_by_field_name("name")

                if name_node is not None:

                    self._handle_function(value, name_node=name_node)
                    return

        # ---- Class-like declarations ----

        if node_type in profile["class_types"]:

            self._handle_class(node)

        # ---- Imports ----

        elif node_type in profile["import_types"]:

            self._handle_import(node)

        # ---- Calls ----

        elif node_type in profile["call_types"]:

            self._handle_call(node)

        # =====================================
        # DFS
        # =====================================

        for child in node.children:

            self.traverse(child)

    # =====================================
    # Handlers
    # =====================================

    def _resolve_name(self, node):

        name_node = node.child_by_field_name("name")

        if name_node is not None:
            return name_node

        # C/C++ style: the name sits a few levels inside "declarator"
        # (e.g. pointer_declarator -> function_declarator -> identifier).
        declarator = node.child_by_field_name("declarator")
        depth = 0

        while declarator is not None and depth < 8:

            if declarator.type in _IDENTIFIER_TYPES:
                return declarator

            declarator = declarator.child_by_field_name("declarator")
            depth += 1

        return None

    def _handle_function(self, node, name_node=None):

        name_node = name_node or self._resolve_name(node)

        if name_node is None:

            # Anonymous function (e.g. an unnamed callback) — still walk
            # its body so nested calls are attributed to the enclosing
            # function, just don't register it as a named function.
            for child in node.children:
                self.traverse(child)

            return

        name = self.source_code[
            name_node.start_byte:name_node.end_byte
        ]

        function = FunctionInfo(

            name=name,

            file_path=self.current_file.path,

            start_line=node.start_point[0] + 1,

            end_line=node.end_point[0] + 1,

            start_byte=node.start_byte,

            end_byte=node.end_byte

        )

        self.index.add_function(function)

        previous_function = self.current_function

        self.current_function = name

        for child in node.children:

            self.traverse(child)

        self.current_function = previous_function

    def _handle_class(self, node):

        name_node = self._resolve_name(node)

        if name_node is None:
            return

        name = self.source_code[
            name_node.start_byte:name_node.end_byte
        ]

        cls = ClassInfo(

            name=name,

            file_path=self.current_file.path,

            start_line=node.start_point[0] + 1,

            end_line=node.end_point[0] + 1,

            start_byte=node.start_byte,

            end_byte=node.end_byte

        )

        self.index.add_class(cls)

    def _handle_import(self, node):

        statement = self.source_code[
            node.start_byte:node.end_byte
        ]

        imp = ImportInfo(

            file_path=self.current_file.path,

            statement=statement

        )

        self.index.add_import(imp)

    def _handle_call(self, node):

        if not self.current_function:
            return

        field = self.profile.get("call_field", "function")

        function_node = node.child_by_field_name(field)

        if function_node is None:
            return

        called_function = self.source_code[
            function_node.start_byte:function_node.end_byte
        ]

        # Handle attribute/member calls like:
        # self.login(), user.authenticate(), obj.method()
        if "." in called_function:
            called_function = called_function.split(".")[-1]

        self.index.add_call(

            self.current_function,

            called_function

        )