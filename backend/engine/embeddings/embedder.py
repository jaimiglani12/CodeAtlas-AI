import hashlib
import re

import numpy as np


class Embedder:

    DIMENSIONS = 384
    TOKEN_PATTERN = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")

    def create_embedding(self, text):

        vector = np.zeros(self.DIMENSIONS, dtype=np.float32)

        for token in self.TOKEN_PATTERN.findall(text.lower()):
            digest = hashlib.blake2b(
                token.encode("utf-8"),
                digest_size=8,
            ).digest()
            value = int.from_bytes(digest, "little")
            direction = 1.0 if value & 1 else -1.0
            vector[value % self.DIMENSIONS] += direction

        norm = np.linalg.norm(vector)

        if norm:
            vector /= norm

        return vector

    def generate(self, index):

        for chunk in index.chunks:
            chunk.embedding = self.create_embedding(chunk.content)
