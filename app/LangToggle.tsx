"use client";

import { useEffect, useState } from "react";

type Lang = "en" | "zh";

// The initial language is set before paint by the inline script in layout.tsx;
// this button only switches it and remembers the choice.
export default function LangToggle() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(document.documentElement.dataset.lang === "zh" ? "zh" : "en");
  }, []);

  function choose(next: Lang) {
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    try {
      localStorage.setItem("lang", next);
    } catch {
      // Storage can be unavailable (private mode); the switch still works.
    }
    setLang(next);
  }

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        aria-pressed={lang === "zh"}
        onClick={() => choose("zh")}
      >
        中
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => choose("en")}
      >
        EN
      </button>
    </div>
  );
}
