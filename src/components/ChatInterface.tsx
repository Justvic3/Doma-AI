import { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ChatInterface() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Implement chat functionality
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="flex-1 flex flex-col h-screen">
      {/* Main chat area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-semibold mb-8 text-foreground">
            What's on the agenda today?
          </h1>
        </div>
      </div>

      {/* Chat input */}
      <div className="p-6 border-t">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-muted rounded-lg border">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              className="flex-1 border-0 bg-transparent px-4 py-3 focus-visible:ring-0"
            />
            <div className="flex items-center gap-2 pr-3">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              {message.trim() ? (
                <Button 
                  onClick={handleSend} 
                  size="sm" 
                  className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Mic className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}