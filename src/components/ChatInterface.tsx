import { useState, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUpload } from '@/components/FileUpload';
import { getRandomOilGasContent } from '@/utils/oilGasContent';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'ai';
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

interface ChatInterfaceProps {
  chatHistory: ChatHistory[];
  onChatHistoryUpdate: (history: ChatHistory[]) => void;
}

export function ChatInterface({ chatHistory, onChatHistoryUpdate }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [currentContent, setCurrentContent] = useState(() => getRandomOilGasContent());
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message.trim(),
        timestamp: new Date(),
        sender: 'user'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setIsNewChat(false);
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm here to help with your Oil & Gas operations. What specific challenge are you facing today?",
          timestamp: new Date(),
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const generateChatTitle = (messages: Message[]): string => {
    if (messages.length === 0) return 'New Chat';
    
    // Get first user message for title generation
    const firstUserMessage = messages.find(m => m.sender === 'user')?.content || '';
    
    // Simple title generation - take first few words or summarize
    const words = firstUserMessage.split(' ').slice(0, 6);
    if (words.length < 6) {
      return firstUserMessage.slice(0, 40) + (firstUserMessage.length > 40 ? '...' : '');
    }
    return words.join(' ') + '...';
  };

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const handleNewChat = () => {
    // Save current chat to history if there are messages and it's not already in history
    if (messages.length > 0 && !currentChatId) {
      const newChat: ChatHistory = {
        id: Date.now().toString(),
        title: generateChatTitle(messages),
        messages: [...messages],
        timestamp: new Date()
      };
      onChatHistoryUpdate([newChat, ...chatHistory]);
    }
    
    setMessages([]);
    setIsNewChat(true);
    setCurrentChatId(null);
    setCurrentContent(getRandomOilGasContent()); // Get new content variation
  };

  const handleLoadChat = (chat: ChatHistory) => {
    setMessages(chat.messages);
    setIsNewChat(false);
    setCurrentChatId(chat.id);
  };

  const handleQuickPrompt = (promptText: string) => {
    setMessage(promptText);
    setTimeout(() => handleSend(), 100); // Small delay to ensure message is set
  };

  // Listen for new chat and load chat events from sidebar
  useEffect(() => {
    const handleNewChatEvent = () => {
      handleNewChat();
    };

    const handleLoadChatEvent = (event: CustomEvent) => {
      handleLoadChat(event.detail);
    };

    window.addEventListener('newChat', handleNewChatEvent);
    window.addEventListener('loadChat', handleLoadChatEvent as EventListener);
    
    return () => {
      window.removeEventListener('newChat', handleNewChatEvent);
      window.removeEventListener('loadChat', handleLoadChatEvent as EventListener);
    };
  }, [messages, chatHistory]);

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {isNewChat && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4 md:p-8">
            <div className="text-center max-w-2xl w-full px-4">
              <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-foreground">
                {currentContent.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-8">
                {currentContent.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {currentContent.prompts.map((prompt, index) => (
                  <button 
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
                  >
                    <h3 className="font-medium mb-2">{prompt.title}</h3>
                    <p className="text-muted-foreground">{prompt.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className={`p-4 md:p-6 border-t ${isNewChat ? 'flex justify-center' : ''}`}>
        <div className={`w-full ${isNewChat ? 'max-w-3xl' : 'max-w-4xl mx-auto'}`}>
          <div className="relative flex items-center bg-muted rounded-lg border">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-3 hidden md:flex">
              <Mic className="h-4 w-4" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about drilling, production, safety, or equipment..."
              className="flex-1 border-0 bg-transparent px-4 py-3 focus-visible:ring-0"
            />
            <div className="flex items-center gap-2 pr-3">
              <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden md:flex">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                  </DialogHeader>
                  <FileUpload 
                    onFilesChange={(files) => {
                      setUploadedFiles(files);
                      if (files.length > 0) {
                        setIsFileDialogOpen(false);
                      }
                    }}
                    maxSize={5}
                  />
                </DialogContent>
              </Dialog>
              {message.trim() && (
                <Button 
                  onClick={handleSend} 
                  size="sm" 
                  className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}