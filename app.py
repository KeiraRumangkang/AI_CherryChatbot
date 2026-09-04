from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from main import get_response


app = Flask(__name__)

CORS(app)


# ==========================================
# HALAMAN UTAMA
# ==========================================

@app.route("/")
def home():
    return send_from_directory("ui", "index.html")


# ==========================================
# FILE CSS
# ==========================================

@app.route("/style.css")
def css():
    return send_from_directory("ui", "style.css")


# ==========================================
# FILE JAVASCRIPT
# ==========================================

@app.route("/script.js")
def javascript():
    return send_from_directory("ui", "script.js")


# ==========================================
# CHAT API
# ==========================================

@app.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        user_input = data.get("message", "").strip()

        if not user_input:

            return jsonify({
                "response": "Silakan masukkan pertanyaan terlebih dahulu.",
                "source": "System"
            })


        result = get_response(user_input)

        return jsonify(result)


    except Exception as e:

        return jsonify({

            "response": "Terjadi kesalahan pada chatbot.",

            "source": "System",

            "error": str(e)

        }), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )