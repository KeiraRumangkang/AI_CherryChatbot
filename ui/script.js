const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const newChat = document.getElementById("newChat");


// ==========================================
// SEND MESSAGE
// ==========================================

function sendMessage() {

    const text = input.value.trim();

    if (text === "") {
        return;
    }


    // Sembunyikan welcome
    welcome.style.display = "none";


    // Tambahkan pesan user
    addMessage(
        text,
        "user"
    );


    // Bersihkan input
    input.value = "";


    // Simulasi AI
    setTimeout(() => {

        const response =
            generateResponse(text);

        addMessage(
            response.text,
            "ai",
            response.source
        );

    }, 600);
}



// ==========================================
// SIMPLE RESPONSE
// ==========================================

function generateResponse(text) {

    const question =
        text.toLowerCase();


    if (
        question.includes("modern")
    ) {

        return {

            text:
                "Arsitektur modern merupakan gaya arsitektur yang menekankan fungsi, kesederhanaan bentuk, penggunaan material modern seperti kaca, baja, dan beton, serta minimnya ornamen.",

            source: "AIML / RAG"

        };

    }


    if (
        question.includes("brutalist") ||
        question.includes("brutalism")
    ) {

        return {

            text:
                "Arsitektur Brutalist dikenal dengan penggunaan beton ekspos, bentuk geometris yang kuat, struktur yang terlihat jelas, dan minim ornamen.",

            source: "AIML / RAG"

        };

    }


    if (
        question.includes("tropical") ||
        question.includes("tropis")
    ) {

        return {

            text:
                "Arsitektur tropis dirancang untuk menyesuaikan bangunan dengan iklim tropis. Prinsipnya meliputi ventilasi alami, perlindungan terhadap sinar matahari, bukaan yang tepat, dan overhang.",

            source: "AIML / RAG"

        };

    }


    if (
        question.includes("halo") ||
        question.includes("hai")
    ) {

        return {

            text:
                "Halo! 🍒 Saya CherryChatbot. Saya siap membantu kamu menjelajahi dunia arsitektur. Apa yang ingin kamu pelajari?",

            source: "AIML"

        };

    }


    return {

        text:
            "Pertanyaan yang menarik! 🍒 Saat ini saya sedang mencari informasi arsitektur yang paling relevan untuk pertanyaan kamu.",

        source: "RAG"

    };

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


    message.appendChild(
        content
    );


    messages.appendChild(
        message
    );


    // Scroll ke pesan terbaru

    setTimeout(() => {

        messages.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });

    }, 50);
}



// ==========================================
// SEND BUTTON
// ==========================================

sendButton.addEventListener(
    "click",
    sendMessage
);



// ==========================================
// ENTER TO SEND
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


quickCards.forEach(
    function(card) {

        card.addEventListener(
            "click",
            function() {

                const question =
                    card.querySelector(
                        "strong"
                    ).textContent;


                input.value =
                    question;


                input.focus();

            }
        );

    }
);



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