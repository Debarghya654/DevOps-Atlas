import { useState } from "react";
import { Check, Copy } from "lucide-react";

const KEYWORDS: Record<string, string[]> = {
  bash: ["if", "then", "else", "elif", "fi", "for", "while", "do", "done", "in", "case", "esac", "function", "return", "local", "echo", "set", "export", "cd", "exit"],
  yaml: ["true", "false", "null"],
  python: ["def", "return", "if", "elif", "else", "for", "while", "in", "import", "from", "as", "try", "except", "finally", "with", "class", "not", "and", "or", "True", "False", "None"],
  java: ["package", "import", "class", "public", "private", "protected", "static", "final", "void", "return", "new", "if", "else", "try", "catch"],
  hcl: ["resource", "variable", "output", "module", "provider", "locals", "data", "terraform"],
  groovy: ["pipeline", "agent", "stages", "stage", "steps", "post", "always", "sh", "echo"],
};

function commentMarker(lang: string): string | null {
  if (["java", "groovy", "js", "ts", "go"].includes(lang)) return "//";
  if (["bash", "sh", "yaml", "yml", "python", "py", "hcl", "tf", "dockerfile", "conf", "toml"].includes(lang)) return "#";
  return null;
}

function highlightLine(line: string, lang: string) {
  const marker = commentMarker(lang);
  const commentAt = marker ? line.indexOf(marker) : -1;
  const code = commentAt >= 0 ? line.slice(0, commentAt) : line;
  const comment = commentAt >= 0 ? line.slice(commentAt) : "";
  const keys = new Set(KEYWORDS[lang] ?? KEYWORDS[lang === "tf" ? "hcl" : lang] ?? []);
  const parts = code.split(/("[^"]*"|'[^']*'|\s+|[(){}[\],:=]+)/).filter((part) => part !== "");
  return { parts, comment, keys };
}

export function CodeBlock({
  code,
  lang,
  title,
  note,
}: {
  code: string;
  lang: string;
  title?: string;
  note?: string;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="my-5 overflow-hidden rounded-xl border border-border bg-surface-2">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <span className="truncate font-mono text-xs text-muted">{title || lang}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs text-muted hover:bg-bg hover:text-fg"
        >
          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-fg" tabIndex={0}>
        <code>
          {lines.map((line, index) => {
            const { parts, comment, keys } = highlightLine(line, lang);
            return (
              <span key={index} className="block">
                {parts.map((part, partIndex) => {
                  const trimmed = part.trim();
                  const isString = part.startsWith('"') || part.startsWith("'");
                  const isKey = keys.has(trimmed);
                  return (
                    <span
                      key={partIndex}
                      className={isString ? "text-accent-2" : isKey ? "text-accent" : undefined}
                    >
                      {part}
                    </span>
                  );
                })}
                {comment ? <span className="text-muted">{comment}</span> : null}
                {line.length === 0 ? "\n" : null}
              </span>
            );
          })}
        </code>
      </pre>
      {note ? <p className="border-t border-border px-4 py-2 text-xs leading-relaxed text-muted">{note}</p> : null}
    </figure>
  );
}
