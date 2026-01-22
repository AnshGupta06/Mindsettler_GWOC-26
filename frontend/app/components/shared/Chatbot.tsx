'use client';

import { chatbotAssistsBooking } from '../../ai/flows/chatbot-assists-booking';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Bot, Loader, MessageSquare, Send, User, X,
  CalendarHeart, Phone, HeartHandshake, Library 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  role: 'user' | 'bot';
  content: string;
  action?: string; // Added action property
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content:
        "Hi 🌱 I’m here to listen and guide you. You can ask about sessions, services, or anything you’re unsure about.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // New State
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 1. Auto-scroll Logic (Preserved)
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages, isLoading]);

  // 2. NEW: Automatic Redirection Logic
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    
    // Check if the last message was from bot AND has a redirect command
    if (lastMsg?.role === 'bot' && lastMsg.action?.startsWith('redirect_')) {
      const action = lastMsg.action;
      setIsRedirecting(true); // Hide buttons immediately

      const timer = setTimeout(() => {
        handleAction(action); 
        setIsRedirecting(false); 
      }, 1500); // 1.5s delay so user can read message

      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleAction = (action: string) => {
    setIsOpen(false);
    if (action.includes('booking')) router.push('/book');
    else if (action.includes('contact')) router.push('/contact');
    else if (action.includes('services')) router.push('/services');
    else if (action.includes('resources')) router.push('/resource');
  };

  const getActionButton = (action: string) => {
    if (action.includes('booking')) 
      return { label: "Book a Session", icon: CalendarHeart, color: "bg-[#b8aaf3] hover:bg-[#a79bf0]" };
    if (action.includes('contact')) 
      return { label: "Contact Support", icon: Phone, color: "bg-[#3F2965] hover:bg-[#2F1D4B]" };
    if (action.includes('services')) 
      return { label: "View Services", icon: HeartHandshake, color: "bg-[#3F2965] hover:bg-[#2F1D4B]" };
    if (action.includes('resources')) 
      return { label: "Explore Resources", icon: Library, color: "bg-[#3F2965] hover:bg-[#2F1D4B]" };
    return null;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatbotAssistsBooking({
        message: input,
        history: messages
          .filter(m => !m.content.startsWith('__'))
          .slice(-10),
      });

      // Updated to store action in the message object
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: result.response, action: result.action },
      ]);
      
      // Removed old manual 'redirect_booking' check here because useEffect handles it now

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          content: "I’m having a little trouble right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={false}
        animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          className="ms-chatbot-trigger h-16 w-16 rounded-full shadow-lg bg-[#dd1764] hover:bg-[#c21458] border-2 border-white"
          onClick={() => setIsOpen(true)}
          aria-label="Open chatbot"
        >
          <MessageSquare className="h-8 w-8 text-white" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[51]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 100, x: 100, originX: 1, originY: 1 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0,
                transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.8 }
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.3, ease: "easeInOut" }
              }}
              className="ms-chatbot-sheet fixed bottom-6 right-6 z-[52] flex flex-col w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-none"
            >
              <div className="ms-chatbot-header p-6 pb-4 relative pr-12">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-6 top-6 rounded-full h-8 w-8 hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-bold text-primary">MindSettler Assistant</h2>
                <p className="text-sm text-muted-foreground mt-1 pr-4 leading-relaxed">
                  A calm space to understand our services and take the next step.
                </p>
              </div>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="space-y-6 p-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-start gap-3',
                          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        )}
                      >
                        <Avatar>
                          <AvatarFallback>
                            {message.role === 'user' ? (
                              <User className="h-5 w-5" />
                            ) : (
                              <Bot className="h-5 w-5" />
                            )}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col gap-2 max-w-[80%]">
                          <div
                            className={cn(
                              'ms-chatbot-message rounded-lg p-3 text-sm',
                              message.role === 'user' ? 'ms-chatbot-user' : 'ms-chatbot-bot'
                            )}
                          >
                            {message.content}
                          </div>

                          {/* NEW: Render Dynamic Action Buttons */}
                          {/* Only show if NOT actively redirecting AND message has an action */}
                          {!isRedirecting && message.role === 'bot' && message.action && message.action !== 'none' && (
                            (() => {
                                const btn = getActionButton(message.action);
                                if (!btn) return null;
                                return (
                                    <Button
                                        size="sm"
                                        onClick={() => handleAction(message.action!)}
                                        className={cn(
                                          "flex items-center gap-2 text-white shadow-sm transition-all w-fit ml-1",
                                          btn.color
                                        )}
                                    >
                                        {btn.label} <btn.icon size={14} />
                                    </Button>
                                );
                            })()
                          )}
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex flex-col gap-1 pl-12">
                        <div className="text-xs text-muted-foreground italic">
                          MindSettler Assistant is typing…
                        </div>

                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="ms-chatbot-bot rounded-lg p-3">
                            <Loader className="ms-chatbot-loader h-5 w-5 animate-spin" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 border-t p-4 bg-white"
              >
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="ms-chatbot-input flex-1"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}