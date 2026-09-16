import { PageHeader } from "../../components/common/Card.jsx";
import { AppearanceSection } from "./AppearanceSection.jsx";
import { SchoolInfoSection } from "./SchoolInfoSection.jsx";
import { NotificationsSection } from "./NotificationsSection.jsx";
import { DataSection } from "./DataSection.jsx";

export function EinstellungenPage() {
  return (
    <div>
      <PageHeader title="Einstellungen" />
      <div className="settings-sections">
        <AppearanceSection />
        <SchoolInfoSection />
        <NotificationsSection />
        <DataSection />
      </div>
    </div>
  );
}
