from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from groq import Groq
import os

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are "ShopHelper", a friendly and enthusiastic AI assistant for a Fashion & Clothing e-commerce store.

STORE INFO:
- Name: TrendHive Fashion
- Specialty: Trendy men's, women's, and kids' clothing & accessories
- Shipping: Worldwide available
- Return Policy: 7-day easy returns
- Payment: Credit/Debit Card, PayPal, Cash on Delivery

YOUR ROLE:
- Help customers find the right clothing items by style, size, budget, or occasion
- Answer questions about sizing guides, fabric, and care instructions
- Handle order tracking, return, and exchange queries
- Give outfit recommendations and styling tips
- Assist with discount codes, ongoing sales, and new arrivals
- Help with account, payment, and checkout issues

PERSONALITY:
- Upbeat, friendly, and fashion-forward
- Match the language the customer uses (English or Bangla)
- Use emojis occasionally to keep it fun but don't overdo it
- Give confident style advice like a personal stylist
- If you can't resolve an issue, say: "Let me connect you with our support team at support@trendhive.com"

Always end by asking if there's anything else you can help with."""


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    history = data.get("history", [])
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=500,
            temperature=0.8
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": "Something went wrong. Please try again.", "error": str(e)}), 500


@app.route("/")
def index():
    return send_from_directory(".", "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
