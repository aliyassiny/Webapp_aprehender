import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp, fadeIn } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { Calendar, Video, FileText, Users, Sparkles, MoreVertical, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { usePatientsApi } from "@/connections/api/patients";
import { useEffect, useState } from "react";
import type { Session, SessionStatus, PatientTherapist } from "@/types";
import { toast } from "sonner";
import { getTranslatedErrorMessage } from "@/lib/errorHandler";
import { useNavigate } from "react-router-dom";
const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getPatientSessions, getPatientTherapists } = usePatientsApi();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [therapists, setTherapists] = useState<PatientTherapist[]>([]);
  const [loading, setLoading] = useState(true);

  const statusMap = {
    "COMPLETED": "Completado",
    "CANCELED": "Cancelado",
    "SCHEDULED": "Programado",
    "ABSENT": "Ausente"
  }

  const loadPatientSessions = async () => {
    try {
      setLoading(true);
      const [sessionsData, therapistsData] = await Promise.all([
        getPatientSessions(user.id),
        getPatientTherapists(user.id)
      ]);
      setSessions(sessionsData);
      setTherapists(therapistsData);
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al cargar los datos"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPatientSessions()
  }, [])

  const fromDateTimeLocal = (dateTimeLocal: string) => {
    if (!dateTimeLocal) return "";
    const date = new Date(dateTimeLocal);
    // Formatea a "DD/MM/YYYY" de forma simple (día, mes, año)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  const formatTime = (dateTimeLocal: string) => {
    if (!dateTimeLocal) return "";
    const date = new Date(dateTimeLocal);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const upcomingSessions = sessions
    .filter(s => s.status === "SCHEDULED")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const featuredSession = upcomingSessions[0];
  const secondarySession = upcomingSessions[1];
  return (
    <DashboardLayout
      role="PATIENT"
      userName="Sofía Martínez"
      userRole="Plan Premium"
    >
      <PageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {/* Welcome */}
          <motion.div variants={fadeInUp} className="mb-6">
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              Bienvenida de nuevo, {user?.username || "Usuario"}.
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Tu viaje de restauración continúa hoy. Tómate un momento para respirar antes de que comience tu próxima sesión.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Próximas sesiones */}
              <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-accent" />
                    <h2 className="text-lg font-semibold text-foreground">Mis próximas sesiones</h2>
                  </div>
                  <button className="text-sm text-accent font-medium hover:underline">Ver calendario</button>
                </div>

                {!featuredSession ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Aún no cuentas con una próxima sesión programada.</p>
                  </div>
                ) : (
                  <>
                    {/* Featured next session */}
                    <div className="brand-card-dark mb-4 relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/[0.04]" />
                      <div className="absolute top-4 right-4 opacity-[0.07]">
                        <Video size={44} />
                      </div>
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 border-2 border-white/20">
                          <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                            {featuredSession.therapist.user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">A continuación</p>
                          <h3 className="text-xl font-bold text-white">{featuredSession.therapist.user.username}</h3>
                          <div className="flex items-center gap-1.5 mt-1 text-white/70 text-sm">
                            <FileText size={14} />
                            Sesión
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{fromDateTimeLocal(featuredSession.startTime)}</p>
                          <p className="text-sm text-white/60">{formatTime(featuredSession.startTime)}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {featuredSession.meetingLink ? (
                          <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-white/20">
                            <Video size={16} />
                            <a href={featuredSession.meetingLink} target="_blank" rel="noopener noreferrer">Unirse a videollamada</a>
                          </button>
                        ) : (
                          <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-white/20">
                            <Users size={16} />
                            Asiste a tu Session
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Secondary session */}
                    {secondarySession && (
                      <div className="bg-secondary/50 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Calendar size={18} className="text-accent" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">Próxima Sesión</p>
                            <p className="text-xs text-muted-foreground">
                              {fromDateTimeLocal(secondarySession.startTime)} • {formatTime(secondarySession.startTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Profesional</p>
                            <p className="text-sm font-medium text-foreground">{secondarySession.therapist.user.username}</p>
                          </div>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
                            <MoreVertical size={16} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>

              {/* Bottom row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Self-reflection note */}
                <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-accent/[0.04]" />
                  <Sparkles size={32} className="absolute bottom-3 right-3 text-accent/[0.06]" />
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={18} className="text-accent" />
                    <h3 className="font-semibold text-foreground">Nota de autorreflexión</h3>
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "Quiero hablar sobre mis patrones de sueño durante esta sesión. Me he sentido más descansada últimamente."
                  </p>
                </motion.div>

                {/* My therapists */}
                <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-primary/[0.03]" />
                  <Heart size={28} className="absolute top-3 right-3 text-accent/[0.06]" />
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={18} className="text-accent" />
                    <h3 className="font-semibold text-foreground">Mis Terapeutas</h3>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Cargando...
                    </div>
                  ) : therapists.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      <Users size={32} className="mx-auto mb-2 opacity-50" />
                      <p>Aún no tienes terapeutas asignados</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {therapists.slice(0, 2).map((therapist) => {
                        const initials = therapist.therapist.user.username
                          .split(" ")
                          .map(n => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();
                        
                        return (
                          <div key={therapist.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-accent/10 text-accent text-sm font-medium">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {therapist.therapist.user.username}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {therapist.therapist.user.email}
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => navigate("/paciente/terapeutas")}
                              className="text-xs text-accent font-medium hover:underline"
                            >
                              Ver perfil
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => navigate("/paciente/terapeutas")}
                    className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent hover:underline"
                  >
                    Explorar especialistas →
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Right column - Session history */}
            <motion.div variants={fadeIn} className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">Historial de sesiones</h2>
              </div>
              <div className="space-y-4 overflow-y-auto h-3/2">
                {sessions.map((item) => {
                  const statusColorMap: Record<SessionStatus, string> = {
                    COMPLETED: "hsl(var(--status-completed))",
                    SCHEDULED: "hsl(var(--status-scheduled))",
                    CANCELED: "hsl(var(--status-cancelled))",
                    ABSENT: "hsl(var(--status-pending))",
                  };
                  return (
                  <div key={item.id} className="border-l-2 pl-4 py-1" style={{
                    borderColor: statusColorMap[item.status] || "hsl(var(--border))"
                  }}>
                    <div className="flex items-center justify-between mb-1">
                      <StatusBadge status={item.status} label={statusMap[item.status]} />
                      <span className="text-xs text-muted-foreground">{fromDateTimeLocal(item.startTime)}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">Sesión con {item.therapist.user.username}</p>
                    <p className="text-xs text-muted-foreground">{item.therapist.user.email}</p>
                  </div>
                );
              })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientDashboard;
