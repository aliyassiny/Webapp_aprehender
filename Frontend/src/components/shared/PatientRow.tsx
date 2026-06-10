import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, FileText, StickyNote } from "lucide-react";
import type { PatientTherapist, Session } from "@/types";
import { fadeInUp } from "@/components/animations/PageTransition";

interface PatientRowProps {
  item: PatientTherapist;
  nextSession?: Session | null;
  onAddNote?: (item: PatientTherapist) => void;
  onViewHistory?: (item: PatientTherapist) => void;
  onSchedule?: (item: PatientTherapist) => void;
}

export const PatientRow = ({ item, nextSession, onAddNote, onViewHistory, onSchedule }: PatientRowProps) => {
  const patientName = item.patient?.user?.username || "Paciente";
  const initials = patientName.substring(0, 2).toUpperCase();
  const nextSessionDate = nextSession ? new Date(nextSession.startTime) : null;

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className="bg-muted text-muted-foreground font-medium">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">{patientName}</p>
        <p className="text-xs text-muted-foreground">{item.patient?.user?.email || ""}</p>
      </div>

      <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground min-w-[160px]">
        <Calendar size={13} className="text-accent flex-shrink-0" />
        {nextSessionDate
          ? nextSessionDate.toLocaleString("es-ES", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })
          : "Sin sesión próxima"}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onViewHistory?.(item)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="Ver historial"
        >
          <FileText size={15} className="text-muted-foreground" />
        </button>
        <button
          onClick={() => onAddNote?.(item)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="Añadir nota"
        >
          <StickyNote size={15} className="text-muted-foreground" />
        </button>
        <button
          onClick={() => onSchedule?.(item)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-xs font-medium hover:bg-accent/20 transition-colors"
        >
          <Clock size={13} />
          Programar
        </button>
      </div>
    </motion.div>
  );
};
