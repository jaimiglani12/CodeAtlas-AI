from tree_sitter import Language, Parser

import tree_sitter_python
import tree_sitter_javascript
import tree_sitter_typescript
import tree_sitter_java
import tree_sitter_cpp
import tree_sitter_c
import tree_sitter_go
import tree_sitter_rust


# Each entry is the grammar loader for a language with tree-sitter support.
# Languages not listed here are still scanned and chunked as plain text
# (see engine/chunker/generator.py) — they just don't get an AST, so
# CodeParser.parse() returns None for them instead of raising.
_GRAMMAR_LOADERS = {

    "python": tree_sitter_python.language,
    "javascript": tree_sitter_javascript.language,
    "typescript": tree_sitter_typescript.language_typescript,
    "tsx": tree_sitter_typescript.language_tsx,
    "java": tree_sitter_java.language,
    "cpp": tree_sitter_cpp.language,
    "c": tree_sitter_c.language,
    "go": tree_sitter_go.language,
    "rust": tree_sitter_rust.language,

}


class CodeParser:
    """
    Parses source files into tree-sitter syntax trees.

    Grammars are loaded lazily and cached on the class, so each language's
    (relatively expensive) grammar load happens at most once per process,
    no matter how many CodeParser instances are created or files parsed.
    """

    _languages = {}
    _parsers = {}

    @classmethod
    def _parser_for(cls, language):

        if language not in _GRAMMAR_LOADERS:

            return None

        if language not in cls._parsers:

            if language not in cls._languages:

                cls._languages[language] = Language(
                    _GRAMMAR_LOADERS[language]()
                )

            cls._parsers[language] = Parser(
                cls._languages[language]
            )

        return cls._parsers[language]

    def parse(self, file):
        """
        Returns a tree-sitter Tree for languages with a wired-up grammar.
        Returns None if the file's language has no AST support — this does
        not mean the file was skipped, only that it won't get function,
        class or call extraction. Callers must handle a None tree.
        """

        parser = self._parser_for(
            getattr(file, "language", None)
        )

        if parser is None:

            return None

        try:

            return parser.parse(
                file.content.encode("utf-8")
            )

        except Exception:

            return None