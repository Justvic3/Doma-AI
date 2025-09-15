import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Settings, HelpCircle, LogOut, Crown, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading, updating, updateProfile } = useProfile();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  // Update full name when profile loads
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    const { error } = await updateProfile({ full_name: fullName });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setIsEditingName(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const menuItems = [
    { 
      icon: Settings, 
      label: 'Settings', 
      action: () => navigate('/settings'),
      hasArrow: true 
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      action: () => {},
      hasArrow: true 
    },
    { 
      icon: LogOut, 
      label: 'Log out', 
      action: handleSignOut,
      hasArrow: false 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-3 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>

        <div className="p-4">
          {/* User Info Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {isEditingName ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="text-sm h-8"
                        placeholder="Enter your name"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={handleSaveProfile}
                        disabled={updating}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => {
                          setIsEditingName(false);
                          setFullName(profile?.full_name || '');
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-sm truncate">
                        {profile?.full_name || 'No name set'}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => setIsEditingName(true)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2 mb-6">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">{item.label}</span>
                {item.hasArrow && (
                  <ArrowLeft className="h-3 w-3 text-muted-foreground rotate-180" />
                )}
              </button>
            ))}
          </div>

          {/* Plan Section */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <Crown className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {profile?.full_name?.split(' ')[0] || 'User'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Free Plan</span>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 h-auto text-xs"
              >
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}