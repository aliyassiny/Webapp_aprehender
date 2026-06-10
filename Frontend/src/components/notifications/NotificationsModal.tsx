import { useEffect, useState } from "react";
import { Bell, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notificationsWS, Notification } from "@/connections/ws/notifications";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function NotificationsModal() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const unreadCount = notifications.filter(n => n.status === "SENT").length;

  // Cargar notificaciones cuando se abre el modal
  useEffect(() => {
    if (open && user?.id) {
      loadNotifications();
    }
  }, [open, user?.id]);

  // Escuchar nuevas notificaciones en tiempo real
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = notificationsWS.onUserNotification(user.id, (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return unsubscribe;
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await notificationsWS.findAllNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      await notificationsWS.markAsRead(notificationId, user.id);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, status: "READ" as const } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "REMINDER":
        return "🔔";
      case "CANCELLATION":
        return "❌";
      case "CONFIRMATION":
        return "✅";
      default:
        return "📬";
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "REMINDER":
        return "bg-blue-100 text-blue-800";
      case "CANCELLATION":
        return "bg-red-100 text-red-800";
      case "CONFIRMATION":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Notificaciones</span>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} nuevas</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.status === "SENT"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <Badge
                          variant="secondary"
                          className={getNotificationColor(notification.type)}
                        >
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.sentAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
                    {notification.status === "SENT" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
