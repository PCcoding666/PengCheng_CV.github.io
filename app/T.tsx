import type { ReactNode } from "react";

// Bilingual text: both languages are rendered into the page; CSS shows the
// one matching <html data-lang>. Works in server and client components and
// keeps the static export free of runtime language logic.
export default function T({ en, zh }: { en: ReactNode; zh: ReactNode }) {
  return (
    <>
      <span className="t-en" lang="en">
        {en}
      </span>
      <span className="t-zh" lang="zh-CN">
        {zh}
      </span>
    </>
  );
}
