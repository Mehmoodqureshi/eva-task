import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import InputBox from "./InputBox";
import Loader from "./Loader";
import { MdSend } from "react-icons/md";

const ChatUI = ({
  messages = [],
  onSend = () => {},
  loading = false,
  className = "",
}) => {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages, loading]);

  const showWelcome =
    messages.length === 0 ||
    (messages.length === 1 &&
      messages[0].sender === "assistant" &&
      messages[0].text === "Hello! How can I assist you?");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  if (showWelcome) {
    return (
      <div className={`flex flex-col h-full bg-gray-900 ${className}`}>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center w-full max-w-2xl">
            <h1 className="text-white text-2xl font-medium mb-6">
              What can I help with?
            </h1>
            <div className="w-full">
              <div className="bg-slate-700 rounded-xl px-4 py-3 flex items-center text-white">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything"
                  className="bg-transparent flex-1 outline-none placeholder:text-gray-400"
                />
                <button onClick={handleSend}>
                  <MdSend className="w-5 h-5 text-white opacity-80 hover:opacity-100" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full gap-2 bg-gray-900 text-white ${className}`}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-2">
          {messages.map(({ id, text, sender, timestamp }) => (
            <Message
              key={id}
              text={text}
              sender={sender}
              timestamp={timestamp}
            />
          ))}
          {loading && (
            <div className="px-4 py-6">
              <Loader />
            </div>
          )}
        </div>
      </div>
      <div className=" border-gray-700 py-3">
        <div className="max-w-4xl mx-auto">
          <InputBox
            onSend={(text) => {
              onSend(text);
              setInput(""); // reset local input
            }}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
