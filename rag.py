import re


# =========================
# LOAD KNOWLEDGE BASE
# =========================

def load_knowledge():

    with open(
        "knowledge/architecture.txt",
        "r",
        encoding="utf-8"
    ) as file:

        text = file.read()


    documents = text.split("\n\n")

    return documents


# =========================
# SEARCH
# =========================

def search_knowledge(query):

    documents = load_knowledge()

    query_words = set(
        re.findall(
            r'\b\w+\b',
            query.lower()
        )
    )


    best_document = None

    highest_score = 0


    for document in documents:

        document_words = set(
            re.findall(
                r'\b\w+\b',
                document.lower()
            )
        )


        score = len(
            query_words &
            document_words
        )


        if score > highest_score:

            highest_score = score

            best_document = document


    return best_document