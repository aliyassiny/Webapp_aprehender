export interface PatientTherapist {
  id: string;
  name: string;
  specialty: string;
  description: string;
  nextSession?: string;
  status: "active" | "available";
  rating?: number;
  reviews?: number;
  isAssigned: boolean;
}

export interface PatientSession {
  id: string;
  therapistName: string;
  specialty: string;
  status: "scheduled" | "completed" | "cancelled";
  date: string;
  time: string;
  modality: "online" | "presencial";
  canJoin?: boolean;
}

export interface SessionHistoryItem {
  id: string;
  title: string;
  therapistName: string;
  date: string;
  status: "completed" | "cancelled";
}

export const assignedTherapists: PatientTherapist[] = [
  {
    id: "t1",
    name: "Dra. Elena Vance",
    specialty: "Psicóloga Clínica - TCC",
    description: "Especialista en ansiedad y gestión emocional. Su enfoque se centra en herramientas prácticas para el día a día.",
    nextSession: "Mañana, 10:00 AM",
    status: "active",
    isAssigned: true,
  },
  {
    id: "t2",
    name: "Dr. Julián Rivas",
    specialty: "Psiquiatra - Mindfulness",
    description: "Enfoque integral que combina medicina moderna con prácticas de atención plena para el estrés crónico.",
    status: "available",
    isAssigned: true,
  },
];

export const exploreTherapists: PatientTherapist[] = [
  { id: "e1", name: "Dra. Lucía Morel", specialty: "Terapia de Pareja", description: "", rating: 4.9, reviews: 120, status: "available", isAssigned: false },
  { id: "e2", name: "Marcos J. Ruiz", specialty: "Especialista en TDAH", description: "", rating: 4.8, reviews: 85, status: "available", isAssigned: false },
  { id: "e3", name: "Sara Costa", specialty: "Psicoanálisis", description: "", rating: 5.0, reviews: 54, status: "available", isAssigned: false },
  { id: "e4", name: "Dr. Mateo Valdés", specialty: "Trauma & PTSD", description: "", rating: 4.7, reviews: 210, status: "available", isAssigned: false },
];

export const patientUpcomingSessions: PatientSession[] = [
  {
    id: "ps1",
    therapistName: "Dra. Elena Vance",
    specialty: "Especialista en Ansiedad y TCC",
    status: "scheduled",
    date: "Mañana",
    time: "10:00 AM",
    modality: "online",
    canJoin: true,
  },
  {
    id: "ps2",
    therapistName: "Dr. Alejandro M.",
    specialty: "Terapia de Pareja y Relaciones",
    status: "completed",
    date: "15 May, 2024",
    time: "14:00",
    modality: "presencial",
  },
  {
    id: "ps3",
    therapistName: "Sesión no asignada",
    specialty: "Evaluación Inicial General",
    status: "cancelled",
    date: "12 May, 2024",
    time: "09:00",
    modality: "presencial",
  },
];

export const sessionHistory: SessionHistoryItem[] = [
  { id: "sh1", title: "Sesión Introductoria", therapistName: "Dra. Eleanor Vance", date: "5 Oct, 2023", status: "completed" },
  { id: "sh2", title: "Control de Bienestar", therapistName: "Equipo de Soporte Clínico", date: "28 Sep, 2023", status: "completed" },
  { id: "sh3", title: "Entrevista de Admisión Completa", therapistName: "Dra. Eleanor Vance", date: "21 Sep, 2023", status: "cancelled" },
];
