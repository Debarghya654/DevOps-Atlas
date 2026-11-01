export type SearchKind = "lesson" | "lab" | "project" | "glossary" | "quiz" | "interview";

export type SearchDoc = {
  id: string;
  kind: SearchKind;
  title: string;
  text: string;
  snippet: string;
  href: string;
  moduleId?: string;
  difficulty?: string;
};

export function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9.+#/\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 9;
  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length] ?? 9;
}

function fuzzyToken(token: string, hay: string): boolean {
  if (token.length < 4) return false;
  const words = hay.split(" ");
  const limit = token.length >= 7 ? 2 : 1;
  for (const word of words) {
    if (word.length < 3 || Math.abs(word.length - token.length) > 2) continue;
    if (levenshtein(token.slice(0, 24), word.slice(0, 24)) <= limit) return true;
  }
  return false;
}

export function scoreQuery(query: string, haystack: string): number {
  const q = normalize(query);
  const h = normalize(haystack);
  if (!q || !h) return 0;
  if (h.includes(q)) {
    const idx = h.indexOf(q);
    const bonus = h.startsWith(q) ? 25 : 0;
    return 90 + bonus - Math.min(30, Math.floor(idx / 30));
  }
  const parts = q.split(" ").filter(Boolean);
  if (parts.length === 0) return 0;
  let matched = 0;
  for (const part of parts) {
    if (h.includes(part)) matched += 1;
    else if (fuzzyToken(part, h)) matched += 0.65;
  }
  if (matched === 0) return 0;
  return Math.round((matched / parts.length) * 70);
}

export function snippetAround(text: string, query: string, width = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const nq = query.trim().toLowerCase();
  const idx = clean.toLowerCase().indexOf(nq);
  if (idx < 0) return clean.slice(0, width) + (clean.length > width ? "…" : "");
  const start = Math.max(0, idx - 48);
  const end = Math.min(clean.length, idx + nq.length + width - 48);
  const slice = clean.slice(start, end);
  return (start > 0 ? "…" : "") + slice + (end < clean.length ? "…" : "");
}

export function searchDocs(docs: SearchDoc[], query: string, limit = 30): Array<SearchDoc & { score: number }> {
  const q = query.trim();
  if (q.length < 2) return [];
  const ranked: Array<SearchDoc & { score: number }> = [];
  for (const doc of docs) {
    const titleScore = scoreQuery(q, doc.title) * 1.4;
    const bodyScore = scoreQuery(q, doc.text);
    const score = Math.max(titleScore, bodyScore);
    if (score >= 18) ranked.push({ ...doc, score });
  }
  ranked.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return ranked.slice(0, limit);
}
