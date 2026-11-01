import { createFileRoute, Link } from "@tanstack/react-router";
import { projects } from "@/content/projects";
import { difficultyLabel } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects · DevOps Atlas" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <p className="font-mono text-xs text-accent">PROJECTS</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Build something you can explain</h1>
      <p className="mt-3 max-w-reading text-muted">
        Six projects, in a sensible order. They are specifications and review criteria, not a hosted cluster. Say when a result
        came from your laptop.
      </p>
      <ol className="mt-8 space-y-3">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link to="/projects/$slug" params={{ slug: project.slug }} className="block rounded-xl border border-border bg-surface p-4 hover:border-accent">
              <p className="font-mono text-xs text-accent">
                Project {project.number} · {difficultyLabel(project.difficulty)} · {project.effort}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{project.title}</h2>
              <p className="mt-2 max-w-reading text-sm leading-6 text-muted">{project.summary}</p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
