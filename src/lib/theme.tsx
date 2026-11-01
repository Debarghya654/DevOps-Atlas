import { useEffect, useState } from "react";

export type ThemeChoice = "light" | "dark" | "system";

const KEY = "devops-atlas-theme";

function resolveDark(choice: ThemeChoice): boolean {
  if (choice === "dark") return true;
  if (choice === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function apply(choice: ThemeChoice) {
  const dark = resolveDark(choice);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  return dark;
}

export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const next: ThemeChoice =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    setChoice(next);
    setDark(apply(next));
    setReady(true);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = localStorage.getItem(KEY);
      if (current === "light" || current === "dark") return;
      setDark(apply("system"));
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function setTheme(next: ThemeChoice) {
    localStorage.setItem(KEY, next);
    setChoice(next);
    setDark(apply(next));
  }

  function toggle() {
    setTheme(dark ? "light" : "dark");
  }

  return { choice, dark, ready, setTheme, toggle };
}
