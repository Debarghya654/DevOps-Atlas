import { createFileRoute, Link } from "@tanstack/react-router";
import { getModule } from "@/content/catalog";
import { quizzes } from "@/content/quizzes";
import { useHydrated, useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/quizzes")({
  head: () => ({ meta: [{ title: "Quizzes · DevOps Atlas" }] }),
  component: QuizzesPage,
});

function QuizzesPage() {
  const hydrated = useHydrated();
  const attempts = useProgress((state) => state.quizAttempts);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <p className="font-mono text-xs text-accent">QUIZZES</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Check what you can explain</h1>
      <p className="mt-3 max-w-reading text-muted">
        Answers stay hidden until you submit. Short questions are scored by you against a model answer. Scores stay in this
        browser.
      </p>
      <ul className="mt-8 grid gap-3 md:grid-cols-2">
        {quizzes.map((quiz) => {
          const mod = getModule(quiz.moduleId);
          const attempt = attempts[quiz.id];
          return (
            <li key={quiz.id}>
              <Link to="/quizzes/$id" params={{ id: quiz.id }} className="block h-full rounded-xl border border-border bg-surface p-4 hover:border-accent">
                <p className="font-mono text-xs text-accent">
                  {mod?.title} · {quiz.questions.length} questions · {quiz.minutes} min
                </p>
                <h2 className="mt-1 font-semibold">{quiz.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{quiz.summary}</p>
                {hydrated && attempt ? (
                  <p className="mt-3 font-mono text-xs text-muted">
                    Last score {attempt.score}/{attempt.total}
                  </p>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
