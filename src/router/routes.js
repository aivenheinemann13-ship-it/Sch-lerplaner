export const ROUTES = {
  DASHBOARD: "dashboard",
  HEUTE: "heute",
  KALENDER: "kalender",
  FAECHER: "faecher",
  FACH_DETAIL: "fach-detail",
  STUNDENPLAN: "stundenplan",
  HAUSAUFGABEN: "hausaufgaben",
  TESTS: "tests",
  NOTEN: "noten",
  STATISTIK: "statistik",
  LERNEN: "lernen",
  ZIELE: "ziele",
  KARTEIKARTEN: "karteikarten",
  NOTIZEN: "notizen",
  DOKUMENTE: "dokumente",
  EINSTELLUNGEN: "einstellungen",
};

export const NAV_ITEMS = [
  { route: ROUTES.DASHBOARD, label: "Dashboard", icon: "LayoutDashboard" },
  { route: ROUTES.HEUTE, label: "Heute", icon: "Sun" },
  { route: ROUTES.KALENDER, label: "Kalender", icon: "Calendar" },
  { route: ROUTES.FAECHER, label: "Fächer", icon: "BookOpen" },
  { route: ROUTES.STUNDENPLAN, label: "Stundenplan", icon: "CalendarClock" },
  { route: ROUTES.HAUSAUFGABEN, label: "Hausaufgaben", icon: "NotebookPen" },
  { route: ROUTES.TESTS, label: "Tests", icon: "FlaskConical" },
  { route: ROUTES.NOTEN, label: "Noten", icon: "BarChart3" },
  { route: ROUTES.STATISTIK, label: "Statistik", icon: "TrendingUp" },
  { route: ROUTES.LERNEN, label: "Lernen", icon: "Timer" },
  { route: ROUTES.ZIELE, label: "Ziele", icon: "Target" },
  { route: ROUTES.KARTEIKARTEN, label: "Karteikarten", icon: "Layers" },
  { route: ROUTES.NOTIZEN, label: "Notizen", icon: "StickyNote" },
  { route: ROUTES.DOKUMENTE, label: "Dokumente", icon: "FolderOpen" },
  { route: ROUTES.EINSTELLUNGEN, label: "Einstellungen", icon: "Settings" },
];

// Subset shown in the mobile bottom nav (keep it short so it fits on screen).
export const MOBILE_NAV_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.KALENDER,
  ROUTES.HAUSAUFGABEN,
  ROUTES.NOTEN,
  ROUTES.EINSTELLUNGEN,
];
