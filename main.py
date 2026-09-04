import aiml

from rag import search_knowledge


# =========================
# AIML
# =========================

kernel = aiml.Kernel()

kernel.learn(
    "chatbot.aiml"
)


# =========================
# CHATBOT
# =========================

print("=" * 50)
print("              ARCHMATE AI")
print("       Architecture Assistant")
print("=" * 50)

print("Ketik 'keluar' untuk berhenti.\n")


while True:

    user_input = input("You: ")


    if user_input.lower() == "keluar":

        print(
            "ArchMate: Sampai jumpa! 👋"
        )

        break


    # =========================
    # AIML
    # =========================

    response = kernel.respond(
        user_input
    )


    if response:

        print(
            "\nArchMate:",
            response
        )

        print(
            "Source: AIML\n"
        )

        continue


    # =========================
    # RAG
    # =========================

    result = search_knowledge(
        user_input
    )


    if result:

        print(
            "\nArchMate:"
        )

        print(
            result
        )

        print(
            "\nSource: RAG\n"
        )


    else:

        print(
            "\nArchMate:"
        )

        print(
            "Maaf, saya belum menemukan "
            "informasi yang relevan."
        )

        print(
            "Source: Not Found\n"
        )