from engine.models.chunk import Chunk


# Files that don't yield a function/class chunk (no AST support for their
# language, or simply no top-level functions/classes) fall back to being
# chunked as plain text, split no larger than this many characters per
# piece so big files don't collapse into one oversized embedding.
MAX_FILE_CHUNK_CHARS = 3000


class ChunkGenerator:

    def __init__(self, index):

        self.index = index

    def generate(self):

        chunked_files = set()

        # ---------- Function Chunks ----------

        for function in self.index.functions:

            file = self.index.get_file(function.file_path)

            if file is None:
                continue

            code = file.content[
                function.start_byte:function.end_byte
            ]

            content = self.build_function_chunk(
                function,
                file,
                code
            )

            chunk = Chunk(

                chunk_type="function",

                name=function.name,

                file_path=function.file_path,

                language=file.language,

                content=content,

                start_line=function.start_line,

                end_line=function.end_line

            )

            self.index.add_chunk(chunk)

            chunked_files.add(function.file_path)

        # ---------- Class Chunks ----------

        for cls in self.index.classes:

            file = self.index.get_file(cls.file_path)

            if file is None:
                continue

            code = file.content[
                cls.start_byte:cls.end_byte
            ]

            content = self.build_class_chunk(
                cls,
                file,
                code
            )

            chunk = Chunk(

                chunk_type="class",

                name=cls.name,

                file_path=cls.file_path,

                language=file.language,

                content=content,

                start_line=cls.start_line,

                end_line=cls.end_line

            )

            self.index.add_chunk(chunk)

            chunked_files.add(cls.file_path)

        # ---------- Whole-file fallback chunks ----------

        # Any file that produced zero function/class chunks — because its
        # language has no tree-sitter grammar wired up (e.g. Ruby, PHP,
        # config/markup files), or because it simply has no top-level
        # functions/classes (scripts, JSON, YAML, README files, etc.) —
        # still gets indexed as plain text. Without this, those files
        # would be scanned but invisible to chat/search.

        for file in self.index.files:

            if file.path in chunked_files:
                continue

            if not file.content or not file.content.strip():
                continue

            pieces = self._split_file(file.content)

            for piece_index, (start_line, end_line, code) in enumerate(pieces):

                name = (
                    file.name
                    if len(pieces) == 1
                    else f"{file.name} (part {piece_index + 1}/{len(pieces)})"
                )

                content = self.build_file_chunk(file, code)

                chunk = Chunk(

                    chunk_type="file",

                    name=name,

                    file_path=file.path,

                    language=file.language,

                    content=content,

                    start_line=start_line,

                    end_line=end_line

                )

                self.index.add_chunk(chunk)

    def _split_file(self, content):
        """
        Splits file content into line-aligned pieces no longer than
        MAX_FILE_CHUNK_CHARS. Returns a list of (start_line, end_line,
        text) tuples, in order.
        """

        lines = content.splitlines()

        if not lines:
            return []

        pieces = []
        current_lines = []
        current_len = 0
        start_line = 1

        for line_number, line in enumerate(lines, start=1):

            current_lines.append(line)
            current_len += len(line) + 1

            if current_len >= MAX_FILE_CHUNK_CHARS:

                pieces.append(
                    (start_line, line_number, "\n".join(current_lines))
                )

                current_lines = []
                current_len = 0
                start_line = line_number + 1

        if current_lines:

            pieces.append(
                (start_line, len(lines), "\n".join(current_lines))
            )

        return pieces

    def build_function_chunk(
        self,
        function,
        file,
        code
    ):

        text = ""

        text += f"Function Name: {function.name}\n"

        text += f"File: {function.file_path}\n"

        text += f"Language: {file.language}\n\n"

        text += "Code:\n"

        text += code

        return text

    def build_file_chunk(
        self,
        file,
        code
    ):

        text = ""

        text += f"File: {file.path}\n"

        text += f"Language: {file.language}\n\n"

        text += "Code:\n"

        text += code

        return text

    def build_class_chunk(
        self,
        cls,
        file,
        code
    ):

        text = ""

        text += f"Class Name: {cls.name}\n"

        text += f"File: {cls.file_path}\n"

        text += f"Language: {file.language}\n\n"

        text += "Code:\n"

        text += code

        return text