import os

from .config import EXTENSION_TO_LANGUAGE
from .config import IGNORE_FOLDERS

from engine.models.file_info import FileInfo


class RepositoryScanner:

    def __init__(self, folder_path):

        self.folder_path = folder_path

    def scan(self, index):

        for root, folders, files in os.walk(self.folder_path):

            folders[:] = [

                folder

                for folder in folders

                if folder not in IGNORE_FOLDERS

            ]

            for file in files:
                if file.startswith("."):
                    continue

                extension = os.path.splitext(file)[1].lower()

                if extension not in EXTENSION_TO_LANGUAGE:

                    continue

                full_path = os.path.join(root, file)

                language = EXTENSION_TO_LANGUAGE[extension]

                file_info = FileInfo(

                    name=file,

                    path=full_path,

                    extension=extension,

                    language=language

                )

                file_info.content = FileInfo.read_file(full_path)

                index.add_file(file_info)