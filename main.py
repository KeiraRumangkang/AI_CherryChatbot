import aiml
from rag import search_knowledge

# Membuat AIML Kernel
kernel = aiml.Kernel()

# Membaca file AIML
kernel.learn("chatbot.aiml")


def get_response(user_input):
    """
    Memproses pertanyaan menggunakan AIML terlebih dahulu.
    Jika tidak ditemukan, dilanjutkan ke RAG.
    """

    # ==========================
    # 1. CEK AIML
    # ==========================

    response = kernel.respond(user_input)

    if response:
        return {
            "response": response,
            "source": "AIML"
        }

    # ==========================
    # 2. CEK RAG
    # ==========================

    result = search_knowledge(user_input)

    if result:
        return {
            "response": result,
            "source": "RAG"
        }

    # ==========================
    # 3. TIDAK DITEMUKAN
    # ==========================

    return {
        "response": "Maaf, saya belum menemukan informasi yang relevan dengan pertanyaan tersebut. 🍒",
        "source": "Not Found"
    }