import type { Lesson } from "./types";

const loaders: Record<string, () => Promise<{ lessons: Lesson[] }>> = {
  m0: () => import("./lessons/m0"),
  m1: () => import("./lessons/m1"),
  m2: () => import("./lessons/m2"),
  m3: () => import("./lessons/m3"),
  m4: () => import("./lessons/m4"),
  m5: () => import("./lessons/m5"),
  m6: () => import("./lessons/m6"),
  m7: () => import("./lessons/m7"),
  m8: () => import("./lessons/m8"),
  m9: () => import("./lessons/m9"),
  m10: () => import("./lessons/m10"),
  m11: () => import("./lessons/m11"),
  m12: () => import("./lessons/m12"),
  m13: () => import("./lessons/m13"),
  m14: () => import("./lessons/m14"),
  m15: () => import("./lessons/m15"),
  m16: () => import("./lessons/m16"),
};

const cache = new Map<string, Lesson[]>();

export function moduleIds(): string[] {
  return Object.keys(loaders);
}

export async function loadModuleLessons(moduleId: string): Promise<Lesson[]> {
  const cached = cache.get(moduleId);
  if (cached) return cached;
  const loader = loaders[moduleId];
  if (!loader) return [];
  const mod = await loader();
  const lessons = mod.lessons ?? [];
  cache.set(moduleId, lessons);
  return lessons;
}

export async function loadLesson(moduleId: string, slug: string): Promise<Lesson | null> {
  const lessons = await loadModuleLessons(moduleId);
  return lessons.find((lesson) => lesson.slug === slug) ?? null;
}

export async function loadAllLessons(): Promise<Lesson[]> {
  const groups = await Promise.all(moduleIds().map((id) => loadModuleLessons(id)));
  return groups.flat();
}
