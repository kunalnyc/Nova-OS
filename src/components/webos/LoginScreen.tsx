import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, ArrowRight } from "lucide-react";
import wallpaper from "@/assets/webos-wallpaper.jpg";

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    onLogin();
  };

  const handleQuickLogin = () => {
    setIsLoading(true);
    setTimeout(onLogin, 800);
  };

  return (
    <div 
      className="h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      
      {/* Login Card */}
      <div className="relative z-10 fade-in">
        <div className="glass rounded-xl p-8 w-96 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 glass rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to WebOS</h1>
            <p className="text-muted-foreground">Your modern web operating system</p>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 mb-6 p-3 glass-strong rounded-lg cursor-pointer hover:bg-white/5 transition-smooth" onClick={handleQuickLogin}>
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-foreground">User</p>
              <p className="text-sm text-muted-foreground">Click to login</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 glass border-glass-border bg-transparent"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 glass border-glass-border bg-transparent"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary hover:glow-primary transition-spring"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Built with modern web technologies
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-8 left-8 text-foreground/80">
        <p className="text-sm">WebOS v1.0</p>
        <p className="text-xs text-muted-foreground">Modern Web Operating System</p>
      </div>

      {/* Time */}
      <div className="absolute top-8 right-8 text-right text-foreground/80">
        <p className="text-lg font-medium">{new Date().toLocaleTimeString()}</p>
        <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};