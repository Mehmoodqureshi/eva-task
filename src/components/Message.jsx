// src/components/Message.jsx
import React from "react";
import clsx from "clsx";

const Message = ({ text, sender, timestamp }) => {
  const isUser = sender === "user";

  return (
    <div
      className={clsx(
        "flex w-full my-2 px-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-xs",
          isUser
            ? "bg-blue-800 text-white rounded-br-none"
            : "bg-[#2d2d2d] text-gray-100 rounded-bl-none"
        )}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {timestamp && (
          <div className="text-xs text-gray-400 text-right mt-1">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
