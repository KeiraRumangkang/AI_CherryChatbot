import re
from pathlib import Path


# Lokasi folder utama project
BASE_DIR = Path(__file__).resolve().parent

# Lokasi file knowledge
KNOWLEDGE_FILE = BASE_DIR / "knowledge" / "architecture.txt"


def load_knowledge():

    # Cek apakah file knowledge tersedia
    if not KNOWLEDGE_FILE.exists():
        raise FileNotFoundError(
            f"File knowledge tidak ditemukan: {KNOWLEDGE_FILE}"
        )

    with open(
        KNOWLEDGE_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        text = file.read()

    # Pisahkan setiap bagian knowledge
    documents = text.split("\n\n")

    # Hapus bagian kosong
    documents = [
        document.strip()
        for document in documents
        if document.strip()
    ]

    return documents


def search_knowledge(query):

    documents = load_knowledge()

    # Ambil kata-kata dari pertanyaan
    query_words = set(
        re.findall(
            r"\b\w+\b",
            query.lower()
        )
    )

    best_document = None
    highest_score = 0


    # Bandingkan dengan setiap knowledge
    for document in documents:

        document_words = set(
            re.findall(
                r"\b\w+\b",
                document.lower()
            )
        )

        # Hitung jumlah kata yang sama
        score = len(
            query_words & document_words
        )


        if score > highest_score:

            highest_score = score

            best_document = document


    # Hanya kembalikan hasil jika
    # ada minimal satu kata yang cocok
    if highest_score > 0:
        return best_document

    return None