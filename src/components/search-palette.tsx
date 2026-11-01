import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { getModule, modules, topics } from "@/content/catalog";
import { glossary } from "@/content/glossary";
import { interviewItems } from "@/content/interview";
import { labs } from "@/content/labs";
import { loadAllLessons } from "@/content/load";
import { projects } from "@/content/projects";
import { quizzes } from "@/content/quizzes";
import { searchDocs, snippetAround, type SearchDoc, type SearchKind } from "@/content/search";
import type { Lesson } from "@/content/types";

function blockText(lesson: Lesson): string {
  return lesson.blocks
    .map((block) => {
      if (block.type === "p" || block.type === "h2" || block.type === "h3") return block.text;
      if (block.type === "ul" || block.type === "ol") return block.items.join(" ");
      if (block.type === "callout") return `${block.title} ${block.text}`;
      if (block.type === "code") return `${block.title ?? ""} ${block.code}`;
      if (block.type === "table") return [...block.headers, ...block.rows.flat()].join(" ");
      return "";
    })
    .join("\n");
}

function staticDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const topic of topics) {
    const mod = getModule(topic.moduleId);
    docs.push({
      id: `topic-${topic.slug}`,
      kind: "lesson",
      title: topic.title,
      text: `${topic.summary} ${topic.brief} ${topic.objectives.join(" ")} ${topic.tags.join(" ")}`,
      snippet: topic.summary,
      href: `/topics/${topic.slug}`,
      moduleId: topic.moduleId,
      difficulty: topic.difficulty,
    });
    if (mod) docs[docs.length - 1].text += ` ${mod.title}`;
  }
  for (const lab of labs) {
    docs.push({
      id: `lab-${lab.slug}`,
      kind: "lab",
      title: lab.title,
      text: `${lab.objective} ${lab.steps.map((step) => `${step.title} ${step.body} ${step.code ?? ""}`).join(" ")}`,
      snippet: lab.objective,
      href: `/labs/${lab.slug}`,
      difficulty: lab.difficulty,
    });
  }
  for (const project of projects) {
    docs.push({
      id: `project-${project.slug}`,
      kind: "project",
      title: project.title,
      text: `${project.summary} ${project.outcomes.join(" ")} ${project.steps.map((step) => step.body).join(" ")}`,
      snippet: project.summary,
      href: `/projects/${project.slug}`,
      difficulty: project.difficulty,
    });
  }
  for (const entry of glossary) {
    docs.push({
      id: `gloss-${entry.slug}`,
      kind: "glossary",
      title: entry.term,
      text: entry.definition,
      snippet: entry.definition,
      href: `/glossary#${entry.slug}`,
      moduleId: entry.moduleId,
    });
  }
  for (const quiz of quizzes) {
    docs.push({
      id: `quiz-${quiz.id}`,
      kind: "quiz",
      title: quiz.title,
      text: `${quiz.summary} ${quiz.questions.map((question) => question.prompt).join(" ")}`,
      snippet: quiz.summary,
      href: `/quizzes/${quiz.id}`,
      moduleId: quiz.moduleId,
    });
  }
  for (const item of interviewItems) {
    docs.push({
      id: `int-${item.id}`,
      kind: "interview",
      title: item.prompt,
      text: `${item.category} ${item.hint} ${item.answer}`,
      snippet: item.hint,
      href: "/interview-prep",
      difficulty: item.difficulty,
    });
  }
  return docs;
}

const kindLabel: Record<SearchKind, string> = {
  lesson: "Lesson",
  lab: "Lab",
  project: "Project",
  glossary: "Glossary",
  quiz: "Quiz",
  interview: "Interview",
};

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<SearchKind | "all">("all");
  const [moduleId, setModuleId] = useState("all");
  const [active, setActive] = useState(0);
  const [lessonDocs, setLessonDocs] = useState<SearchDoc[] | null>(null);
  const base = useMemo(() => staticDocs(), []);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    let cancelled = false;
    if (!lessonDocs) {
      void loadAllLessons().then((lessons) => {
        if (cancelled) return;
        setLessonDocs(
          lessons.map((lesson) => {
            const topic = topics.find((item) => item.slug === lesson.slug);
            return {
              id: `body-${lesson.slug}`,
              kind: "lesson" as const,
              title: lesson.title,
              text: blockText(lesson),
              snippet: topic?.summary ?? lesson.title,
              href: `/topics/${lesson.slug}`,
              moduleId: topic?.moduleId,
              difficulty: topic?.difficulty,
            };
          }),
        );
      });
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, lessonDocs]);

  const results = useMemo(() => {
    const docs = lessonDocs ? [...base, ...lessonDocs] : base;
    return searchDocs(docs, query, 40).filter((hit) => {
      if (kind !== "all" && hit.kind !== kind) return false;
      if (moduleId !== "all" && hit.moduleId && hit.moduleId !== moduleId) return false;
      if (moduleId !== "all" && !hit.moduleId) return false;
      return true;
    });
  }, [base, lessonDocs, query, kind, moduleId]);

  useEffect(() => setActive(0), [query, kind, moduleId]);

  if (!open) return null;

  function go(href: string) {
    onClose();
    void router.history.push(href);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button type="button" className="absolute inset-0 bg-bg/80" aria-label="Close search" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the curriculum"
        className="relative z-10 flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card"
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="size-4 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lessons, commands, glossary, interviews"
            className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
            aria-controls={listId}
            aria-activedescendant={results[active]?.id}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((value) => Math.min(value + 1, Math.max(results.length - 1, 0)));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((value) => Math.max(value - 1, 0));
              } else if (event.key === "Enter" && results[active]) {
                event.preventDefault();
                go(results[active].href);
              }
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2 border-b border-border px-3 py-2">
          <label className="text-xs text-muted">
            Type
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value as SearchKind | "all")}
              className="ml-2 h-8 rounded-md border border-border bg-bg px-2 text-xs text-fg"
            >
              <option value="all">All</option>
              {(Object.keys(kindLabel) as SearchKind[]).map((item) => (
                <option key={item} value={item}>
                  {kindLabel[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted">
            Module
            <select
              value={moduleId}
              onChange={(event) => setModuleId(event.target.value)}
              className="ml-2 h-8 max-w-48 rounded-md border border-border bg-bg px-2 text-xs text-fg"
            >
              <option value="all">All modules</option>
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.number}. {mod.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ul id={listId} role="listbox" className="overflow-y-auto p-2">
          {query.trim().length < 2 ? (
            <li className="px-3 py-6 text-sm text-muted">Type at least two characters. Search covers titles, summaries, lesson text, labs, and interview prompts.</li>
          ) : results.length === 0 ? (
            <li className="px-3 py-6 text-sm text-muted">No matches. Try a command, a status code, or a tool name.</li>
          ) : (
            results.map((hit, index) => {
              const mod = hit.moduleId ? getModule(hit.moduleId) : undefined;
              return (
                <li key={hit.id} id={hit.id} role="option" aria-selected={index === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(hit.href)}
                    className={`w-full rounded-lg px-3 py-2 text-left ${index === active ? "bg-surface-2" : ""}`}
                  >
                    <span className="flex items-center gap-2 text-xs text-muted">
                      <span className="text-accent">{kindLabel[hit.kind]}</span>
                      {mod ? <span>{mod.title}</span> : null}
                    </span>
                    <span className="mt-0.5 block text-sm font-medium text-fg">{hit.title}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted">{snippetAround(hit.text, query)}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
