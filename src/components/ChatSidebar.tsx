import { MessageSquarePlus, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function ChatSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex-1" />
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSignOut}
          className="text-destructive hover:bg-destructive/10 border-destructive/20"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-4 mb-4">
          <Button variant="outline" className="w-full justify-start">
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            New chat
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No chat history yet. Start a conversation to see your chats here.
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}