"use client";

// Inline script tag — runs before React hydration to avoid theme flash.
export function ThemeBoot() {
  const code = `(() => {
    try {
      const stored = localStorage.getItem('tempo-theme');
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored === 'light' || stored === 'dark' ? stored : (sysDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch {}
  })();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
