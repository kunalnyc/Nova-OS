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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'search' | 'loading'>('home');

  const addNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'https://novados.local/new-tab',
      isActive: true
    };
    
    setTabs(prev => prev.map(tab => ({ ...tab, isActive: false })).concat(newTab));
    setAddressBar('');
    setCurrentPage('home');
    setSearchResults([]);
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
      // Reset to home page when switching tabs
      setCurrentPage('home');
      setSearchResults([]);
    }
  };

  const mockSearchResults = (query: string) => {
    const results: any[] = [];
    const searchTerm = query.toLowerCase();
    
    // Mock search results based on the query
    if (searchTerm.includes('car') || searchTerm.includes('auto')) {
      results.push(
        {
          title: "Top 10 Best Cars of 2024",
          url: "https://example.com/best-cars-2024",
          description: "Discover the most reliable, efficient, and stylish cars of 2024. From electric vehicles to luxury sedans, find your perfect match.",
          favicon: "🚗"
        },
        {
          title: "Electric Car Buying Guide",
          url: "https://example.com/electric-cars",
          description: "Complete guide to buying electric vehicles. Compare Tesla, BMW, Audi and other top electric car brands.",
          favicon: "⚡"
        },
        {
          title: "Car Insurance Comparison",
          url: "https://example.com/car-insurance",
          description: "Find the best car insurance rates. Compare quotes from top providers and save money on your coverage.",
          favicon: "🛡️"
        }
      );
    } else if (searchTerm.includes('weather')) {
      results.push(
        {
          title: "Weather Forecast",
          url: "https://weather.com",
          description: "Get accurate weather forecasts and current conditions for your location.",
          favicon: "🌤️"
        }
      );
    } else if (searchTerm.includes('news')) {
      results.push(
        {
          title: "Latest News Headlines",
          url: "https://news.com",
          description: "Stay updated with breaking news from around the world.",
          favicon: "📰"
        }
      );
    } else {
      // Generic search results
      results.push(
        {
          title: `Search results for "${query}"`,
          url: `https://search.com/q=${encodeURIComponent(query)}`,
          description: `Find information, websites, and resources related to ${query}.`,
          favicon: "🔍"
        },
        {
          title: `${query} - Wikipedia`,
          url: `https://wikipedia.org/wiki/${encodeURIComponent(query)}`,
          description: `Learn more about ${query} from the free encyclopedia.`,
          favicon: "📖"
        }
      );
    }
    
    return results;
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressBar.trim()) return;
    
    const activeTab = tabs.find(tab => tab.isActive);
    if (activeTab) {
      setIsSearching(true);
      setCurrentPage('loading');
      
      // Update tab title to show loading
      setTabs(prev => prev.map(tab => 
        tab.isActive 
          ? { ...tab, url: addressBar, title: 'Loading...' }
          : tab
      ));
      
      // Simulate search delay
      setTimeout(() => {
        const results = mockSearchResults(addressBar);
        setSearchResults(results);
        setCurrentPage('search');
        setIsSearching(false);
        
        // Update tab with search results
        setTabs(prev => prev.map(tab => 
          tab.isActive 
            ? { ...tab, title: `${addressBar} - Search Results` }
            : tab
        ));
      }, 1000);
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
      <div className="flex-1 overflow-auto">
        {currentPage === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}

        {currentPage === 'search' && (
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                About {searchResults.length} results for "{addressBar}"
              </p>
            </div>
            <div className="space-y-6">
              {searchResults.map((result, index) => (
                <div key={index} className="cursor-pointer hover:bg-white/5 p-4 rounded-lg transition-smooth">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{result.favicon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-primary hover:underline font-medium">
                          {result.title}
                        </h3>
                      </div>
                      <p className="text-xs text-success mb-2">{result.url}</p>
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'home' && (
          <div className="p-8">
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
                <div 
                  className="glass rounded-lg p-4 text-center cursor-pointer hover:glow-primary transition-spring"
                  onClick={() => {
                    setAddressBar('search web');
                    const input = document.querySelector('input[placeholder="Enter URL or search..."]') as HTMLInputElement;
                    if (input) input.focus();
                  }}
                >
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
                      onClick={() => {
                        setAddressBar(site.url);
                        setCurrentPage('search');
                        setSearchResults([{
                          title: site.name,
                          url: `https://${site.url}`,
                          description: `Access ${site.name} on NovaOS`,
                          favicon: "🖥️"
                        }]);
                      }}
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
        )}
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