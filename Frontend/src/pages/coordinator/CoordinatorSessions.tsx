import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp } from "@/components/animations/PageTransition";
import { SessionCard } from "@/components/shared/SessionCard";
import { MiniCalendar } from "@/components/shared/MiniCalendar";
import { SessionFormModal } from "@/components/coordinator/SessionFormModal";
import { DeleteConfirmModal } from "@/components/coordinator/DeleteConfirmModal";
import { useSessionsApi } from "@/connections/api/sessions";
import { getTranslatedErrorMessage } from "@/lib/errorHandler";
import { logSessionCreated, logSessionUpdated, logSessionDeleted } from "@/lib/activityLogger";
import { Filter, TrendingUp, CalendarCheck, Plus, Pencil, Trash2, MoreVertical, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Session, SessionFormData } from "@/types";
import { toast } from "sonner";

const CoordinatorSessions = () => {
  const { getSessions, createSession, updateSession, deleteSession } = useSessionsApi();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getLocalDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  // Calendar date filter
  const todayStr = getLocalDate(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Cargar sesiones al montar el componente
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al cargar las sesiones"));
    } finally {
      setLoading(false);
    }
  };

  // Extraer fechas únicas de las sesiones para el calendario
  const sessionDates = [...new Set(sessions.map((s) => {
    return getLocalDate(new Date(s.startTime));
  }))];

  const filtered = sessions.filter((s) => {
    const sessionDate = getLocalDate(new Date(s.startTime));
    
    // Filter by selected calendar date
    if (selectedDate && sessionDate !== selectedDate) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const handleDateSelect = (date: string) => {
    // Toggle: clicking same date shows all
    setSelectedDate(date === selectedDate ? "" : date);
  };

  const handleSave = async (formData: SessionFormData) => {
    try {
      if (editingSession) {
        const updated = await updateSession(editingSession.id, formData);
        setSessions((prev) => prev.map((s) => (s.id === editingSession.id ? updated : s)));
        
        // Registrar actividad
        const patientName = updated.patient?.user?.username || "Paciente";
        logSessionUpdated(patientName);
        
        toast.success("Sesión actualizada correctamente");
      } else {
        const created = await createSession(formData);
        setSessions((prev) => [...prev, created]);
        
        // Registrar actividad
        const patientName = created.patient?.user?.username || "Paciente";
        const therapistName = created.therapist?.user?.username || "Terapeuta";
        logSessionCreated(patientName, therapistName);
        
        toast.success("Sesión creada correctamente");
      }
      setEditingSession(null);
      setFormOpen(false);
    } catch (error) {
      const defaultMsg = editingSession ? "Error al actualizar la sesión" : "Error al crear la sesión";
      toast.error(getTranslatedErrorMessage(error, defaultMsg));
    }
  };

  const handleDelete = async () => {
    if (deletingId) {
      try {
        // Obtener la sesión antes de eliminarla para el log
        const sessionToDelete = sessions.find(s => s.id === deletingId);
        
        await deleteSession(deletingId);
        setSessions((prev) => prev.filter((s) => s.id !== deletingId));
        
        // Registrar actividad
        if (sessionToDelete) {
          const patientName = sessionToDelete.patient?.user?.username || "Paciente";
          logSessionDeleted(patientName);
        }
        
        toast.success("Sesión eliminada correctamente");
        setDeletingId(null);
        setDeleteOpen(false);
      } catch (error) {
        toast.error(getTranslatedErrorMessage(error, "Error al eliminar la sesión"));
      }
    }
  };

  const openEdit = (session: Session) => {
    setEditingSession(session);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingSession(null);
    setFormOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const completedCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const cancelledCount = sessions.filter((s) => s.status === "CANCELED").length;
  const scheduledCount = sessions.filter((s) => s.status === "SCHEDULED").length;

  return (
    <DashboardLayout
      role="COORDINATOR"
      userName="Dr. Julián Rivas"
      userRole="Coordinador de Terapia"
    >
      <PageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={fadeInUp} className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestión de Sesiones</h1>
              <p className="text-muted-foreground text-sm">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
              >
                <Plus size={16} /> Nueva Sesión
              </button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filtros:</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="SCHEDULED">Programadas</SelectItem>
                <SelectItem value="COMPLETED">Completadas</SelectItem>
                <SelectItem value="CANCELED">Canceladas</SelectItem>
                <SelectItem value="ABSENT">Ausentes</SelectItem>
              </SelectContent>
            </Select>
            {(statusFilter !== "all" || selectedDate !== todayStr) && (
              <button
                onClick={() => { setStatusFilter("all"); setSelectedDate(todayStr); }}
                className="text-xs text-accent hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-semibold">Sesiones</h2>
                  <span className="status-active text-xs">{filtered.length} resultados</span>
                </motion.div>

                <motion.div variants={staggerContainer} className="space-y-3">
                  {filtered.map((session) => (
                    <div key={session.id} className="relative group">
                      <SessionCard session={session} variant="coordinator" />
                      {/* Action overlay */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors">
                              <MoreVertical size={14} className="text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => openEdit(session)} className="gap-2 cursor-pointer">
                              <Pencil size={14} /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => confirmDelete(session.id)} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                              <Trash2 size={14} /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      No se encontraron sesiones con los filtros aplicados.
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="space-y-4">
                <MiniCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  highlightedDates={sessionDates}
                />

                <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-accent/[0.04]" />
                  <CalendarCheck size={32} className="absolute bottom-3 right-3 text-accent/[0.06]" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Resumen General</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Programadas", count: scheduledCount, color: "bg-accent" },
                      { label: "Completadas", count: completedCount, color: "bg-status-completed" },
                      { label: "Canceladas", count: cancelledCount, color: "bg-status-cancelled" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-muted-foreground">{item.label}:</span>
                        <span className="font-semibold text-foreground">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="brand-card-dark relative overflow-hidden">
                  <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/[0.04]" />
                  <div className="absolute top-4 right-4 opacity-[0.08]">
                    <TrendingUp size={36} />
                  </div>
                  <TrendingUp size={24} className="mb-3 opacity-80" />
                  <h3 className="font-bold text-lg mb-2">Eficiencia de Agenda</h3>
                  <p className="text-sm opacity-70 mb-4">
                    Gestiona y coordina todas las sesiones de terapia de manera eficiente.
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </PageTransition>

      <SessionFormModal open={formOpen} onOpenChange={setFormOpen} session={editingSession} onSave={handleSave} />
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar sesión"
        description="¿Estás seguro de que deseas eliminar esta sesión? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        userId={deletingId}
      />
    </DashboardLayout>
  );
};

export default CoordinatorSessions;
