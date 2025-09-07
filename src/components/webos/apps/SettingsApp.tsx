import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Monitor, 
  Globe, 
  HardDrive,
  Wifi,
  Volume2,
  Battery,
  Power,
  Info,
  ChevronRight
} from "lucide-react";

const settingsCategories = [
  { id: 'account', name: 'Account', icon: User },
  { id: 'appearance', name: 'Appearance', icon: Palette },
  { id: 'display', name: 'Display', icon: Monitor },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'privacy', name: 'Privacy & Security', icon: Shield },
  { id: 'network', name: 'Network', icon: Globe },
  { id: 'storage', name: 'Storage', icon: HardDrive },
  { id: 'system', name: 'System', icon: Settings },
  { id: 'power', name: 'Power', icon: Power },
  { id: 'about', name: 'About', icon: Info },
];

export const SettingsApp = () => {
  const [activeCategory, setActiveCategory] = useState('account');
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoUpdate: true,
    soundEnabled: true,
    volume: [75],
    brightness: [80],
    fontSize: 'medium',
    language: 'en',
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderSettingsContent = () => {
    switch (activeCategory) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">User Account</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 glass rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">User</h4>
                    <p className="text-sm text-muted-foreground">user@webos.local</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Change Photo
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" className="glass border-glass-border bg-transparent" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" className="glass border-glass-border bg-transparent" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="user@webos.local" className="glass border-glass-border bg-transparent" />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" className="glass border-glass-border bg-transparent" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme across the system</p>
                  </div>
                  <Switch 
                    checked={settings.darkMode} 
                    onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                  />
                </div>
                
                <div>
                  <Label>Font Size</Label>
                  <Select value={settings.fontSize} onValueChange={(value) => updateSetting('fontSize', value)}>
                    <SelectTrigger className="glass border-glass-border bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="xlarge">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger className="glass border-glass-border bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Display Settings</h3>
              <div className="space-y-6">
                <div>
                  <Label>Brightness</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-muted-foreground">0%</span>
                    <Slider
                      value={settings.brightness}
                      onValueChange={(value) => updateSetting('brightness', value)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">100%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Current: {settings.brightness[0]}%</p>
                </div>
                
                <div>
                  <Label>Resolution</Label>
                  <Select defaultValue="1920x1080">
                    <SelectTrigger className="glass border-glass-border bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1920x1080">1920 x 1080</SelectItem>
                      <SelectItem value="2560x1440">2560 x 1440</SelectItem>
                      <SelectItem value="3840x2160">3840 x 2160</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Scale</Label>
                  <Select defaultValue="100">
                    <SelectTrigger className="glass border-glass-border bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="100">100%</SelectItem>
                      <SelectItem value="125">125%</SelectItem>
                      <SelectItem value="150">150%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Allow apps to show notifications</p>
                  </div>
                  <Switch 
                    checked={settings.notifications} 
                    onCheckedChange={(checked) => updateSetting('notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound</Label>
                    <p className="text-sm text-muted-foreground">Play sound for notifications</p>
                  </div>
                  <Switch 
                    checked={settings.soundEnabled} 
                    onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                  />
                </div>
                
                <div>
                  <Label>Volume</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <Slider
                      value={settings.volume}
                      onValueChange={(value) => updateSetting('volume', value)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">{settings.volume[0]}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Update</Label>
                    <p className="text-sm text-muted-foreground">Automatically install system updates</p>
                  </div>
                  <Switch 
                    checked={settings.autoUpdate} 
                    onCheckedChange={(checked) => updateSetting('autoUpdate', checked)}
                  />
                </div>
                
                <div className="glass rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">System Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version</span>
                      <span className="text-foreground">WebOS 1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Build</span>
                      <span className="text-foreground">2024.01.15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Memory</span>
                      <span className="text-foreground">8 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Storage</span>
                      <span className="text-foreground">256 GB</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    Check for Updates
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Reset Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Settings</h3>
            <p className="text-muted-foreground">Select a category to configure settings</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-surface/20">
      {/* Sidebar */}
      <div className="w-64 glass-strong border-r border-glass-border p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Settings</h2>
          <p className="text-sm text-muted-foreground">Configure your WebOS experience</p>
        </div>
        
        <div className="space-y-1">
          {settingsCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeCategory === category.id 
                  ? 'gradient-primary hover:glow-primary' 
                  : 'hover:bg-white/5'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <category.icon className="w-4 h-4 mr-3" />
              {category.name}
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderSettingsContent()}
      </div>
    </div>
  );
};