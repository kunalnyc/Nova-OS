import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Folder, 
  FileText, 
  Globe, 
  Settings, 
  Calendar,
  Calculator,
  Camera,
  Music,
  Image,
  Mail,
  Phone,
  Clock,
  Gamepad2,
  Code,
  Terminal as TerminalIcon,
  CloudSun
} from "lucide-react";
import { FileManager } from "./apps/FileManager";
import { TextEditor } from "./apps/TextEditor";
import { Browser } from "./apps/Browser";
import { SettingsApp } from "./apps/SettingsApp";
import { CalendarApp } from "./apps/CalendarApp";
import { Calculator as CalculatorApp } from "./apps/Calculator";
import { Terminal } from "./apps/Terminal";
import { PhotoGallery } from "./apps/PhotoGallery";
import { WeatherApp } from "./apps/WeatherApp";
import { CodeEditor } from "./apps/CodeEditor";

interface AppLauncherProps {
  onClose: () => void;
  onOpenApp: (app: string, title: string, content: React.ReactNode) => void;
  onShutdown?: () => void;
}

const allApps = [
  {
    id: "file-manager",
    name: "Files",
    icon: Folder,
    component: FileManager,
    category: "System",
  },
  {
    id: "text-editor",
    name: "Text Editor",
    icon: FileText,
    component: TextEditor,
    category: "Productivity",
  },
  {
    id: "browser",
    name: "Browser",
    icon: Globe,
    component: Browser,
    category: "Internet",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: Calendar,
    component: CalendarApp,
    category: "Productivity",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    component: SettingsApp,
    category: "System",
  },
  // Additional apps (placeholders for now)
  {
    id: "calculator",
    name: "Calculator",
    icon: Calculator,
    component: CalculatorApp,
    category: "Utilities",
  },
  {
    id: "camera",
    name: "Camera",
    icon: Camera,
    component: () => <div className="p-4">Camera App Coming Soon...</div>,
    category: "Media",
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    component: () => <div className="p-4">Music Player Coming Soon...</div>,
    category: "Media",
  },
  {
    id: "photos",
    name: "Photos",
    icon: Image,
    component: PhotoGallery,
    category: "Media",
  },
  {
    id: "mail",
    name: "Mail",
    icon: Mail,
    component: () => <div className="p-4">Mail App Coming Soon...</div>,
    category: "Internet",
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: TerminalIcon,
    component: Terminal,
    category: "System",
  },
  {
    id: "code",
    name: "Code Editor",
    icon: Code,
    component: CodeEditor,
    category: "Development",
  },
  {
    id: "weather",
    name: "Weather",
    icon: CloudSun,
    component: WeatherApp,
    category: "Utilities",
  },
];

const categories = ["All", "System", "Productivity", "Internet", "Media", "Utilities", "Development"];

export const AppLauncher = ({ onClose, onOpenApp, onShutdown }: AppLauncherProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredApps = allApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAppClick = (app: typeof allApps[0]) => {
    if (app.id === 'terminal') {
      onOpenApp(app.id, app.name, <Terminal onShutdown={onShutdown} />);
    } else {
      onOpenApp(app.id, app.name, <app.component />);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="glass rounded-2xl p-6 w-[800px] h-[600px] shadow-2xl fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">App Launcher</h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-glass-border bg-transparent"
              autoFocus
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                className={`transition-smooth ${
                  selectedCategory === category 
                    ? 'gradient-primary hover:glow-primary' 
                    : 'hover:bg-white/10'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-6 gap-4 h-[400px] overflow-y-auto pr-2">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => handleAppClick(app)}
            >
              <div className="w-16 h-16 glass rounded-xl flex items-center justify-center mb-2 group-hover:glow-primary transition-spring group-hover:scale-110">
                <app.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="text-xs text-foreground/90 text-center group-hover:text-primary transition-smooth">
                {app.name}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {filteredApps.length} apps available
          </p>
        </div>
      </div>
    </div>
  );
};