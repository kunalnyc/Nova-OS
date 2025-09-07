import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Grid3X3, 
  Search, 
  Volume2, 
  Wifi, 
  Battery, 
  Bell,
  Calendar,
  Settings,
  Folder,
  FileText,
  Globe,
  Monitor
} from "lucide-react";
import { Window } from "./types";
import { AppLauncher } from "./AppLauncher";

interface TaskbarProps {
  windows: Window[];
  onOpenApp: (app: string, title: string, content: React.ReactNode) => void;
  onFocusWindow: (id: string) => void;
  onToggleNotifications: () => void;
  hasNotifications: boolean;
}

export const Taskbar = ({
  windows,
  onOpenApp,
  onFocusWindow,
  onToggleNotifications,
  hasNotifications,
}: TaskbarProps) => {
  const [showAppLauncher, setShowAppLauncher] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getAppIcon = (appId: string) => {
    const icons: Record<string, any> = {
      'file-manager': Folder,
      'text-editor': FileText,
      'browser': Globe,
      'calendar': Calendar,
      'settings': Settings,
    };
    return icons[appId] || Monitor;
  };

  return (
    <>
      {/* App Launcher Overlay */}
      {showAppLauncher && (
        <AppLauncher
          onClose={() => setShowAppLauncher(false)}
          onOpenApp={(app, title, content) => {
            onOpenApp(app, title, content);
            setShowAppLauncher(false);
          }}
        />
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 glass-strong border-t border-glass-border slide-up">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left Section - App Launcher & Running Apps */}
          <div className="flex items-center space-x-2">
            {/* App Launcher Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0 hover:bg-primary/20 hover:text-primary transition-spring"
              onClick={() => setShowAppLauncher(!showAppLauncher)}
            >
              <Grid3X3 className="w-5 h-5" />
            </Button>

            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0 hover:bg-primary/20 hover:text-primary transition-smooth"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Separator */}
            <div className="w-px h-6 bg-border mx-2" />

            {/* Running Apps */}
            <div className="flex items-center space-x-1">
              {windows.map((window) => {
                const IconComponent = getAppIcon(window.app);
                return (
                  <Button
                    key={window.id}
                    variant="ghost"
                    size="sm"
                    className={`w-10 h-10 p-0 transition-spring relative ${
                      window.isMinimized 
                        ? 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground' 
                        : 'bg-primary/20 text-primary hover:bg-primary/30'
                    }`}
                    onClick={() => onFocusWindow(window.id)}
                  >
                    <IconComponent className="w-5 h-5" />
                    {!window.isMinimized && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Right Section - System Tray & Clock */}
          <div className="flex items-center space-x-2">
            {/* System Icons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-white/10 transition-smooth"
              >
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-white/10 transition-smooth"
              >
                <Wifi className="w-4 h-4 text-success" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-white/10 transition-smooth"
              >
                <Battery className="w-4 h-4 text-success" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 hover:bg-white/10 transition-smooth relative ${
                  hasNotifications ? 'text-warning' : 'text-muted-foreground'
                }`}
                onClick={onToggleNotifications}
              >
                <Bell className="w-4 h-4" />
                {hasNotifications && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full" />
                )}
              </Button>
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-border mx-2" />

            {/* Clock */}
            <div className="text-right text-sm">
              <div className="text-foreground font-medium">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-muted-foreground text-xs">
                {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};