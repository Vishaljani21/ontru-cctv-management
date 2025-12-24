import React, { useState, useEffect, useContext, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { AppContext, AppContextType } from '../App';
import type { ChatMessage } from '../types';
import { ChatbotIcon, CloseIcon, SendIcon, SparklesIcon } from './icons';
import { api } from '../services/api';

const ChatbotWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const appContext = useContext(AppContext) as AppContextType;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    // Initialize Gemini AI
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Effect to generate initial reminders
    useEffect(() => {
        if (isOpen && !hasInitialized.current) {
            const generateReminders = async () => {
                setIsLoading(true);
                const { visits, warrantyEntries } = appContext;
                // FIX: Fetch customers to get their names for reminders.
                const customers = await api.getCustomers();

                const remindersToGenerate = [];
                const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

                const longPendingWarranties = warrantyEntries.filter(e =>
                    e.status === 'Sent to Service' && new Date(e.dispatchDate || 0).getTime() < sevenDaysAgo
                );

                const visitsMissingCredentials = visits.filter(v =>
                    v.status === 'completed' && (!v.nvrUsername || !v.nvrPassword)
                );

                if (longPendingWarranties.length > 0) {
                    remindersToGenerate.push(`These warranty items are pending from service station for more than 7 days: ${longPendingWarranties.map(e => e.serialNumber).join(', ')}.`);
                }
                if (visitsMissingCredentials.length > 0) {
                    // FIX: Look up customer name from the fetched customers list instead of accessing a non-existent property.
                     const customerNames = visitsMissingCredentials.map(v => {
                        return customers.find(c => c.id === v.customerId)?.companyName || `Visit #${v.id}`;
                     }).join(', ');
                     remindersToGenerate.push(`These completed visits are missing NVR credentials: ${customerNames}. Technicians should be reminded to add them.`);
                }

                if (remindersToGenerate.length > 0) {
                    const prompt = `You are OnTru Sahayak, a helpful AI assistant. Your primary language is Gujarati.
                    Based on the following issues, generate a friendly and professional reminder summary in Gujarati.
                    
                    Issues:
                    - ${remindersToGenerate.join('\n- ')}
                    
                    Start your message with "નમસ્તે! મારી પાસે તમારા માટે કેટલાક રીમાઇન્ડર્સ છે:"
                    `;

                    try {
                        const response = await ai.models.generateContent({
                            model: 'gemini-2.5-flash',
                            contents: prompt,
                        });
                        setMessages([{ role: 'model', text: response.text }]);
                    } catch (error) {
                        console.error("Error generating reminders:", error);
                        setMessages([{ role: 'model', text: 'નમસ્તે! હું તમારા ડેટાનું વિશ્લેષણ કરી રહ્યો હતો, પરંતુ મને એક સમસ્યા આવી.' }]);
                    }

                } else {
                    setMessages([{ role: 'model', text: 'નમસ્તે! હું OnTru સહાયક છું. તમે મુલાકાતો, વોરંટી, અથવા ઇન્વેન્ટરી વિશે પ્રશ્નો પૂછી શકો છો. હું તમને કેવી રીતે મદદ કરી શકું?' }]);
                }
                
                setIsLoading(false);
                hasInitialized.current = true;
            };

            generateReminders();
        }
    }, [isOpen, appContext, ai.models]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Contextual Data
        const contextData = `
            Current Visits Data: ${JSON.stringify(appContext.visits.slice(0, 5))}
            Current Warranty Data: ${JSON.stringify(appContext.warrantyEntries.slice(0, 5))}
        `;

        const systemInstruction = `You are OnTru Sahayak, an AI assistant for a business management app.
        You must communicate primarily in Gujarati, but you can understand English.
        Your goal is to be helpful and answer questions based on the provided data context.
        Explain features if asked. Be concise and friendly.
        If you don't know the answer from the context, say "માફ કરશો, મારી પાસે આ માહિતી નથી."
        `;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `CONTEXT:\n${contextData}\n\nUSER QUESTION:\n${input}`,
                config: { systemInstruction }
            });

            setMessages(prev => [...prev, { role: 'model', text: response.text }]);
        } catch (error) {
            console.error("Gemini API error:", error);
             setMessages(prev => [...prev, { role: 'model', text: "માફ કરશો, મને જવાબ આપવામાં સમસ્યા આવી રહી છે." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-primary-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-transform transform hover:scale-110"
                aria-label="Open AI Assistant"
            >
                <ChatbotIcon className="w-8 h-8" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[90vw] max-w-md h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50">
            <header className="flex items-center justify-between p-4 bg-primary-500 text-white rounded-t-2xl">
                 <div className="flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-2"/>
                    <h3 className="font-semibold text-lg">OnTru Sahayak</h3>
                </div>
                <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                            <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <footer className="p-4 border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="તમારો પ્રશ્ન પૂછો..."
                        className="flex-1 w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400"
                        disabled={isLoading}
                    />
                    <button type="submit" className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:bg-primary-300" disabled={isLoading || !input.trim()}>
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatbotWidget;