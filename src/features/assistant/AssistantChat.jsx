import React, { useState, useEffect } from "react";
import ChatUI from "@/components/ChatUI";
import { v4 as uuidv4 } from "uuid"; // 👉 install with: npm i uuid

export const AssistantChat = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! How can I assist you?", sender: "assistant" },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  // 🧠 Create or reuse session ID
  useEffect(() => {
    let existingSession = localStorage.getItem("chat_session_id");
    if (!existingSession) {
      existingSession = uuidv4();
      localStorage.setItem("chat_session_id", existingSession);
    }
    setSessionId(existingSession);
  }, []);

  const sendMessage = async (msg) => {
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg, sessionId }),
      });

      const data = await res.json();
      return data.reply || "🤖 No response from assistant.";
    } catch (err) {
      console.error("❌ Error communicating with MCP assistant:", err);
      return "⚠️ Failed to get response from assistant.";
    }
  };

  const handleSend = async (msg) => {
    const userMsg = {
      id: Date.now().toString(),
      text: msg,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const assistantReply = await sendMessage(msg);

      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: assistantReply,
        sender: "assistant",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error fetching assistant response:", err);
    }

    setLoading(false);
  };

  return (
    <ChatUI
      messages={messages}
      onSend={handleSend}
      loading={loading}
      className="h-full"
    />
  );
};
