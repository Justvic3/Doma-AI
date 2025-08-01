import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatInterface } from '@/components/ChatInterface';

interface ChatHistory {
  id: string;
  title: string;
  messages: any[];
  timestamp: Date;
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-background">
        {isMobile && (
          <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center border-b bg-background px-4">
            <SidebarTrigger />
            <h1 className="ml-4 font-semibold">DOMA AI</h1>
          </header>
        )}
        <ChatSidebar chatHistory={chatHistory} />
        <div className={`flex-1 ${isMobile ? 'pt-12' : ''}`}>
          <ChatInterface 
            chatHistory={chatHistory} 
            onChatHistoryUpdate={setChatHistory}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
