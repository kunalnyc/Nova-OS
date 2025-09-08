import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Minimize, Maximize2 } from "lucide-react";

interface TerminalProps {
  onShutdown?: () => void;
}

interface CommandOutput {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
}

export const Terminal = ({ onShutdown }: TerminalProps) => {
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([
    {
      id: '1',
      command: 'welcome',
      output: 'NovaOS Terminal v1.0\nType "help" for available commands.',
      timestamp: new Date()
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [isShutdownInitiated, setIsShutdownInitiated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const commands: Record<string, (args: string[]) => string> = {
    help: () => `Available commands:
  help          - Show this help message
  clear         - Clear terminal output
  echo [text]   - Display text
  date          - Show current date and time
  whoami        - Show current user
  pwd           - Show current directory
  ls            - List directory contents
  cat [file]    - Display file contents
  neofetch      - Display system information
  shutdown      - Shutdown NovaOS
  reboot        - Restart system (same as shutdown)
  exit          - Close terminal`,

    clear: () => {
      setCommandHistory([]);
      return "";
    },

    echo: (args) => args.join(" ") || "",

    date: () => new Date().toString(),

    whoami: () => "user@novados",

    pwd: () => "/home/user",

    ls: () => `Desktop/
Documents/
Downloads/
Pictures/
Videos/
Music/
Applications/`,

    cat: (args) => {
      const file = args[0];
      if (!file) return "cat: missing file operand";
      
      const files: Record<string, string> = {
        "welcome.txt": "Welcome to NovaOS!\nYour modern web operating system.",
        "version.txt": "NovaOS v1.0\nBuilt with React + TypeScript",
        "readme.txt": "NovaOS - A modern web-based operating system\n\nFeatures:\n- Multi-window management\n- Built-in applications\n- File manager\n- Web browser\n- Terminal\n\nType 'shutdown' to power off the system."
      };

      return files[file] || `cat: ${file}: No such file or directory`;
    },

    neofetch: () => `
        ███▄    █  ▒█████   ██▒   █▓ ▄▄▄       ▒█████   ██████ 
        ██ ▀█   █ ▒██▒  ██▒▓██░   █▒▒████▄    ▒██▒  ██▒▒██    ▒ 
       ▓██  ▀█ ██▒▒██░  ██▒ ▓██  █▒░▒██  ▀█▄  ▒██░  ██▒░ ▓██▄   
       ▓██▒  ▐▌██▒▒██   ██░  ▒██ █░░░██▄▄▄▄██ ▒██   ██░  ▒   ██▒
       ▒██░   ▓██░░ ████▓▒░   ▒▀█░   ▓█   ▓██▒░ ████▓▒░▒██████▒▒
       ░ ▒░   ▒ ▒ ░ ▒░▒░▒░    ░ ▐░   ▒▒   ▓▒█░░ ▒░▒░▒░ ▒ ▒▓▒ ▒ ░
       ░ ░░   ░ ▒░  ░ ▒ ▒░    ░ ░░    ▒   ▒▒ ░  ░ ▒ ▒░ ░ ░▒  ░ ░
          ░   ░ ░ ░ ░ ░ ▒       ░░    ░   ▒   ░ ░ ░ ▒  ░  ░  ░  
                ░     ░ ░        ░        ░  ░    ░ ░        ░  

OS: NovaOS v1.0
Kernel: WebKit
Uptime: ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m
Shell: nova-shell
CPU: Modern Browser Engine
Memory: ${Math.floor(Math.random() * 8 + 4)}GB Available
Display: WebGL Accelerated`,

    shutdown: () => {
      setIsShutdownInitiated(true);
      setTimeout(() => {
        onShutdown?.();
      }, 3000);
      return "Shutdown initiated...\nSaving system state...\nNovaOS will power off in 3 seconds.";
    },

    reboot: () => {
      setIsShutdownInitiated(true);
      setTimeout(() => {
        onShutdown?.();
      }, 3000);
      return "Reboot initiated...\nSaving system state...\nNovaOS will restart in 3 seconds.";
    },

    exit: () => {
      // This would close the terminal window
      return "Terminal session ended.";
    }
  };

  const executeCommand = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const [command, ...args] = trimmed.split(" ");
    const cmd = commands[command.toLowerCase()];
    
    const output = cmd ? cmd(args) : `Command not found: ${command}\nType 'help' for available commands.`;
    
    const newOutput: CommandOutput = {
      id: Date.now().toString(),
      command: input,
      output,
      timestamp: new Date()
    };

    if (command.toLowerCase() === 'clear') {
      // Clear is handled in the command itself
      return;
    }

    setCommandHistory(prev => [...prev, newOutput]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCommand.trim()) {
      executeCommand(currentCommand);
      setCurrentCommand("");
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [commandHistory]);

  useEffect(() => {
    // Focus input when terminal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-background/95 text-foreground font-mono">
      {/* Terminal Content */}
      <div 
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted"
      >
        {commandHistory.map((entry) => (
          <div key={entry.id} className="space-y-1">
            <div className="text-success">
              <span className="text-primary">user@novados</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-info">~</span>
              <span className="text-muted-foreground">$ </span>
              <span className="text-foreground">{entry.command}</span>
            </div>
            {entry.output && (
              <div className="text-muted-foreground whitespace-pre-wrap pl-4 border-l-2 border-muted/30">
                {entry.output}
              </div>
            )}
          </div>
        ))}
        
        {isShutdownInitiated && (
          <div className="text-warning animate-pulse">
            █ SYSTEM SHUTDOWN IN PROGRESS █
          </div>
        )}
      </div>

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-glass-border">
        <div className="flex items-center space-x-2">
          <span className="text-success">user@novados</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-info">~</span>
          <span className="text-muted-foreground">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground"
            disabled={isShutdownInitiated}
            placeholder={isShutdownInitiated ? "Shutting down..." : "Type a command..."}
          />
        </div>
      </form>
    </div>
  );
};