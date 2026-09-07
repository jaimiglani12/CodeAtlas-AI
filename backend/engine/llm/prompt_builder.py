class PromptBuilder:

    MAX_CONTEXT_CHARS = 20_000
    MAX_CHUNK_CHARS = 4_000

    def __init__(self):

        pass

    def build(self, query, results):

        prompt = ""

        prompt += "You are an expert software engineer.\n\n"

        prompt += "Answer the user's question using ONLY the repository context below.\n"

        prompt += "If the repository does not contain the answer, clearly say so.\n\n"

        prompt += "=" * 60 + "\n"
        prompt += "Repository Context\n"
        prompt += "=" * 60 + "\n\n"

        context_chars = 0

        for result in results:

            chunk = result["chunk"]

            remaining = self.MAX_CONTEXT_CHARS - context_chars

            if remaining <= 0:
                break

            content = chunk.content[:min(self.MAX_CHUNK_CHARS, remaining)]

            prompt += f"Function : {chunk.name}\n"
            prompt += f"File     : {chunk.file_path}\n"
            prompt += f"Lines    : {chunk.start_line}-{chunk.end_line}\n\n"

            prompt += content

            context_chars += len(content)

            prompt += "\n"

            prompt += "-" * 60

            prompt += "\n\n"

        prompt += "=" * 60 + "\n"
        prompt += "User Question\n"
        prompt += "=" * 60 + "\n\n"

        prompt += query

        prompt += "\n\nAnswer:\n"

        return prompt
