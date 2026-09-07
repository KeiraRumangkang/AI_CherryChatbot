import aiml
from rag import search_knowledge


# =========================================================
# MEMBUAT AIML KERNEL
# =========================================================

kernel = aiml.Kernel()


# =========================================================
# MEMBACA FILE AIML
# =========================================================

kernel.learn("chatbot.aiml")


# =========================================================
# FUNGSI UTAMA CHATBOT
# =========================================================

def get_response(user_input):
    """
    Memproses pertanyaan menggunakan AIML terlebih dahulu.
    Jika tidak ditemukan, dilanjutkan ke RAG.

    Hasil yang dikembalikan:
    - response : jawaban chatbot
    - source   : sumber jawaban (AIML / RAG / Not Found)
    - image    : gambar jika tersedia
    """


    # =====================================================
    # 1. CEK AIML
    # =====================================================

    response = kernel.respond(user_input)


    if response:

        return {
            "response": response,
            "source": "AIML",
            "image": None
        }


    # =====================================================
    # 2. CEK RAG
    # =====================================================

    result = search_knowledge(user_input)


    if result:

        # =================================================
        # RAG mengembalikan dictionary
        # =================================================

        return {
            "response": result.get("response", ""),
            "source": "RAG",
            "image": result.get("image")
        }


    # =====================================================
    # 3. TIDAK DITEMUKAN
    # =====================================================

    return {
        "response": (
            "Maaf, saya belum menemukan informasi yang "
            "relevan dengan pertanyaan tersebut. 🍒"
        ),
        "source": "Not Found",
        "image": None
    }