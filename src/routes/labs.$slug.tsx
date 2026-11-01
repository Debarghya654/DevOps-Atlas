import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";
import { getLab, labs } from "@/content/labs";
import { difficultyLabel } from "@/lib/utils";

export const Route = createFileRoute("/labs/$slug")({
  loader: ({ params }) => {
    const lab = getLab(params.slug);
    if (!lab) throw notFound();
    const index = labs.findIndex((item) => item.slug === lab.slug);
    return { lab, prev: labs[index - 1] ?? null, next: labs[index + 1] ?? null };
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.lab.title} · DevOps Atlas` : "Lab" }] }),
  notFoundComponent: () => (
    <div className="px-4 py-16">
      <h1 className="text-2xl font-semibold">Lab not found</h1>
      <Link to="/labs" className="mt-3 inline-block text-accent">
        All labs
      </Link>
    </div>
  ),
  component: LabPage,
});

function LabPage() {
  const { lab, prev, next } = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-reading px-4 py-8 md:px-6">
      <p className="text-sm text-muted">
        <Link to="/labs" className="hover:text-fg">
          Labs
        </Link>
        <span aria-hidden="true"> / </span>
        Lab {lab.code}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{lab.title}</h1>
      <p className="mt-3 text-base leading-7">{lab.objective}</p>
      <p className="mt-3 font-mono text-xs text-muted">
        {difficultyLabel(lab.difficulty)} · {lab.minutes} min
      </p>
      {lab.warning ? (
        <aside className="mt-4 rounded-xl border border-warn/50 bg-warn/10 px-4 py-3 text-sm leading-6">{lab.warning}</aside>
      ) : null}
      <h2 className="mt-8 text-lg font-semibold">Prerequisites</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
        {lab.prerequisites.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-lg font-semibold">Setup</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
        {lab.setup.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-lg font-semibold">Steps</h2>
      <ol className="mt-3 space-y-6">
        {lab.steps.map((step, index) => (
          <li key={step.title}>
            <h3 className="text-base font-semibold">
              {index + 1}. {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6">{step.body}</p>
            <p className="mt-2 text-sm leading-6 text-muted">Why: {step.why}</p>
            {step.code ? <CodeBlock code={step.code} lang={step.lang ?? "text"} title={step.title} note={step.note} /> : null}
          </li>
        ))}
      </ol>
      <h2 className="mt-8 text-lg font-semibold">Verify</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
        {lab.verify.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-lg font-semibold">Common errors</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-surface-2">
            <tr>
              <th className="px-3 py-2">Symptom</th>
              <th className="px-3 py-2">Recovery</th>
            </tr>
          </thead>
          <tbody>
            {lab.errors.map((error) => (
              <tr key={error.symptom} className="border-t border-border align-top">
                <td className="px-3 py-2">{error.symptom}</td>
                <td className="px-3 py-2">{error.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mt-8 text-lg font-semibold">Cleanup</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
        {lab.cleanup.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-lg font-semibold">Checklist</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
        {lab.checklist.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {lab.challenge ? (
        <>
          <h2 className="mt-8 text-lg font-semibold">Optional challenge</h2>
          <p className="mt-2 text-sm leading-6">{lab.challenge}</p>
        </>
      ) : null}
      <nav className="mt-10 flex justify-between gap-4 border-t border-border pt-6 text-sm">
        {prev ? (
          <Link to="/labs/$slug" params={{ slug: prev.slug }} className="text-muted hover:text-fg">
            Previous
            <span className="mt-1 block font-medium text-fg">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to="/labs/$slug" params={{ slug: next.slug }} className="text-right text-muted hover:text-fg">
            Next
            <span className="mt-1 block font-medium text-fg">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
