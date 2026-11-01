import { createFileRoute, Link } from "@tanstack/react-router";
import { curriculumMinutes, modules, moduleTopics, topics } from "@/content/catalog";
import { useHydrated, useProgress } from "@/lib/progress-store";
import { difficultyLabel, formatMinutes } from "@/lib/utils";

export const Route = createFileRoute("/learn")({
  head: () => ({ meta: [{ title: "Curriculum · DevOps Atlas" }] }),
  component: LearnIndex,
});

function LearnIndex() {
  const hydrated = useHydrated();
  const completed = useProgress((state) => state.completed);
  const done = hydrated ? topics.filter((topic) => completed[topic.slug]).length : 0;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <p className="font-mono text-xs text-accent">CURRICULUM</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Seventeen modules, in order</h1>
      <p className="mt-3 max-w-reading text-muted">
        {topics.length} topics, about {formatMinutes(curriculumMinutes())} of reading. Full lessons are the ones to study deeply.
        Primers are shorter and still real. Nothing here is marked complete until you mark it.
        {hydrated ? ` You have marked ${done}.` : ""}
      </p>
      <ol className="mt-8 space-y-4">
        {modules.map((mod) => {
          const items = moduleTopics(mod.id);
          const count = hydrated ? items.filter((topic) => completed[topic.slug]).length : 0;
          return (
            <li key={mod.id} className="rounded-xl border border-border bg-surface p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-accent">
                    Module {mod.number}
                    {mod.optional ? " · optional" : ""}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    <Link to="/learn/$module" params={{ module: mod.slug }} className="hover:text-accent">
                      {mod.title}
                    </Link>
                  </h2>
                  <p className="mt-1 max-w-reading text-sm leading-6 text-muted">{mod.summary}</p>
                </div>
                <p className="font-mono text-xs text-muted">
                  {hydrated ? `${count}/` : ""}
                  {items.length} topics
                </p>
              </div>
              <ul className="mt-4 grid gap-2 md:grid-cols-2">
                {items.map((topic) => (
                  <li key={topic.slug}>
                    <Link to="/topics/$slug" params={{ slug: topic.slug }} className="flex items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-2">
                      <span className="text-sm text-fg">
                        {hydrated && completed[topic.slug] ? <span className="mr-2 text-ok" aria-label="Complete">●</span> : null}
                        {topic.title}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-muted">
                        {difficultyLabel(topic.difficulty)} · {topic.minutes}m
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
