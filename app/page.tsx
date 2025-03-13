'use client'

import { useState, useRef, useEffect } from 'react'

// Define response categories and their messages
const responses = {
  greeting: [
    "Hello! How are you feeling today? I'm here to provide support and information about postpartum depression.",
    "Hi there! I'm your postpartum depression support assistant. How can I help you today?",
    "Welcome! I'm here to chat about postpartum depression and provide support. How are you doing?"
  ],
  
  symptoms: [
    "Common symptoms of postpartum depression include persistent sadness, anxiety, excessive crying, and difficulty bonding with your baby. You might also experience changes in appetite, sleep problems, and feelings of worthlessness. Remember that experiencing these symptoms doesn't make you a bad parent - PPD is a medical condition that can be treated.",
    "Postpartum depression symptoms can include feeling overwhelmed, extreme fatigue, withdrawal from family and friends, and sometimes thoughts of harming yourself or your baby. Physical symptoms like headaches and chest pain can also occur. If you're experiencing any of these, please reach out to a healthcare provider.",
    "Signs of postpartum depression may include intense irritability, anger, hopelessness, and feeling like you're not a good mother. You might have trouble concentrating or making decisions, and may lose interest in activities you used to enjoy. These symptoms typically develop within the first few weeks after childbirth, but can appear up to a year later."
  ],
  
  treatment: [
    "Treatment for postpartum depression often includes therapy, such as cognitive behavioral therapy (CBT), which helps you identify and change negative thought patterns. Medication like antidepressants may also be prescribed. Support groups can connect you with others experiencing similar challenges. Self-care strategies like getting adequate rest, eating well, and gentle exercise are also important components of recovery.",
    "There are several effective treatments for postpartum depression. Psychotherapy can provide strategies to cope with negative feelings and set realistic expectations. Antidepressants can help balance brain chemicals affecting mood, though some may pass through breast milk (your doctor can help find a safe option if you're breastfeeding). Support from family, friends, and joining a support group can also be beneficial.",
    "Treating postpartum depression typically involves a combination approach. This might include counseling with a mental health professional, medication prescribed by your doctor, lifestyle changes like prioritizing sleep when possible, and building a support network. Remember that seeking help is a sign of strength, not weakness."
  ],
  
  coping: [
    "Some helpful coping strategies include: 1) Don't face this alone - accept help from family and friends, 2) Make time for self-care, even if it's just 10 minutes, 3) Connect with other parents through support groups, 4) Set realistic expectations - you don't need to be perfect, 5) Get as much rest as possible, and 6) Eat nutritious foods and stay hydrated.",
    "To cope with postpartum depression day-to-day: Try to get outside for some fresh air and sunlight daily, practice mindfulness or deep breathing when feeling overwhelmed, communicate openly with your partner about your feelings, join a new parent group (online or in-person), and remember that recovery takes time - be patient with yourself.",
    "Practical ways to cope include: Breaking tasks into smaller steps so they feel more manageable, scheduling time for activities you enjoy, keeping a journal to track your moods and identify triggers, limiting visitors if socializing feels overwhelming, and remembering that your feelings are valid and temporary - with proper support and treatment, you will feel better."
  ],
  
  resources: [
    "Helpful resources include: Postpartum Support International (1-800-944-4773), which offers a helpline and online support groups; the National Suicide Prevention Lifeline (988 or 1-800-273-8255) for crisis situations; and apps like 'What's Up?' or 'MoodMission' that offer coping strategies. Many hospitals also offer postpartum support programs.",
    "Some valuable resources are: The 'Postpartum Depression for Dummies' book by Shoshana Bennett, the website PostpartumProgress.com which has helpful articles and personal stories, the 'Mom & Mind' podcast, and the Crisis Text Line (text HOME to 741741) for immediate support. Your healthcare provider can also connect you with local resources.",
    "Resources that many find helpful include: The book 'This Isn't What I Expected' by Karen Kleiman, online forums like Reddit's r/PPDepression community, the 'Happiest Baby' blog which has articles on postpartum depression, and the Association for Postnatal Illness website. Don't forget that your pediatrician can also be a source of support and referrals."
  ],
  
  general: [
    "Postpartum depression is more common than many people realize - it affects about 1 in 7 new mothers. It's important to know that PPD is not caused by anything you did or didn't do, and experiencing it doesn't mean you don't love your baby. With support and treatment, you can recover and enjoy time with your child.",
    "Remember that postpartum depression is a medical condition, not a character flaw. Hormonal changes, sleep deprivation, and the major life adjustment of having a baby all contribute to it. Many people feel ashamed to seek help, but getting support early leads to faster recovery.",
    "It's important to distinguish between 'baby blues' (which affects up to 80% of mothers and typically resolves within two weeks after childbirth) and postpartum depression, which is more severe and longer-lasting. Partners can also experience depression after a baby's birth, though this is less frequently discussed."
  ]
};

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

  // Client-side message processing function
  const processMessage = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Determine which category the message falls into
    let category: keyof typeof responses = 'general';
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.match(/^hey/) || lowerCaseMessage.includes('greetings')) {
      category = 'greeting';
    } else if (lowerCaseMessage.includes('symptom') || lowerCaseMessage.includes('sign') || lowerCaseMessage.includes('feel') || lowerCaseMessage.includes('experiencing')) {
      category = 'symptoms';
    } else if (lowerCaseMessage.includes('treatment') || lowerCaseMessage.includes('therapy') || lowerCaseMessage.includes('medication') || lowerCaseMessage.includes('doctor') || lowerCaseMessage.includes('help me')) {
      category = 'treatment';
    } else if (lowerCaseMessage.includes('cope') || lowerCaseMessage.includes('manage') || lowerCaseMessage.includes('deal with') || lowerCaseMessage.includes('handle') || lowerCaseMessage.includes('strategy')) {
      category = 'coping';
    } else if (lowerCaseMessage.includes('resource') || lowerCaseMessage.includes('website') || lowerCaseMessage.includes('book') || lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('hotline') || lowerCaseMessage.includes('where can i')) {
      category = 'resources';
    }
    
    // Select a random response from the appropriate category
    const randomIndex = Math.floor(Math.random() * responses[category].length);
    const response = responses[category][randomIndex];
    
    // Add a disclaimer for medical advice
    const disclaimer = "\n\nPlease remember that I'm an AI assistant and not a substitute for professional medical advice. If you're struggling, please reach out to a healthcare provider.";
    
    // Only add disclaimer for medical-related responses
    return (category === 'symptoms' || category === 'treatment') 
      ? response + disclaimer 
      : response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    //asdsd
    try {
      // Process the message client-side instead of calling an API
      setTimeout(() => {
        const botResponse = processMessage(userMessage.content);
        setMessages((prev) => [...prev, { role: 'assistant', content: botResponse }]);
        setIsLoading(false);
      }, 1000); // Simulate a delay for more natural conversation flow
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
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