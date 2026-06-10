import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp } from "@/components/animations/PageTransition";
import { SessionCard } from "@/components/shared/SessionCard";
import { MiniCalendar } from "@/components/shared/MiniCalendar";
import { SessionFormModal } from "@/components/coordinator/SessionFormModal";
import { DeleteConfirmModal } from "@/components/coordinator/DeleteConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useSessionsApi } from "@/connections/api/sessions";
import { useTherapistsApi } from "@/connections/api/therapists";
import { getTranslatedErrorMessage } from "@/lib/errorHandler";
import { Filter, Lightbulb, CalendarCheck, Plus, Pencil, Trash2, MoreVertical, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Session, SessionFormData } from "@/types";
import { toast } from "sonner";

const TherapistSessions = () => {
  const { user } = useAuth();
  const { createSession, updateSession, deleteSession } = useSessionsApi();
  const { getTherapistSessions } = useTherapistsApi();

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

  useEffect(() => {
    if (user?.id) {
      loadSessions();
    }
  }, [user?.id]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getTherapistSessions(user.id);
      setSessions(data);
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al cargar las sesiones"));
    } finally {
      setLoading(false);
    }
  };

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
    setSelectedDate(date === selectedDate ? "" : date);
  };

  const handleSave = async (formData: SessionFormData) => {
    try {
      if (editingSession) {
        await updateSession(editingSession.id, formData);
        toast.success("Sesión actualizada correctamente");
      } else {
        await createSession(formData);
        toast.success("Sesión creada correctamente");
      }
      await loadSessions();
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
        await deleteSession(deletingId);
        toast.success("Sesión eliminada correctamente");
        await loadSessions();
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
      role="THERAPIST"
      userName={user?.username || "Terapeuta"}
      userRole="Psicólogo"
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
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
            >
              <Plus size={16} /> Agendar Sesión
            </button>
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
                      <SessionCard session={session} variant="therapist" />
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
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/[0.04]" />
                  <div className="absolute top-4 right-4 opacity-[0.08]">
                    <Lightbulb size={36} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Recordatorio Semanal</h3>
                  <p className="text-sm opacity-70 mb-4">
                    No olvides completar los reportes clínicos de la semana para asegurar el seguimiento adecuado de tus pacientes.
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </PageTransition>

      <SessionFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        session={editingSession}
        onSave={handleSave}
        prefilledTherapistId={user?.id}
      />
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar sesión"
        description="¿Estás seguro de que deseas eliminar esta sesión? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        userId= {deletingId}
      />
    </DashboardLayout>
  );
};

export default TherapistSessions;
