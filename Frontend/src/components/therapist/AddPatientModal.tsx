import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useUsersApi } from "@/connections/api/users";
import { toast } from "sonner";
import { User } from "@/types";

interface AddPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (userId: string) => Promise<void>;
}

export const AddPatientModal = ({ open, onOpenChange, onAdd }: AddPatientModalProps) => {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { getUsers } = useUsersApi();

  useEffect(() => {
    if (open) {
      loadPatients();
    }
  }, [open]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      // Filter explicit users with role PATIENT
      const patientUsers = data.filter((u: User) => u.role === "PATIENT");
      setPatients(patientUsers);
    } catch(err) {
      toast.error("Error al cargar la lista de pacientes");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (userId: string) => {
    setAddingId(userId);
    try {
      await onAdd(userId);
      onOpenChange(false);
    } finally {
      setAddingId(null);
    }
  };

  const filteredPatients = patients.filter(
    (p) => 
      (p.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir Paciente</DialogTitle>
          <DialogDescription>
            Busca y selecciona un usuario con rol de paciente para asignarlo a tu consulta.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-2 mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre o correo electrónico..."
            className="pl-9 h-10 bg-secondary/50 border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Cargando...</p>
          ) : filteredPatients.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No se encontraron pacientes disponibles.</p>
          ) : (
            filteredPatients.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                <div>
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <button
                  onClick={() => handleAdd(user.id)}
                  disabled={addingId === user.id}
                  className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {addingId === user.id ? "Añadiendo..." : "Añadir"}
                </button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
