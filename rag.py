import re
from pathlib import Path


# =========================================================
# LOKASI KNOWLEDGE
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

KNOWLEDGE_FILE = (
    BASE_DIR
    / "knowledge"
    / "architecture.txt"
)


# =========================================================
# GAMBAR ARSITEKTUR
# =========================================================

IMAGE_MAP = {
    "gothic": "/images/gothic.jpg",
    "brutalist": "/images/brutalist.jpg",
    "modern": "/images/modern.jpg",
    "tropical": "/images/tropical.jpg"
}


# =========================================================
# STOPWORDS
# Kata-kata umum yang tidak terlalu membantu pencarian
# =========================================================

STOPWORDS = {
    "apa",
    "yang",
    "dan",
    "atau",
    "dengan",
    "dari",
    "untuk",
    "pada",
    "di",
    "ke",
    "dalam",
    "itu",
    "ini",
    "adalah",
    "merupakan",
    "bagaimana",
    "mengapa",
    "sebuah",
    "suatu",
    "sebagai",
    "saya",
    "ingin",
    "tahu",
    "jelaskan",
    "jelaskanlah"
}


# =========================================================
# SINONIM SEDERHANA
# =========================================================

SYNONYMS = {

    "ciri": {
        "karakteristik",
        "karakter",
        "fitur"
    },

    "material": {
        "bahan"
    },

    "bangunan": {
        "gedung"
    },

    "vegetasi": {
        "tanaman"
    },

    "panas": {
        "suhu",
        "temperatur"
    },

    "ruang": {
        "area"
    },

    "tapak": {
        "site",
        "lahan"
    },

    "sirkulasi": {
        "pergerakan",
        "jalur"
    },

    "pencahayaan": {
        "cahaya"
    },

    "angin": {
        "udara"
    }
}


# =========================================================
# LOAD KNOWLEDGE
# =========================================================

def load_knowledge():

    if not KNOWLEDGE_FILE.exists():

        raise FileNotFoundError(
            f"File knowledge tidak ditemukan: "
            f"{KNOWLEDGE_FILE}"
        )

    with open(
        KNOWLEDGE_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        text = file.read()


    # =====================================================
    # PERBAIKI TYPO
    # =====================================================

    text = text.replace(
        "lnventarisasi",
        "Inventarisasi"
    )


    # =====================================================
    # PISAHKAN BERDASARKAN PARAGRAF KOSONG
    # =====================================================

    documents = re.split(
        r"\n\s*\n",
        text
    )


    # =====================================================
    # BERSIHKAN DOKUMEN KOSONG
    # =====================================================

    documents = [

        document.strip()

        for document in documents

        if document.strip()

    ]

    return documents


# =========================================================
# TOKENIZATION
# =========================================================

def tokenize(text):

    words = re.findall(
        r"\b[a-zA-ZÀ-ÿ]+\b",
        text.lower()
    )


    # Hapus stopwords

    words = [

        word

        for word in words

        if word not in STOPWORDS

    ]

    return set(words)


# =========================================================
# PERLUAS QUERY DENGAN SINONIM
# =========================================================

def expand_query(words):

    expanded_words = set(words)


    for word in words:

        for key, synonyms in SYNONYMS.items():

            if word == key:

                expanded_words.update(
                    synonyms
                )

            elif word in synonyms:

                expanded_words.add(key)


    return expanded_words


# =========================================================
# DETEKSI GAMBAR
# =========================================================

def detect_image(query):

    query_lower = query.lower()


    # Gothic

    if "gothic" in query_lower:

        return IMAGE_MAP["gothic"]


    # Brutalist

    if "brutalist" in query_lower:

        return IMAGE_MAP["brutalist"]


    # Modern

    if "arsitektur modern" in query_lower:

        return IMAGE_MAP["modern"]


    # Tropical

    if "arsitektur tropis" in query_lower:

        return IMAGE_MAP["tropical"]


    return None


# =========================================================
# SEARCH KNOWLEDGE
# =========================================================

def search_knowledge(query):

    documents = load_knowledge()


    # =====================================================
    # QUERY ASLI
    # =====================================================

    query_lower = query.lower().strip()


    # =====================================================
    # PRIORITAS PERTANYAAN DEFINISI INVENTARISASI
    # =====================================================

    definition_questions = [

        "apa yang dimaksud dengan inventarisasi",

        "apa itu inventarisasi",

        "pengertian inventarisasi",

        "jelaskan inventarisasi"

    ]


    for question in definition_questions:

        if question in query_lower:

            for document in documents:

                document_lower = document.lower()


                if (
                    "inventarisasi adalah kegiatan"
                    in document_lower
                ):

                    return {
                        "response": document,
                        "image": None
                    }


    # =====================================================
    # TOKEN PERTANYAAN
    # =====================================================

    query_words = tokenize(query)


    # Tambahkan sinonim

    query_words = expand_query(
        query_words
    )


    if not query_words:

        return None


    best_document = None

    highest_score = 0


    # =====================================================
    # CARI DOKUMEN TERBAIK
    # =====================================================

    for document in documents:

        document_words = tokenize(
            document
        )


        # Kata yang sama

        common_words = (
            query_words
            & document_words
        )


        score = len(common_words)


        # =================================================
        # DOKUMEN DALAM LOWERCASE
        # =================================================

        document_lower = (
            document.lower()
        )


        # =================================================
        # ISTILAH PENTING
        # =================================================

        important_terms = [

            "arsitektur modern",

            "arsitektur brutalist",

            "arsitektur gothic",

            "arsitektur tropis",

            "material beton",

            "material kayu",

            "analisis tapak",

            "inventarisasi",

            "site planning",

            "site condition",

            "hvac",

            "fire fighting",

            "fire alarm",

            "sewage treatment plant",

            "elektrikal",

            "tata suara",

            "vegetasi",

            "sirkulasi",

            "topografi",

            "hidrologi",

            "pencahayaan"

        ]


        # =================================================
        # BONUS ISTILAH PENTING
        # =================================================

        for term in important_terms:

            if term in query_lower:

                if term in document_lower:

                    score += 5


        # =================================================
        # SIMPAN DOKUMEN DENGAN SKOR TERTINGGI
        # =================================================

        if score > highest_score:

            highest_score = score

            best_document = document


    # =====================================================
    # TENTUKAN HASIL
    # =====================================================

    if highest_score >= 1:

        image = detect_image(query)


        return {

            "response": best_document,

            "image": image

        }


    return None