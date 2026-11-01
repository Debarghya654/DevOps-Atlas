import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getModule, moduleTopics } from "@/content/catalog";
import { useHydrated, useProgress } from "@/lib/progress-store";
import { difficultyLabel } from "@/lib/utils";

export const Route = createFileRoute("/learn/$module")({
  loader: ({ params }) => {
    const mod = getModule(params.module);
    if (!mod) throw notFound();
    return { mod, items: moduleTopics(mod.id) };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.mod.title} · DevOps Atlas` : "Module · DevOps Atlas" }],
  }),
  notFoundComponent: () => (
    <div className="px-4 py-16 md:px-6">
      <h1 className="text-2xl font-semibold">Module not found</h1>
      <Link to="/learn" className="mt-3 inline-block text-accent">
        Back to the curriculum
      </Link>
    </div>
  ),
  component: ModulePage,
});

function ModulePage() {
  const { mod, items } = Route.useLoaderData();
  const hydrated = useHydrated();
  const completed = useProgress((state) => state.completed);
  const done = items.filter((topic) => completed[topic.slug]).length;
  return (
    <div className="mx-auto max-w-reading px-4 py-8 md:px-6">
      <p className="text-sm text-muted">
        <Link to="/learn" className="hover:text-fg">
          Curriculum
        </Link>
        <span aria-hidden="true"> / </span>
        Module {mod.number}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{mod.title}</h1>
      <p className="mt-3 text-base leading-7 text-muted">{mod.summary}</p>
      {mod.optional ? (
        <p className="mt-3 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted">
          Optional. Useful once the earlier modules are solid, not a prerequisite for a junior interview.
        </p>
      ) : null}
      <h2 className="mt-8 text-sm font-semibold tracking-wide text-muted">OUTCOMES</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
        {mod.outcomes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-sm font-semibold tracking-wide text-muted">
        COMPLETION {hydrated ? `· ${done}/${items.length}` : ""}
      </h2>
      <ol className="mt-3 space-y-2">
        {items.map((topic, index) => (
          <li key={topic.slug}>
            <Link to="/topics/$slug" params={{ slug: topic.slug }} className="block rounded-xl border border-border bg-surface px-4 py-3 hover:border-accent">
              <span className="font-mono text-xs text-muted">
                {String(index + 1).padStart(2, "0")} · {topic.depth === "full" ? "Full lesson" : "Primer"} ·{" "}
                {difficultyLabel(topic.difficulty)} · {topic.minutes} min
                {hydrated && completed[topic.slug] ? " · done" : ""}
              </span>
              <span className="mt-1 block font-semibold text-fg">{topic.title}</span>
              <span className="mt-1 block text-sm leading-6 text-muted">{topic.summary}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
