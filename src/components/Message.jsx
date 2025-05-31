import React, { memo } from "react";

const Message = memo(({ text, sender }) => {
  const isUser = sender === "user";

  return (
    <div
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} px-2`}
    >
      <div
        className={`whitespace-pre-wrap px-4 py-3 rounded-xl max-w-2xl text-sm shadow 
        ${isUser ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"}`}
      >
        {text}
      </div>
    </div>
  );
});

export default Message;
