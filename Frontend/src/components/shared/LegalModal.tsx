import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type LegalType = "privacy" | "terms";

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: LegalType;
}

const content: Record<LegalType, { title: string; body: string[] }> = {
  privacy: {
    title: "Política de Privacidad",
    body: [
      "Última actualización: 30 de marzo de 2026",
      "En MindBridge, nos comprometemos a proteger la privacidad y seguridad de la información personal de nuestros usuarios. Esta política describe cómo recopilamos, usamos y protegemos sus datos.",
      "1. Información que Recopilamos\nRecopilamos información personal que usted nos proporciona directamente, como nombre, correo electrónico, información de contacto y datos de salud relevantes para su tratamiento terapéutico. También recopilamos datos de uso de la plataforma de forma automática.",
      "2. Uso de la Información\nUtilizamos su información para: facilitar la conexión con profesionales de salud mental, gestionar citas y sesiones, mejorar nuestros servicios, enviar comunicaciones relevantes sobre su tratamiento y cumplir con obligaciones legales.",
      "3. Protección de Datos\nImplementamos medidas de seguridad técnicas y organizativas para proteger su información, incluyendo encriptación de datos en tránsito y en reposo, controles de acceso estrictos y auditorías regulares de seguridad.",
      "4. Compartición de Datos\nNo vendemos ni compartimos su información personal con terceros para fines de marketing. Solo compartimos datos con su terapeuta asignado y cuando sea requerido por ley.",
      "5. Sus Derechos\nUsted tiene derecho a acceder, corregir, eliminar o exportar sus datos personales en cualquier momento. Para ejercer estos derechos, contáctenos a privacidad@mindbridge.com.",
      "6. Retención de Datos\nConservamos su información durante el tiempo que mantenga una cuenta activa y según lo requieran las regulaciones de salud aplicables.",
    ],
  },
  terms: {
    title: "Términos de Servicio",
    body: [
      "Última actualización: 30 de marzo de 2026",
      "Bienvenido a MindBridge. Al registrarse y utilizar nuestra plataforma, usted acepta los siguientes términos y condiciones.",
      "1. Descripción del Servicio\nMindBridge es una plataforma digital que facilita la conexión entre pacientes y profesionales de salud mental certificados. Ofrecemos gestión de citas, sesiones de telemedicina y herramientas de seguimiento terapéutico.",
      "2. Elegibilidad\nPara utilizar nuestros servicios debe ser mayor de 18 años o contar con el consentimiento de un tutor legal. Debe proporcionar información veraz y mantener la confidencialidad de sus credenciales de acceso.",
      "3. Uso Aceptable\nSe compromete a utilizar la plataforma únicamente para fines legítimos relacionados con su bienestar mental. Queda prohibido el uso indebido, la suplantación de identidad y cualquier actividad que viole las leyes aplicables.",
      "4. Sesiones\nLas sesiones deben cancelarse con al menos 24 horas de anticipación. Las cancelaciones tardías pueden estar sujetas a cargos según la política del terapeuta.",
      "5. Limitación de Responsabilidad\nMindBridge facilita la conexión con profesionales pero no es responsable del diagnóstico o tratamiento proporcionado. En caso de emergencia médica, contacte a los servicios de emergencia locales.",
      "6. Modificaciones\nNos reservamos el derecho de modificar estos términos. Le notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico.",
      "7. Terminación\nPodemos suspender o terminar su cuenta si viola estos términos. Usted puede cancelar su cuenta en cualquier momento desde la configuración de su perfil.",
    ],
  },
};

const LegalModal = ({ open, onOpenChange, type }: LegalModalProps) => {
  const data = content[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{data.title}</DialogTitle>
          <DialogDescription>MindBridge — Plataforma de Bienestar Mental</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[55vh] pr-4">
          <div className="space-y-4">
            {data.body.map((paragraph, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LegalModal;
