import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUsersApi } from "@/connections/api/users";
import { getTranslatedErrorMessage } from "@/lib/errorHandler";
import type { Session, SessionStatus, SessionFormData, User } from "@/types";
import { CalendarPlus, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface SessionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
  prefilledTherapistId?: string;
  prefilledPatientId?: string;
  onSave: (formData: SessionFormData) => void;
}

const emptyForm: SessionFormData = {
  therapistId: "",
  patientId: "",
  startTime: new Date(),
  endTime: new Date(),
  meetingLink: "",
  status: "SCHEDULED",
  isVirtual: false,
};

export const SessionFormModal = ({ open, onOpenChange, session, prefilledTherapistId, prefilledPatientId, onSave }: SessionFormModalProps) => {
  const isEdit = !!session;
  const { getUsers } = useUsersApi();
  const { user } = useAuth();
  
  const [form, setForm] = useState<SessionFormData>(emptyForm);
  const [therapists, setTherapists] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Cargar usuarios al abrir el modal
  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  // Cargar datos de la sesión si estamos editando
  useEffect(() => {
    if (session) {
      setForm({
        therapistId: session.therapist?.userId || session.therapistId,
        patientId: session.patient?.userId || session.patientId,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        meetingLink: session.meetingLink || "",
        status: session.status,
        isVirtual: session.isVirtual,
      });
    } else {
      setForm({
        ...emptyForm,
        therapistId: prefilledTherapistId || "",
        patientId: prefilledPatientId || "",
      });
    }
  }, [session, open]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const users = await getUsers();
      const allTherapists = users.filter((u: User) => u.role === "THERAPIST");
      
      // Si el que abrió el modal es un terapeuta, solo cargarlo a él como opción
      if (user?.role === "THERAPIST") {
        setTherapists(allTherapists.filter((u: User) => u.id === user.id));
      } else {
        setTherapists(allTherapists);
      }
      
      setPatients(users.filter((u: User) => u.role === "PATIENT"));
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al cargar usuarios"));
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSave = () => {
    // Validaciones
    if (!form.therapistId || !form.patientId) {
      toast.error("Debes seleccionar un terapeuta y un paciente");
      return;
    }
    if (!form.startTime || !form.endTime) {
      toast.error("Debes especificar fecha y hora de inicio y fin");
      return;
    }
    if (!form.meetingLink || form.meetingLink.trim() === "") {
      toast.error("Debes proporcionar un enlace de reunión");
      return;
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (form.endTime <= form.startTime) {
      toast.error("La hora de fin debe ser posterior a la hora de inicio");
      return;
    }

    onSave(form);
  };

  // Helper para convertir Date a datetime-local input format
  const toDateTimeLocal = (date: Date) => {
    if (!date) return "";
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  // Helper para convertir datetime-local a Date
  const fromDateTimeLocal = (dateTimeLocal: string) => {
    if (!dateTimeLocal) return new Date();
    return new Date(dateTimeLocal);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isEdit ? <Pencil size={18} className="text-accent" /> : <CalendarPlus size={18} className="text-accent" />}
            <DialogTitle>{isEdit ? "Editar Sesión" : "Nueva Sesión"}</DialogTitle>
          </div>
          <DialogDescription>
            {isEdit ? "Modifica los datos de la sesión." : "Completa los datos para programar una nueva sesión."}
          </DialogDescription>
        </DialogHeader>

        {loadingUsers ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="therapistId">Terapeuta</Label>
                <Select 
                  value={form.therapistId} 
                  onValueChange={(v) => setForm({ ...form, therapistId: v })}
                  disabled={user?.role === "THERAPIST"}
                >
                  <SelectTrigger id="therapistId">
                    <SelectValue placeholder="Seleccionar terapeuta" />
                  </SelectTrigger>
                  <SelectContent>
                    {therapists.map((therapist) => (
                      <SelectItem key={therapist.id} value={therapist.id}>
                        {therapist.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="patientId">Paciente</Label>
                <Select value={form.patientId} onValueChange={(v) => setForm({ ...form, patientId: v })}>
                  <SelectTrigger id="patientId">
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startTime">Fecha y hora de inicio</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={toDateTimeLocal(form.startTime)}
                  onChange={(e) => setForm({ ...form, startTime: fromDateTimeLocal(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endTime">Fecha y hora de fin</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={toDateTimeLocal(form.endTime)}
                  onChange={(e) => setForm({ ...form, endTime: fromDateTimeLocal(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="meetingLink">Enlace de reunión</Label>
              <Input
                id="meetingLink"
                placeholder="https://meet.google.com/..."
                value={form.meetingLink}
                onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="isVirtual">¿Es sesión virtual?</Label>
              <Select value={form.isVirtual ? "true" : "false"} onValueChange={(v) => setForm({ ...form, isVirtual: v === "true" })}>
                <SelectTrigger id="isVirtual">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as SessionStatus })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Programada</SelectItem>
                  <SelectItem value="COMPLETED">Completada</SelectItem>
                  <SelectItem value="CANCELED">Cancelada</SelectItem>
                  <SelectItem value="ABSENT">Ausente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loadingUsers}>
            {isEdit ? "Guardar cambios" : "Crear sesión"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
