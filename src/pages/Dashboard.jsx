import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const quickPrompts = [
  "टमाटर की पत्तियां पीली हो रही हैं",
  "Wheat rust disease treatment",
  "आलू में कौन सी खाद डालें?",
  "Drip irrigation for mustard crop",
];

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "नमस्ते किसान भाई! 🌾 मैं AgriSarthi हूँ। आप अपनी फसल, रोग, कीट, या खाद से जुड़ा कोई भी सवाल पूछ सकते हैं। (You can ask in Hindi or English!)",
    },
  ]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      {
        role: "assistant",
        text: "🔄 AgriSarthi AI is coming soon! This is the frontend skeleton. Once the backend is connected, I'll give you instant advice on: " + trimmed,
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        {/* Page Heading */}
        <div
          className="py-6 px-4 text-center"
          style={{ background: "linear-gradient(135deg, #14532d, #16a34a)" }}
        >
          <h1
            className="text-white text-2xl md:text-3xl font-extrabold"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            🤖 Chat with AgriSarthi
          </h1>
          <p className="text-leaf-200 text-sm mt-1">
            Ask anything about your crops — in Hindi or English
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => setInput(p)}
                className="bg-white border border-leaf-200 text-leaf-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-leaf-50 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[340px] max-h-[420px]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                      msg.role === "user" ? "bg-soil-100" : "bg-leaf-100"
                    }`}
                    style={{ backgroundColor: msg.role === "user" ? "#fef3c7" : "#dcfce7" }}
                  >
                    {msg.role === "user" ? "👨‍🌾" : "🤖"}
                  </div>
                  <div
                    className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-leaf-600 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                    style={msg.role === "user" ? { backgroundColor: "#16a34a" } : {}}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="border-t border-gray-100 p-3 flex gap-2 items-end">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="अपना सवाल यहाँ लिखें... (Type your question here)"
                className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-leaf-400 transition-colors"
              />
              <button
                onClick={handleSend}
                className="bg-leaf-600 hover:bg-leaf-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors"
                style={{ backgroundColor: "#16a34a" }}
              >
                Send ➤
              </button>
            </div>
          </div>

          {/* Info note */}
          <p className="text-center text-xs text-gray-400">
            ⚠️ This is a frontend skeleton. AI responses will be live once the backend is connected.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
