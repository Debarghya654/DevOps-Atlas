import { createFileRoute, Link } from "@tanstack/react-router";
import { getTopic } from "@/content/catalog";
import { useHydrated, useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks · DevOps Atlas" }] }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const hydrated = useHydrated();
  const bookmarks = useProgress((state) => state.bookmarks);
  const items = bookmarks.map((slug) => getTopic(slug)).filter((topic) => topic !== undefined);
  return (
    <div className="mx-auto max-w-reading px-4 py-8 md:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Bookmarks</h1>
      <p className="mt-3 text-muted">Saved on this browser. Clearing site data removes them.</p>
      {!hydrated ? <p className="mt-6 text-sm text-muted">Loading local bookmarks…</p> : null}
      {hydrated && items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-surface px-4 py-6 text-sm text-muted">
          None yet. Open any topic and choose Bookmark.
        </p>
      ) : null}
      <ul className="mt-6 space-y-2">
        {items.map((topic) => (
          <li key={topic.slug}>
            <Link to="/topics/$slug" params={{ slug: topic.slug }} className="block rounded-xl border border-border bg-surface px-4 py-3 hover:border-accent">
              <span className="font-medium">{topic.title}</span>
              <span className="mt-1 block text-sm text-muted">{topic.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
