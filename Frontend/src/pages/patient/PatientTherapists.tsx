import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { Calendar, Clock, Stethoscope } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePatientsApi } from "@/connections/api/patients";
import type { PatientTherapist, Session } from "@/types";
import { toast } from "sonner";
import { getTranslatedErrorMessage } from "@/lib/errorHandler";
import { ScheduleSessionModal } from "@/components/patient/ScheduleSessionModal";

const PatientTherapists = () => {
  const { user } = useAuth();
  const { getPatientTherapists, getPatientSessions } = usePatientsApi();
  const [therapists, setTherapists] = useState<PatientTherapist[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<PatientTherapist | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [therapistsData, sessionsData] = await Promise.all([
        getPatientTherapists(user.id),
        getPatientSessions(user.id)
      ]);
      setTherapists(therapistsData);
      setSessions(sessionsData);
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al cargar terapeutas"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getNextSessionForTherapist = (therapistProfileId: string) => {
    const upcomingSessions = sessions
      .filter(s => s.status === "SCHEDULED" && s.therapistId === therapistProfileId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return upcomingSessions[0] || null;
  };

  const formatSessionDate = (dateTimeLocal: string) => {
    if (!dateTimeLocal) return "";
    const date = new Date(dateTimeLocal);
    return date.toLocaleString("es-ES", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const handleScheduleClick = (therapist: PatientTherapist) => {
    setSelectedTherapist(therapist);
    setScheduleModalOpen(true);
  };
  
  return (
    <DashboardLayout
      role="PATIENT"
      userName="Sofía Martínez"
      userRole="Plan Premium"
    >
      <PageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={fadeInUp} className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Mis Terapeutas</h1>
            <p className="text-muted-foreground mt-1 max-w-2xl">
              Continúa tu camino de bienestar con el apoyo de tus profesionales asignados. Aquí puedes gestionar tus sesiones y revisar tu progreso.
            </p>
          </motion.div>

          {/* Assigned therapists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {therapists.length === 0 && !loading && (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <Stethoscope size={48} className="mx-auto mb-4 opacity-50" />
                <p>Aún no tienes terapeutas asignados.</p>
              </div>
            )}
            
            {therapists.map((item) => {
              const therapistName = item.therapist.user.username || "Terapeuta";
              const initials = therapistName.substring(0, 2).toUpperCase();
              const nextSession = getNextSessionForTherapist(item.therapist.id);

              return (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-accent/[0.04]" />
                  <Stethoscope size={36} className="absolute bottom-4 right-4 text-accent/[0.06]" />
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-accent/10 text-accent text-xl font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-foreground">{therapistName}</h3>
                        <span className="status-active text-[10px]">ACTIVO</span>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent">{item.therapist.specialization}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Terapeuta profesional especializado y asignado para acompañarte en tu proceso.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    {nextSession ? (
                      <>
                        <Calendar size={15} className="text-accent" />
                        <span>Próxima sesión: {formatSessionDate(nextSession.startTime)}</span>
                      </>
                    ) : (
                      <>
                        <Clock size={15} className="text-accent" />
                        <span>Disponible para agendar</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {nextSession && nextSession.meetingLink ? (
                      <button className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        <a href={nextSession.meetingLink} target="_blank" rel="noopener noreferrer">Unirse a Cita</a>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleScheduleClick(item)}
                        className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                         Agendar Cita
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </PageTransition>

      {/* Modal de agendar sesión */}
      <ScheduleSessionModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        therapist={selectedTherapist}
      />
    </DashboardLayout>
  );
};

export default PatientTherapists;
