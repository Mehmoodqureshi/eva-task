"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FaBars } from "react-icons/fa";
import { AssistantChat } from "@/features/assistant/AssistantChat";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [chats, setChats] = useState([
    { id: 1, title: "AssistantChat: Today's Chat", messages: [] },
  ]);
  const [selectedChat, setSelectedChat] = useState(chats[0].id);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const addNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `AssistantChat: New Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats([newChat, ...chats]);
    setSelectedChat(newChat.id);
  };

  const updateChatMessages = (chatId, newMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          // If first message, update title to snippet
          const updatedTitle =
            chat.messages.length === 0
              ? newMessage.content.slice(0, 30) +
                (newMessage.content.length > 30 ? "..." : "")
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
    <div className="flex h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chats={chats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        addNewChat={addNewChat}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`flex-1 bg-slate-900 text-white transition-all duration-300 ease-in-out h-screen ${
          sidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-400 ">
          <div className="flex items-center">
            {!sidebarOpen && (
              <button
                className="text-white p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover:scale-105 mr-4"
                onClick={toggleSidebar}
                aria-label="Open sidebar"
              >
                <FaBars size={18} />
              </button>
            )}
            <h1 className="text-lg font-medium text-gray-100">
              Your Assistant
            </h1>
          </div>
          <div className="text-sm text-gray-400">version 1</div>
        </div>

        <div
          className={`transition-all border-yellow-200 duration-300 ease-in-out transform ${
            sidebarOpen ? "scale-100 opacity-100" : "scale-[1.02] opacity-100"
          }`}
        >
          <div className="">
            <AssistantChat
              key={selectedChat}
              chatId={selectedChat}
              messages={
                chats.find((c) => c.id === selectedChat)?.messages || []
              }
              onSendMessage={(msg) => updateChatMessages(selectedChat, msg)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
