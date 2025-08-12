import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiMessageSquare } from "react-icons/fi";

const Chatbot = ({
  chatTitle = "Healthymind Assistant",
  systemPrompt = `
    Your name is Healthymind Assistant. You are part of the "Healthy Mind in a Healthy Body" project at KNUST.
    You provide support and guidance to students on mental health, academics, wellness, and campus life.
    
    Key features of the application:
    1. Professional Counsellors and Peer Counsellors
    2. Anonymous messaging system
    3. Advice hub with articles on academics, wellness, and career
    4. Student concern reporting system
    5. Feedback mechanism
    
    Your role:
    - Provide empathetic support to students
    - Offer guidance on mental health resources
    - Help navigate academic challenges
    - Suggest campus resources when needed
    - Maintain a friendly and supportive tone
    
    Always begin by introducing yourself and offering assistance.
  `,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm Healthymind Assistant. I'm here to support your wellbeing journey at KNUST. How can I help you today?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message to state immediately
    const userMessage = { id: Date.now(), text: inputValue, isUser: true };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare conversation history correctly
      const conversationHistory = [
        { role: "system", content: systemPrompt },
        ...updatedMessages
          .filter((msg) => msg.id !== 1) // Exclude initial greeting
          .map((msg) => ({
            role: msg.isUser ? "user" : "assistant",
            content: msg.text,
          })),
      ];

      // Call our API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      // Handle the response
      if (!data.choices || !Array.isArray(data.choices)) {
        throw new Error("Invalid response structure from API");
      }

      const firstChoice = data.choices[0];
      if (!firstChoice.message || !firstChoice.message.content) {
        throw new Error("Missing message content in API response");
      }

      const botResponse = firstChoice.message.content;

      // Add bot response to state
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: botResponse,
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      let errorMessage =
        "Sorry, I'm having trouble connecting. Please try again later.";

      // More specific error for token limit issues
      if (error.message.includes("context length")) {
        errorMessage =
          "Our conversation is getting too long. Please start a new chat session.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: errorMessage,
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[350px] h-[500px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden transform transition-all duration-300 animate-fadeIn">
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-3">
                <div className="bg-indigo-200 rounded-full w-8 h-8 flex items-center justify-center">
                  <FiMessageSquare className="text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold">{chatTitle}</h3>
                <p className="text-xs opacity-80">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-indigo-700 rounded-full p-1 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      message.isUser
                        ? "bg-indigo-500 text-white rounded-br-none"
                        : "bg-white border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-xl rounded-bl-none p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-200"
          >
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-r-lg px-4 hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
                disabled={isLoading || !inputValue.trim()}
              >
                <FiSend size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {chatTitle} - Here to support your wellness journey
            </p>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 animate-bounce"
        >
          <FiMessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
