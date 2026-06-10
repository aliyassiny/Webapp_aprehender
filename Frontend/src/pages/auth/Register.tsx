import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { User, Mail, Lock, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import authBg from "@/assets/auth-bg.jpg";
import LegalModal from "@/components/shared/LegalModal";
import { useAuthApi } from "@/connections/api/auth";
import { toast } from "sonner";

const Register = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);

  const allAccepted = acceptedTerms && acceptedPrivacy ;
  const { handleRegister, loading, error } = useAuthApi();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    handleRegister(username, email, password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-brand-dark/90" />
        <div className="relative z-10 flex flex-col justify-between p-10 text-primary-foreground">
          <Logo className="[&_span]:text-primary-foreground [&_div]:bg-primary-foreground/20" />
          <div className="mb-20">
            <h1 className="text-4xl font-bold leading-tight mb-4" style={{ lineHeight: 1.1 }}>
              Tu bienestar comienza<br />con un entorno<br />restaurador.
            </h1>
            <p className="text-primary-foreground/70 text-base max-w-sm leading-relaxed">
              Únete a nuestra plataforma diseñada para ofrecerte la paz y el apoyo profesional que mereces en tu camino terapéutico.
            </p>
          </div>
          <p className="text-primary-foreground/50 text-sm">Más de 5,000 pacientes confían en nuestra red de cuidado.</p>
        </div>
      </motion.div>

      {/* Right - Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-2">Crear cuenta de paciente</h2>
          <p className="text-muted-foreground mb-8">
            Completa tus datos para comenzar tu experiencia personalizada en MindBridge.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                  placeholder="Ej. Juan Pérez" 
                  className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="nombre@ejemplo.com" 
                  className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" 
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Confirmar</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" 
                  />
                </div>
              </div>
            </div>

            {/* Legal checkboxes */}
            <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
              <p className="text-xs font-semibold text-foreground mb-2">Acepta los siguientes términos para continuar:</p>

              <label className="flex items-start gap-2.5 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5 shrink-0" />
                <span>
                  Acepto los{" "}
                  <button type="button" onClick={() => setLegalModal("terms")} className="text-accent hover:underline font-medium">
                    Términos de Servicio
                  </button>
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5 shrink-0" />
                <span>
                  Acepto la{" "}
                  <button type="button" onClick={() => setLegalModal("privacy")} className="text-accent hover:underline font-medium">
                    Política de Privacidad
                  </button>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!allAccepted}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          {error && toast.error(error)}

          <p className="text-sm text-muted-foreground mt-6 text-center">
            ¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-foreground hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </motion.div>

      <LegalModal open={legalModal !== null} onOpenChange={(open) => !open && setLegalModal(null)} type={legalModal ?? "terms"} />
    </div>
  );
};

export default Register;
