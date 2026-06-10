import { ReactNode, useEffect } from "react";
import { notificationsWS } from "@/connections/ws/notifications";
import { useAuth } from "./AuthContext";

interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const { accessToken, user } = useAuth();

  useEffect(() => {
    if (accessToken && user?.id) {
      notificationsWS.connect(accessToken);

      return () => {
        notificationsWS.disconnect();
      };
    }
  }, [accessToken, user?.id]);

  return <>{children}</>;
}
