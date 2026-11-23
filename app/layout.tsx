import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/newsreader/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peng Cheng",
  description:
    "I build AI products from my own questions — and when they fail, I write down why.",
  openGraph: {
    title: "Peng Cheng",
    description:
      "I build AI products from my own questions — and when they fail, I write down why.",
    url: "https://pccoding666.com",
    siteName: "Peng Cheng",
  },
};

// Pick the language before first paint so there is no flash of the wrong one:
// a saved choice wins, otherwise follow the browser. Only pages that use <T>
// have bilingual text; the rest of the site is English.
const LANG_SCRIPT = `(function(){try{var l=localStorage.getItem("lang");if(l!=="zh"&&l!=="en"){l=/^zh/i.test(navigator.language)?"zh":"en"}var d=document.documentElement;d.dataset.lang=l;d.lang=l==="zh"?"zh-CN":"en"}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_SCRIPT }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
