import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp } from "@/components/animations/PageTransition";
import { PatientCard } from "@/components/shared/PatientCard";
import { PatientRow } from "@/components/shared/PatientRow";
import { NoteFormModal } from "@/components/therapist/NoteFormModal";
import { ClinicalHistoryModal } from "@/components/therapist/ClinicalHistoryModal";
import { SessionFormModal } from "@/components/coordinator/SessionFormModal";
import { AddPatientModal } from "@/components/therapist/AddPatientModal";
import { Grid3X3, List, UserPlus, ArrowRight } from "lucide-react";
import type { PatientTherapist, Session, SessionFormData } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useTherapistsApi } from "@/connections/api/therapists";
import { useSessionsApi } from "@/connections/api/sessions";

type ViewMode = "grid" | "list";
type StatusFilter = "all" | "active" | "inactive";

const TherapistPatients = () => {
  const { user } = useAuth();
  const { getTherapistPatients, getTherapistSessions, addPatient } = useTherapistsApi();
  const { createSession } = useSessionsApi();

  const [patients, setPatients] = useState<PatientTherapist[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [notePatient, setNotePatient] = useState<PatientTherapist | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyPatient, setHistoryPatient] = useState<PatientTherapist | null>(null);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessionPatient, setSessionPatient] = useState<PatientTherapist | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ptData, stData] = await Promise.all([
        getTherapistPatients(user.id),
        getTherapistSessions(user.id),
      ]);
      setPatients(ptData);
      setSessions(stData);
    } catch (err) {
      toast.error("Error al cargar pacientes y sesiones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  // Filtrar por estado activo: tiene sesión SCHEDULED próxima
  const filteredPatients = patients.filter((item) => {
    if (statusFilter === "all") return true;
    const hasUpcoming = sessions.some(
      (s) => s.patientId === item.patient.id && s.status === "SCHEDULED"
    );
    return statusFilter === "active" ? hasUpcoming : !hasUpcoming;
  });

  const getNextSessionForPatient = (patientProfileId: string) => {
    return sessions
      .filter((s) => s.status === "SCHEDULED" && s.patientId === patientProfileId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] || null;
  };

  const handleAddNote = (patient: PatientTherapist) => { setNotePatient(patient); setNoteOpen(true); };
  const handleViewHistory = (patient: PatientTherapist) => { setHistoryPatient(patient); setHistoryOpen(true); };
  const handleSchedule = (patient: PatientTherapist) => { setSessionPatient(patient); setSessionOpen(true); };

  const handleSaveSession = async (formData: SessionFormData) => {
    try {
      await createSession(formData);
      toast.success("Sesión programada exitosamente");
      await loadData();
      setSessionOpen(false);
      setSessionPatient(null);
    } catch (err) {
      toast.error("Error al programar la sesión");
    }
  };

  const handleAddPatientSubmit = async (patientId: string) => {
    try {
      await addPatient({ therapistId: user.id, patientId });
      toast.success("Paciente añadido exitosamente");
      await loadData();
    } catch (err) {
      toast.error("Error al añadir el paciente.");
    }
  };

  return (
    <DashboardLayout role="THERAPIST" userName={user?.username || "Terapeuta"} userRole="Psicólogo">
      <PageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {/* Header */}
          <motion.div variants={fadeInUp} className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mis Pacientes</h1>
              <p className="text-muted-foreground text-sm">Gestiona tu red de cuidado y el progreso clínico.</p>
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:bg-card/50"
                }`}
              >
                <Grid3X3 size={14} /> Cuadrícula
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:bg-card/50"
                }`}
              >
                <List size={14} /> Lista
              </button>
            </div>
          </motion.div>

          {/* Filtro por estado */}
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Estado:</span>
            {(["all", "active", "inactive"] as StatusFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  statusFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {{ all: "Todos", active: "Activos", inactive: "Sin sesión" }[f]}
              </button>
            ))}
            <span className="ml-auto text-sm text-accent font-medium">
              {filteredPatients.length} pacientes
            </span>
          </motion.div>

          {/* Contenido */}
          {loading ? (
            <div className="py-16 text-center text-muted-foreground text-sm">Cargando pacientes...</div>
          ) : viewMode === "grid" ? (
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPatients.map((item) => (
                <PatientCard
                  key={item.id}
                  item={item}
                  nextSession={getNextSessionForPatient(item.patient.id)}
                  onAddNote={handleAddNote}
                  onViewHistory={handleViewHistory}
                  onSchedule={handleSchedule}
                />
              ))}
              {/* Nueva tarjeta */}
              <motion.div
                variants={fadeInUp}
                onClick={() => setAddPatientOpen(true)}
                className="rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center hover:border-accent/40 hover:bg-secondary/20 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <UserPlus size={20} className="text-muted-foreground" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">Nuevo Paciente</h4>
                <p className="text-sm text-muted-foreground mb-3">Registra un nuevo ingreso terapéutico.</p>
                <span className="text-sm text-accent font-medium flex items-center gap-1 hover:underline">
                  Comenzar registro <ArrowRight size={14} />
                </span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div variants={staggerContainer} className="space-y-2">
              {filteredPatients.map((item) => (
                <PatientRow key={item.id} item={item} />
              ))}
              {/* Nueva fila */}
              <motion.div
                variants={fadeInUp}
                onClick={() => setAddPatientOpen(true)}
                className="rounded-xl border-2 border-dashed border-border flex items-center gap-4 px-5 py-4 hover:border-accent/40 hover:bg-secondary/20 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <UserPlus size={18} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Nuevo Paciente</p>
                  <p className="text-xs text-muted-foreground">Registra un nuevo ingreso terapéutico.</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-accent" />
              </motion.div>
            </motion.div>
          )}

          {/* Pagination */}
          <motion.div variants={fadeInUp} className="flex items-center justify-between mt-8 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-semibold text-foreground">{filteredPatients.length}</span> de{" "}
              <span className="font-semibold text-foreground">{patients.length}</span> pacientes
            </p>
          </motion.div>
        </motion.div>
      </PageTransition>

      {notePatient && (
        <NoteFormModal
          open={noteOpen}
          onOpenChange={setNoteOpen}
          patient={notePatient}
          therapistId={user?.id}
          therapistName={user?.username || "Terapeuta"}
          sessions={sessions}
          onSaved={loadData}
          isEdit={false}
        />
      )}

      {historyPatient && (
        <ClinicalHistoryModal
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          patient={historyPatient}
          sessions={sessions}
        />
      )}

      <AddPatientModal
        open={addPatientOpen}
        onOpenChange={setAddPatientOpen}
        onAdd={handleAddPatientSubmit}
      />

      <SessionFormModal
        open={sessionOpen}
        onOpenChange={(open) => { setSessionOpen(open); if (!open) setSessionPatient(null); }}
        session={null}
        prefilledTherapistId={user?.id}
        prefilledPatientId={sessionPatient?.patient.userId}
        onSave={handleSaveSession}
      />
    </DashboardLayout>
  );
};

export default TherapistPatients;
