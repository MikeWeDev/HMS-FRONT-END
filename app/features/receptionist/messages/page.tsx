'use client'
import React, { useState, useEffect, useRef } from 'react';
// Removed: import Head from 'next/head'; // Head is not needed for global font loading

// Define the type for a single message
interface Message {
  id: string;
  text: string;
  timestamp: string; // Storing as string for display purposes
  isUser: boolean; // To simulate sender (user vs. AI/other)
}

// Main ChatApp component
function Message() {
  // State to hold all messages in the chat
  const [messages, setMessages] = useState<Message[]>([]);
  // State to hold the current input text
  const [inputText, setInputText] = useState('');
  // Ref for the messages container to scroll to the bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Local Storage Operations ---

  // useEffect to load messages from local storage when the component mounts
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem('chatMessages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Failed to load messages from local storage:", error);
      // Optionally, clear invalid data or handle gracefully
      localStorage.removeItem('chatMessages');
    }
  }, []);

  // useEffect to save messages to local storage whenever the messages state changes
  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to local storage:", error);
    }
  }, [messages]);

  // useEffect to scroll to the bottom of the chat whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Event Handlers ---

  // Handles sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(), // Unique ID based on timestamp
        text: inputText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true, // Assuming the user is sending this message
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText(''); // Clear the input field
    }
  };

  // Handles deleting a message by its ID
  const handleDeleteMessage = (id: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    console.log('Message deleted successfully!');
  };

  // --- UI Rendering ---

  return (
    // Removed 'font-inter' class as it should be applied globally in layout.tsx
    <div className="flex flex-col h-screen bg-gray-100 antialiased">
      {/* Removed the Head component and all its content related to fonts and global styles */}

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full bg-white rounded-lg shadow-xl overflow-hidden my-auto h-[90vh]">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white text-lg font-semibold rounded-t-lg shadow-md flex items-center justify-between">
          <span>Hotel Chat Support</span>
          {/* Example of an icon - using SVG for simplicity and customizability */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>

        {/* Messages Display Area */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">Start chatting!</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end ${message.isUser ? 'justify-end' : 'justify-start'} group`}
              >
                <div
                  className={`relative max-w-[75%] px-4 py-3 rounded-xl shadow-sm text-sm ${
                    message.isUser
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  {/* Delete button for each message - now appears on hover */}
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="absolute top-1 right-1 text-red-300 hover:text-red-500 transition-opacity p-1 z-10 opacity-0 group-hover:opacity-100"
                    title="Delete message"
                  >
                    {/* Trashcan icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
          {/* Dummy div to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t border-gray-200 flex items-center rounded-b-lg shadow-inner">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="ml-3 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md transform hover:scale-105"
            aria-label="Send message"
          >
            {/* Send icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Message;