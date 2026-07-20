class FileInfo:

    def __init__(self, name, path, extension, language):

        self.name = name
        self.path = path
        self.extension = extension
        self.language = language
        self.content = ""

    @staticmethod
    def read_file(path):

        try:

            with open(path, "r", encoding="utf-8") as file:

                return file.read()

        except Exception:

            return ""