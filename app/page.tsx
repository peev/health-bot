'use client'

import { useState, useRef, useEffect } from 'react'

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message when component mounts
  useEffect(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: 'Hello! I\'m your postpartum depression support assistant. I can provide information about symptoms, treatment options, coping strategies, and resources. How can I help you today?' 
      }
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.text();
      
      // Add assistant message
      setMessages((prev) => [...prev, { role: 'assistant', content: data }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Suggested questions for users to click
  const suggestedQuestions = [
    "What are the symptoms of postpartum depression?",
    "How is postpartum depression treated?",
    "What coping strategies can help?",
    "Where can I find resources for support?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="bg-white shadow-sm py-3 px-4 sm:py-4 sm:px-6 sticky top-0 z-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-indigo-700">
          Postpartum Depression Support
        </h1>
      </header>
      
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-2 sm:p-4">
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 sm:p-4" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <div className="space-y-3 sm:space-y-4">
              {messages.map((m, index) => (
                <div
                  key={index}
                  className={`flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    } p-2 sm:p-3 rounded-lg max-w-[85%] sm:max-w-[80%] shadow-sm whitespace-pre-wrap text-sm sm:text-base`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-2 sm:p-3 rounded-lg shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Suggested questions */}
          {messages.length <= 2 && (
            <div className="p-2 sm:p-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs sm:text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full transition-colors mb-1"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-2 sm:p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                className="flex-1 p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
                disabled={isLoading || !input.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
        
        <footer className="mt-2 sm:mt-4 text-center text-xs sm:text-sm text-gray-500 px-2">
          <p>This is an AI assistant for informational purposes only. Not a substitute for professional medical advice.</p>
        </footer>
      </div>
    </main>
  )
} 