import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import authBg from "@/assets/auth-bg.jpg";
import { useAuthApi } from "@/connections/api/auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useAuthApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image Panel */}
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
              Accede a tu espacio personal diseñado para tu tranquilidad y crecimiento terapéutico.
            </p>
          </div>
          <p className="text-primary-foreground/50 text-sm">Cuidando de ti, cada paso del camino.</p>
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Bienvenido de nuevo</h2>
          <p className="text-muted-foreground mb-8">
            Por favor, ingrese sus credenciales para acceder a su espacio de trabajo.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-foreground">Contraseña</label>
                <a href="#" className="text-sm text-accent hover:underline font-medium">¿Olvidó su contraseña?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              Recordar este dispositivo
            </label>

            <div
              onClick={handleSubmit}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Acceder al Panel <ArrowRight size={16} />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-background px-3 text-sm text-muted-foreground">O</span></div>
            </div>

            <Link
              to="/registro"
              className="w-full py-3 border border-border rounded-lg text-sm font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-accent"
            >
              <UserPlus size={16} />
              Registrarse como Paciente
            </Link>
          </form>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            ¿Profesional de la salud? <a href="#" className="font-semibold text-foreground hover:underline">Solicite sus credenciales</a>
          </p>

          <div className="flex items-center justify-center gap-4 mt-8 text-xs text-muted-foreground">
            <a href="#" className="hover:underline">Política de Privacidad</a>
            <span>•</span>
            <a href="#" className="hover:underline">Ayuda</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
