import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, MicrophoneIcon } from '@heroicons/react/24/solid';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ConversationalAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input,
        sender: 'user',
      };
      setMessages(prev => [...prev, newMessage]);
      setInput('');

      // TODO: Implement AI response logic here
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm your AI assistant. How can I help you?",
        sender: 'ai',
      };
      setTimeout(() => setMessages(prev => [...prev, aiResponse]), 1000);
    }
  };

  const handleVoice = () => {
    setIsListening(!isListening);
    // TODO: Implement voice recognition logic here
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleVoice}
            className={`p-2 ${isListening ? 'bg-red-500' : 'bg-gray-200'} text-white rounded-none`}
          >
            <MicrophoneIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleSend}
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
