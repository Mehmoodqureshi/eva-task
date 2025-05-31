import React, { useState } from "react";
import { FaPlus, FaRobot, FaUserCircle, FaTimes } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";

const chatsMock = [
  { id: 2, title: "Assistant Ben - Urbanisme" },
  { id: 3, title: "Assistant Théa - Assistante en ..." },
];

const Sidebar = ({ isOpen, onClose }) => {
  const [chats, setChats] = useState(chatsMock);
  const [selectedChat, setSelectedChat] = useState(chats[0].id);

  const handleDelete = (id) => {
    setChats(chats.filter((chat) => chat.id !== id));
    if (selectedChat === id && chats.length > 1) {
      setSelectedChat(chats[0].id);
    }
  };

  return (
    <div
      className={`
    fixed top-0 left-0 h-full w-72 bg-slate-900 text-white select-none
    transform transition-transform duration-300 ease-in-out z-40
    border-r border-gray-700
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}
    >
      {/* Close button - visible on all screens */}
      <div className="flex justify-between p-2">
        <h1 className="font-bold text-lg tracking-wide">Your Assistant</h1>
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="text-white hover:text-red-500"
        >
          <FaTimes size={18} />
        </button>
      </div>

      {/* Logo and New Chat */}
      <div className="flex items-center justify-end px-4 py-3 border-b border-gray-700">
        <button
          className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
          onClick={() => {
            const newChat = {
              id: chats.length + 1,
              title: `New Chat ${chats.length + 1}`,
            };
            setChats([newChat, ...chats]);
            setSelectedChat(newChat.id);
          }}
        >
          <FaPlus />
          <span className="text-sm">New chat</span>
        </button>
      </div>

      {/* Chat List */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1 px-2 mt-3">
          {chats.map(({ id, title }) => (
            <li
              key={id}
              onClick={() => setSelectedChat(id)}
              className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer
                ${
                  selectedChat === id
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-600 text-gray-300"
                }`}
            >
              <div className="flex items-center gap-3">
                <FaRobot className="text-lg" />
                <span className="truncate max-w-[180px]">{title}</span>
              </div>
              {id !== 1 && (
                <AiOutlineDelete
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(id);
                  }}
                  className="text-lg hover:text-red-500 cursor-pointer"
                  title="Delete chat"
                />
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile footer */}
    </div>
  );
};

export default Sidebar;
