import { useState } from 'react'
import { X, Settings as SettingsIcon, Bell, Palette, Zap, Shield, User, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from '@/components/ThemeProvider'
import { useNavigate } from 'react-router-dom'

const settingsSections = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'personalization', label: 'Personalization', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'account', label: 'Account', icon: User },
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general')
  const [followUpSuggestions, setFollowUpSuggestions] = useState(true)
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">General</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Theme</label>
          </div>
          <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Language</label>
          </div>
          <Select defaultValue="auto-detect">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto-detect">Auto-detect</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Spoken language</label>
            <p className="text-xs text-muted-foreground">For best results, select the language you mainly speak. If it's not listed, it may still be supported via auto-detection.</p>
          </div>
          <Select defaultValue="auto-detect">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto-detect">Auto-detect</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Voice</label>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              ▶ Play
            </Button>
          </div>
          <Select defaultValue="arbor">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arbor">Arbor</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Show follow up suggestions in chats</label>
          </div>
          <Switch
            checked={followUpSuggestions}
            onCheckedChange={setFollowUpSuggestions}
          />
        </div>
      </div>
    </div>
  )

  const renderPersonalizationSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Personalization</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Theme</label>
            <p className="text-xs text-muted-foreground">Choose your preferred theme for the interface</p>
          </div>
          <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderDefaultSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 capitalize">{activeSection.replace('-', ' ')}</h2>
      </div>
      <p className="text-muted-foreground">Settings for {activeSection.replace('-', ' ')} will be available soon.</p>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings()
      case 'personalization':
        return renderPersonalizationSettings()
      default:
        return renderDefaultSection()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 min-h-screen bg-muted/30 border-r p-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-semibold">Settings</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 p-8">
            <Card className="p-6">
              {renderContent()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}