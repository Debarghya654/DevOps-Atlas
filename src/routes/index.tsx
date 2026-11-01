import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, FlaskConical, FolderGit2 } from "lucide-react";
import { Diagram } from "@/components/diagrams";
import { curriculumMinutes, modules, moduleTopics, topics } from "@/content/catalog";
import { labs } from "@/content/labs";
import { projects } from "@/content/projects";
import { useHydrated, useProgress } from "@/lib/progress-store";
import { formatMinutes } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

const skills = [
  ["Linux", "Shell, files, permissions, services"],
  ["Git", "History, branches, reviews"],
  ["CI/CD", "Pipelines that fail closed"],
  ["Docker", "Images, Compose, runtime"],
  ["Cloud", "AWS core, cost, equivalents"],
  ["IaC", "Terraform plans, Ansible"],
  ["Kubernetes", "Objects and broken Pods"],
  ["Observe", "Metrics, SLOs, alerts"],
  ["Security", "Scans, secrets, hardening"],
];

function Home() {
  const hydrated = useHydrated();
  const completed = useProgress((state) => state.completed);
  const lastSlug = useProgress((state) => state.lastSlug);
  const done = hydrated ? topics.filter((topic) => completed[topic.slug]).length : 0;
  const last = topics.find((topic) => topic.slug === lastSlug);
  const next = topics.find((topic) => !completed[topic.slug]) ?? topics[0];
  const continueTopic = last ?? next;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div>
            <p className="font-mono text-xs tracking-wide text-accent">DEVOPS ATLAS</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-fg md:text-5xl md:leading-tight">
              Your path from beginner to DevOps Engineer.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              A text-first curriculum: prose, diagrams, commands, labs, and questions. No video playlist. You start with no assumed
              production access and practice on your own machine.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/topics/$slug"
                params={{ slug: continueTopic.slug }}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-fg"
              >
                {hydrated && done > 0 ? "Continue learning" : "Start learning"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/roadmap"
                className="inline-flex h-11 items-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-fg"
              >
                Explore the roadmap
              </Link>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Self-paced study resource. It does not guarantee a job, a certification, or a salary. Hiring depends on what you can
              demonstrate.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
            <p className="text-xs font-semibold tracking-wide text-muted">IN THIS BROWSER</p>
            <p className="mt-2 font-mono text-3xl text-fg">{hydrated ? `${Math.round((done / topics.length) * 100)}%` : "–"}</p>
            <p className="text-sm text-muted">
              {hydrated ? `${done} of ${topics.length} topics marked complete` : "Progress loads locally"}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {formatMinutes(curriculumMinutes())} of reading across {modules.length} modules, plus labs and projects. Progress is
              stored only on this device.
            </p>
            {hydrated && last ? (
              <p className="mt-3 text-sm text-fg">
                Last opened: <span className="font-medium">{last.title}</span>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="max-w-reading">
          <h2 className="text-xl font-semibold tracking-tight">How a change is supposed to move</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            The loop is the map for the rest of the course. Each module hangs off one of these stages.
          </p>
        </div>
        <Diagram id="infinity" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4 md:px-6">
        <h2 className="text-xl font-semibold tracking-tight">What you will be able to talk about</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map(([title, body]) => (
            <li key={title} className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-sm font-semibold text-fg">{title}</p>
              <p className="mt-1 text-sm text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Curriculum</h2>
          <Link to="/learn" className="text-sm font-medium text-accent">
            All modules
          </Link>
        </div>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {modules.map((mod) => {
            const items = moduleTopics(mod.id);
            const count = hydrated ? items.filter((topic) => completed[topic.slug]).length : 0;
            return (
              <li key={mod.id}>
                <Link
                  to="/learn/$module"
                  params={{ module: mod.slug }}
                  className="block h-full rounded-xl border border-border bg-surface p-4 hover:border-accent"
                >
                  <p className="font-mono text-xs text-accent">
                    Module {mod.number}
                    {mod.optional ? " · optional" : ""}
                  </p>
                  <p className="mt-1 font-semibold text-fg">{mod.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{mod.summary}</p>
                  <p className="mt-3 font-mono text-xs text-muted">
                    {hydrated ? `${count}/${items.length} complete` : `${items.length} topics`}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 md:px-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="size-4 text-accent" aria-hidden="true" />
            <h2 className="text-xl font-semibold tracking-tight">Labs</h2>
          </div>
          <ul className="mt-4 space-y-2">
            {labs.slice(0, 5).map((lab) => (
              <li key={lab.slug}>
                <Link to="/labs/$slug" params={{ slug: lab.slug }} className="block rounded-lg border border-border bg-surface px-3 py-2 hover:border-accent">
                  <span className="font-mono text-xs text-accent">Lab {lab.code}</span>
                  <span className="mt-0.5 block text-sm font-medium text-fg">{lab.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/labs" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
            All labs <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="size-4 text-accent" aria-hidden="true" />
            <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
          </div>
          <ul className="mt-4 space-y-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className="block rounded-lg border border-border bg-surface px-3 py-2 hover:border-accent"
                >
                  <span className="font-mono text-xs text-accent">Project {project.number}</span>
                  <span className="mt-0.5 block text-sm font-medium text-fg">{project.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 md:px-6">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold">First hour, if you are new</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Read what DevOps is, then the lifecycle. Do not open Kubernetes first. The roadmap says the same thing with dates.
            </p>
          </div>
          <Link
            to="/topics/$slug"
            params={{ slug: "what-is-devops" }}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            What is DevOps?
          </Link>
        </div>
      </section>
    </div>
  );
}
