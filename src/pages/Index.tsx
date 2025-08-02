import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useChatHistory } from '@/hooks/useChatHistory';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { chatHistory, updateChatHistory, timeFilter, setTimeFilter } = useChatHistory();

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
        {isMobile ? (
          <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between border-b bg-background px-4">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="ml-4 font-semibold">DOMA AI</h1>
            </div>
            <ThemeToggle />
          </header>
        ) : (
          <header className="fixed top-0 right-0 z-50 p-4">
            <ThemeToggle />
          </header>
        )}
        <ChatSidebar 
          chatHistory={chatHistory}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />
        <div className={`flex-1 ${isMobile ? 'pt-12' : 'pr-16'}`}>
          <ChatInterface 
            chatHistory={chatHistory} 
            onChatHistoryUpdate={updateChatHistory}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
