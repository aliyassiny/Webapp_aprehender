import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp, fadeIn } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { Video, FileText, Clock, Award, TrendingUp, CheckCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MiniCalendar } from "@/components/shared/MiniCalendar";
import { usePatientsApi } from "@/connections/api/patients";
import { useAuth } from "@/context/AuthContext";
import { getTranslatedErrorMessage } from "@/lib/errorHandler";
import type { Session, SessionStatus } from "@/types";
import { toast } from "sonner";

const statusFilterOptions: { label: string; value: string }[] = [
  { label: "Todas", value: "all" },
  { label: "Programadas", value: "SCHEDULED" },
  { label: "Completadas", value: "COMPLETED" },
  { label: "Canceladas", value: "CANCELED" },
];

const PatientSessions = () => {
  const { user } = useAuth();
  const { getPatientSessions } = usePatientsApi();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Calendar
  const getLocalDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const todayStr = getLocalDate(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  useEffect(() => {
    if (user?.id) loadSessions();
  }, [user]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getPatientSessions(user!.id);
      setSessions(data);
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al cargar las sesiones"));
    } finally {
      setLoading(false);
    }
  };

  // Fechas con sesiones para el calendario
  const sessionDates = [...new Set(sessions.map((s) => {
    return getLocalDate(new Date(s.startTime));
  }))];

  const filtered = sessions.filter((s) => {
    const sessionDate = getLocalDate(new Date(s.startTime));
    
    if (selectedDate && sessionDate !== selectedDate) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const handleDateSelect = (date: string) => {
    setSelectedDate(date === selectedDate ? "" : date);
  };

  // Estadísticas
  const completedCount = sessions.filter(s => s.status === "COMPLETED").length;
  const scheduledCount = sessions.filter(s => s.status === "SCHEDULED").length;
  const attendanceRate = sessions.length > 0
    ? Math.round((completedCount / sessions.length) * 100)
    : 0;

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return {
      date: date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }),
      time: date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getTherapistInitials = (session: Session) => {
    const name = session.therapist?.user?.username || "";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "T";
  };

  return (
    <DashboardLayout role="PATIENT" userName={user?.username || "Paciente"} userRole="Paciente">
      <PageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={fadeInUp} className="mb-2">
            <h1 className="text-2xl font-bold text-foreground">Mis Sesiones</h1>
            <p className="text-muted-foreground mt-1">Administra tus citas y revisa tu historial terapéutico.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Lista de sesiones */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filtros de estado */}
              <motion.div variants={fadeInUp} className="flex items-center gap-2 flex-wrap">
                {statusFilterOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setStatusFilter(opt.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === opt.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
                {(statusFilter !== "all" || selectedDate !== todayStr) && (
                  <button
                    onClick={() => { setStatusFilter("all"); setSelectedDate(todayStr); }}
                    className="text-xs text-accent hover:underline ml-1"
                  >
                    Limpiar filtros
                  </button>
                )}
              </motion.div>

              {/* Contador */}
              <motion.div variants={fadeInUp} className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">Sesiones</h2>
                <span className="status-active text-xs">{filtered.length} resultados</span>
              </motion.div>

              {/* Sesiones */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm bg-card rounded-xl border border-border">
                  No se encontraron sesiones con los filtros aplicados.
                </div>
              ) : (
                filtered.map(session => {
                  const { date, time } = formatDateTime(session.startTime);
                  const { time: endTime } = formatDateTime(session.endTime);
                  const therapistName = session.therapist?.user?.username || "Terapeuta";

                  return (
                    <motion.div
                      key={session.id}
                      variants={fadeInUp}
                      className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-accent/10 text-accent font-medium">
                              {getTherapistInitials(session)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-foreground">{therapistName}</h4>
                            <p className="text-xs text-muted-foreground">
                              {session.therapist?.user?.email || ""}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={session.status} />
                      </div>

                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-lg text-xs font-medium">
                          <Clock size={13} />
                          {date} • {time} - {endTime}
                        </div>
                        {session.meetingLink && (
                          <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-lg text-xs font-medium text-foreground">
                            <Video size={13} />
                            Videollamada
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {session.status === "SCHEDULED" && session.meetingLink && (
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                          >
                            <Video size={15} />
                            Unirse a videollamada
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div variants={fadeIn}>
                <MiniCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  highlightedDates={sessionDates}
                />
              </motion.div>

              {/* Resumen */}
              <motion.div variants={fadeIn} className="brand-card-dark relative overflow-hidden">
                <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/[0.04]" />
                <div className="absolute top-4 right-4 opacity-[0.08]">
                  <Award size={36} />
                </div>
                <h3 className="text-lg font-bold mb-4">Resumen de Mis Sesiones</h3>
                {loading ? (
                  <div className="h-24 bg-white/10 animate-pulse rounded-lg" />
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-xs text-white/60">Total</p>
                        <p className="text-2xl font-bold text-white">{sessions.length}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-white/50">
                          <TrendingUp size={12} />
                          {scheduledCount} próximas
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-xs text-white/60">Asistidas</p>
                        <p className="text-2xl font-bold text-white">{completedCount}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-white/50">
                          <CheckCircle size={12} />
                          {attendanceRate}% asistencia
                        </div>
                      </div>
                    </div>
                    {completedCount >= 4 && (
                      <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                          <Award size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Racha de bienestar</p>
                          <p className="text-xs text-white/60">¡{completedCount} sesiones completadas!</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientSessions;
