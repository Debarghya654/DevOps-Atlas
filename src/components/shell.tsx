import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookMarked,
  BookOpen,
  ChevronDown,
  Compass,
  FlaskConical,
  FolderGit2,
  GraduationCap,
  Library,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { getModule, moduleTopics, modules, topics } from "@/content/catalog";
import { useHydrated, useProgress } from "@/lib/progress-store";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { SearchPalette } from "./search-palette";

const links = [
  { to: "/", label: "Home", icon: Compass },
  { to: "/roadmap", label: "Roadmap", icon: Compass },
  { to: "/learn", label: "Curriculum", icon: BookOpen },
  { to: "/labs", label: "Labs", icon: FlaskConical },
  { to: "/projects", label: "Projects", icon: FolderGit2 },
  { to: "/quizzes", label: "Quizzes", icon: GraduationCap },
  { to: "/interview-prep", label: "Interview", icon: GraduationCap },
  { to: "/glossary", label: "Glossary", icon: Library },
  { to: "/progress", label: "Progress", icon: BookMarked },
] as const;

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hydrated = useHydrated();
  const completed = useProgress((state) => state.completed);
  const activeTopic = pathname.startsWith("/topics/") ? pathname.split("/")[2] : "";
  const activeModule = getModule(pathname.split("/")[2] ?? "")?.id ?? topics.find((topic) => topic.slug === activeTopic)?.moduleId;
  const [openId, setOpenId] = useState<string | null>(activeModule ?? "m0");

  useEffect(() => {
    if (activeModule) setOpenId(activeModule);
  }, [activeModule]);

  return (
    <div className="flex h-full flex-col">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2 px-4 py-4">
        <span className="grid size-8 place-items-center rounded-lg border border-border bg-surface-2 font-mono text-xs text-accent">
          DA
        </span>
        <span>
          <span className="block text-sm font-semibold tracking-tight text-fg">DevOps Atlas</span>
          <span className="block text-xs text-muted">Learn. Automate. Deploy.</span>
        </span>
      </Link>
      <nav aria-label="Primary" className="px-2">
        {links.map((item) => {
          const Icon = item.icon;
          const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "mb-0.5 flex h-10 items-center gap-2 rounded-lg px-3 text-sm",
                active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 px-4 text-xs font-semibold tracking-wide text-muted">MODULES</div>
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-6">
        {modules.map((mod) => {
          const expanded = openId === mod.id;
          const items = moduleTopics(mod.id);
          const done = hydrated ? items.filter((topic) => completed[topic.slug]).length : 0;
          return (
            <div key={mod.id} className="mb-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-fg hover:bg-surface-2"
                aria-expanded={expanded}
                onClick={() => setOpenId(expanded ? null : mod.id)}
              >
                <ChevronDown className={cn("size-4 shrink-0 text-muted transition-transform", expanded ? "rotate-0" : "-rotate-90")} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">
                  <span className="text-muted">{mod.number}.</span> {mod.title}
                </span>
                <span className="font-mono text-xs text-muted">
                  {hydrated ? done : "–"}/{items.length}
                </span>
              </button>
              {expanded ? (
                <ul className="mb-2 ml-4 border-l border-border">
                  {items.map((topic) => {
                    const current = topic.slug === activeTopic;
                    return (
                      <li key={topic.slug}>
                        <Link
                          to="/topics/$slug"
                          params={{ slug: topic.slug }}
                          onClick={onNavigate}
                          className={cn(
                            "block py-1.5 pr-2 pl-3 text-sm",
                            current ? "text-accent" : "text-muted hover:text-fg",
                          )}
                          aria-current={current ? "page" : undefined}
                        >
                          <span className="flex items-start gap-2">
                            <span
                              className={cn(
                                "mt-1.5 size-1.5 shrink-0 rounded-full",
                                hydrated && completed[topic.slug] ? "bg-ok" : "bg-border",
                              )}
                              aria-hidden="true"
                            />
                            <span>{topic.title}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { dark, toggle } = useTheme();
  const hydrated = useHydrated();
  const completedCount = useProgress((state) => Object.keys(state.completed).length);
  const pct = hydrated ? Math.round((completedCount / topics.length) * 100) : 0;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearch(true);
      } else if (event.key === "/" && !event.metaKey && !event.ctrlKey) {
        const target = event.target as HTMLElement | null;
        const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
        if (!typing) {
          event.preventDefault();
          setSearch(true);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-surface md:block">
        <Sidebar />
      </aside>
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button type="button" className="absolute inset-0 bg-bg/80" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div role="dialog" aria-modal="true" aria-label="Navigation" className="relative h-full w-72 max-w-[85vw] border-r border-border bg-surface">
            <button type="button" className="absolute top-3 right-3 grid size-10 place-items-center rounded-lg text-muted" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="size-5" />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
      <div className="md:pl-72">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-bg/95 px-3 backdrop-blur md:px-6">
          <button type="button" className="grid size-10 place-items-center rounded-lg text-fg md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setSearch(true)}
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-left text-sm text-muted md:max-w-md"
          >
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Search curriculum</span>
            <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 font-mono text-xs sm:inline">/</kbd>
          </button>
          <Link to="/progress" className="hidden h-10 items-center rounded-lg px-3 font-mono text-xs text-muted hover:bg-surface sm:inline-flex" aria-label="Learning progress">
            {hydrated ? `${pct}%` : "–"}
          </Link>
          <button type="button" onClick={toggle} className="grid size-10 place-items-center rounded-lg text-fg hover:bg-surface" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <details className="relative">
            <summary className="flex h-10 cursor-pointer list-none items-center rounded-lg px-3 text-sm text-muted hover:bg-surface">
              Local
            </summary>
            <div className="absolute right-0 z-30 mt-1 w-52 rounded-xl border border-border bg-surface p-1 shadow-card">
              <Link to="/bookmarks" className="block rounded-lg px-3 py-2 text-sm text-fg hover:bg-surface-2">
                Bookmarks
              </Link>
              <Link to="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg hover:bg-surface-2">
                <Settings className="size-4" aria-hidden="true" />
                Settings
              </Link>
              <p className="px-3 py-2 text-xs leading-5 text-muted">Progress stays in this browser. It is not synced.</p>
            </div>
          </details>
        </header>
        <main id="main">{children}</main>
      </div>
      <SearchPalette open={search} onClose={() => setSearch(false)} />
    </div>
  );
}
