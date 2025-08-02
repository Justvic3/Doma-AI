import { MessageSquarePlus, Settings, User, LogOut, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TimeFilter } from '@/hooks/useChatHistory';

export function ChatSidebar({ 
  chatHistory = [], 
  timeFilter = 'all', 
  onTimeFilterChange 
}: { 
  chatHistory?: Array<{id: string, title: string, messages: any[], timestamp: Date}>;
  timeFilter?: TimeFilter;
  onTimeFilterChange?: (filter: TimeFilter) => void;
}) {
  const { signOut, authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <Sidebar className="w-56 border-r" collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarHeader className="p-4">
        {isMobile && <SidebarTrigger className="mb-4" />}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            disabled={authLoading}
            className="w-full justify-start text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {authLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => window.dispatchEvent(new CustomEvent('newChat'))}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            New chat
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Chat History</span>
            {onTimeFilterChange && (
              <Select value={timeFilter} onValueChange={onTimeFilterChange}>
                <SelectTrigger className="h-6 w-16 p-1 text-xs">
                  <Filter className="h-3 w-3" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="5d">5d</SelectItem>
                  <SelectItem value="2w">2w</SelectItem>
                  <SelectItem value="1m">1m</SelectItem>
                </SelectContent>
              </Select>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatHistory.length > 0 ? (
                chatHistory.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton 
                      className="w-full justify-start text-left"
                      onClick={() => window.dispatchEvent(new CustomEvent('loadChat', { detail: chat }))}
                    >
                      <span className="truncate">{chat.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No chat history yet. Start a conversation to see your chats here.
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="w-full justify-start"
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="w-full justify-start"
              onClick={() => navigate('/profile')}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}