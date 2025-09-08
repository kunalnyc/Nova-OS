import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Home, 
  Shield, 
  Star, 
  MoreHorizontal,
  Plus,
  X,
  Search,
  Globe,
  Lock,
  Bookmark
} from "lucide-react";

interface Tab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

export const Browser = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'NovaOS Browser', url: 'https://novados.local/', isActive: true }
  ]);
  const [addressBar, setAddressBar] = useState('https://novados.local/');

  const addNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'https://novados.local/new-tab',
      isActive: true
    };
    
    setTabs(prev => prev.map(tab => ({ ...tab, isActive: false })).concat(newTab));
    setAddressBar('');
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return; // Don't close last tab
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    // If closing active tab, make another tab active
    if (tabs[tabIndex].isActive && newTabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[newActiveIndex].isActive = true;
      setAddressBar(newTabs[newActiveIndex].url);
    }
    
    setTabs(newTabs);
  };

  const switchTab = (tabId: string) => {
    setTabs(prev => prev.map(tab => ({ 
      ...tab, 
      isActive: tab.id === tabId 
    })));
    
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setAddressBar(tab.url);
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate navigation
    const activeTab = tabs.find(tab => tab.isActive);
    if (activeTab) {
      setTabs(prev => prev.map(tab => 
        tab.isActive 
          ? { ...tab, url: addressBar, title: 'Loading...' }
          : tab
      ));
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface/20">
      {/* Tab Bar */}
      <div className="flex items-center glass-strong border-b border-glass-border">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center min-w-0 max-w-60 px-4 py-2 border-r border-glass-border cursor-pointer group ${
                tab.isActive 
                  ? 'bg-surface/50 text-foreground' 
                  : 'text-muted-foreground hover:bg-white/5'
              }`}
              onClick={() => switchTab(tab.id)}
            >
              <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate text-sm flex-1">{tab.title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="w-5 h-5 p-0 ml-2 opacity-0 group-hover:opacity-100 hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="m-1 hover:bg-white/10"
          onClick={addNewTab}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="p-3 border-b border-glass-border glass-strong">
        <div className="flex items-center space-x-2">
          {/* Navigation Buttons */}
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Home className="w-4 h-4" />
          </Button>

          {/* Address Bar */}
          <form onSubmit={handleNavigate} className="flex-1 flex items-center">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <Lock className="w-4 h-4 text-success mr-1" />
                <span className="text-xs text-success font-medium">Secure</span>
              </div>
              <Input
                type="text"
                value={addressBar}
                onChange={(e) => setAddressBar(e.target.value)}
                className="pl-20 pr-10 glass border-glass-border bg-transparent"
                placeholder="Enter URL or search..."
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Action Buttons */}
          <Button variant="ghost" size="sm">
            <Star className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Shield className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Page */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 glass rounded-full flex items-center justify-center">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Welcome to NovaOS Browser
            </h1>
            <p className="text-muted-foreground text-lg">
              Your secure, fast, and modern web browser
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-lg p-4 text-center cursor-pointer hover:glow-primary transition-spring">
              <Search className="w-8 h-8 text-primary mx-auto mb-2" />
              <span className="text-sm text-foreground">Search Web</span>
            </div>
            <div className="glass rounded-lg p-4 text-center cursor-pointer hover:glow-primary transition-spring">
              <Bookmark className="w-8 h-8 text-primary mx-auto mb-2" />
              <span className="text-sm text-foreground">Bookmarks</span>
            </div>
            <div className="glass rounded-lg p-4 text-center cursor-pointer hover:glow-primary transition-spring">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <span className="text-sm text-foreground">Privacy</span>
            </div>
            <div className="glass rounded-lg p-4 text-center cursor-pointer hover:glow-primary transition-spring">
              <MoreHorizontal className="w-8 h-8 text-primary mx-auto mb-2" />
              <span className="text-sm text-foreground">More Tools</span>
            </div>
          </div>

          {/* Recent Sites */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Frequently Visited
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'NovaOS Dashboard', url: 'novados.local/dashboard' },
                { name: 'System Settings', url: 'novados.local/settings' },
                { name: 'File Manager', url: 'novados.local/files' },
              ].map((site, index) => (
                <div
                  key={index}
                  className="glass rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-smooth"
                >
                  <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-3">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground text-sm mb-1">
                    {site.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {site.url}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-glass-border glass-strong">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Ready</span>
          <span>Zoom: 100%</span>
        </div>
      </div>
    </div>
  );
};