import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject } from "@/content/projects";
import { difficultyLabel } from "@/lib/utils";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.project.title} · DevOps Atlas` : "Project" }],
  }),
  notFoundComponent: () => (
    <div className="px-4 py-16">
      <h1 className="text-2xl font-semibold">Project not found</h1>
      <Link to="/projects" className="mt-3 inline-block text-accent">
        All projects
      </Link>
    </div>
  ),
  component: ProjectPage,
});

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function ProjectPage() {
  const { project } = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-reading px-4 py-8 md:px-6">
      <p className="text-sm text-muted">
        <Link to="/projects" className="hover:text-fg">
          Projects
        </Link>
        <span aria-hidden="true"> / </span>
        {project.number}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-3 text-base leading-7">{project.summary}</p>
      <p className="mt-3 font-mono text-xs text-muted">
        {difficultyLabel(project.difficulty)} · {project.effort}
      </p>
      {project.warning ? (
        <aside className="mt-4 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm leading-6">{project.warning}</aside>
      ) : null}
      <Block title="Outcomes" items={project.outcomes} />
      <Block title="Architecture" items={project.architecture} />
      <h2 className="mt-8 text-lg font-semibold">Suggested repository layout</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-surface-2">
            <tr>
              <th className="px-3 py-2">Path</th>
              <th className="px-3 py-2">Why it is there</th>
            </tr>
          </thead>
          <tbody>
            {project.tree.map((row) => (
              <tr key={row.path} className="border-t border-border align-top">
                <td className="px-3 py-2 font-mono text-xs">{row.path}</td>
                <td className="px-3 py-2">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mt-8 text-lg font-semibold">Build sequence</h2>
      <ol className="mt-3 space-y-4">
        {project.steps.map((step, index) => (
          <li key={step.title}>
            <h3 className="text-base font-semibold">
              {index + 1}. {step.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
      <Block title="Deliverables" items={project.deliverables} />
      <Block title="Validation" items={project.validation} />
      <Block title="Interview talking points" items={project.talkingPoints} />
    </article>
  );
}
