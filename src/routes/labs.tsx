import { createFileRoute, Link } from "@tanstack/react-router";
import { labs } from "@/content/labs";
import { difficultyLabel } from "@/lib/utils";

export const Route = createFileRoute("/labs")({
  head: () => ({ meta: [{ title: "Labs · DevOps Atlas" }] }),
  component: LabsPage,
});

function LabsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <p className="font-mono text-xs text-accent">LABS</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Hands-on labs</h1>
      <p className="mt-3 max-w-reading text-muted">
        These run on your machine. This site does not deploy cloud resources, start containers, or mark a lab done because you
        opened the page. If a tool is missing, the lab says so. Paper reviews are labeled as reviews.
      </p>
      <ol className="mt-8 grid gap-3 md:grid-cols-2">
        {labs.map((lab) => (
          <li key={lab.slug}>
            <Link to="/labs/$slug" params={{ slug: lab.slug }} className="block h-full rounded-xl border border-border bg-surface p-4 hover:border-accent">
              <p className="font-mono text-xs text-accent">
                Lab {lab.code} · {difficultyLabel(lab.difficulty)} · {lab.minutes} min
              </p>
              <h2 className="mt-1 font-semibold">{lab.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{lab.objective}</p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
