import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationsModal } from "@/components/notifications/NotificationsModal";

interface TopBarProps {
  userName: string;
  userRole: string;
  onMenuClick: () => void;
}

const breadcrumbMap: Record<string, { parent: string; current: string }> = {
  "/coordinador": { parent: "Panel", current: "Dashboard" },
  "/coordinador/sesiones": { parent: "Sesiones", current: "Gestión de Sesiones" },
  "/coordinador/directorio": { parent: "Directorio", current: "Gestión de Usuarios" },
  "/coordinador/analisis": { parent: "Análisis", current: "Reportes" },
  "/terapeuta": { parent: "Panel", current: "Dashboard" },
  "/terapeuta/sesiones": { parent: "Sesiones", current: "Mis Sesiones" },
  "/terapeuta/pacientes": { parent: "Pacientes", current: "Mis Pacientes" },
  "/paciente": { parent: "Panel", current: "Dashboard" },
  "/paciente/sesiones": { parent: "Sesiones", current: "Mis Sesiones" },
  "/paciente/terapeutas": { parent: "Terapeutas", current: "Mis Terapeutas" },
};

export const TopBar = ({ userName, userRole, onMenuClick }: TopBarProps) => {
  const location = useLocation();
  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2);
  const crumb = breadcrumbMap[location.pathname] || { parent: "Panel", current: "Dashboard" };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      {/* Left: hamburger icon + breadcrumb */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={20} className="text-muted-foreground" />
        </button>
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground hidden sm:inline">{crumb.parent}</span>
          <span className="text-muted-foreground hidden sm:inline">›</span>
          <span className="text-accent font-semibold">{crumb.current}</span>
        </nav>
      </div>

      {/* Right: actions + avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationsModal />
        <div className="flex items-center gap-2.5 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-tight">{userName}</p>
            <p className="text-xs text-muted-foreground leading-tight">{userRole}</p>
          </div>
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
