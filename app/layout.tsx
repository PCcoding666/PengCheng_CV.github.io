import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
