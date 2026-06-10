import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, FileText, CalendarCheck, Loader2 } from "lucide-react";
import { useClinicalNotesApi } from "@/connections/api/clinicalNotes";
import { getTranslatedErrorMessage } from "@/lib/errorHandler";
import { toast } from "sonner";
import type { PatientTherapist, Session, ClinicalNote } from "@/types";

interface NoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientTherapist;
  therapistId: string;
  therapistName: string;
  sessions: Session[];
  onSaved?: () => void;
  isEdit?: boolean;
  noteToEdit?: ClinicalNote;
}

export const NoteFormModal = ({
  open,
  onOpenChange,
  patient,
  therapistId,
  therapistName,
  sessions,
  onSaved,
  isEdit,
  noteToEdit,
}: NoteFormModalProps) => {
  const { createNote, updateNote } = useClinicalNotesApi();
  const [content, setContent] = useState("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const patientName = patient.patient?.user?.username || "Paciente";
  const initials = patientName.substring(0, 2).toUpperCase();

  useEffect(() => {
    if (open) {
      if (isEdit && noteToEdit) {
        setContent(noteToEdit.content || "");
        setSelectedSession(noteToEdit.sessionId || "none");
      } else {
        setContent("");
        setSelectedSession("");
      }
    }
  }, [open, isEdit, noteToEdit]);

  // Filter sessions that belong to this patient
  const patientSessions = sessions.filter(
    (s) => s.patientId === patient.patient?.id && s.status === "COMPLETED"
  );

  const handleSave = async () => {
    if (!content.trim()) return;
    try {
      setSaving(true);
      if (isEdit && noteToEdit) {
        await updateNote(noteToEdit.id, {
          patientId: noteToEdit.patientId,
          therapistId,
          sessionId: selectedSession === "none" ? undefined : selectedSession || undefined,
          content: content.trim(),
        });
        toast.success("Nota evolutiva actualizada correctamente");
      } else {
        await createNote({
          patientId: patient.patient.id,
          therapistId,
          sessionId: selectedSession === "none" ? undefined : selectedSession || undefined,
          content: content.trim(),
        });
        toast.success("Nota evolutiva guardada correctamente");
      }
      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, isEdit ? "Error al actualizar la nota" : "Error al guardar la nota"));
    } finally {
      setSaving(false);
    }
  };

  const formatSessionLabel = (session: Session) => {
    const date = new Date(session.startTime);
    return date.toLocaleString("es-ES", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={18} className="text-accent" />
            {isEdit ? "Editar Nota Evolutiva" : "Nueva Nota Evolutiva"}
          </DialogTitle>
        </DialogHeader>

        {/* Identification header */}
        <div className="bg-secondary/50 rounded-lg p-4 space-y-3 border border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-accent/10 text-accent font-semibold text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paciente</p>
              <p className="font-semibold text-foreground">{patientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Terapeuta</p>
              <p className="font-semibold text-foreground">{therapistName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-completed/10 flex items-center justify-center">
              <CalendarCheck size={16} className="text-status-completed" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Sesión Asociada</p>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccionar sesión (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin sesión asociada</SelectItem>
                  {patientSessions.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {formatSessionLabel(s)}
                    </SelectItem>
                  ))}
                  {patientSessions.length === 0 && (
                    <SelectItem value="empty" disabled>Sin sesiones completadas</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Contenido de la nota</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe las observaciones clínicas, avances, intervenciones realizadas..."
            className="min-h-[160px] resize-none"
          />
        </div>

        <DialogFooter>
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim() || saving}
            className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Guardar Nota
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
