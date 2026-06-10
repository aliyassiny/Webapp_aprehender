import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition, staggerContainer, fadeInUp } from "@/components/animations/PageTransition";
import { BarChart3, Download, History, Users, Shield, SlidersHorizontal, FileBarChart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useReportsApi } from "@/connections/api/reports";
import { useTherapistsApi } from "@/connections/api/therapists";
import { useUsersApi } from "@/connections/api/users";
import { toast } from "sonner";
import { getTranslatedErrorMessage } from "@/lib/errorHandler";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { downloadPDF } from "@/components/reports/ReportPDF";
import type { PatientTherapist, User } from "@/types";

const CoordinatorReports = () => {
  const { generateReport } = useReportsApi();
  const { getTherapistPatients } = useTherapistsApi();
  const { getUsers } = useUsersApi();
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [therapistId, setTherapistId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [therapists, setTherapists] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    loadTherapists();
  }, []);

  useEffect(() => {
    if (therapistId) {
      loadPatientsForTherapist(therapistId);
    } else {
      setPatients([]);
      setPatientId("");
    }
  }, [therapistId]);

  const loadTherapists = async () => {
    try {
      const users = await getUsers();
      const allTherapists = users.filter((u: User) => u.role === "THERAPIST");
      setTherapists(allTherapists);
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al cargar terapeutas"));
    }
  };

  const loadPatientsForTherapist = async (therapistId: string) => {
    try {
      const data = await getTherapistPatients(therapistId);
      const patientUsers = data.map((pt: PatientTherapist) => ({
        id: pt.patient.userId,
        username: pt.patient.user.username,
        email: pt.patient.user.email,
        role: "PATIENT" as const,
      }));
      setPatients(patientUsers);
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al cargar pacientes"));
    }
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor selecciona las fechas de inicio y fin");
      return;
    }

    setLoading(true);
    try {
      const data = await generateReport({
        startDate,
        endDate,
        therapistId: therapistId && therapistId !== "all" ? therapistId : undefined,
        patientId: patientId && patientId !== "all" ? patientId : undefined,
      });
      setReportData(data);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      toast.error(getTranslatedErrorMessage(error, "Error al generar el reporte"));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setTherapistId("");
    setPatientId("");
    setReportData(null);
  };

  const handleExportPDF = async () => {
    if (!reportData) {
      toast.error("Primero genera un reporte");
      return;
    }

    try {
      toast.info("Generando PDF...");
      const filename = `reporte-sesiones-${new Date().toISOString().split('T')[0]}.pdf`;
      await downloadPDF(reportData, filename);
      toast.success("PDF descargado exitosamente");
    } catch (error) {
      toast.error("Error al generar el PDF");
      console.error(error);
    }
  };

  return (
    <DashboardLayout
      role="COORDINATOR"
      userName="Dr. Julián Rivas"
      userRole="Coordinador de Terapia"
    >
      <PageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div variants={fadeInUp} className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">Informes y Análisis Administrativo</h1>
                <p className="text-muted-foreground max-w-lg">
                  Transforma la actividad clínica en decisiones estratégicas. Nuestra herramienta de análisis permite visualizar el rendimiento de tu centro con precisión editorial.
                </p>
              </motion.div>

              {/* Report config */}
              <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-muted-foreground" />
                    <h2 className="font-semibold text-foreground">Configuración de Reporte</h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Fecha de inicio */}
                  <div className="space-y-1.5">
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  {/* Fecha de fin */}
                  <div className="space-y-1.5">
                    <Label htmlFor="endDate">Fecha de Fin</Label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  {/* Terapeuta */}
                  <div className="space-y-1.5">
                    <Label htmlFor="therapistId">Terapeuta (Opcional)</Label>
                    <Select 
                      value={therapistId} 
                      onValueChange={(v) => setTherapistId(v)}
                    >
                      <SelectTrigger id="therapistId">
                        <SelectValue placeholder="Todos los terapeutas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los terapeutas</SelectItem>
                        {therapists.map((therapist) => (
                          <SelectItem key={therapist.id} value={therapist.id}>
                            {therapist.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Paciente */}
                  <div className="space-y-1.5">
                    <Label htmlFor="patientId">Paciente (Opcional)</Label>
                    <Select 
                      value={patientId} 
                      onValueChange={(v) => setPatientId(v)}
                      disabled={!therapistId || therapistId === "all"}
                    >
                      <SelectTrigger id="patientId">
                        <SelectValue placeholder={therapistId && therapistId !== "all" ? "Todos los pacientes" : "Selecciona un terapeuta"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los pacientes</SelectItem>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">Filtra tus datos para obtener una visión detallada del flujo terapéutico.</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleClear}
                      className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors font-medium"
                    >
                      Limpiar
                    </button>
                    <button 
                      onClick={handleGenerateReport}
                      disabled={loading}
                      className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      Generar Reporte
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Vista previa del reporte o Features */}
              {reportData ? (
                <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileBarChart size={20} className="text-accent" />
                    Vista Previa del Reporte
                  </h2>

                  {/* Resumen general */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-blue-600 font-semibold mb-1">Total Sesiones</p>
                      <p className="text-2xl font-bold text-blue-900">{reportData.summary.totalSessions}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs text-green-600 font-semibold mb-1">Completadas</p>
                      <p className="text-2xl font-bold text-green-900">{reportData.summary.completedSessions}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <p className="text-xs text-yellow-600 font-semibold mb-1">Programadas</p>
                      <p className="text-2xl font-bold text-yellow-900">{reportData.summary.scheduledSessions}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-xs text-red-600 font-semibold mb-1">Canceladas</p>
                      <p className="text-2xl font-bold text-red-900">{reportData.summary.canceledSessions}</p>
                    </div>
                  </div>

                  {/* Estadísticas de notas */}
                  <div className="bg-accent/5 rounded-lg p-4 border border-accent/20 mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Estadísticas de Notas Clínicas</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total de Notas</p>
                        <p className="text-lg font-bold text-foreground">{reportData.summary.totalNotes}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sesiones con Notas</p>
                        <p className="text-lg font-bold text-foreground">{reportData.summary.sessionsWithNotes}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Promedio por Sesión</p>
                        <p className="text-lg font-bold text-foreground">{reportData.summary.averageNotesPerSession}</p>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas por terapeuta */}
                  {reportData.therapistStats.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Estadísticas por Terapeuta</h3>
                      <div className="space-y-2">
                        {reportData.therapistStats.map((therapist: any) => (
                          <div key={therapist.id} className="bg-secondary/50 rounded-lg p-3 border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium text-foreground">{therapist.name}</p>
                                <p className="text-xs text-muted-foreground">{therapist.email}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-foreground">{therapist.totalSessions} sesiones</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-xs">
                              <div>
                                <p className="text-muted-foreground">Completadas</p>
                                <p className="font-semibold text-green-600">{therapist.completedSessions}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Programadas</p>
                                <p className="font-semibold text-yellow-600">{therapist.scheduledSessions}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Canceladas</p>
                                <p className="font-semibold text-red-600">{therapist.canceledSessions}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Notas</p>
                                <p className="font-semibold text-blue-600">{therapist.totalNotes}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Estadísticas por paciente */}
                  {reportData.patientStats.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">Estadísticas por Paciente</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {reportData.patientStats.map((patient: any) => (
                          <div key={patient.id} className="bg-secondary/50 rounded-lg p-3 border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium text-foreground">{patient.name}</p>
                                <p className="text-xs text-muted-foreground">{patient.email}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-foreground">{patient.totalSessions} sesiones</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-xs">
                              <div>
                                <p className="text-muted-foreground">Completadas</p>
                                <p className="font-semibold text-green-600">{patient.completedSessions}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Programadas</p>
                                <p className="font-semibold text-yellow-600">{patient.scheduledSessions}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Canceladas</p>
                                <p className="font-semibold text-red-600">{patient.canceledSessions}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Notas</p>
                                <p className="font-semibold text-blue-600">{patient.totalNotes}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div variants={fadeInUp} className="space-y-5">
                  {[
                    { icon: <Users size={22} className="text-status-cancelled" />, title: "Productividad del Terapeuta", desc: "Calcula automáticamente las horas de consulta efectivas y el ratio de cancelaciones por cada miembro de tu equipo." },
                    { icon: <Shield size={22} className="text-accent" />, title: "Privacidad y Seguridad", desc: "Todas las exportaciones cumplen con los estándares de protección de datos clínicos, anonimizando información sensible según el perfil del usuario." },
                  ].map((feature) => (
                    <div key={feature.title} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">{feature.icon}</div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Right */}
            <div className="space-y-4">
              <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BarChart3 size={22} className="text-accent" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Estado del Sistema</p>
                  <p className="font-bold text-foreground">Datos Actualizados</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="brand-card-dark relative overflow-hidden">
                <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/[0.04]" />
                <div className="absolute top-4 right-4 opacity-[0.08]">
                  <FileBarChart size={36} />
                </div>
                <Download size={24} className="mb-3 opacity-80" />
                <h3 className="text-lg font-bold mb-2">Exportación Directa</h3>
                <p className="text-sm opacity-70 mb-4">
                  Genera archivos PDF profesionales con los datos del reporte.
                </p>
                <button 
                  onClick={handleExportPDF}
                  disabled={!reportData}
                  className="w-full py-2.5 border border-primary-foreground/30 rounded-lg text-sm font-medium hover:bg-primary-foreground/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={14} /> Exportar a PDF
                </button>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-accent/5 rounded-xl border border-accent/20 p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-2">Consejo de gestión</p>
                <p className="text-sm text-foreground italic">
                  "Utiliza el filtro de rango trimestral para detectar patrones estacionales en las solicitudes de nuevas terapias."
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default CoordinatorReports;
