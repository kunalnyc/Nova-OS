import { useState, useEffect } from "react";
import { LoginScreen } from "./webos/LoginScreen";
import { Desktop } from "./webos/Desktop";
import { WindowManager } from "./webos/WindowManager";
import { Taskbar } from "./webos/Taskbar";
import { NotificationCenter } from "./webos/NotificationCenter";
import { Window } from "./webos/types";

export const NovaOS = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [windows, setWindows] = useState<Window[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Welcome to NovaOS",
      message: "Your modern web operating system is ready!",
      time: new Date().toLocaleTimeString(),
      type: "info" as const,
    },
  ]);

  // Simulate login process
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Shutdown process
  const handleShutdown = () => {
    setIsLoggedIn(false);
    setWindows([]);
    setActiveWindowId(null);
    setShowNotifications(false);
  };

  // Window management
  const openWindow = (app: string, title: string, content: React.ReactNode) => {
    const newWindow: Window = {
      id: Math.random().toString(36).substr(2, 9),
      app,
      title,
      content,
      position: { x: 100 + windows.length * 50, y: 100 + windows.length * 50 },
      size: { width: 800, height: 600 },
      isMinimized: false,
      isMaximized: false,
      zIndex: Date.now(),
    };
    
    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remainingWindows = windows.filter(w => w.id !== id);
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  };

  const maximizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(windows.map(w => 
      w.id === id 
        ? { ...w, zIndex: Date.now(), isMinimized: false }
        : w
    ));
  };

  const updateWindow = (id: string, updates: Partial<Window>) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  };

  const addNotification = (notification: Omit<typeof notifications[0], 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications([newNotification, ...notifications.slice(0, 4)]);
  };

  // Auto-login for demo (remove in production)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        // addNotification({
        //   title: "Auto Login",
        //   message: "Click anywhere to enter WebOS",
        //   time: new Date().toLocaleTimeString(),
        //   type: "info",
        // });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-background relative">
      <Desktop onOpenApp={openWindow} />
      
      <WindowManager
        windows={windows.filter(w => !w.isMinimized)}
        activeWindowId={activeWindowId}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onFocus={focusWindow}
        onUpdate={updateWindow}
      />
      
      <Taskbar
        windows={windows}
        onOpenApp={openWindow}
        onFocusWindow={focusWindow}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        hasNotifications={notifications.length > 0}
        onShutdown={handleShutdown}
      />
      
      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onClearAll={() => setNotifications([])}
        />
      )}
    </div>
  );
};