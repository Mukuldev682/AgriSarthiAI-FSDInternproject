import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { chatAPI } from "../utils/api";

const quickPrompts = [
  "टमाटर की पत्तियां पीली हो रही हैं",
  "Wheat rust disease treatment",
  "आलू में कौन सी खाद डालें?",
  "Drip irrigation for mustard crop",
];

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [userId] = useState(localStorage.getItem('userId') || '');

  // Load messages on component mount
  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatAPI.getMessages(userId);
      if (response.success && response.data.length > 0) {
        setMessages(response.data);
      } else {
        // Set welcome message if no messages
        setMessages([
          {
            role: "assistant",
            text: "नमस्ते किसान भाई! 🌾 मैं AgriSarthi हूँ। आप अपनी फसल, रोग, कीट, या खाद से जुड़ा कोई भी सवाल पूछ सकते हैं। (You can ask in Hindi or English!)",
          },
        ]);
      }
    } catch (err) {
      setError(err.message);
      // Set welcome message on error
      setMessages([
        {
          role: "assistant",
          text: "नमस्ते किसान भाई! 🌾 मैं AgriSarthi हूँ। आप अपनी फसल, रोग, कीट, या खाद से जुड़ा कोई भी सवाल पूछ सकते हैं। (You can ask in Hindi or English!)",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    try {
      setSending(true);
      setError(null);

      // Add user message to UI immediately
      const userMessage = { role: "user", text: trimmed };
      setMessages((prev) => [...prev, userMessage]);

      // Send to backend
      const response = await chatAPI.sendMessage({
        userId,
        role: "user",
        text: trimmed,
      });

      if (response.success) {
        setInput("");
        // Reload messages to get AI response
        setTimeout(() => loadMessages(), 1000);
      }
    } catch (err) {
      setError(err.message);
      // Remove the user message if send failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
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
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Page Heading */}
        <div
          className="py-6 px-4 text-center bg-gradient-to-br from-leaf-900 to-leaf-600 dark:from-gray-800 dark:to-gray-700"
        >
          <h1
            className="text-white dark:text-gray-100 text-2xl md:text-3xl font-extrabold"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            🤖 Chat with AgriSarthi
          </h1>
          <p className="text-leaf-200 dark:text-gray-300 text-sm mt-1">
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
                className="bg-white dark:bg-gray-800 border border-leaf-200 dark:border-gray-600 text-leaf-700 dark:text-leaf-300 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-leaf-50 dark:hover:bg-gray-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[340px] max-h-[420px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader size="medium" text="Loading messages..." />
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={msg.id || i}
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
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none"
                      }`}
                      style={msg.role === "user" ? { backgroundColor: "#16a34a" } : {}}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Bar */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-3 flex gap-2 items-end">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="अपना सवाल यहाँ लिखें... (Type your question here)"
                className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 text-sm outline-none focus:border-leaf-400 transition-colors"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={sending}
                className="bg-leaf-600 hover:bg-leaf-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#16a34a" }}
              >
                {sending ? <Loader size="small" /> : "Send ➤"}
              </button>
            </div>
          </div>

          {/* Info note */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            💬 Connected to backend API • AI responses powered by AgriSarthi
          </p>
        </div>
      </main>
      <Footer />
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
    </div>
  );
};

export default Dashboard;
