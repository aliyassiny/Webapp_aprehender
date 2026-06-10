import { Session, Patient, ActivityItem, User } from "@/types";

// Helper: today's date string
const now = new Date();
const toDateStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayStr = toDateStr(now);
const yesterday = toDateStr(new Date(now.getTime() - 86400000));
const tomorrow = toDateStr(new Date(now.getTime() + 86400000));
const in2Days = toDateStr(new Date(now.getTime() + 2 * 86400000));
const in3Days = toDateStr(new Date(now.getTime() + 3 * 86400000));

export const therapistSessions: Session[] = [
  // Hoy
  { id: "1", patientName: "Elena Rodríguez", status: "completed", modality: "presencial", date: todayStr, startTime: "09:00", endTime: "10:00", sessionNumber: 4, therapyType: "TCC" },
  { id: "2", patientName: "Julián Castro", status: "scheduled", modality: "telemedicina", date: todayStr, startTime: "10:30", endTime: "11:30", zoomLink: "zoom.us/j/8823..." },
  { id: "3", patientName: "Sofía Méndez", status: "scheduled", modality: "presencial", date: todayStr, startTime: "15:00", endTime: "16:00", focus: "Ansiedad Generalizada" },
  { id: "4", patientName: "Marcos Valdés", status: "cancelled", modality: "telemedicina", date: todayStr, startTime: "17:30", endTime: "18:30" },
  // Ayer
  { id: "5", patientName: "Ana Beltrán", status: "completed", modality: "presencial", date: yesterday, startTime: "08:00", endTime: "09:00", therapyType: "Psicoanálisis" },
  { id: "6", patientName: "Carlos Fuentes", status: "completed", modality: "telemedicina", date: yesterday, startTime: "11:00", endTime: "12:00" },
  // Mañana
  { id: "7", patientName: "Lucía Herrera", status: "scheduled", modality: "presencial", date: tomorrow, startTime: "09:00", endTime: "10:00", focus: "Depresión" },
  { id: "8", patientName: "Pedro Ramírez", status: "pending", modality: "telemedicina", date: tomorrow, startTime: "14:00", endTime: "15:00" },
  // En 2 días
  { id: "9", patientName: "Gabriela Torres", status: "scheduled", modality: "presencial", date: in2Days, startTime: "10:00", endTime: "11:00", therapyType: "TCC" },
];

export const coordinatorSessions: Session[] = [
  // Hoy
  { id: "c1", patientName: "Marcos Valenzuela", therapistName: "Dra. Elena Sotelo", status: "scheduled", modality: "presencial", date: todayStr, startTime: "09:00", endTime: "10:00" },
  { id: "c2", patientName: "Sofía Méndez", therapistName: "Dr. Ricardo Paz", status: "completed", modality: "presencial", date: todayStr, startTime: "08:00", endTime: "09:00" },
  { id: "c3", patientName: "Javier Duarte", therapistName: "Psic. Laura Bernal", status: "cancelled", modality: "telemedicina", date: todayStr, startTime: "10:30", endTime: "11:30" },
  { id: "c4", patientName: "Beatriz Moreno", therapistName: "Dra. Elena Sotelo", status: "scheduled", modality: "presencial", date: todayStr, startTime: "11:00", endTime: "12:00" },
  // Ayer
  { id: "c5", patientName: "Roberto Salinas", therapistName: "Dr. Ricardo Paz", status: "completed", modality: "telemedicina", date: yesterday, startTime: "09:00", endTime: "10:00" },
  { id: "c6", patientName: "Daniela Ortiz", therapistName: "Psic. Laura Bernal", status: "completed", modality: "presencial", date: yesterday, startTime: "14:00", endTime: "15:00" },
  // Mañana
  { id: "c7", patientName: "Fernando López", therapistName: "Dra. Elena Sotelo", status: "scheduled", modality: "telemedicina", date: tomorrow, startTime: "08:30", endTime: "09:30" },
  { id: "c8", patientName: "Isabel Navarro", therapistName: "Dr. Ricardo Paz", status: "pending", modality: "presencial", date: tomorrow, startTime: "11:00", endTime: "12:00" },
  { id: "c9", patientName: "Andrés Quiroga", therapistName: "Psic. Laura Bernal", status: "scheduled", modality: "presencial", date: tomorrow, startTime: "16:00", endTime: "17:00" },
  // En 2 días
  { id: "c10", patientName: "Carmen Reyes", therapistName: "Dra. Elena Sotelo", status: "scheduled", modality: "telemedicina", date: in2Days, startTime: "10:00", endTime: "11:00" },
  // En 3 días
  { id: "c11", patientName: "Luis Paredes", therapistName: "Dr. Ricardo Paz", status: "scheduled", modality: "presencial", date: in3Days, startTime: "09:00", endTime: "10:00" },
];

export const patients: Patient[] = [
  {
    id: "1",
    name: "Elena Rodríguez",
    therapyType: "Terapia Cognitiva",
    nextSession: "24 Oct, 10:30 AM",
    lastSession: "12 Oct, 2023",
    focus: "Ansiedad Social",
    status: "active",
  },
  {
    id: "2",
    name: "Marco Aurelio",
    therapyType: "Psicoanálisis",
    nextSession: "Hoy, 4:00 PM",
    lastSession: "05 Oct, 2023",
    focus: "Depresión Leve",
    status: "active",
  },
  {
    id: "3",
    name: "Lucía Méndez",
    therapyType: "Terapia de Grupo",
    nextSession: "26 Oct, 9:00 AM",
    lastSession: "19 Oct, 2023",
    focus: "Duelo",
    status: "active",
  },
  {
    id: "4",
    name: "Javier Santos",
    therapyType: "Terapia Conductual",
    nextSession: "30 Oct, 11:15 AM",
    lastSession: "20 Oct, 2023",
    focus: "Estrés Laboral",
    status: "active",
  },
];

export const directoryUsers: User[] = [
  {
    id: "u1",
    name: "Dr. Aris Thorne",
    email: "aris.thorne@canvasclinic.com",
    role: "therapist",
    title: "Terapeuta",
    status: "active",
  },
  {
    id: "u2",
    name: "Elena Vance",
    email: "e.vance@gmail.com",
    role: "patient",
    title: "Paciente",
    status: "active",
  },
  {
    id: "u3",
    name: "Marcus Holloway",
    email: "m.holloway@outlook.com",
    role: "patient",
    title: "Paciente",
    status: "suspended",
  },
  {
    id: "u4",
    name: "Jordan Smith",
    email: "jordan.smith@canvasclinic.com",
    role: "coordinator",
    title: "Admin",
    status: "active",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "a1",
    icon: "user-plus",
    title: "Registro de nuevo paciente",
    description: "Julianne Moore se unió como paciente bajo el Dr. Aris",
    time: "Hace 2 min",
    tag: "Sinc. pendiente",
    tagColor: "orange",
  },
  {
    id: "a2",
    icon: "check-circle",
    title: "Sesión completada",
    description: "Terapia Cognitiva - Sala 4B (Terapeuta: David Hall)",
    time: "Hace 14 min",
    tag: "Registrado",
    tagColor: "green",
  },
  {
    id: "a3",
    icon: "alert-triangle",
    title: "Sesión cancelada",
    description: "La paciente Sarah Connor canceló su sesión de las 3:00 PM",
    time: "Hace 1 hora",
    tag: "Alerta enviada",
    tagColor: "red",
  },
  {
    id: "a4",
    icon: "shield-check",
    title: "Terapeuta incorporado",
    description: "Credenciales del Dr. Marcus Aurelius verificadas y activo",
    time: "Hace 3 horas",
    tag: "Nuevo Pro",
    tagColor: "blue",
  },
];

export const todaySessions: Session[] = [
  {
    id: "ts1",
    patientName: "Julian Henderson",
    status: "in-progress",
    modality: "presencial",
    date: "2024-10-24",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
  },
  {
    id: "ts2",
    patientName: "Sarah Chen",
    status: "scheduled",
    modality: "telemedicina",
    date: "2024-10-24",
    startTime: "10:30 AM",
    endTime: "11:30 AM",
  },
  {
    id: "ts3",
    patientName: "Marcus Thorne",
    status: "pending",
    modality: "presencial",
    date: "2024-10-24",
    startTime: "01:00 PM",
    endTime: "02:00 PM",
  },
];
