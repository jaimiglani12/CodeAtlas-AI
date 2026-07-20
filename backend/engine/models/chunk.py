class Chunk:

    def __init__(
        self,
        chunk_type,
        name,
        file_path,
        language,
        content,
        start_line,
        end_line
    ):

        self.chunk_type = chunk_type

        self.name = name

        self.file_path = file_path

        self.language = language

        self.content = content

        self.start_line = start_line

        self.end_line = end_line

        self.embedding = None