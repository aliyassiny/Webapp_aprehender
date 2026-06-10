import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  userName: string;
  userRole: string;
}

export const DashboardLayout = ({
  children,
  role,
  userName,
  userRole,
}: DashboardLayoutProps) => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if(user?.role === "COORDINATOR") {
      userRole = "Coordinador";
    } else if(user?.role === "THERAPIST") {
      userRole = "Terapeuta";
    } else {
      userRole = "Paciente";
    }

    return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-[200px]">
        <TopBar 
          userName={user?.username || userName} 
          userRole={userRole}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="px-4 py-5 sm:px-6">{children}</main>
      </div>
    </div>
  );
};
