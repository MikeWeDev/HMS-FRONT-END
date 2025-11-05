'use client'
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react'; // Added Lucide icons for a modern look

// Define the type for a single message
interface Message {
  id: string;
  text: string;
  timestamp: string; // Storing as string for display purposes
  isUser: boolean; // To simulate sender (user vs. AI/other)
}

// Main ChatApp component
function Message() {
  // Messages are now only stored in state, starting empty.
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Scroll Effect (Only effect remaining) ---
  // Scrolls to the bottom whenever messages change.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Event Handlers (Updated to include simulated response) ---

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
      };
      
      // Add the user message
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');

      // Simulate a support agent response after 1 second
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thank you for reaching out. A support agent is now reviewing your ephemeral message.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      }, 1000);
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    console.log('Message deleted successfully!');
  };

  // --- UI Rendering (User's latest styles maintained) ---

  return (
    // Applied user's latest h-[90vh] and mt-[10px] styling
    <div className="flex flex-col bg-gray-100 antialiased p-0 sm:p-4 mt-[10px] overflow-hidden h-[90vh]">
      
      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full bg-white shadow-none sm:shadow-2xl sm:rounded-xl overflow-hidden h-full sm:min-h-[85vh] transition-all duration-300">
        
        {/* Chat Header (Retained user's blue color) */}
        <div className="bg-blue-600 p-4 text-white text-xl font-bold shadow-lg flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6" />
            <span>Support Chat</span>
          </div>
          {/* Updated text for ephemeral state */}
        </div>

        {/* Messages Display Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8 p-4 bg-gray-50 rounded-lg shadow-inner">
              Welcome!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
              >
                {/* Message Bubble */}
                <div
                  className={`relative max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl shadow-md text-sm transition-all duration-200 ${
                    message.isUser
                      ? 'bg-blue-600 text-white rounded-br-md ml-auto'
                      : 'bg-gray-200 text-gray-800 rounded-tl-md mr-auto'
                  }`}
                >
                  <p className="break-words mb-1">{message.text}</p>
                  
                  {/* Timestamp & Delete */}
                  <div className={`flex items-center gap-2 mt-1 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-[10px] ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </span>
                    
                    {/* Delete button (only visible on hover/tap) */}
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className={`text-red-300 hover:text-red-500 transition-opacity p-0.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 ${message.isUser ? 'text-blue-300 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                      title="Delete message"
                      aria-label="Delete message"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Dummy div to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center sticky bottom-0 z-10">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question or request..."
            // Fixed typo: text-balck -> text-black
            className="flex-1 p-3 border border-gray-300 text-black rounded-full focus:outline-none focus:ring-4 focus:ring-blue-100 text-base transition-shadow"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="ml-3 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-xl disabled:bg-gray-400 disabled:shadow-none"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Custom Scrollbar Styling (Inline) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1; /* gray-300 */
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; /* gray-100 */
        }
      `}</style>
    </div>
  );
}

export default Message;