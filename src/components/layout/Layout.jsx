import { useState } from "react";
import { Sidebar } from "./Sidebar.jsx";
import { BottomNav } from "./BottomNav.jsx";
import { TopBar } from "./TopBar.jsx";
import { SearchModal } from "../common/SearchModal.jsx";
import { ToastContainer } from "../common/Toast.jsx";

export function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar />
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      <div className="app-main">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="app-content">{children}</main>
        <BottomNav />
      </div>
      <SearchModal />
      <ToastContainer />
    </div>
  );
}
