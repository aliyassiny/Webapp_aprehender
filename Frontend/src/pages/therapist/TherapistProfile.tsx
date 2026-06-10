import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp } from "@/components/animations/PageTransition";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useTherapistsApi } from "@/connections/api/therapists";
import { toast } from "sonner";
import { User, Mail, Loader2, Save, Stethoscope, BookOpen } from "lucide-react";

const TherapistProfile = () => {
  const { user } = useAuth();
  const { getTherapist, updateTherapist } = useTherapistsApi();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    specialization: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getTherapist(user.id);
      setProfile(data);
      setForm({ specialization: data.specialization || "" });
    } catch {
      toast.error("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await updateTherapist(user.id, form);
      setProfile(updated);
      toast.success("Perfil actualizado correctamente");
    } catch {
      toast.error("Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.username
    ? user.username.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "T";

  return (
    <DashboardLayout role="THERAPIST" userName={user?.username || ""} userRole="Psicólogo">
      <PageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={fadeInUp} className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
            <p className="text-muted-foreground text-sm">Gestiona tu información profesional</p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Avatar & info card */}
              <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col items-center text-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-accent/20 text-accent text-3xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{user?.username}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">Terapeuta</span>
                </div>
                <div className="w-full border-t border-border pt-4 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Stethoscope size={14} className="shrink-0" />
                    <span>{profile?.specialization || "Sin especificar"}</span>
                  </div>
                </div>
              </motion.div>

              {/* Edit form */}
              <motion.div variants={fadeInUp} className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <User size={18} className="text-accent" />
                  <h3 className="font-semibold text-foreground">Información Profesional</h3>
                </div>

                <div className="grid gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="username">Nombre de usuario</Label>
                      <Input id="username" value={user?.username || ""} disabled className="bg-secondary/40" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input id="email" value={user?.email || ""} disabled className="bg-secondary/40" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="specialization" className="flex items-center gap-1.5">
                      <BookOpen size={14} />
                      Especialización
                    </Label>
                    <Input
                      id="specialization"
                      placeholder="Ej: Psicología Clínica, Terapia Cognitivo-Conductual..."
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Esta información será visible para tus pacientes.</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Guardar cambios
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default TherapistProfile;
