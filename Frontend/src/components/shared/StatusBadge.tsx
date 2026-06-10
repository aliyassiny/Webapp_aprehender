import { SessionStatus } from "@/types";

const statusLabels: Record<SessionStatus, string> = {
  SCHEDULED: "PROGRAMADA",
  COMPLETED: "COMPLETADA",
  CANCELED: "CANCELADA",
  ABSENT: "AUSENTE",
};

interface StatusBadgeProps {
  status: SessionStatus;
  label?: string;
  className?: string;
}

export const StatusBadge = ({ status, label, className = "" }: StatusBadgeProps) => {
  const statusClass = {
    SCHEDULED: "status-scheduled",
    COMPLETED: "status-completed",
    CANCELED: "status-cancelled",
    ABSENT: "status-pending",
  }[status];

  return (
    <span className={`${statusClass} ${className}`}>
      {label || statusLabels[status]}
    </span>
  );
};
