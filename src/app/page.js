"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FaBars, FaPlus } from "react-icons/fa";
import { AssistantChat } from "@/features/assistant/AssistantChat";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [chats, setChats] = useState([
    { id: 1, title: "New Chat", messages: [] },
  ]);
  const [selectedChat, setSelectedChat] = useState(chats[0].id);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const addNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };
    setChats([newChat, ...chats]);
    setSelectedChat(newChat.id);
  };

  const deleteChat = (chatId) => {
    if (chats.length <= 1) return;

    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);

    if (selectedChat === chatId) {
      setSelectedChat(updatedChats[0].id);
    }
  };

  const renameChat = (chatId, newTitle) => {
    setChats(
      chats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const updateChatMessages = (chatId, newMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          // If first message, update title to snippet
          const updatedTitle =
            chat.messages.length === 0
              ? newMessage.text.slice(0, 40) +
                (newMessage.text.length > 40 ? "..." : "")
              : chat.title;

          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            title: updatedTitle,
          };
        }
        return chat;
      })
    );
  };

  return (
    <div className="flex h-screen bg-gray-700">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chats={chats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        addNewChat={addNewChat}
        deleteChat={deleteChat}
        renameChat={renameChat}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header - ChatGPT Style */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-500 bg-gray-900">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu - Always Visible */}
            <button
              className="text-gray-300 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <FaBars size={16} />
            </button>

            {/* New Chat Button - Show when sidebar is closed */}
            {!sidebarOpen && (
              <button
                onClick={addNewChat}
                className="flex items-center  gap-2 px-3 py-1.5 text-sm border border-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaPlus size={12} />
                New chat
              </button>
            )}

            <h1 className="text-lg font-semibold">Your Assistant</h1>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 relative overflow-hidden">
          <AssistantChat
            key={selectedChat}
            chatId={selectedChat}
            messages={chats.find((c) => c.id === selectedChat)?.messages || []}
            onSendMessage={(msg) => updateChatMessages(selectedChat, msg)}
          />
        </div>
      </div>
    </div>
  );
}
