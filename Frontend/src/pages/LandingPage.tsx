import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { ArrowRight, ShieldCheck, Video, CalendarCheck, Users, Heart, Star, ChartLine } from "lucide-react";
import heroImg from "@/assets/hero-landing.jpg";
import LegalModal from "@/components/shared/LegalModal";

const features = [
  { icon: ChartLine, title: "Seguimiento de progreso", desc: "Realiza un seguimiento de tu progreso terapéutico y alcanza tus metas de bienestar." },
  { icon: Video, title: "Sessiones", desc: "Sesiones virtuales seguras con tu terapeuta desde la comodidad de tu hogar." },
  { icon: Users, title: "Equipo Profesional", desc: "Red de terapeutas certificados especializados en diversas áreas de la salud mental." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }),
};

const LandingPage = () => {
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Servicios</a>
            <a href="#cta" className="hover:text-foreground transition-colors">Contacto</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-foreground hover:text-accent transition-colors px-4 py-2">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden min-h-screen">
        {/* Organic background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-accent/[0.04] blur-3xl" />
          <div className="absolute top-[30%] -left-[15%] w-[40vw] h-[40vw] rounded-full bg-primary/[0.03] blur-3xl" />
          <div className="absolute bottom-0 right-[20%] w-[30vw] h-[30vw] rounded-full bg-accent/[0.05] blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 py-20 lg:py-0"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-8 backdrop-blur-sm"
            >
              <Heart size={14} /> Plataforma de Bienestar Mental
            </motion.span>

            <h1 className="text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-foreground leading-[1.05] mb-6">
              Tu camino{" "}
              <span className="relative inline-block">
                hacia el
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 8C40 2 80 2 100 6C120 10 160 4 198 6" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" className="opacity-40" />
                </svg>
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                bienestar
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed mb-10">
              Conectamos pacientes con terapeutas profesionales en un entorno seguro y personalizado.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link
                to="/registro"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 active:scale-[0.97]"
                style={{ background: "var(--cta-gradient)" }}
              >
                Comenzar Ahora
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold border border-border text-foreground hover:bg-secondary/80 transition-all duration-300 backdrop-blur-sm"
              >
                Conocer Más
              </a>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <ShieldCheck size={14} className="text-accent" />
                </div>
                <span>Terapeutas Certificados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users size={14} className="text-accent" />
                </div>
                <span>+200 pacientes</span>
              </div>
            </div>
          </motion.div>

          {/* Image composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main image with organic shape */}
              <div
                className="relative overflow-hidden shadow-2xl shadow-primary/10"
                style={{ borderRadius: "30% 70% 60% 40% / 50% 40% 60% 50%" }}
              >
                <img
                  src={heroImg}
                  alt="Espacio terapéutico profesional"
                  className="w-full h-[480px] object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/20" />
              </div>

              {/* Floating accent ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -left-6 w-24 h-24 rounded-full border-2 border-dashed border-accent/25"
              />

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-6 -left-8 bg-card/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                    <CalendarCheck size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Próxima Sesión</p>
                    <p className="text-xs text-muted-foreground">Agenda hoy</p>
                  </div>
                </div>
              </motion.div>

              {/* Dot cluster */}
              <div className="absolute top-4 -right-4 flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="w-1.5 h-1.5 rounded-full bg-accent/20" />
                    ))}
                  </div>
                ))}
              </div>

              {/* Stats card top-right */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -top-4 -right-6 bg-card/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Heart size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">98%</p>
                    <p className="text-xs text-muted-foreground">Satisfacción</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitas para tu bienestar
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-xl mx-auto">
              Una plataforma integral diseñada para facilitar tu experiencia terapéutica y acompañarte en cada paso.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i + 2}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-accent/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <f.icon size={22} className="text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

  

      {/* CTA */}
      <section id="cta" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl p-12 md:p-16 text-center text-primary-foreground"
            style={{ background: "var(--card-highlight)" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comienza tu camino hoy</h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">
              Regístrate de forma gratuita y accede a nuestra red de profesionales de la salud mental.
            </p>
            <Link
              to="/registro"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary-foreground text-primary text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Crear mi Cuenta <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => setLegalModal("privacy")} className="hover:text-foreground transition-colors">Política de Privacidad</button>
            <button onClick={() => setLegalModal("terms")} className="hover:text-foreground transition-colors">Términos de Servicio</button>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 MindBridge. Todos los derechos reservados.</p>
        </div>
      </footer>

      <LegalModal open={legalModal !== null} onOpenChange={(open) => !open && setLegalModal(null)} type={legalModal ?? "terms"} />
    </div>
  );
};

export default LandingPage;
