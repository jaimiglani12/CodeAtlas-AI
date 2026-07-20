from collections import Counter


class RepositoryAnalyzer:

    def __init__(self, index):

        self.index = index

    # ----------------------------------------

    def total_files(self):

        return len(self.index.files)

    # ----------------------------------------

    def total_functions(self):

        return len(self.index.functions)

    # ----------------------------------------

    def total_classes(self):

        return len(self.index.classes)

    # ----------------------------------------

    def total_imports(self):

        return len(self.index.imports)

    # ----------------------------------------

    def total_chunks(self):

        return len(self.index.chunks)

    # ----------------------------------------

    def languages(self):

        counter = Counter()

        for file in self.index.files:

            counter[file.language] += 1

        return dict(counter)

    # ----------------------------------------

    def largest_files(self):

        files = []

        for file in self.index.files:

            files.append(

                (

                    len(file.content),

                    file.path

                )

            )

        files.sort(reverse=True)

        return files

    # ----------------------------------------

    def most_called_functions(self):

        counter = Counter()

        for call in self.index.calls:

            counter[call.callee] += 1

        return counter.most_common()

    # ----------------------------------------

    def summary(self):

        return {

            "files": self.total_files(),

            "functions": self.total_functions(),

            "classes": self.total_classes(),

            "imports": self.total_imports(),

            "chunks": self.total_chunks(),

            "languages": self.languages(),

            "largest_files": self.largest_files()[:5],

            "most_called": self.most_called_functions()[:10]

        }