const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const newChat = document.getElementById("newChat");


// ==========================================
// RECENT QUESTIONS
// ==========================================

const recentQuestions =
    document.getElementById("recentQuestions");


// Menyimpan daftar pertanyaan
let questionHistory = [];


// ==========================================
// ADD QUESTION TO HISTORY
// ==========================================

function addToHistory(question) {

    // Jangan masukkan pertanyaan yang sama
    if (questionHistory.includes(question)) {
        return;
    }


    // Masukkan pertanyaan terbaru ke awal
    questionHistory.unshift(question);


    // Batasi maksimal 8 pertanyaan
    if (questionHistory.length > 8) {
        questionHistory.pop();
    }


    renderHistory();
}


// ==========================================
// DISPLAY HISTORY
// ==========================================

function renderHistory() {

    // Bersihkan isi history
    recentQuestions.innerHTML = "";


    // Jika belum ada pertanyaan
    if (questionHistory.length === 0) {

        const empty =
            document.createElement("div");

        empty.classList.add(
            "empty-history"
        );

        empty.textContent =
            "Belum ada pertanyaan.";

        recentQuestions.appendChild(
            empty
        );

        return;
    }


    // Tampilkan setiap pertanyaan
    questionHistory.forEach(
        function(question) {

            const item =
                document.createElement("button");

            item.classList.add(
                "history-item"
            );


            // Icon
            const icon =
                document.createElement("span");

            icon.classList.add(
                "history-icon"
            );

            icon.textContent = "◈";


            // Text
            const text =
                document.createElement("span");

            text.classList.add(
                "history-text"
            );

            text.textContent =
                question;


            // Masukkan icon dan text
            item.appendChild(icon);

            item.appendChild(text);


            // ==================================
            // KETIKA HISTORY DIKLIK
            // ==================================

            item.addEventListener(
                "click",
                function() {

                    input.value =
                        question;

                    input.focus();

                }
            );


            recentQuestions.appendChild(
                item
            );

        }
    );
}


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    const text = input.value.trim();

    if (text === "") {
        return;
    }


    // ======================================
    // TAMBAHKAN KE HISTORY
    // ======================================

    addToHistory(text);


    // ======================================
    // SEMBUNYIKAN WELCOME
    // ======================================

    welcome.style.display = "none";


    // ======================================
    // TAMPILKAN PESAN USER
    // ======================================

    addMessage(
        text,
        "user"
    );


    // ======================================
    // BERSIHKAN INPUT
    // ======================================

    input.value = "";


    // ======================================
    // TAMPILKAN LOADING
    // ======================================

    const loadingMessage = addMessage(
        "CherryChatbot sedang berpikir... 🍒",
        "ai"
    );


    try {

        // ==================================
        // KIRIM PERTANYAAN KE PYTHON
        // ==================================

        const response = await fetch(
            "/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: text
                })
            }
        );


        // ==================================
        // CEK RESPONSE SERVER
        // ==================================

        if (!response.ok) {

            throw new Error(
                "Server error"
            );

        }


        // ==================================
        // AMBIL DATA DARI PYTHON
        // ==================================

        const data =
            await response.json();


        // ==================================
        // HAPUS LOADING
        // ==================================

        loadingMessage.remove();


        // ==================================
        // TAMPILKAN JAWABAN
        // ==================================

        addMessage(
            data.response,
            "ai",
            data.source,
            data.image
        );


    } catch (error) {

        console.error(error);


        // ==================================
        // HAPUS LOADING
        // ==================================

        loadingMessage.remove();


        // ==================================
        // TAMPILKAN ERROR
        // ==================================

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
    source = "",
    image = null
) {

    // ======================================
    // CONTAINER MESSAGE
    // ======================================

    const message =
        document.createElement("div");

    message.classList.add(
        "message",
        sender
    );


    // ======================================
    // CONTENT
    // ======================================

    const content =
        document.createElement("div");

    content.classList.add(
        "message-content"
    );


    // ======================================
    // TEXT
    // ======================================

    const textElement =
        document.createElement("div");

    textElement.textContent = text;


    content.appendChild(
        textElement
    );


    // ======================================
    // GAMBAR
    // ======================================

    if (image) {

        const imageContainer =
            document.createElement("div");

        imageContainer.classList.add(
            "chat-image-container"
        );


        const imageElement =
            document.createElement("img");

        imageElement.src = image;

        imageElement.alt =
            "Gambar arsitektur";


        imageElement.classList.add(
            "chat-image"
        );


        // Jika gambar gagal dimuat

        imageElement.onerror =
            function() {

                imageContainer.remove();

            };


        imageContainer.appendChild(
            imageElement
        );

        content.appendChild(
            imageContainer
        );

    }


    // ======================================
    // SOURCE AIML / RAG
    // ======================================

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


    // ======================================
    // MASUKKAN KE MESSAGE
    // ======================================

    message.appendChild(
        content
    );

    messages.appendChild(
        message
    );


    // ======================================
    // SCROLL KE PESAN TERBARU
    // ======================================

    setTimeout(
        function() {

            message.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });

        },
        50
    );


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

        // Hapus semua pesan
        messages.innerHTML = "";


        // Tampilkan kembali welcome
        welcome.style.display =
            "block";


        // Kosongkan input
        input.value = "";


        // Hapus history
        questionHistory = [];


        // Tampilkan kondisi history kosong
        renderHistory();


        // Fokus input
        input.focus();

    }
);


// ==========================================
// INITIAL HISTORY
// ==========================================

renderHistory();