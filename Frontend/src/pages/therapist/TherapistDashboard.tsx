import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp } from "@/components/animations/PageTransition";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Users, ArrowRight, Stethoscope, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTherapistsApi } from "@/connections/api/therapists";
import { SessionCard } from "@/components/shared/SessionCard";
import type { Session, PatientTherapist, ClinicalNote } from "@/types";

const TherapistDashboard = () => {
  const { user } = useAuth();
  const { getTherapistSessions, getTherapistPatients, getTherapistClinicalNotes } = useTherapistsApi();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<PatientTherapist[]>([]);
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessionsData, patientsData, notesData] = await Promise.all([
        getTherapistSessions(user.id),
        getTherapistPatients(user.id),
        getTherapistClinicalNotes(user.id)
      ]);
      setSessions(sessionsData);
      setPatients(patientsData);
      setNotes(notesData);
    } catch (error) {
      console.error("Error loading dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const todayStr = getLocalDate(new Date());

  const todaySessions = sessions
    .filter(s => getLocalDate(new Date(s.startTime)) === todayStr)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const pendingSessionsCount = todaySessions.filter(s => s.status === "SCHEDULED").length;

  return (
    <DashboardLayout
      role="THERAPIST"
      userName={user?.username || "Terapeuta"}
      userRole="Psicólogo"
    >
      <PageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {/* Welcome */}
          <motion.div variants={fadeInUp} className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">Bienvenido de nuevo, {user?.username}</p>
            <h1 className="text-3xl font-bold text-foreground mb-2">Su Resumen Clínico</h1>
            <p className="text-muted-foreground max-w-lg">
              Concéntrese en sus pacientes mientras MindBrige se encarga de la logística. Tiene {pendingSessionsCount} sesiones programadas para hoy.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="lg:col-span-2">
                {/* Today's sessions */}
                <motion.div variants={fadeInUp}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Sesiones de hoy</h2>
                    <Link to="/terapeuta/sesiones" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
                      Ver horario completo <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {todaySessions.length === 0 ? (
                      <div className="bg-card w-full p-8 border rounded-xl shadow-sm text-center">
                        <p className="text-muted-foreground text-sm">No tienes sesiones programadas para el día de hoy.</p>
                      </div>
                    ) : (
                      todaySessions.map((session) => (
                        <SessionCard key={session.id} session={session} variant="therapist" />
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-4">
                {/* Stats summary */}
                <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-5 shadow-sm flex gap-6">
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-foreground">{notes.length}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Notas Evolutivas</p>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-foreground">{patients.length}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Pacientes</p>
                  </div>
                </motion.div>

                {/* Notes card */}
                <motion.div variants={fadeInUp} className="brand-card-dark relative overflow-hidden">
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/[0.04]" />
                  <div className="absolute top-4 right-4 opacity-[0.08]">
                    <FileText size={40} />
                  </div>
                  <FileText size={24} className="mb-3 opacity-80" />
                  <p className="text-3xl font-bold mb-1">{notes.length}</p>
                  <p className="text-xs uppercase tracking-widest opacity-70 font-semibold mb-4">Notas Evolutivas</p>
                  <Link to="/terapeuta/pacientes" className="block text-center w-full py-2.5 border border-primary-foreground/30 rounded-lg text-sm font-medium hover:bg-primary-foreground/10 transition-colors">
                    Ver pacientes
                  </Link>
                </motion.div>

                {/* Patients card */}
                <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-accent/[0.04]" />
                  <Stethoscope size={36} className="absolute bottom-3 right-3 text-accent/[0.06]" />
                  <Users size={24} className="text-muted-foreground mb-3" />
                  <p className="text-3xl font-bold text-foreground mb-1">{patients.length}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">Total de Pacientes</p>
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {patients.slice(0, 3).map((p) => {
                        const init = p.patient.user.username.split(" ").map(n => n[0]).join("").slice(0, 2);
                        return (
                          <Avatar key={p.id} className="w-8 h-8 border-2 border-card">
                            <AvatarFallback className="bg-muted text-[10px] font-medium text-muted-foreground hover:bg-accent/20 cursor-pointer">{init}</AvatarFallback>
                          </Avatar>
                        )
                      })}
                    </div>
                    {patients.length > 3 && (
                      <span className="text-xs text-muted-foreground ml-2">+{patients.length - 3}</span>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default TherapistDashboard;
