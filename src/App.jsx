import { AppDataProvider } from "./context/AppDataContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { ShortcutsProvider } from "./context/ShortcutsProvider.jsx";
import { RouterProvider, useRouter } from "./router/Router.jsx";
import { ROUTES } from "./router/routes.js";
import { Layout } from "./components/layout/Layout.jsx";

import { Dashboard } from "./pages/Dashboard/Dashboard.jsx";
import { HeutePage } from "./pages/Heute/HeutePage.jsx";
import { KalenderPage } from "./pages/Kalender/KalenderPage.jsx";
import { FaecherPage } from "./pages/Faecher/FaecherPage.jsx";
import { FachDetailPage } from "./pages/FachDetail/FachDetailPage.jsx";
import { StundenplanPage } from "./pages/Stundenplan/StundenplanPage.jsx";
import { HausaufgabenPage } from "./pages/Hausaufgaben/HausaufgabenPage.jsx";
import { TestsPage } from "./pages/Tests/TestsPage.jsx";
import { NotenPage } from "./pages/Noten/NotenPage.jsx";
import { StatistikPage } from "./pages/Statistik/StatistikPage.jsx";
import { LernenPage } from "./pages/Lernen/LernenPage.jsx";
import { ZielePage } from "./pages/Ziele/ZielePage.jsx";
import { KarteikartenPage } from "./pages/Karteikarten/KarteikartenPage.jsx";
import { NotizenPage } from "./pages/Notizen/NotizenPage.jsx";
import { DokumentePage } from "./pages/Dokumente/DokumentePage.jsx";
import { EinstellungenPage } from "./pages/Einstellungen/EinstellungenPage.jsx";

const PAGES = {
  [ROUTES.DASHBOARD]: Dashboard,
  [ROUTES.HEUTE]: HeutePage,
  [ROUTES.KALENDER]: KalenderPage,
  [ROUTES.FAECHER]: FaecherPage,
  [ROUTES.FACH_DETAIL]: FachDetailPage,
  [ROUTES.STUNDENPLAN]: StundenplanPage,
  [ROUTES.HAUSAUFGABEN]: HausaufgabenPage,
  [ROUTES.TESTS]: TestsPage,
  [ROUTES.NOTEN]: NotenPage,
  [ROUTES.STATISTIK]: StatistikPage,
  [ROUTES.LERNEN]: LernenPage,
  [ROUTES.ZIELE]: ZielePage,
  [ROUTES.KARTEIKARTEN]: KarteikartenPage,
  [ROUTES.NOTIZEN]: NotizenPage,
  [ROUTES.DOKUMENTE]: DokumentePage,
  [ROUTES.EINSTELLUNGEN]: EinstellungenPage,
};

function RouteOutlet() {
  const { route } = useRouter();
  const Page = PAGES[route] || Dashboard;
  return <Page />;
}

function AppShell() {
  return (
    <Layout>
      <RouteOutlet />
    </Layout>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <ThemeProvider>
        <ToastProvider>
          <RouterProvider>
            <SearchProvider>
              <ShortcutsProvider>
                <AppShell />
              </ShortcutsProvider>
            </SearchProvider>
          </RouterProvider>
        </ToastProvider>
      </ThemeProvider>
    </AppDataProvider>
  );
}
