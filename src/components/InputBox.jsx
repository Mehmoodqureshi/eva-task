// src/components/InputBox.jsx
import React, { useState } from "react";

const InputBox = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    console.log("InputBox sending message:", input.trim());
    onSend(input.trim()); // send text to parent
    setInput(""); // clear input
  };

  return (
    <div className="flex ">
      <input
        type="text"
        className="flex-grow p-2  text-black bg-slate-200 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <button
        onClick={handleSend}
        className="ml-2 bg-blue-600 text-white px-4 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default InputBox;
