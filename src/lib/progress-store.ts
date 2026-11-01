import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuizAttempt = {
  score: number;
  total: number;
  at: number;
  missedTopics: string[];
};

type Persisted = {
  completed: Record<string, true>;
  bookmarks: string[];
  notes: Record<string, string>;
  exerciseChecks: Record<string, Record<number, true>>;
  lastSlug: string | null;
  quizAttempts: Record<string, QuizAttempt>;
  weeklyHours: number;
};

type ProgressState = Persisted & {
  markComplete: (slug: string, done: boolean) => void;
  toggleBookmark: (slug: string) => void;
  setNote: (slug: string, note: string) => void;
  toggleExercise: (slug: string, index: number) => void;
  setLast: (slug: string) => void;
  saveQuiz: (id: string, attempt: QuizAttempt) => void;
  setWeeklyHours: (hours: number) => void;
  replaceAll: (data: Partial<Persisted>) => void;
  reset: () => void;
};

const empty: Persisted = {
  completed: {},
  bookmarks: [],
  notes: {},
  exerciseChecks: {},
  lastSlug: null,
  quizAttempts: {},
  weeklyHours: 5,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...empty,
      markComplete: (slug, done) =>
        set((s) => {
          const completed = { ...s.completed };
          if (done) completed[slug] = true;
          else delete completed[slug];
          return { completed };
        }),
      toggleBookmark: (slug) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(slug)
            ? s.bookmarks.filter((x) => x !== slug)
            : [...s.bookmarks, slug],
        })),
      setNote: (slug, note) => set((s) => ({ notes: { ...s.notes, [slug]: note } })),
      toggleExercise: (slug, index) =>
        set((s) => {
          const current = { ...(s.exerciseChecks[slug] ?? {}) };
          if (current[index]) delete current[index];
          else current[index] = true;
          return { exerciseChecks: { ...s.exerciseChecks, [slug]: current } };
        }),
      setLast: (slug) => set({ lastSlug: slug }),
      saveQuiz: (id, attempt) => set((s) => ({ quizAttempts: { ...s.quizAttempts, [id]: attempt } })),
      setWeeklyHours: (weeklyHours) => set({ weeklyHours }),
      replaceAll: (data) =>
        set({
          completed: data.completed ?? {},
          bookmarks: data.bookmarks ?? [],
          notes: data.notes ?? {},
          exerciseChecks: data.exerciseChecks ?? {},
          lastSlug: data.lastSlug ?? null,
          quizAttempts: data.quizAttempts ?? {},
          weeklyHours: data.weeklyHours ?? 5,
        }),
      reset: () => set({ ...empty }),
    }),
    { name: "devops-atlas-progress", skipHydration: true },
  ),
);

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    void useProgress.persist.rehydrate();
    const unsub = useProgress.persist.onFinishHydration(() => setHydrated(true));
    if (useProgress.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}
