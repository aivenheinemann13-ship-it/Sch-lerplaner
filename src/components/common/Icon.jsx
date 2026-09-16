import {
  LayoutDashboard, Sun, Calendar, BookOpen, CalendarClock, NotebookPen,
  FlaskConical, BarChart3, TrendingUp, Timer, Target, Layers, StickyNote,
  FolderOpen, Settings, AlertTriangle, Clock, Bell, Trophy, Moon,
} from "lucide-react";

const ICONS = {
  LayoutDashboard, Sun, Calendar, BookOpen, CalendarClock, NotebookPen,
  FlaskConical, BarChart3, TrendingUp, Timer, Target, Layers, StickyNote,
  FolderOpen, Settings, AlertTriangle, Clock, Bell, Trophy, Moon,
};

export function Icon({ name, ...props }) {
  const Component = ICONS[name];
  if (!Component) return null;
  return <Component {...props} />;
}
