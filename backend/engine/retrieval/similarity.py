from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity(

    query_embedding,

    chunk_embedding

):

    if query_embedding is None:

        return 0.0

    if chunk_embedding is None:

        return 0.0

    score = cosine_similarity(

        query_embedding.reshape(1, -1),

        chunk_embedding.reshape(1, -1)

    )[0][0]

    return float(score)