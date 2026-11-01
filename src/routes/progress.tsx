import { createFileRoute, Link } from "@tanstack/react-router";
import { getModule, moduleTopics, topics } from "@/content/catalog";
import { useHydrated, useProgress } from "@/lib/progress-store";
import { formatMinutes } from "@/lib/utils";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Progress · DevOps Atlas" }] }),
  component: ProgressPage,
});

const hoursOptions = [3, 5, 8, 12];

function ProgressPage() {
  const hydrated = useHydrated();
  const completed = useProgress((state) => state.completed);
  const weeklyHours = useProgress((state) => state.weeklyHours);
  const setWeeklyHours = useProgress((state) => state.setWeeklyHours);
  const lastSlug = useProgress((state) => state.lastSlug);
  const done = topics.filter((topic) => completed[topic.slug]);
  const remaining = topics.filter((topic) => !completed[topic.slug]);
  const weeklyMinutes = weeklyHours * 60;
  let budget = weeklyMinutes;
  const plan = [];
  for (const topic of remaining) {
    if (budget <= 0) break;
    plan.push(topic);
    budget -= topic.minutes;
  }
  const last = topics.find((topic) => topic.slug === lastSlug);
  const pct = Math.round((done.length / topics.length) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Progress</h1>
      <p className="mt-3 max-w-reading text-muted">
        Stored in local storage under this browser profile. It does not follow you to another device. There is no account.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <section className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold tracking-wide text-muted">CURRICULUM</p>
          <p className="mt-2 font-mono text-3xl">{hydrated ? `${pct}%` : "–"}</p>
          <p className="text-sm text-muted">{hydrated ? `${done.length} of ${topics.length} topics` : "Waiting for local data"}</p>
        </section>
        <section className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold tracking-wide text-muted">CONTINUE</p>
          {last ? (
            <Link to="/topics/$slug" params={{ slug: last.slug }} className="mt-2 block font-semibold text-accent">
              {last.title}
            </Link>
          ) : (
            <Link to="/topics/$slug" params={{ slug: "what-is-devops" }} className="mt-2 block font-semibold text-accent">
              Start with What Is DevOps?
            </Link>
          )}
        </section>
        <section className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold tracking-wide text-muted">THIS WEEK</p>
          <label className="mt-2 block text-sm text-muted">
            Hours you can study
            <select
              value={weeklyHours}
              onChange={(event) => setWeeklyHours(Number(event.target.value))}
              className="mt-1 h-10 w-full rounded-lg border border-border bg-bg px-2 text-fg"
            >
              {hoursOptions.map((hours) => (
                <option key={hours} value={hours}>
                  {hours} hours
                </option>
              ))}
            </select>
          </label>
        </section>
      </div>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Suggested next topics</h2>
        <p className="mt-1 text-sm text-muted">
          Fits about {formatMinutes(weeklyMinutes)} at your chosen pace. It skips nothing you have already marked.
        </p>
        <ul className="mt-3 space-y-2">
          {(hydrated ? plan : topics.slice(0, 4)).map((topic) => (
            <li key={topic.slug}>
              <Link to="/topics/$slug" params={{ slug: topic.slug }} className="flex items-baseline justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-sm font-medium">{topic.title}</span>
                <span className="font-mono text-xs text-muted">{topic.minutes} min</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">By module</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {moduleTopics &&
            ["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12", "m13", "m14", "m15", "m16"].map((id) => {
              const mod = getModule(id);
              const items = moduleTopics(id);
              const count = hydrated ? items.filter((topic) => completed[topic.slug]).length : 0;
              if (!mod) return null;
              return (
                <li key={id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link to="/learn/$module" params={{ module: mod.slug }} className="font-medium hover:text-accent">
                      {mod.title}
                    </Link>
                    <span className="font-mono text-xs text-muted">
                      {hydrated ? count : "–"}/{items.length}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                    <div className="h-full bg-accent" style={{ width: hydrated ? `${Math.round((count / items.length) * 100)}%` : "0%" }} />
                  </div>
                </li>
              );
            })}
        </ul>
      </section>
    </div>
  );
}
