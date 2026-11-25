import type { Metadata } from "next";
import SubHeader from "../SubHeader";
import T from "../T";
import { ENTRIES } from "./entries";

export const metadata: Metadata = {
  title: "Learning notes · Peng Cheng",
  description:
    "Study notes written from my own sessions. 按我自己的学习记录写的笔记。",
};

export default function LearningIndex() {
  return (
    <>
      <SubHeader />
      <main>
        <section className="hero wrap">
          <h1 className="hero-headline">
            <T
              en={
                <>
                  Learning notes. <em>What I studied, and what I had to ask again.</em>
                </>
              }
              zh={
                <>
                  学习专栏。<em>我学了什么，以及我不得不追问的地方。</em>
                </>
              }
            />
          </h1>
          <p className="hero-sub">
            <T
              en="Each note is written from my own study sessions. I keep the questions I asked, including the ones where my first answer was wrong."
              zh="每一篇都按我自己的学习记录来写。我把追问留在里面，包括我第一次答错的那些。"
            />
          </p>
        </section>

        <section>
          <div className="wrap">
            <p className="section-label">
              <T en="Entries" zh="文章" />
            </p>
            <div className="track-list">
              {ENTRIES.map((e) => (
                <a key={e.slug} href={`/learning/${e.slug}`} className="track-row entry-row">
                  <div className="track-period">{e.date}</div>
                  <div>
                    <div className="track-role">
                      <T en={e.title.en} zh={e.title.zh} />
                    </div>
                    <div className="track-detail">
                      <T en={e.summary.en} zh={e.summary.zh} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <span className="footer-note">pccoding666.com</span>
          <span className="footer-note">
            <T en="building in public" zh="边做边公开" />
          </span>
        </div>
      </footer>
    </>
  );
}
