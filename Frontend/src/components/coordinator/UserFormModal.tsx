import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { User, UserRole } from "@/types";
import { UserPlus, Pencil } from "lucide-react";
import { useUsersApi } from "@/connections/api/users";
import { toast } from "sonner";

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onUserUpdated: () => void; // Para refrescar la lista después de crear/actualizar
}

const emptyForm = {
  username: "",
  email: "",
  password: "",
  role: "PATIENT" as UserRole,
  isActive: true as boolean,
};

export const UserFormModal = ({ open, onOpenChange, user, onUserUpdated }: UserFormModalProps) => {
  const isEdit = !!user;
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const { postUser, updateUser } = useUsersApi();

  useEffect(() => {
    if (user) {
      const { id, ...rest } = user;
      setForm({ ...emptyForm, ...rest, password: "" });
    } else {
      setForm(emptyForm);
    }
  }, [user, open]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const userData = {
        id: user?.id || crypto.randomUUID(),
        username: form.username,
        email: form.email,
        password: form.password || (user?.password || ""),
        role: form.role,
        isActive: form.isActive,
      };

      if (isEdit && user?.id) {
        await updateUser(user.id, userData);
        toast.success("Usuario actualizado correctamente");
      } else {
        await postUser(userData);
        toast.success("Usuario creado correctamente");
      }

      onUserUpdated(); // Refrescar la lista
      onOpenChange(false);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      toast.error(isEdit ? "Error al actualizar usuario" : "Error al crear usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isEdit ? <Pencil size={18} className="text-accent" /> : <UserPlus size={18} className="text-accent" />}
            <DialogTitle>{isEdit ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          </div>
          <DialogDescription>
            {isEdit ? "Modifica la información del usuario." : "Completa los datos para registrar un nuevo usuario."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="userName">Nombre completo</Label>
            <Input id="userName" placeholder="Nombre y apellido" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="userEmail">Correo electrónico</Label>
            <Input id="userEmail" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="userPassword">{isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}</Label>
            <Input id="userPassword" type="password" placeholder={isEdit ? "Dejar vacío para mantener" : "Mínimo 6 caracteres"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Rol</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="THERAPIST">Terapeuta</SelectItem>
                  <SelectItem value="PATIENT">Paciente</SelectItem>
                  <SelectItem value="COORDINATOR">Coordinador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={form.isActive ? "active" : "inactive"} onValueChange={(v) => setForm({ ...form, isActive: v === "active" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!form.username || !form.email || (!isEdit && form.password.length < 6) || isLoading}>
            {isLoading ? (isEdit ? "Actualizando..." : "Creando...") : (isEdit ? "Guardar cambios" : "Crear usuario")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
