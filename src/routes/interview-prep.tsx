import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getTopic } from "@/content/catalog";
import { interviewCategories, interviewItems } from "@/content/interview";
import type { InterviewItem } from "@/content/types";
import { difficultyLabel } from "@/lib/utils";

export const Route = createFileRoute("/interview-prep")({
  head: () => ({ meta: [{ title: "Interview practice · DevOps Atlas" }] }),
  component: InterviewPage,
});

function InterviewPage() {
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState<"browse" | "mock">("browse");
  const filtered = interviewItems.filter((item) => category === "All" || item.category === category);
  return (
    <div className="mx-auto max-w-reading px-4 py-8 md:px-6">
      <p className="font-mono text-xs text-accent">INTERVIEW</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Practice out loud</h1>
      <p className="mt-3 text-muted">
        Junior answers, not trivia. Hints stay closed until you ask. This is not a prediction of any company’s questions, and a
        high score here is not an offer.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="h-10 rounded-lg border border-border px-3 text-sm" onClick={() => setMode(mode === "mock" ? "browse" : "mock")}>
          {mode === "mock" ? "Exit mock mode" : "Start mock mode"}
        </button>
        <label className="flex h-10 items-center gap-2 text-sm text-muted">
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-lg border border-border bg-surface px-2 text-fg">
            <option>All</option>
            {interviewCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      {mode === "mock" ? <Mock key={category} items={filtered} /> : <Browse items={filtered} />}
      <p className="mt-8 text-sm text-muted">
        Also read{" "}
        <Link to="/topics/$slug" params={{ slug: "interview-prep-freshers" }} className="text-accent">
          Interview preparation for freshers
        </Link>
        .
      </p>
    </div>
  );
}

function Browse({ items }: { items: InterviewItem[] }) {
  return (
    <ol className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-xl border border-border bg-surface p-4">
          <p className="font-mono text-xs text-muted">
            {item.category} · {difficultyLabel(item.difficulty)} · {item.kind}
          </p>
          <p className="mt-2 text-sm font-medium leading-6">{item.prompt}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-accent">Hint</summary>
            <p className="mt-1 text-sm leading-6 text-muted">{item.hint}</p>
          </details>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-accent">Sample answer</summary>
            <p className="mt-1 text-sm leading-6 text-muted">{item.answer}</p>
          </details>
        </li>
      ))}
    </ol>
  );
}

function Mock({ items }: { items: InterviewItem[] }) {
  const deck = useMemo(() => items.slice(0, 8), [items]);
  const [index, setIndex] = useState(0);
  const [hint, setHint] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  if (index >= deck.length) {
    const total = scores.reduce((sum, value) => sum + value, 0);
    return (
      <aside className="mt-6 rounded-xl border border-border bg-surface p-4">
        <h2 className="text-lg font-semibold">Mock result</h2>
        <p className="mt-2 text-sm leading-6">
          You scored {total} out of {deck.length * 2}. Two points is a clear, correct answer. One is partial. Zero means practice
          the explanation again. This does not measure production experience.
        </p>
      </aside>
    );
  }
  const item = deck[index];
  if (!item) return <p className="mt-6 text-sm text-muted">No questions in this category.</p>;
  return (
    <section className="mt-6 rounded-xl border border-border bg-surface p-4" aria-label="Mock question">
      <p className="font-mono text-xs text-muted">
        Question {index + 1} of {deck.length}
      </p>
      <h2 className="mt-2 text-lg font-semibold leading-7">{item.prompt}</h2>
      {hint ? <p className="mt-3 text-sm leading-6 text-muted">{item.hint}</p> : null}
      {reveal ? <p className="mt-3 text-sm leading-6">{item.answer}</p> : null}
      {item.topic && getTopic(item.topic) ? (
        <Link to="/topics/$slug" params={{ slug: item.topic }} className="mt-3 inline-block text-sm text-accent">
          Related lesson
        </Link>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="h-10 rounded-lg border border-border px-3 text-sm" onClick={() => setHint(true)}>
          Hint
        </button>
        <button type="button" className="h-10 rounded-lg border border-border px-3 text-sm" onClick={() => setReveal(true)}>
          Sample answer
        </button>
      </div>
      {reveal ? (
        <div className="mt-4">
          <p className="text-sm font-medium">Score your answer</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              ["Clear", 2],
              ["Partial", 1],
              ["Missed", 0],
            ].map(([label, value]) => (
              <button
                key={label}
                type="button"
                className="h-10 rounded-lg bg-accent px-3 text-sm font-semibold text-accent-fg"
                onClick={() => {
                  setScores((current) => [...current, Number(value)]);
                  setIndex((current) => current + 1);
                  setHint(false);
                  setReveal(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
