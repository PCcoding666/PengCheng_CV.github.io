import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import BuildDetail from "./BuildDetail";

// ─── Replace with your real X handle ────────────────────────────────
const X_HANDLE = "Peng5231631440";

// ─── Build data ──────────────────────────────────────────────────────
type BuildStatus = "building" | "shutdown" | "demoed" | "published" | "live";

interface Build {
  id: string;
  title: string;
  status: BuildStatus;
  statusLabel: string;
  description: string;
  detail?: string;
  metric?: string;
  tags: string[];
  links: { label: string; href: string }[];
}

const BUILDS: Build[] = [
  {
    id: "vidsnap",
    title: "VidSnap",
    status: "building",
    statusLabel: "building",
    description:
      "An AI agent that turns any video into structured, illustrated notes.",
    detail:
      "Started Jan 2025. An agent that orchestrates skills — transcription, keyframe understanding, and downstream generation like illustrated notes — into one video-understanding harness. Still pre-launch; the current push is getting it in front of first real users.",
    tags: ["LLM Agent", "Python", "Computer Vision"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/PCcoding666/my_youtube_summarizer",
      },
    ],
  },
  {
    id: "yt-download",
    title: "YouTube Download",
    status: "shutdown",
    statusLabel: "shut down",
    description:
      "A paid YouTube downloader I shipped end-to-end — closed once the unit economics didn't work.",
    detail:
      "Built with a mentor from the Antalpha days. Full stack shipped: SEO, a live payment system, real traffic. It died on unit economics — no overseas entity for Stripe, and proxy/traffic costs outran revenue at ~50 monthly users and one paying customer. The most useful failure I've run.",
    metric: "~50 monthly users · 1 paying customer",
    tags: ["Node.js", "Stripe", "SEO"],
    links: [],
  },
];

// ─── Track record data ───────────────────────────────────────────────
const TRACK = [
  {
    period: "2025 — now",
    role: "Product Development Solution Architect",
    org: "Alibaba Cloud · Tongyi (Qwen)",
    detail: "Deploying LLMs across every major phone maker in China.",
  },
  {
    period: "2024",
    role: "Live Caption Translation · Dell",
    org: "Client project",
    detail:
      "On-device caption translation for Dell's AI PCs; demoed at Singapore FinTech Festival.",
  },
  {
    period: "2024",
    role: "AI Engineer Intern",
    org: "HyperGAI",
    detail: "VLM inference & evaluation pipelines.",
  },
  {
    period: "2023 — 24",
    role: "AI Product Intern",
    org: "Antalpha",
    detail: "Shipped cc.Monet to 180 staff; −90% weekly processing time.",
  },
  {
    period: "2022",
    role: "AI Engineer Intern",
    org: "Procter & Gamble",
    detail: "CNN defect detection — 2% false pass vs 10% target.",
  },
  {
    period: "2023 — 25",
    role: "M.Eng, Materials Science + AI",
    org: "National University of Singapore",
    detail:
      "Built an LLM pipeline over 41,000 papers; published in Chinese Physics B.",
  },
  {
    period: "2019 — 23",
    role: "B.Eng, Materials Science",
    org: "South China University of Technology",
    detail: "",
  },
];

// ─── Status badge component ──────────────────────────────────────────
function StatusBadge({
  status,
  label,
}: {
  status: BuildStatus;
  label: string;
}) {
  const cls = `status s-${status}`;
  if (status === "shutdown") {
    return (
      <span className={cls}>
        <span className="status-dot">—</span>
        {label}
      </span>
    );
  }
  return (
    <span className={cls}>
      <span className="status-dot" />
      {label}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      {/* ── Site header ── */}
      <header className="site-header">
        <div className="wrap">
          <span className="site-name">Peng Cheng</span>
          <nav className="header-nav" aria-label="Site sections">
            <a href="#builds">builds</a>
            <a href="#record">record</a>
            <a href="#about">about</a>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="hero wrap">
          <h1 className="hero-headline">
            I build AI products from my own questions —{" "}
            <em>and when they fail, I write down why.</em>
          </h1>
          <p className="hero-sub">
            By day I deploy LLMs across China&apos;s phone makers at Alibaba
            Cloud&apos;s Tongyi (Qwen); on the side I build my own tools and
            document what breaks.
          </p>
        </section>

        {/* ── What I'm building ── */}
        <section id="builds">
          <div className="wrap">
            <p className="section-label">What I&apos;m building</p>
            <div className="builds-list">
              {BUILDS.map((b) => (
                <div
                  key={b.id}
                  className={`build-row${b.status === "shutdown" ? " shutdown" : ""}`}
                >
                  <div>
                    <div className="build-title">
                      {b.title}
                      <StatusBadge status={b.status} label={b.statusLabel} />
                    </div>
                    <p className="build-desc">{b.description}</p>
                    {b.metric && <p className="build-metric">{b.metric}</p>}
                    {b.detail && (
                      <BuildDetail
                        id={`build-detail-${b.id}`}
                        detail={b.detail}
                      />
                    )}
                    <div className="build-tags">
                      {b.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="build-links">
                    {b.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        className="build-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Track record ── */}
        <section id="record">
          <div className="wrap">
            <p className="section-label">Track record</p>
            <div className="track-list">
              {TRACK.map((t, i) => (
                <div key={i} className="track-row">
                  <div className="track-period">{t.period}</div>
                  <div>
                    <div className="track-role">{t.role}</div>
                    <div className="track-org">{t.org}</div>
                    {t.detail && (
                      <div className="track-detail">{t.detail}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about">
          <div className="wrap">
            <p className="section-label">About</p>

            <blockquote className="about-pull">
              I grew up with the map already drawn. I&apos;m here to go off it.
            </blockquote>

            <p className="about-body">
              Materials engineer turned AI builder — I came to AI through a
              problem, not a CS degree, and I&apos;ve been building toward my
              own questions ever since.
            </p>

            <div className="contact-links">
              <a
                href="https://github.com/PCcoding666"
                className="contact-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
                GitHub
              </a>
              <a
                href={`https://x.com/${X_HANDLE}`}
                className="contact-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
                X
              </a>
              <a
                href="https://www.youtube.com/@PCcoding666"
                className="contact-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube />
                YouTube
              </a>
              <a
                href="https://www.linkedin.com/in/cheng-peng-30936a2a0/"
                className="contact-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin />
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="wrap">
          <span className="footer-note">pccoding666.com</span>
          <span className="footer-note">building in public</span>
        </div>
      </footer>
    </>
  );
}
