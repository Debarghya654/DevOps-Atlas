import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/shell";
import appCss from "../styles.css?url";

const THEME_BOOT = `(function(){try{var t=localStorage.getItem("devops-atlas-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var el=document.documentElement;el.classList.toggle("dark",!!d);el.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DevOps Atlas" },
      {
        name: "description",
        content:
          "DevOps Atlas is a text-first curriculum from zero knowledge to junior DevOps engineer skills. Learn, automate, deploy, and operate.",
      },
      { name: "theme-color", content: "#0B1020" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-reading px-4 py-20">
      <p className="font-mono text-xs text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">That page is not on the map.</h1>
      <p className="mt-3 text-muted">The link may be old, or the topic slug is wrong.</p>
      <a href="/" className="mt-6 inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg">
        Back home
      </a>
    </div>
  );
}
