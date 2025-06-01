// src/components/InputBox.jsx
import React, { useState } from "react";
import { MdSend } from "react-icons/md"; // Use MdSend as you wanted

const InputBox = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    console.log("InputBox sending message:", input.trim());
    onSend(input.trim());
    setInput(""); // clear after sending
  };

  return (
    <div className="bg-slate-600 rounded-xl px-4 py-3 flex items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Ask anything"
        disabled={disabled}
        className="bg-transparent flex-1 outline-none text-white placeholder:text-gray-400"
      />
      <button onClick={handleSend} disabled={disabled}>
        <MdSend className="w-5 h-5 text-white opacity-80 hover:opacity-100" />
      </button>
    </div>
  );
};

export default InputBox;
