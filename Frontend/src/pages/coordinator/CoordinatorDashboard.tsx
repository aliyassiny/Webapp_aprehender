import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp } from "@/components/animations/PageTransition";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Zap, UserPlus, CheckCircle, AlertTriangle, ShieldCheck, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { getActivities, refreshActivityTimes } from "@/lib/activityLogger";
import { useUsersApi } from "@/connections/api/users";
import { useSessionsApi } from "@/connections/api/sessions";
import type { User, Session } from "@/types";
import { Link } from "react-router-dom";

const tagColors: Record<string, string> = {
  green: "bg-status-active/10 text-status-active",
  red: "bg-status-cancelled/10 text-status-cancelled",
  orange: "bg-status-pending/10 text-status-pending",
  blue: "bg-accent/10 text-accent",
};

const activityIcons: Record<string, React.ReactNode> = {
  "user-plus": <UserPlus size={18} className="text-accent" />,
  "check-circle": <CheckCircle size={18} className="text-status-completed" />,
  "alert-triangle": <AlertTriangle size={18} className="text-status-cancelled" />,
  "shield-check": <ShieldCheck size={18} className="text-accent" />,
};

const CoordinatorDashboard = () => {
  const { getUsers } = useUsersApi();
  const { getSessions } = useSessionsApi();
  
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activities, setActivities] = useState(getActivities());
  const [loading, setLoading] = useState(true);

  // Cargar datos al montar
  useEffect(() => {
    loadDashboardData();
    
    // Actualizar tiempos relativos cada minuto
    const interval = setInterval(() => {
      setActivities(refreshActivityTimes());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [usersData, sessionsData] = await Promise.all([
        getUsers(),
        getSessions(),
      ]);
      setUsers(usersData);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const totalUsers = users.length;
  const therapistsCount = users.filter(u => u.role === "THERAPIST").length;
  const patientsCount = users.filter(u => u.role === "PATIENT").length;
  
  // Sesiones de hoy
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
    return sessionDate === today;
  });
  
  const activeSessions = todaySessions.filter(s => s.status === "SCHEDULED").length;

  // Últimas 6 sesiones para avatares
  const recentSessionUsers = sessions
    .slice(0, 6)
    .map(s => {
      const username = s.patient?.user?.username || "";
      if (!username) return "";
      return username.split(" ").map(n => n[0]).join("").slice(0, 2);
    })
    .filter(Boolean);

  console.log(sessions)

  // Datos para el gráfico de tendencias (últimos 6 meses)
  const getMonthlyTrend = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
      const monthSessions = sessions.filter(s => {
        const sessionDate = new Date(s.startTime);
        return sessionDate.getMonth() === date.getMonth() && 
               sessionDate.getFullYear() === date.getFullYear();
      }).length;
      
      months.push({ name: monthName, count: monthSessions });
    }
    
    return months;
  };

  const monthlyTrend = getMonthlyTrend();
  const maxSessions = Math.max(...monthlyTrend.map(m => m.count), 1);

  return (
    <DashboardLayout
      role="COORDINATOR"
      userName="Elena Vance"
      userRole="Coordinadora"
    >
      <PageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {/* Stats row */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Users */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-accent/[0.04]" />
              <Users size={48} className="absolute top-3 right-3 text-accent/[0.06]" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users size={20} className="text-accent" />
                </div>
                {loading ? (
                  <div className="h-5 w-12 bg-muted animate-pulse rounded" />
                ) : (
                  <span className="status-active text-xs">Activo</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Usuarios totales</p>
              {loading ? (
                <div className="h-9 w-20 bg-muted animate-pulse rounded mt-1" />
              ) : (
                <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
              )}
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                {loading ? (
                  <>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </>
                ) : (
                  <>
                    <span>● {therapistsCount} Terapeutas</span>
                    <span>● {patientsCount} Pacientes</span>
                  </>
                )}
              </div>
            </div>

            {/* Sessions */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm relative overflow-hidden">
              <Activity size={48} className="absolute top-3 right-3 text-status-active/[0.06]" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-status-active/10 flex items-center justify-center">
                  <Zap size={20} className="text-status-active" />
                </div>
                {!loading && activeSessions > 0 && (
                  <span className="status-active text-xs">En vivo ahora</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Sesiones programadas hoy</p>
              {loading ? (
                <div className="h-9 w-16 bg-muted animate-pulse rounded mt-1" />
              ) : (
                <p className="text-3xl font-bold text-foreground">{todaySessions.length}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {loading ? (
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                ) : recentSessionUsers.length > 0 ? (
                  <>
                    <div className="flex -space-x-1">
                      {recentSessionUsers.slice(0, 3).map((initials, i) => (
                        <Avatar key={i} className="w-6 h-6 border-2 border-card">
                          <AvatarFallback className="bg-muted text-[8px]">{initials}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activeSessions} activas
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">No hay sesiones hoy</span>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm relative overflow-hidden">
              <BarChart3 size={48} className="absolute top-3 right-3 text-accent/[0.06]" />
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Tendencias mensuales</p>
                <span className="text-xs text-accent font-medium">Últimos 6 meses</span>
              </div>
              {loading ? (
                <div className="h-16 bg-muted animate-pulse rounded mt-4" />
              ) : (
                <>
                  <div className="flex items-end gap-3 h-16 mt-4">
                    {monthlyTrend.map((month, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-accent/15 rounded-sm transition-all hover:bg-accent/25" 
                        style={{ height: `${(month.count / maxSessions) * 100}%` }}
                        title={`${month.name}: ${month.count} sesiones`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    {monthlyTrend.map((month, i) => (
                      <span key={i}>{month.name}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity */}
            <motion.div variants={fadeInUp} className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Actividad reciente</h2>
                  <p className="text-sm text-muted-foreground">Actualizaciones en tiempo real en la plataforma</p>
                </div>
              </div>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No hay actividades recientes. Las acciones que realices aparecerán aquí.
                  </div>
                ) : (
                  activities.slice(0, 8).map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        {activityIcons[item.icon]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                        <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColors[item.tagColor]}`}>
                          {item.tag}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Right column */}
            <div className="space-y-4">
              <motion.div variants={fadeInUp} className="brand-card-dark relative overflow-hidden">
                <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/[0.04]" />
                <div className="absolute top-4 right-4 opacity-[0.08]">
                  <Users size={40} />
                </div>
                <p className="text-[10px] uppercase tracking-widest opacity-60 font-semibold mb-1">Foco de hoy</p>
                <h3 className="text-lg font-bold mb-2">Gestión del Directorio</h3>
                <p className="text-sm opacity-70 mb-4">
                  Revisa y gestiona la lista de terapeutas y pacientes activos en el sistema.
                </p>
                <Link
                  to="/coordinador/directorio"
                  className="w-full py-2.5 border border-primary-foreground/30 rounded-lg text-sm font-medium hover:bg-primary-foreground/10 transition-colors flex items-center justify-center"
                >
                  Ir al Directorio
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Acciones rápidas</h3>
                <div className="space-y-3">
                  <Link
                    to="/coordinador/sesiones"
                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <Zap size={18} className="text-accent" />
                    </div>
                    Gestionar sesiones
                  </Link>
                  <Link
                    to="/coordinador/directorio"
                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <UserPlus size={18} className="text-accent" />
                    </div>
                    Agregar usuario
                  </Link>
                  <Link
                    to="/coordinador/reportes"
                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <TrendingUp size={18} className="text-accent" />
                    </div>
                    Ver reportes
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default CoordinatorDashboard;
