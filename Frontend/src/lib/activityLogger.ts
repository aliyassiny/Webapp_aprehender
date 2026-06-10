export interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  timestamp: number;
  tag: string;
  tagColor: "green" | "red" | "blue" | "orange";
}

const STORAGE_KEY = "recentActivities";
const MAX_ACTIVITIES = 20;

/**
 * Obtiene todas las actividades del sessionStorage
 */
export const getActivities = (): ActivityItem[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const activities = JSON.parse(stored) as ActivityItem[];
    // Ordenar por timestamp descendente (más reciente primero)
    return activities.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error al leer actividades:", error);
    return [];
  }
};

/**
 * Agrega una nueva actividad al log
 */
export const addActivity = (activity: Omit<ActivityItem, "id" | "time" | "timestamp">): void => {
  try {
    const activities = getActivities();
    const now = Date.now();
    
    const newActivity: ActivityItem = {
      ...activity,
      id: `activity-${now}`,
      timestamp: now,
      time: getRelativeTime(now),
    };
    
    // Agregar al inicio y limitar a MAX_ACTIVITIES
    const updatedActivities = [newActivity, ...activities].slice(0, MAX_ACTIVITIES);
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities));
  } catch (error) {
    console.error("Error al guardar actividad:", error);
  }
};

/**
 * Limpia todas las actividades
 */
export const clearActivities = (): void => {
  sessionStorage.removeItem(STORAGE_KEY);
};

/**
 * Actualiza los tiempos relativos de todas las actividades
 */
export const refreshActivityTimes = (): ActivityItem[] => {
  try {
    const activities = getActivities();
    const updatedActivities = activities.map(activity => ({
      ...activity,
      time: getRelativeTime(activity.timestamp),
    }));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities));
    return updatedActivities;
  } catch (error) {
    console.error("Error al actualizar tiempos:", error);
    return [];
  }
};

/**
 * Calcula el tiempo relativo desde un timestamp
 */
const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return "Hace unos segundos";
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
  
  return new Date(timestamp).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
};

// Helpers para tipos específicos de actividades
export const logSessionCreated = (patientName: string, therapistName: string) => {
  addActivity({
    icon: "check-circle",
    title: "Sesión creada",
    description: `Nueva sesión programada: ${patientName} con ${therapistName}`,
    tag: "Registrado",
    tagColor: "green",
  });
};

export const logSessionUpdated = (patientName: string) => {
  addActivity({
    icon: "check-circle",
    title: "Sesión actualizada",
    description: `Sesión modificada para ${patientName}`,
    tag: "Actualizado",
    tagColor: "blue",
  });
};

export const logSessionDeleted = (patientName: string) => {
  addActivity({
    icon: "alert-triangle",
    title: "Sesión cancelada",
    description: `Sesión eliminada para ${patientName}`,
    tag: "Cancelado",
    tagColor: "red",
  });
};

export const logUserCreated = (username: string, role: string) => {
  addActivity({
    icon: "user-plus",
    title: "Nuevo usuario registrado",
    description: `${username} se unió como ${role}`,
    tag: "Nuevo",
    tagColor: "green",
  });
};

export const logUserUpdated = (username: string) => {
  addActivity({
    icon: "shield-check",
    title: "Usuario actualizado",
    description: `Información de ${username} modificada`,
    tag: "Actualizado",
    tagColor: "blue",
  });
};

export const logUserDeleted = (username: string) => {
  addActivity({
    icon: "alert-triangle",
    title: "Usuario eliminado",
    description: `${username} fue removido del sistema`,
    tag: "Eliminado",
    tagColor: "orange",
  });
};
