import { io, Socket } from "socket.io-client";

export interface Notification {
  id: string;
  userId: string;
  type: "REMINDER" | "CANCELLATION" | "CONFIRMATION";
  message: string;
  status: "SENT" | "FAILED" | "READ";
  sentAt: Date;
}

class NotificationsWebSocket {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    
    this.socket = io(backendUrl, {
      auth: {
        token,
      },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }
    this.socket.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)?.add(callback);
    this.socket.on(event, callback);
    
    return () => this.off(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    if (!this.socket) {
      return;
    }

    if (callback) {
      this.socket.off(event, callback);
      this.listeners.get(event)?.delete(callback);
    } else {
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }

  // Métodos específicos para notificaciones
  findAllNotifications(userId: string): Promise<Notification[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("findAllNotifications", userId, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  markAsRead(notificationId: string, userId: string): Promise<Notification> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("removeNotification", { id: notificationId, userId }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  // Escuchar notificaciones específicas del usuario
  onUserNotification(userId: string, callback: (notification: Notification) => void) {
    return this.on(`notification:${userId}`, callback);
  }
}

export const notificationsWS = new NotificationsWebSocket();
