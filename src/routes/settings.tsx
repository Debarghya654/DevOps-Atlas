import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useProgress } from "@/lib/progress-store";
import { useTheme, type ThemeChoice } from "@/lib/theme";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · DevOps Atlas" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { choice, setTheme } = useTheme();
  const reset = useProgress((state) => state.reset);
  const replaceAll = useProgress((state) => state.replaceAll);
  const snapshot = useProgress((state) => state);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");

  function exportProgress() {
    const payload = {
      completed: snapshot.completed,
      bookmarks: snapshot.bookmarks,
      notes: snapshot.notes,
      exerciseChecks: snapshot.exerciseChecks,
      lastSlug: snapshot.lastSlug,
      quizAttempts: snapshot.quizAttempts,
      weeklyHours: snapshot.weeklyHours,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "devops-atlas-progress.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-reading px-4 py-8 md:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-3 text-muted">
        Theme and progress live in this browser. Export the file if you want a copy. There is no login and no remote sync.
      </p>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Theme</h2>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Theme">
          {(["system", "light", "dark"] as ThemeChoice[]).map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={choice === option}
              onClick={() => setTheme(option)}
              className={`h-10 rounded-lg border px-3 text-sm capitalize ${choice === option ? "border-accent bg-surface-2" : "border-border"}`}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">First visit follows the system theme until you choose.</p>
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Progress file</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={exportProgress} className="h-10 rounded-lg border border-border px-3 text-sm">
            Export JSON
          </button>
          <label className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-border px-3 text-sm">
            Import JSON
            <input
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  const data = JSON.parse(await file.text()) as Record<string, unknown>;
                  if (!data || typeof data !== "object") throw new Error("not an object");
                  replaceAll({
                    completed: (data.completed as Record<string, true>) ?? {},
                    bookmarks: Array.isArray(data.bookmarks) ? (data.bookmarks as string[]) : [],
                    notes: (data.notes as Record<string, string>) ?? {},
                    exerciseChecks: (data.exerciseChecks as Record<string, Record<number, true>>) ?? {},
                    lastSlug: typeof data.lastSlug === "string" ? data.lastSlug : null,
                    quizAttempts: (data.quizAttempts as typeof snapshot.quizAttempts) ?? {},
                    weeklyHours: typeof data.weeklyHours === "number" ? data.weeklyHours : 5,
                  });
                  setMessage("Imported. Check Progress to confirm.");
                } catch {
                  setMessage("That file could not be read as a DevOps Atlas progress export.");
                }
              }}
            />
          </label>
        </div>
        {message ? <p className="mt-2 text-sm text-muted">{message}</p> : null}
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Reset</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Removes completion, bookmarks, notes, exercise checks, and quiz scores from this browser.</p>
        {confirm ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="h-10 rounded-lg bg-danger px-3 text-sm font-semibold text-bg"
              onClick={() => {
                reset();
                setConfirm(false);
                setMessage("Local progress was reset.");
              }}
            >
              Confirm reset
            </button>
            <button type="button" className="h-10 rounded-lg border border-border px-3 text-sm" onClick={() => setConfirm(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="mt-3 h-10 rounded-lg border border-danger px-3 text-sm text-danger" onClick={() => setConfirm(true)}>
            Reset progress
          </button>
        )}
      </section>
    </div>
  );
}
