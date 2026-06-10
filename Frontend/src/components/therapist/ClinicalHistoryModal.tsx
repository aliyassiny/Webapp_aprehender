import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, CalendarCheck, Clock, Loader2, Trash2, Pencil } from "lucide-react";
import { useClinicalNotesApi } from "@/connections/api/clinicalNotes";
import { getTranslatedErrorMessage } from "@/lib/errorHandler";
import { toast } from "sonner";
import type { PatientTherapist, Session, ClinicalNote } from "@/types";
import { NoteFormModal } from "./NoteFormModal";

interface ClinicalHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientTherapist;
  sessions: Session[];
}

export const ClinicalHistoryModal = ({ open, onOpenChange, patient, sessions }: ClinicalHistoryModalProps) => {
  const { getNotesByPatient, deleteNote } = useClinicalNotesApi();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editNoteModalOpen, setEditNoteModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<ClinicalNote | null>(null);

  const patientName = patient.patient?.user?.username || "Paciente";
  const initials = patientName.substring(0, 2).toUpperCase();

  useEffect(() => {
    if (open && patient.patient?.id) {
      loadNotes();
    }
  }, [open, patient.patient?.id]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotesByPatient(patient.patient.id);
      setNotes(data);
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al cargar el historial"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      toast.success("Nota eliminada");
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al eliminar la nota"));
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={18} className="text-accent" />
            Historial Clínico
          </DialogTitle>
        </DialogHeader>

        {/* Patient info */}
        <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-4 border border-border">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-accent/10 text-accent font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{patientName}</h3>
            <p className="text-sm text-muted-foreground">{patient.patient?.user?.email || ""}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Total de notas</p>
            <p className="text-2xl font-bold text-accent">{notes.length}</p>
          </div>
        </div>

        <ScrollArea className="h-[380px] pr-3">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-7 h-7 animate-spin text-accent" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <FileText size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">Sin notas registradas</p>
              <p className="text-xs">Añade la primera nota evolutiva para este paciente.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="bg-card rounded-xl border border-border p-4 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-l-xl" />
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {note.session && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CalendarCheck size={10} />
                          {new Date(note.session.startTime).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-destructive"
                        title="Eliminar nota"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          setNoteToEdit(note);
                          setEditNoteModalOpen(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent/10 text-accent"
                        title="Editar nota"
                      >
                        <Pencil size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    — {note.therapist?.user?.username || "Terapeuta"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
      <NoteFormModal
        open={editNoteModalOpen}
        onOpenChange={setEditNoteModalOpen}
        patient={patient}
        therapistId={patient.therapistId}
        therapistName={""}
        sessions={sessions}
        onSaved={() => {
          loadNotes();
        }}
        isEdit={true}
        noteToEdit={noteToEdit}
      />
    </Dialog>
  );
};
