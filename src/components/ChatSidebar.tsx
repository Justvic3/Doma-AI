import { MessageSquarePlus, Search, BookOpen, Bot, Settings, LogOut } from 'lucide-react';
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

const chatItems = [
  'New chat',
  'Search chats',
  'Library',
  'Sora',
  'GPTs',
  'chats',
  'gear not Bible frequency',
  'client assurance response',
  'light-cost project tools',
  'AI chatbot project cost',
  'IM platform comparison',
  'aith Relief Trust Comparison',
  'Biblical story of strength',
  'Honesty and kindness meaning',
  'Meaning of replaceable statement...',
  'internship skill set guide',
  'Breaking chains with cutters',
  'meal meeting exchange',
];

export function ChatSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4">
        <Button variant="outline" className="w-full justify-start">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatItems.slice(1).map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton className="w-full justify-start text-sm py-2 px-3 text-muted-foreground hover:bg-muted/50">
                    {item === 'Search chats' && <Search className="mr-2 h-4 w-4" />}
                    {item === 'Library' && <BookOpen className="mr-2 h-4 w-4" />}
                    {item === 'Sora' && <Bot className="mr-2 h-4 w-4" />}
                    <span className="truncate">{item}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
            <SidebarMenuButton 
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}