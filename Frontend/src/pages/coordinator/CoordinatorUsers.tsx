import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp } from "@/components/animations/PageTransition";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserFormModal } from "@/components/coordinator/UserFormModal";
import { DeleteConfirmModal } from "@/components/coordinator/DeleteConfirmModal";
import { directoryUsers as initialUsers } from "@/data/mockData";
import { UserPlus, Search, SlidersHorizontal, Users, FileText, AlertTriangle, Pencil, Trash2, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/types/index";
import { toast } from "sonner";
import { useEffect } from "react";
import { useUsersApi } from "@/connections/api/users";

const roleBadge: Record<string, string> = {
  THERAPIST: "bg-[#59E5CA] text-accent",
  PATIENT: "bg-[#79ADE1] text-white",
  COORDINATOR: "bg-muted text-muted-foreground",
};

const roleLabel: Record<string, string> = {
  THERAPIST: "Terapeuta",
  PATIENT: "Paciente",
  COORDINATOR: "Coordinador",
};

const CoordinatorUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { getUsers } = useUsersApi();

  // Fetch users on component mount
  useEffect(() => {
    getUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.isActive !== (statusFilter === "active")) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.username?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleUserUpdated = async () => {
    // Refrescar la lista de usuarios desde la API
    try {
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error al refrescar usuarios:", error);
      toast.error("Error al actualizar la lista de usuarios");
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      setUsers((prev) => prev.filter((u) => u.id !== deletingId));
      toast.success("Usuario eliminado");
      setDeletingId(null);
      setDeleteOpen(false);
    }
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const activeCount = users.filter((u) => u.role === "THERAPIST" && u.isActive === true).length + users.filter((u) => u.role === "COORDINATOR" && u.isActive === true).length;
  const patientCount = users.filter((u) => u.role === "PATIENT").length;
  const pendingCount = users.filter((u) => u.isActive === false).length;

  const tabOptions = [
    { label: "Todos los usuarios", value: "all" },
    { label: "Terapeutas", value: "THERAPIST" },
    { label: "Pacientes", value: "PATIENT" },
  ];

  return (
    <DashboardLayout
      role="COORDINATOR"
      userName="Sarah Jenkins"
      userRole="Coordinadora"
    >
      <PageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {/* Breadcrumb */}
          <motion.div variants={fadeInUp} className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Directorio</span>
            <span>›</span>
            <span className="text-accent font-medium">Gestión de Usuarios</span>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
              <p className="text-muted-foreground text-sm">Gestionar terapeutas, pacientes y personal clínico en tu espacio de trabajo.</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
            >
              <UserPlus size={16} /> Añadir nuevo usuario
            </button>
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-6">
            <div className="flex bg-secondary rounded-lg p-1">
              {tabOptions.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setRoleFilter(tab.value)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    roleFilter === tab.value ? "bg-card shadow-sm text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Buscar por nombre, correo o rol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
              <SelectTrigger className={`w-[180px] ${statusFilter !== "all" ? "border-accent text-accent bg-accent/5" : ""}`}>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Table */}
          <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm h-[500px] overflow-y-auto">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-secondary/50 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <div className="col-span-4">Usuario</div>
              <div className="col-span-3">Rol</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-1">Acciones</div>
            </div>

            {filtered.map((user) => {
              const initials = user.username?.split(" ").map(n => n[0]).join("").slice(0, 2) || "";
              return (
                <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-border items-center hover:bg-secondary/30 transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <span className={`status-badge text-xs ${roleBadge[user.role]}`}>{roleLabel[user.role]}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${user.isActive ? "text-status-active" : "text-status-pending"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-status-active" : "bg-status-pending"}`} />
                      {user.isActive ? "Activo" : "Suspendido"}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                          <MoreVertical size={14} className="text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => openEdit(user)} className="gap-2 cursor-pointer">
                          <Pencil size={14} /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => confirmDelete(user.id)} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                          <Trash2 size={14} /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm border-t border-border">
                No se encontraron usuarios con los filtros aplicados.
              </div>
            )}

            <div className="px-6 py-3 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Mostrando <span className="font-semibold text-foreground">{filtered.length}</span> de <span className="font-semibold text-foreground">{users.length}</span> usuarios</p>
            </div>
          </motion.div>

          {/* Bottom stats */}
          <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 mt-6">
            {[
              { icon: <Users size={20} className="text-accent" />, value: String(activeCount), label: "Clínicos Activos", bg: "bg-accent/10" },
              { icon: <FileText size={20} className="text-accent" />, value: String(patientCount), label: "Total de Pacientes", bg: "bg-accent/10" },
              { icon: <AlertTriangle size={20} className="text-status-pending" />, value: String(pendingCount), label: "Revisiones Pendientes", bg: "bg-status-pending/10" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center gap-4 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full bg-accent/[0.04]" />
                <div className={`w-11 h-11 rounded-lg ${stat.bg} flex items-center justify-center`}>{stat.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </PageTransition>

      <UserFormModal open={formOpen} onOpenChange={setFormOpen} user={editingUser} onUserUpdated={handleUserUpdated} />
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar usuario"
        description="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        userId={deletingId || ""}
      />
    </DashboardLayout>
  );
};

export default CoordinatorUsers;
