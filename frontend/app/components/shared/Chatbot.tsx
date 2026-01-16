'use client';

import { chatbotAssistsBooking } from '../../ai/flows/chatbot-assists-booking';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bot, Loader, MessageSquare, Send, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  role: 'user' | 'bot';
  content: string;
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

      setMessages(prev => [
        ...prev,
        { role: 'bot', content: result.response },
      ]);

      if (result.action === 'redirect_booking') {
        setTimeout(() => {
          router.push('/book');
          setIsOpen(false);
        }, 700);
      }

      if (result.action === 'suggest_booking') {
        setMessages(prev => [
          ...prev,
          {
            role: 'bot',
            content: '__BOOK_SESSION_BUTTON__',
          },
        ]);
      }
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
      {}
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
            {}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[51]"
            />

            {}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 100, x: 100, originX: 1, originY: 1 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  duration: 0.8
                }
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.3, ease: "easeInOut" }
              }}
              className="ms-chatbot-sheet fixed bottom-6 right-6 z-[52] flex flex-col w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-none"
            >
              {}
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

              {}
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

                        <div
                          className={cn(
                            'ms-chatbot-message max-w-[80%] rounded-lg p-3 text-sm',
                            message.role === 'user'
                              ? 'ms-chatbot-user'
                              : 'ms-chatbot-bot'
                          )}
                        >
                          {message.content === '__BOOK_SESSION_BUTTON__' ? (
                            <Button
                              className="mt-2 w-fit bg-[#b8aaf3] text-white hover:bg-[#a79bf0]"
                              onClick={() => {
                                router.push('/book');
                                setIsOpen(false);
                              }}
                            >
                              Book a session with MindSettler
                            </Button>
                          ) : (
                            message.content
                          )}
                        </div>
                      </div>
                    ))}

                    {}
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

              {}
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