import { useState, useCallback } from "react";

const useChat = () => {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  return {
    messages,
    addMessage,
  };
};

export default useChat;
