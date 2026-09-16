import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Bell, Trash2, Pencil } from "lucide-react";
import { PageHeader, Card } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { todayISO, toISODate, addDays, MONTHS_DE, formatGermanDate } from "../../utils/date.js";
import { getEventsForDate, getUpcomingReminders } from "../../data/selectors.js";
import { MonthView } from "./MonthView.jsx";
import { WeekView } from "./WeekView.jsx";
import { DayView } from "./DayView.jsx";
import { EventForm } from "./EventForm.jsx";
import { ReminderForm } from "./ReminderForm.jsx";

export function KalenderPage() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const [view, setView] = useState("month");
  const [refDate, setRefDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [reminderFormOpen, setReminderFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [reminderToDelete, setReminderToDelete] = useState(null);

  const shift = (amount) => {
    if (view === "month") setRefDate((d) => new Date(d.getFullYear(), d.getMonth() + amount, 1));
    else if (view === "week") setRefDate((d) => addDays(d, amount * 7));
    else setRefDate((d) => addDays(d, amount));
  };

  const handleSaveEvent = (values) => {
    if (values.id) {
      actions.updateEvent(values.id, values);
      addToast("Termin aktualisiert ✅", { type: "success" });
    } else {
      actions.addEvent(values);
      addToast("Termin hinzugefügt 📅", { type: "success" });
    }
    setFormOpen(false);
  };

  const handleSaveReminder = (values) => {
    if (values.id) {
      actions.updateReminder(values.id, values);
      addToast("Erinnerung aktualisiert ✅", { type: "success" });
    } else {
      actions.addReminder(values);
      addToast("Erinnerung erstellt 🔔", { type: "success" });
    }
    setReminderFormOpen(false);
  };

  const selectedDayEvents = getEventsForDate(state, selectedDate);
  const upcomingReminders = getUpcomingReminders(state, todayISO(), 8);

  return (
    <div>
      <PageHeader
        title="Kalender"
        subtitle="Alle Termine im Überblick"
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingEvent(null);
              setFormOpen(true);
            }}
          >
            Neuer Termin
          </Button>
        }
      />

      <div className="calendar-toolbar">
        <div className="segmented">
          {["month", "week", "day"].map((v) => (
            <button
              key={v}
              className={view === v ? "segmented__btn segmented__btn--active" : "segmented__btn"}
              onClick={() => setView(v)}
            >
              {v === "month" ? "Monat" : v === "week" ? "Woche" : "Tag"}
            </button>
          ))}
        </div>
        <div className="calendar-toolbar__nav">
          <button className="icon-button" onClick={() => shift(-1)}>
            <ChevronLeft size={18} />
          </button>
          <span>
            {view === "month"
              ? `${MONTHS_DE[refDate.getMonth()]} ${refDate.getFullYear()}`
              : formatGermanDate(toISODate(refDate), { short: true })}
          </span>
          <button className="icon-button" onClick={() => shift(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="calendar-layout">
        <Card className="calendar-main">
          {view === "month" && (
            <MonthView
              year={refDate.getFullYear()}
              month={refDate.getMonth()}
              events={state.events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}
          {view === "week" && (
            <WeekView
              referenceDate={refDate}
              events={state.events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}
          {view === "day" && (
            <DayView
              date={toISODate(refDate)}
              events={getEventsForDate(state, toISODate(refDate))}
              onEdit={(e) => {
                setEditingEvent(e);
                setFormOpen(true);
              }}
              onDelete={setToDelete}
            />
          )}

          {view !== "day" && (
            <div className="calendar-selected-day">
              <DayView
                date={selectedDate}
                events={selectedDayEvents}
                onEdit={(e) => {
                  setEditingEvent(e);
                  setFormOpen(true);
                }}
                onDelete={setToDelete}
              />
            </div>
          )}
        </Card>

        <Card className="reminders-panel">
          <div className="reminders-panel__header">
            <h3 className="section-title">
              <Bell size={16} /> Erinnerungen
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingReminder(null);
                setReminderFormOpen(true);
              }}
            >
              Neu
            </Button>
          </div>
          {upcomingReminders.length === 0 ? (
            <p className="muted">Keine bevorstehenden Erinnerungen.</p>
          ) : (
            <ul className="simple-list">
              {upcomingReminders.map((r) => (
                <li key={r.id}>
                  <div>
                    <strong>{r.title}</strong>
                    <p className="muted">
                      {formatGermanDate(r.date, { short: true })} · {r.time}
                    </p>
                  </div>
                  <span className="simple-list__badges">
                    <button
                      className="icon-button icon-button--sm"
                      onClick={() => {
                        setEditingReminder(r);
                        setReminderFormOpen(true);
                      }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button className="icon-button icon-button--sm" onClick={() => setReminderToDelete(r)}>
                      <Trash2 size={13} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {formOpen && (
        <EventForm
          key={editingEvent?.id || "new"}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSaveEvent}
          initialValues={editingEvent}
          defaultDate={selectedDate}
        />
      )}

      {reminderFormOpen && (
        <ReminderForm
          key={editingReminder?.id || "new"}
          open={reminderFormOpen}
          onClose={() => setReminderFormOpen(false)}
          onSave={handleSaveReminder}
          initialValues={editingReminder}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Termin löschen"
        message={`Möchtest du „${toDelete?.title}“ wirklich löschen?`}
        onConfirm={() => {
          actions.deleteEvent(toDelete.id);
          addToast("Termin gelöscht", { type: "info" });
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />

      <ConfirmDialog
        open={!!reminderToDelete}
        title="Erinnerung löschen"
        message={`Möchtest du „${reminderToDelete?.title}“ wirklich löschen?`}
        onConfirm={() => {
          actions.deleteReminder(reminderToDelete.id);
          addToast("Erinnerung gelöscht", { type: "info" });
          setReminderToDelete(null);
        }}
        onCancel={() => setReminderToDelete(null)}
      />
    </div>
  );
}
