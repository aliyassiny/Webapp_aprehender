import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRoutes } from "./routes/AppRoutes";


const App = () => (
  <>
    <AppRoutes />
    <TooltipProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </>
);

export default App;
