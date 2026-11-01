import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, Check } from "lucide-react";
import { headingIds, LessonBody } from "@/components/lesson-body";
import { getModule, getTopic, topicNeighbors } from "@/content/catalog";
import { loadLesson } from "@/content/load";
import { useHydrated, useProgress } from "@/lib/progress-store";
import { difficultyLabel } from "@/lib/utils";

export const Route = createFileRoute("/topics/$slug")({
  loader: async ({ params }) => {
    const topic = getTopic(params.slug);
    if (!topic) throw notFound();
    const lesson = await loadLesson(topic.moduleId, topic.slug);
    return { topic, lesson };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.topic.title} · DevOps Atlas` : "Topic · DevOps Atlas" }],
  }),
  notFoundComponent: () => (
    <div className="px-4 py-16">
      <h1 className="text-2xl font-semibold">Topic not found</h1>
      <Link to="/learn" className="mt-3 inline-block text-accent">
        Browse the curriculum
      </Link>
    </div>
  ),
  component: TopicPage,
});

function TopicPage() {
  const { topic, lesson } = Route.useLoaderData();
  const mod = getModule(topic.moduleId);
  const { prev, next } = topicNeighbors(topic.slug);
  const hydrated = useHydrated();
  const completed = useProgress((state) => state.completed[topic.slug]);
  const bookmarked = useProgress((state) => state.bookmarks.includes(topic.slug));
  const savedNote = useProgress((state) => state.notes[topic.slug] ?? "");
  const checks = useProgress((state) => state.exerciseChecks[topic.slug] ?? {});
  const markComplete = useProgress((state) => state.markComplete);
  const toggleBookmark = useProgress((state) => state.toggleBookmark);
  const setNote = useProgress((state) => state.setNote);
  const toggleExercise = useProgress((state) => state.toggleExercise);
  const setLast = useProgress((state) => state.setLast);
  const [draft, setDraft] = useState<string | null>(null);
  const [openCheck, setOpenCheck] = useState<number | null>(null);

  useEffect(() => {
    setLast(topic.slug);
    setDraft(null);
    setOpenCheck(null);
  }, [topic.slug, setLast]);

  useEffect(() => {
    if (draft === null) return;
    const handle = window.setTimeout(() => setNote(topic.slug, draft), 350);
    return () => window.clearTimeout(handle);
  }, [draft, setNote, topic.slug]);

  const headings = lesson ? headingIds(lesson.blocks) : [];
  const depth = lesson?.status ?? "primer";
  const hasBody = Boolean(lesson && lesson.blocks.length > 0);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <article className="min-w-0 max-w-reading">
        <p className="text-sm text-muted">
          <Link to="/learn" className="hover:text-fg">
            Curriculum
          </Link>
          {mod ? (
            <>
              <span aria-hidden="true"> / </span>
              <Link to="/learn/$module" params={{ module: mod.slug }} className="hover:text-fg">
                {mod.title}
              </Link>
            </>
          ) : null}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">{topic.title}</h1>
        <p className="mt-3 text-base leading-7 text-muted">{topic.summary}</p>
        <dl className="mt-4 flex flex-wrap gap-2 text-xs">
          <div className="rounded-full border border-border px-2.5 py-1 text-muted">{difficultyLabel(topic.difficulty)}</div>
          <div className="rounded-full border border-border px-2.5 py-1 text-muted">{topic.minutes} min read</div>
          <div className="rounded-full border border-border px-2.5 py-1 text-muted">{depth === "full" && hasBody ? "Full lesson" : "Primer"}</div>
          {topic.tags.slice(0, 3).map((tag) => (
            <div key={tag} className="rounded-full border border-border px-2.5 py-1 font-mono text-muted">
              {tag}
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => markComplete(topic.slug, !completed)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-3 text-sm font-semibold text-accent-fg"
          >
            <Check className="size-4" aria-hidden="true" />
            {completed ? "Completed" : "Mark complete"}
          </button>
          <button
            type="button"
            onClick={() => toggleBookmark(topic.slug)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium"
            aria-pressed={bookmarked}
          >
            <Bookmark className="size-4" aria-hidden="true" />
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>

        <section className="mt-8" aria-label="Objectives">
          <h2 className="text-sm font-semibold tracking-wide text-muted">OBJECTIVES</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
            {topic.objectives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {topic.prerequisites.length > 0 ? (
            <p className="mt-3 text-sm text-muted">
              Prerequisites:{" "}
              {topic.prerequisites.map((slug, index) => {
                const prereq = getTopic(slug);
                return (
                  <span key={slug}>
                    {index > 0 ? ", " : null}
                    {prereq ? (
                      <Link to="/topics/$slug" params={{ slug }} className="text-accent">
                        {prereq.title}
                      </Link>
                    ) : (
                      slug
                    )}
                  </span>
                );
              })}
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted">No prior topic is required. Comfort with reading technical English is enough.</p>
          )}
        </section>

        {headings.length > 0 ? (
          <details className="mt-6 rounded-xl border border-border bg-surface p-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold">On this page</summary>
            <ul className="mt-2 space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`} className="text-sm text-muted hover:text-fg">
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        {hasBody && lesson ? (
          <LessonBody blocks={lesson.blocks} />
        ) : (
          <div className="mt-8">
            <aside className="rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm leading-6">
              This page is a primer outline. The long-form lesson is not in this build yet, so it is not marked as a full lesson.
            </aside>
            <p className="mt-4 text-base leading-7">{topic.brief}</p>
          </div>
        )}

        {lesson?.exercise ? (
          <section className="mt-10 rounded-xl border border-border bg-surface p-4" aria-label="Exercise">
            <h2 className="text-lg font-semibold">{lesson.exercise.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{lesson.exercise.prompt}</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6">
              {lesson.exercise.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <h3 className="mt-4 text-sm font-semibold">Acceptance criteria</h3>
            <ul className="mt-2 space-y-2">
              {lesson.exercise.criteria.map((criterion, index) => (
                <li key={criterion}>
                  <label className="flex items-start gap-2 text-sm leading-6">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 accent-accent"
                      checked={Boolean(checks[index])}
                      onChange={() => toggleExercise(topic.slug, index)}
                    />
                    <span>{criterion}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {lesson && lesson.checks.length > 0 ? (
          <section className="mt-10" aria-label="Knowledge checks">
            <h2 className="text-lg font-semibold">Knowledge checks</h2>
            <p className="mt-1 text-sm text-muted">Answers stay hidden until you ask for them.</p>
            <ol className="mt-4 space-y-4">
              {lesson.checks.map((item, index) => (
                <li key={item.q} className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-sm font-medium leading-6">
                    {index + 1}. {item.q}
                  </p>
                  {openCheck === index ? (
                    <p className="mt-2 text-sm leading-6 text-muted">{item.a}</p>
                  ) : (
                    <button type="button" className="mt-3 text-sm font-medium text-accent" onClick={() => setOpenCheck(index)}>
                      Show answer
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {lesson && lesson.interview.length > 0 ? (
          <section className="mt-10" aria-label="Interview questions">
            <h2 className="text-lg font-semibold">Interview questions</h2>
            <div className="mt-3 space-y-3">
              {lesson.interview.map((item) => (
                <details key={item.q} className="rounded-xl border border-border bg-surface px-4 py-3">
                  <summary className="cursor-pointer text-sm font-medium leading-6">{item.q}</summary>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {lesson && lesson.takeaways.length > 0 ? (
          <section className="mt-10" aria-label="Takeaways">
            <h2 className="text-lg font-semibold">Key takeaways</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
              {lesson.takeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-10" aria-label="Notes">
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="mt-1 text-sm text-muted">Saved in this browser only.</p>
          <textarea
            value={draft ?? (hydrated ? savedNote : "")}
            onChange={(event) => setDraft(event.target.value)}
            disabled={!hydrated}
            rows={5}
            className="mt-3 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm leading-6 text-fg"
            aria-label="Personal notes for this topic"
            placeholder="Write a reminder you will actually use."
          />
        </section>

        <nav className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between" aria-label="Topic">
          {prev ? (
            <Link to="/topics/$slug" params={{ slug: prev.slug }} className="text-sm text-muted hover:text-fg">
              Previous
              <span className="mt-1 block font-medium text-fg">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to="/topics/$slug" params={{ slug: next.slug }} className="text-sm text-muted hover:text-fg sm:text-right">
              Next
              <span className="mt-1 block font-medium text-fg">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </article>
      <aside className="hidden lg:block">
        <nav aria-label="On this page" className="sticky top-20">
          <p className="text-xs font-semibold tracking-wide text-muted">ON THIS PAGE</p>
          <ul className="mt-3 space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a href={`#${heading.id}`} className="text-sm leading-5 text-muted hover:text-fg">
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
