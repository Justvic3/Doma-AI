import { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'ai';
}

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isNewChat, setIsNewChat] = useState(true);

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

  const handleNewChat = () => {
    setMessages([]);
    setIsNewChat(true);
  };

  return (
    <main className="flex-1 flex flex-col h-screen">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {isNewChat && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              <h1 className="text-4xl font-semibold mb-4 text-foreground">
                Ready to optimize your field operations?
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Get instant insights on drilling, production, safety protocols, and equipment maintenance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Drilling Operations</h3>
                  <p className="text-muted-foreground">Optimize drilling parameters and monitor wellbore conditions</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Production Analysis</h3>
                  <p className="text-muted-foreground">Analyze production data and identify optimization opportunities</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Safety Protocols</h3>
                  <p className="text-muted-foreground">Access HSE guidelines and safety procedures</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Equipment Maintenance</h3>
                  <p className="text-muted-foreground">Get maintenance schedules and troubleshooting guides</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
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
      <div className={`p-6 border-t ${isNewChat ? 'flex justify-center' : ''}`}>
        <div className={`${isNewChat ? 'max-w-2xl' : 'max-w-4xl mx-auto'}`}>
          <div className="relative flex items-center bg-muted rounded-lg border">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-3">
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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Paperclip className="h-4 w-4" />
              </Button>
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