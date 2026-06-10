import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MiniCalendarProps {
  className?: string;
  selectedDate?: string; // "YYYY-MM-DD"
  onDateSelect?: (date: string) => void;
  highlightedDates?: string[]; // dates that have sessions
}

const DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

export const MiniCalendar = ({ className = "", selectedDate, onDateSelect, highlightedDates = [] }: MiniCalendarProps) => {
  const today = new Date();
  const [month, setMonth] = useState(selectedDate ? parseInt(selectedDate.split("-")[1]) - 1 : today.getMonth());
  const [year, setYear] = useState(selectedDate ? parseInt(selectedDate.split("-")[0]) : today.getFullYear());

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const { cells, daysInMonth } = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday=0 to Monday-based: Mon=0, Tue=1, ..., Sun=6
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const dim = new Date(year, month + 1, 0).getDate();
    const c: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) c.push(null);
    for (let i = 1; i <= dim; i++) c.push(i);
    return { cells: c, daysInMonth: dim };
  }, [month, year]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const makeDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const handleDayClick = (day: number) => {
    onDateSelect?.(makeDateStr(day));
  };

  return (
    <div className={`bg-card rounded-xl border border-border p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-foreground">{monthNames[month]} {year}</h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-secondary transition-colors">
            <ChevronLeft size={16} className="text-muted-foreground" />
          </button>
          <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-secondary transition-colors">
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="text-center py-1" />;
          const dateStr = makeDateStr(day);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasSession = highlightedDates.includes(dateStr);

          return (
            <div key={i} className="text-center py-1">
              <button
                onClick={() => handleDayClick(day)}
                className={`w-7 h-7 rounded-full text-xs font-medium transition-colors relative ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {day}
                {hasSession && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
