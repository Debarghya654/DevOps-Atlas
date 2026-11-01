import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getModule } from "@/content/catalog";
import { glossary, glossaryByLetter } from "@/content/glossary";

export const Route = createFileRoute("/glossary")({
  head: () => ({ meta: [{ title: "Glossary · DevOps Atlas" }] }),
  component: GlossaryPage,
});

function GlossaryPage() {
  const groups = useMemo(() => glossaryByLetter(), []);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = glossary[index % glossary.length];
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <p className="font-mono text-xs text-accent">GLOSSARY</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Terms, said once</h1>
      <p className="mt-3 max-w-reading text-muted">
        Short definitions linked to the module that teaches them. Flashcards use the same list. Nothing is sent off this browser.
      </p>
      <section className="mt-6 max-w-reading rounded-xl border border-border bg-surface p-4" aria-label="Flashcard">
        <p className="font-mono text-xs text-muted">
          Card {index + 1} of {glossary.length}
        </p>
        <button type="button" onClick={() => setFlipped((value) => !value)} className="mt-3 min-h-24 w-full text-left">
          <span className="block text-xl font-semibold">{flipped ? card.definition : card.term}</span>
          <span className="mt-2 block text-xs text-muted">{flipped ? "Click for the term" : "Click to reveal the definition"}</span>
        </button>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="h-10 rounded-lg border border-border px-3 text-sm"
            onClick={() => {
              setIndex((value) => (value + glossary.length - 1) % glossary.length);
              setFlipped(false);
            }}
          >
            Previous
          </button>
          <button
            type="button"
            className="h-10 rounded-lg border border-border px-3 text-sm"
            onClick={() => {
              setIndex((value) => (value + 1) % glossary.length);
              setFlipped(false);
            }}
          >
            Next
          </button>
        </div>
      </section>
      <div className="mt-8 space-y-8">
        {groups.map((group) => (
          <section key={group.letter} aria-labelledby={`letter-${group.letter}`}>
            <h2 id={`letter-${group.letter}`} className="font-mono text-sm text-accent">
              {group.letter}
            </h2>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {group.entries.map((entry) => {
                const mod = getModule(entry.moduleId);
                return (
                  <li key={entry.slug} id={entry.slug} className="scroll-mt-24 rounded-xl border border-border bg-surface p-4">
                    <h3 className="font-semibold">{entry.term}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{entry.definition}</p>
                    {mod ? (
                      <Link to="/learn/$module" params={{ module: mod.slug }} className="mt-2 inline-block text-sm text-accent">
                        {mod.title}
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
