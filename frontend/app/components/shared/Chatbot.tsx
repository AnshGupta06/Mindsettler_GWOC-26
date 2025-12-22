'use client';

import { chatbotAssistsBooking } from '../../ai/flows/chatbot-assists-booking';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../components/ui/sheet';
import { cn } from '@/lib/utils';
import { Bot, Loader, MessageSquare, Send, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

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

    // DIRECT REDIRECT
    if (result.action === 'redirect_booking') {
      setTimeout(() => {
        router.push('/book');
        setIsOpen(false);
      }, 700);
    }

    // SOFT SUGGESTION (BUTTON)
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
        content:
          "I’m having a little trouble right now. Please try again in a moment.",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      {/* Floating Trigger Button */}
      <Button
        className="ms-chatbot-trigger fixed bottom-6 right-6 h-16 w-16 rounded-full"
        onClick={() => setIsOpen(true)}
        aria-label="Open chatbot"
      >
        <MessageSquare className="h-8 w-8" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="ms-chatbot-sheet flex h-full flex-col sm:max-w-md">
          <SheetHeader className="ms-chatbot-header pr-8">
            <SheetTitle className="text-2xl">
              MindSettler Assistant
            </SheetTitle>
            <SheetDescription>
              A calm space to understand our services and take the next step.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="space-y-6 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user'
                        ? 'flex-row-reverse'
                        : 'flex-row'
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

                {isLoading && (
  <div className="flex flex-col gap-1 pl-12">
    {/* Typing text */}
    <div className="text-xs text-muted-foreground italic">
      MindSettler Assistant is typing…
    </div>

    {/* Loader bubble */}
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
            className="flex items-center gap-2 border-t p-4"
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
        </SheetContent>
      </Sheet>
    </>
  );
}
