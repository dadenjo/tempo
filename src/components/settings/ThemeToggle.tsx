"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/ui";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme): void {
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const effective = theme === "system" ? (sysDark ? "dark" : "light") : theme;
  document.documentElement.setAttribute("data-theme", effective);
  if (theme === "system") localStorage.removeItem("tempo-theme");
  else localStorage.setItem("tempo-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem("tempo-theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  const choose = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
  };

  return (
    <div className="flex gap-2">
      {(["light", "dark", "system"] as Theme[]).map((t) => (
        <Button
          key={t}
          variant={theme === t ? "primary" : "ghost"}
          onClick={() => choose(t)}
        >
          {t}
        </Button>
      ))}
    </div>
  );
}
