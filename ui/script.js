const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const newChat = document.getElementById("newChat");


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    const text = input.value.trim();

    if (text === "") {
        return;
    }

    // Sembunyikan welcome
    welcome.style.display = "none";

    // Tampilkan pesan user
    addMessage(text, "user");

    // Bersihkan input
    input.value = "";

    // Tampilkan loading
    const loadingMessage = addMessage(
        "CherryChatbot sedang berpikir... 🍒",
        "ai"
    );


    try {

        // Kirim pertanyaan ke Python
        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })

        });


        if (!response.ok) {
            throw new Error("Server error");
        }


        // Ambil jawaban Python
        const data = await response.json();


        // Hapus loading
        loadingMessage.remove();


        // Tampilkan jawaban
        addMessage(
            data.response,
            "ai",
            data.source
        );


    } catch (error) {

        console.error(error);

        loadingMessage.remove();

        addMessage(
            "Maaf, CherryChatbot tidak dapat terhubung ke Python. Pastikan server sedang berjalan. 🍒",
            "ai",
            "System"
        );

    }
}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(
    text,
    sender,
    source = ""
) {

    const message =
        document.createElement("div");

    message.classList.add(
        "message",
        sender
    );


    const content =
        document.createElement("div");

    content.classList.add(
        "message-content"
    );


    content.textContent = text;


    // Source AIML / RAG
    if (source) {

        const sourceElement =
            document.createElement("div");

        sourceElement.classList.add(
            "source"
        );

        sourceElement.textContent =
            "● Source: " + source;

        content.appendChild(
            sourceElement
        );

    }


    message.appendChild(content);

    messages.appendChild(message);


    // Scroll
    setTimeout(() => {

        message.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });

    }, 50);


    return message;
}


// ==========================================
// SEND BUTTON
// ==========================================

sendButton.addEventListener(
    "click",
    sendMessage
);


// ==========================================
// ENTER
// ==========================================

input.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ==========================================
// QUICK QUESTIONS
// ==========================================

const quickCards =
    document.querySelectorAll(
        ".quick-card"
    );


quickCards.forEach(function(card) {

    card.addEventListener(
        "click",
        function() {

            const question =
                card.querySelector(
                    "strong"
                ).textContent;

            input.value = question;

            input.focus();

        }
    );

});


// ==========================================
// NEW CHAT
// ==========================================

newChat.addEventListener(
    "click",
    function() {

        messages.innerHTML = "";

        welcome.style.display = "block";

        input.value = "";

        input.focus();

    }
);