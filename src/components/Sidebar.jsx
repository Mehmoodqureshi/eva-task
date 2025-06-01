import React, { useState } from "react";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const Sidebar = ({
  isOpen,
  onClose,
  chats,
  selectedChat,
  setSelectedChat,
  addNewChat,
  deleteChat,
  renameChat,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleDelete = (id) => {
    if (chats.length <= 1) return;
    deleteChat(id);
  };

  const handleEdit = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = (id) => {
    if (editTitle.trim()) {
      renameChat(id, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleKeyPress = (e, id) => {
    if (e.key === "Enter") {
      handleSaveEdit(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditTitle("");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - ChatGPT Style */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 z-50 border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900">
          <h1 className="text-white text-lg font-medium">Your Assistant</h1>
        </div>

        {/* New Chat Button */}
        <div className="p-2">
          <button
            onClick={addNewChat}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors duration-200 text-white"
          >
            <FaPlus size={16} />
            <span className="text-sm font-medium">New chat</span>
          </button>
        </div>

        {/* Close Sidebar Button */}
        {/* <div className="px-2 pb-2">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-400 hover:text-white"
            title="Close sidebar"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
            <span className="text-sm">Hide sidebar</span>
          </button>
        </div> */}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="pb-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
                  selectedChat === chat.id
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                {editingId === chat.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(chat.id)}
                    onKeyDown={(e) => handleKeyPress(e, chat.id)}
                    className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <div className="flex-1 truncate text-sm">{chat.title}</div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(chat.id, chat.title);
                        }}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title="Rename"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(chat.id);
                        }}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-red-400"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 p-3">
          <div className="flex items-center gap-2 px-2 py-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium"></span>
            </div>
            <div className="flex-1 text-sm text-gray-300">User</div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-gray-700 rounded"
              title="Close sidebar"
            >
              <FaTimes size={12} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
