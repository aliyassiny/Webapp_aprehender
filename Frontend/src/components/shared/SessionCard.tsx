import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Clock, Link as LinkIcon, User } from "lucide-react";
import type { Session } from "@/types";
import { fadeInUp } from "@/components/animations/PageTransition";

interface SessionCardProps {
  session: Session;
  variant?: "therapist" | "coordinator";
}

export const SessionCard = ({ session, variant = "therapist" }: SessionCardProps) => {
  // Obtener nombres de paciente y terapeuta
  const patientName = session.patient?.user?.username || "Paciente";
  const therapistName = session.therapist?.user?.username || "Terapeuta";
  
  const initials = patientName.split(" ").map(n => n[0]).join("").slice(0, 2);
  const isHighlighted = session.status === "SCHEDULED" && variant === "therapist";

  // Formatear fechas
  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <motion.div
      variants={fadeInUp}
      className={`bg-card rounded-xl border p-4 flex items-center gap-4 shadow-sm transition-shadow hover:shadow-md ${
        isHighlighted ? "border-accent border-2" : "border-border"
      }`}
    >
      <div className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center text-xs font-semibold shrink-0 ${
        session.status === "CANCELED" ? "bg-status-cancelled/10 text-status-cancelled" :
        session.status === "COMPLETED" ? "bg-status-completed/10 text-status-completed" :
        "bg-accent/10 text-accent"
      }`}>
        <span className="text-sm font-bold">{formatTime(startDate)}</span>
        <span className="text-[10px]">{formatDate(startDate)}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-sm text-foreground">{patientName}</h4>
          <StatusBadge status={session.status} />
        </div>
        {variant === "coordinator" && (
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <User size={12} />
            {therapistName}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-accent" />
            {formatTime(startDate)} - {formatTime(endDate)}
          </span>
          {session.meetingLink && (
            <a 
              href={session.meetingLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent hover:underline"
            >
              <LinkIcon size={12} />
              Enlace
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2"> 
        {session.status === "SCHEDULED" && isHighlighted && (
          <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2">
            ▶ Iniciar sesión
          </a>
        )}
      </div>
    </motion.div>
  );
};
