import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getTopic } from "@/content/catalog";
import { getQuiz } from "@/content/quizzes";
import type { Quiz, QuizQuestion } from "@/content/types";
import { useProgress } from "@/lib/progress-store";
import { difficultyLabel } from "@/lib/utils";

export const Route = createFileRoute("/quizzes/$id")({
  loader: ({ params }) => {
    const quiz = getQuiz(params.id);
    if (!quiz) throw notFound();
    return { quiz };
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.quiz.title} · DevOps Atlas` : "Quiz" }] }),
  notFoundComponent: () => (
    <div className="px-4 py-16">
      <h1 className="text-2xl font-semibold">Quiz not found</h1>
      <Link to="/quizzes" className="mt-3 inline-block text-accent">
        All quizzes
      </Link>
    </div>
  ),
  component: QuizPage,
});

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function pointsFor(question: QuizQuestion, choice: string | undefined, self: number | undefined): number | null {
  if (question.kind === "short") {
    if (self === undefined) return null;
    return self;
  }
  if (choice === undefined) return 0;
  if (question.kind === "tf") return choice === String(question.answer) ? 1 : 0;
  return Number(choice) === question.answer ? 1 : 0;
}

function QuizPage() {
  const { quiz } = Route.useLoaderData();
  return <Runner key={quiz.id} quiz={quiz} />;
}

function Runner({ quiz }: { quiz: Quiz }) {
  const saveQuiz = useProgress((state) => state.saveQuiz);
  const [order, setOrder] = useState(quiz.questions);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [text, setText] = useState<Record<string, string>>({});
  const [self, setSelf] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    let total = 0;
    let earned = 0;
    const missed = new Set<string>();
    for (const question of order) {
      const value = pointsFor(question, choices[question.id], self[question.id]);
      if (question.kind === "short" && value === null) continue;
      total += 1;
      earned += value ?? 0;
      if ((value ?? 0) < 1) missed.add(question.topic);
    }
    return { earned, total, missed: [...missed] };
  }, [order, choices, self]);

  function submit() {
    setSubmitted(true);
    const missed = new Set<string>();
    let earned = 0;
    let total = 0;
    for (const question of order) {
      if (question.kind === "short") continue;
      total += 1;
      const value = pointsFor(question, choices[question.id], undefined) ?? 0;
      earned += value;
      if (value < 1) missed.add(question.topic);
    }
    saveQuiz(quiz.id, { score: earned, total, at: Date.now(), missedTopics: [...missed] });
  }

  return (
    <div className="mx-auto max-w-reading px-4 py-8 md:px-6">
      <p className="text-sm text-muted">
        <Link to="/quizzes" className="hover:text-fg">
          Quizzes
        </Link>
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{quiz.title}</h1>
      <p className="mt-3 text-muted">{quiz.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="h-10 rounded-lg border border-border px-3 text-sm"
          onClick={() => {
            setOrder(shuffle(quiz.questions));
            setSubmitted(false);
          }}
          disabled={submitted}
        >
          Shuffle
        </button>
        {!submitted ? (
          <button type="button" className="h-10 rounded-lg bg-accent px-3 text-sm font-semibold text-accent-fg" onClick={submit}>
            Submit graded questions
          </button>
        ) : (
          <p className="self-center text-sm text-muted">
            Auto-scored {score.earned} / {score.total || quiz.questions.filter((question) => question.kind !== "short").length}. Short
            answers need your own mark.
          </p>
        )}
      </div>
      <ol className="mt-8 space-y-6">
        {order.map((question, index) => (
          <li key={question.id} className="rounded-xl border border-border bg-surface p-4">
            <p className="font-mono text-xs text-muted">
              {index + 1} · {difficultyLabel(question.difficulty)} · {question.kind === "tf" ? "True or false" : question.kind === "mc" ? "Multiple choice" : "Short answer"}
            </p>
            <p className="mt-2 text-sm font-medium leading-6">{question.prompt}</p>
            {question.kind === "mc" && question.choices ? (
              <fieldset className="mt-3 space-y-2" disabled={submitted}>
                <legend className="sr-only">Choices</legend>
                {question.choices.map((choice, choiceIndex) => (
                  <label key={choice} className="flex items-start gap-2 text-sm leading-6">
                    <input
                      type="radio"
                      className="mt-1"
                      name={question.id}
                      checked={choices[question.id] === String(choiceIndex)}
                      onChange={() => setChoices((current) => ({ ...current, [question.id]: String(choiceIndex) }))}
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </fieldset>
            ) : null}
            {question.kind === "tf" ? (
              <fieldset className="mt-3 flex gap-4 text-sm" disabled={submitted}>
                <legend className="sr-only">True or false</legend>
                {["true", "false"].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={question.id}
                      checked={choices[question.id] === value}
                      onChange={() => setChoices((current) => ({ ...current, [question.id]: value }))}
                    />
                    {value === "true" ? "True" : "False"}
                  </label>
                ))}
              </fieldset>
            ) : null}
            {question.kind === "short" ? (
              <textarea
                value={text[question.id] ?? ""}
                onChange={(event) => setText((current) => ({ ...current, [question.id]: event.target.value }))}
                rows={4}
                className="mt-3 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                aria-label="Your answer"
                placeholder="Answer in your own words, then submit."
              />
            ) : null}
            {submitted ? (
              <div className="mt-3 border-t border-border pt-3 text-sm leading-6">
                {question.kind !== "short" ? (
                  <p className={pointsFor(question, choices[question.id], undefined) === 1 ? "text-ok" : "text-danger"}>
                    {pointsFor(question, choices[question.id], undefined) === 1 ? "Correct." : "Not the expected answer."}
                  </p>
                ) : (
                  <div>
                    <p className="font-medium">Model answer</p>
                    <p className="mt-1 text-muted">{question.model}</p>
                    <p className="mt-2 text-xs text-muted">How close were you?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        ["I had it", 1],
                        ["Partial", 0.5],
                        ["Missed it", 0],
                      ].map(([label, value]) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setSelf((current) => ({ ...current, [question.id]: Number(value) }))}
                          className="h-9 rounded-lg border border-border px-3 text-xs"
                          aria-pressed={self[question.id] === value}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="mt-2 text-muted">{question.explanation}</p>
                {getTopic(question.topic) ? (
                  <Link to="/topics/$slug" params={{ slug: question.topic }} className="mt-2 inline-block text-accent">
                    Revise {getTopic(question.topic)?.title}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      {submitted && score.missed.length > 0 ? (
        <aside className="mt-6 rounded-xl border border-border bg-surface p-4 text-sm leading-6">
          <p className="font-semibold">Revise these topics</p>
          <ul className="mt-2 list-disc pl-5">
            {score.missed.map((slug) => (
              <li key={slug}>
                <Link to="/topics/$slug" params={{ slug }} className="text-accent">
                  {getTopic(slug)?.title ?? slug}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
