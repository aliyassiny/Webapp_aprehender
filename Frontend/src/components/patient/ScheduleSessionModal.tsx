import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar, Clock, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { PatientTherapist } from "@/types";

interface ScheduleSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  therapist: PatientTherapist | null;
}

export function ScheduleSessionModal({
  open,
  onOpenChange,
  therapist,
}: ScheduleSessionModalProps) {
  if (!therapist) return null;

  const therapistName = therapist.therapist.user.username;
  const initials = therapistName.substring(0, 2).toUpperCase();
  const contactPhone = "+57 300 123 4567"; // Número de contacto de la empresa
  const contactEmail = "contacto@mindbridge.com";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Sesión</DialogTitle>
          <DialogDescription>
            Información para coordinar tu próxima sesión
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del terapeuta */}
          <div className="bg-accent/5 rounded-lg p-4 border border-accent/10">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-accent/10 text-accent text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{therapistName}</p>
                <p className="text-xs text-muted-foreground">
                  {therapist.therapist.specialization}
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje informativo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-2">¿Cómo agendar tu sesión?</p>
                <p className="text-blue-800 leading-relaxed">
                  Para coordinar tu sesión con {therapistName.split(" ")[0]}, por favor comunícate 
                  directamente con nuestro equipo de coordinación. Ellos te ayudarán a encontrar 
                  el mejor horario disponible.
                </p>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Contacta con nosotros:</p>
            
            <div className="space-y-2">
              <a 
                href={`tel:${contactPhone}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="text-sm font-medium text-foreground">{contactPhone}</p>
                </div>
              </a>

              <a 
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Correo electrónico</p>
                  <p className="text-sm font-medium text-foreground">{contactEmail}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Horarios de atención */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-start gap-2">
              <Clock size={16} className="text-gray-600 mt-0.5" />
              <div className="text-xs text-gray-700">
                <p className="font-semibold mb-1">Horario de atención:</p>
                <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                <p>Sábados: 9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>

          {/* Botón de cerrar */}
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
