import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  RefreshCw, 
  Settings, 
  Code, 
  Monitor, 
  Copy,
  Folder,
  FileText,
  Zap,
  Info,
  Palette,
  Terminal as TerminalIcon
} from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenApp?: (app: string, title: string, content: React.ReactNode) => void;
}

export const ContextMenu = ({ x, y, onClose, onOpenApp }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleInspectElement = () => {
    // Try different methods to open developer tools
    try {
      // Method 1: Try to dispatch F12 key event
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'F12',
        keyCode: 123,
        code: 'F12',
        bubbles: true
      }));
      
      // Method 2: Try console.log to at least open console
      console.log('%cNovaOS Developer Tools', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
      console.log('Right-click > Inspect Element to open browser developer tools');
      
      // Method 3: Alert user about manual opening
      setTimeout(() => {
        alert('To inspect elements:\n• Press F12\n• Right-click and select "Inspect"\n• Use Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac)');
      }, 100);
      
    } catch (error) {
      console.error('Could not open developer tools:', error);
    }
    onClose();
  };

  const handleRefresh = () => {
    window.location.reload();
    onClose();
  };

  const handleViewPageSource = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`<pre>${document.documentElement.outerHTML}</pre>`);
      newWindow.document.title = 'Page Source - NovaOS';
    }
    onClose();
  };

  const handleOpenTerminal = () => {
    if (onOpenApp) {
      const { Terminal } = require('./apps/Terminal');
      onOpenApp('terminal', 'Terminal', <Terminal />);
    }
    onClose();
  };

  const handleOpenSettings = () => {
    if (onOpenApp) {
      const { SettingsApp } = require('./apps/SettingsApp');
      onOpenApp('settings', 'Settings', <SettingsApp />);
    }
    onClose();
  };

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(window.location.href);
    onClose();
  };

  // Adjust position if menu would go off screen
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 300);

  return (
    <div 
      ref={menuRef}
      className="fixed glass-strong border border-glass-border rounded-lg shadow-2xl py-2 min-w-[180px] z-[10000] fade-in"
      style={{ 
        left: adjustedX, 
        top: adjustedY,
      }}
    >
      {/* Inspect & Debug */}
      <div className="px-2 py-1 text-xs text-muted-foreground font-medium border-b border-glass-border mb-1">
        Developer Tools
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-left px-3 py-2 h-auto hover:bg-primary/20 transition-smooth"
        onClick={handleInspectElement}
      >
        <Code className="w-4 h-4 mr-3" />
        Inspect Element
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-left px-3 py-2 h-auto hover:bg-primary/20 transition-smooth"
        onClick={handleViewPageSource}
      >
        <FileText className="w-4 h-4 mr-3" />
        View Page Source
      </Button>

      <div className="my-1 h-px bg-glass-border" />

      {/* System Actions */}
      <div className="px-2 py-1 text-xs text-muted-foreground font-medium border-b border-glass-border mb-1">
        System
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-left px-3 py-2 h-auto hover:bg-primary/20 transition-smooth"
        onClick={handleRefresh}
      >
        <RefreshCw className="w-4 h-4 mr-3" />
        Refresh Desktop
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-left px-3 py-2 h-auto hover:bg-primary/20 transition-smooth"
        onClick={handleOpenTerminal}
      >
        <TerminalIcon className="w-4 h-4 mr-3" />
        Open Terminal
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-left px-3 py-2 h-auto hover:bg-primary/20 transition-smooth"
        onClick={handleOpenSettings}
      >
        <Settings className="w-4 h-4 mr-3" />
        System Settings
      </Button>

      <div className="my-1 h-px bg-glass-border" />

      {/* Additional Actions */}
      <div className="px-2 py-1 text-xs text-muted-foreground font-medium border-b border-glass-border mb-1">
        Actions
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-left px-3 py-2 h-auto hover:bg-primary/20 transition-smooth"
        onClick={handleCopyLocation}
      >
        <Copy className="w-4 h-4 mr-3" />
        Copy Location
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-left px-3 py-2 h-auto hover:bg-primary/20 transition-smooth"
        onClick={() => {
          window.print();
          onClose();
        }}
      >
        <Monitor className="w-4 h-4 mr-3" />
        Print Page
      </Button>

      <div className="my-1 h-px bg-glass-border" />

      {/* Info */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-left px-3 py-2 h-auto hover:bg-primary/20 transition-smooth text-xs"
        onClick={() => {
          alert(`NovaOS v1.0\nBrowser: ${navigator.userAgent.split(' ').slice(-2).join(' ')}\nResolution: ${window.screen.width}x${window.screen.height}`);
          onClose();
        }}
      >
        <Info className="w-4 h-4 mr-3" />
        About NovaOS
      </Button>
    </div>
  );
};