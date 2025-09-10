import { useState, useEffect } from "react";
import { Folder, FileText, Globe, Settings, Calendar } from "lucide-react";
import { FileManager } from "./apps/FileManager";
import { TextEditor } from "./apps/TextEditor";
import { Browser } from "./apps/Browser";
import { SettingsApp } from "./apps/SettingsApp";
import { CalendarApp } from "./apps/CalendarApp";
import { ContextMenu } from "./ContextMenu";
import wallpaper from "@/assets/webos-wallpaper.jpg";

interface DesktopProps {
  onOpenApp: (app: string, title: string, content: React.ReactNode) => void;
}

const desktopApps = [
  {
    id: "file-manager",
    name: "Files",
    icon: Folder,
    component: FileManager,
  },
  {
    id: "text-editor",
    name: "Text Editor",
    icon: FileText,
    component: TextEditor,
  },
  {
    id: "browser",
    name: "Browser",
    icon: Globe,
    component: Browser,
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: Calendar,
    component: CalendarApp,
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    component: SettingsApp,
  },
];

export const Desktop = ({ onOpenApp }: DesktopProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleAppDoubleClick = (app: typeof desktopApps[0]) => {
    onOpenApp(app.id, app.name, <app.component />);
  };

  return (
    <div 
      className="h-full w-full relative"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onContextMenu={handleContextMenu}
      onClick={handleCloseContextMenu}
    >
      {/* Desktop Icons */}
      <div className="absolute top-8 left-8 grid gap-6">
        {desktopApps.map((app) => (
          <div
            key={app.id}
            className="flex flex-col items-center cursor-pointer group"
            onDoubleClick={() => handleAppDoubleClick(app)}
          >
            <div className="w-16 h-16 glass rounded-xl flex items-center justify-center mb-2 group-hover:glow-primary transition-spring group-hover:scale-110">
              <app.icon className="w-8 h-8 text-primary" />
            </div>
            <span className="text-sm text-foreground/90 font-medium text-center group-hover:text-primary transition-smooth">
              {app.name}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop Clock Widget */}
      <div className="absolute top-8 right-8">
        <div className="glass rounded-xl p-6 text-right">
          <div className="text-3xl font-bold text-foreground mb-1">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString([], { 
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions Widget */}
      <div className="absolute bottom-32 right-8">
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-smooth text-sm text-muted-foreground hover:text-foreground"
              onClick={() => handleAppDoubleClick(desktopApps.find(app => app.id === 'file-manager')!)}
            >
              Open Files
            </button>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-smooth text-sm text-muted-foreground hover:text-foreground"
              onClick={() => handleAppDoubleClick(desktopApps.find(app => app.id === 'text-editor')!)}
            >
              New Document
            </button>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-smooth text-sm text-muted-foreground hover:text-foreground"
              onClick={() => handleAppDoubleClick(desktopApps.find(app => app.id === 'settings')!)}
            >
              System Settings
            </button>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onOpenApp={onOpenApp}
        />
      )}
    </div>
  );
};