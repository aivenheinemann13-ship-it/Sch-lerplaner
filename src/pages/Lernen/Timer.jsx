import { useEffect, useRef, useState } from "react";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { FormField, Input, Select } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { PomodoroSettings } from "./PomodoroSettings.jsx";
import { pad2 } from "../../utils/date.js";

const DEFAULT_POMODORO = { workMinutes: 25, breakMinutes: 5, longBreakMinutes: 15, roundsUntilLongBreak: 4 };

function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

export function Timer() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();

  const [mode, setMode] = useState("normal");
  const [subjectId, setSubjectId] = useState("");
  const [goal, setGoal] = useState("");
  const [pomodoro, setPomodoro] = useState(DEFAULT_POMODORO);

  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("work"); // 'work' | 'break' | 'long_break'
  const [round, setRound] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0); // normal mode: counts up
  const [remainingSeconds, setRemainingSeconds] = useState(pomodoro.workMinutes * 60); // pomodoro: counts down

  const startedAtRef = useRef(null);
  const accumulatedRef = useRef(0); // seconds actually spent studying (work phases only) this session

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      if (mode === "normal") {
        setElapsedSeconds((s) => s + 1);
        accumulatedRef.current += 1;
      } else {
        setRemainingSeconds((s) => {
          if (s <= 1) {
            handlePhaseComplete();
            return 0;
          }
          if (phase === "work") accumulatedRef.current += 1;
          return s - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode, phase]);

  function handlePhaseComplete() {
    if (phase === "work") {
      const isLongBreak = round % pomodoro.roundsUntilLongBreak === 0;
      setPhase(isLongBreak ? "long_break" : "break");
      setRemainingSeconds((isLongBreak ? pomodoro.longBreakMinutes : pomodoro.breakMinutes) * 60);
      addToast(isLongBreak ? "Lange Pause! 🎉" : "Pause! ☕", { type: "success" });
    } else {
      setPhase("work");
      setRound((r) => r + 1);
      setRemainingSeconds(pomodoro.workMinutes * 60);
      addToast("Weiter geht's! 📚", { type: "info" });
    }
  }

  const start = () => {
    if (!startedAtRef.current) startedAtRef.current = new Date().toISOString();
    setRunning(true);
  };

  const pause = () => setRunning(false);

  const reset = () => {
    setRunning(false);
    setElapsedSeconds(0);
    setRemainingSeconds(pomodoro.workMinutes * 60);
    setPhase("work");
    setRound(1);
    accumulatedRef.current = 0;
    startedAtRef.current = null;
  };

  const stop = () => {
    // Round up so even a short session (a few seconds) is still credited
    // with at least 1 minute instead of silently being discarded.
    const minutes = accumulatedRef.current > 0 ? Math.max(1, Math.round(accumulatedRef.current / 60)) : 0;
    setRunning(false);
    if (minutes > 0) {
      actions.addStudySession({
        subjectId: subjectId || null,
        mode,
        goal,
        plannedMinutes: mode === "pomodoro" ? pomodoro.workMinutes : 0,
        actualMinutes: minutes,
        startedAt: startedAtRef.current || new Date().toISOString(),
        endedAt: new Date().toISOString(),
      });
      addToast(`Lernzeit gespeichert: ${minutes} Min ⏱️`, { type: "success" });
    }
    reset();
  };

  const changeMode = (nextMode) => {
    if (running) return;
    setMode(nextMode);
    reset();
  };

  const phaseLabel = { work: "Lernen", break: "Pause", long_break: "Lange Pause" }[phase];

  return (
    <Card className="timer-card">
      <div className="segmented">
        <button
          className={mode === "normal" ? "segmented__btn segmented__btn--active" : "segmented__btn"}
          onClick={() => changeMode("normal")}
        >
          Normal
        </button>
        <button
          className={mode === "pomodoro" ? "segmented__btn segmented__btn--active" : "segmented__btn"}
          onClick={() => changeMode("pomodoro")}
        >
          Pomodoro
        </button>
      </div>

      <div className="timer-display">
        <span className="timer-display__phase">{mode === "pomodoro" ? phaseLabel : "Lernzeit"}</span>
        <span className="timer-display__clock">
          {mode === "normal" ? formatClock(elapsedSeconds) : formatClock(remainingSeconds)}
        </span>
        {mode === "pomodoro" && <span className="muted">Runde {round}</span>}
      </div>

      <div className="timer-setup">
        <FormField label="Fach">
          <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} disabled={running}>
            <option value="">Ohne Fach</option>
            {state.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Lernziel">
          <Input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="z. B. 30 Minuten Englisch lernen"
            disabled={running}
          />
        </FormField>
      </div>

      {mode === "pomodoro" && (
        <PomodoroSettings settings={pomodoro} onChange={setPomodoro} disabled={running || accumulatedRef.current > 0} />
      )}

      <div className="timer-controls">
        {!running ? (
          <Button variant="primary" icon={Play} onClick={start}>
            Start
          </Button>
        ) : (
          <Button variant="ghost" icon={Pause} onClick={pause}>
            Pause
          </Button>
        )}
        <Button variant="danger" icon={Square} onClick={stop} disabled={accumulatedRef.current === 0 && !running}>
          Beenden &amp; speichern
        </Button>
        <Button variant="ghost" icon={RotateCcw} onClick={reset}>
          Zurücksetzen
        </Button>
      </div>
    </Card>
  );
}
