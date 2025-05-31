import React, { useEffect, useRef } from "react";
import Message from "./Message";
import InputBox from "./InputBox";
import Loader from "./Loader";

const ChatUI = ({ messages = [], onSend = () => {}, loading = false }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1 bg-slate-900 text-white">
      {/* Scrollable messages container */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.map(({ id, text, sender }) => (
          <Message key={id} text={text} sender={sender} />
        ))}
        {loading && <Loader />}
      </div>

      {/* Fixed input box at bottom */}
      <div className="border-t border-slate-700 h-8">
        <InputBox onSend={onSend} />
      </div>
    </div>
  );
};

export default ChatUI;
