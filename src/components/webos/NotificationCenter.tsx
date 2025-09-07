import { Button } from "@/components/ui/button";
import { X, Bell, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Notification } from "./types";

interface NotificationCenterProps {
  notifications: Notification[];
  onClose: () => void;
  onClearAll: () => void;
}

export const NotificationCenter = ({ notifications, onClose, onClearAll }: NotificationCenterProps) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 w-80 z-50 fade-in">
      <div className="glass rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-glass-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Notifications</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs hover:bg-white/10"
                onClick={onClearAll}
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-white/10"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-glass-border">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-white/5 transition-smooth">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};