import type { Metadata } from "next";
import SubHeader from "../SubHeader";
import T from "../T";
import { ENTRIES } from "./entries";

export const metadata: Metadata = {
  title: "Failure log · Peng Cheng",
  description:
    "Things I tried that didn't work, and what I changed because of them. 我做砸的事，以及因此改掉的东西。",
};

export default function FailuresIndex() {
  return (
    <>
      <SubHeader />
      <main>
        <section className="hero wrap">
          <h1 className="hero-headline">
            <T
              en={
                <>
                  Failure log. <em>What didn&apos;t work, and what I changed.</em>
                </>
              }
              zh={
                <>
                  失败记录。<em>做砸了什么，以及之后改了什么。</em>
                </>
              }
            />
          </h1>
          <p className="hero-sub">
            <T
              en="Each entry is a post-mortem written from my own records, not from memory. Numbers are shown as percentages."
              zh="每一篇都是照着我自己的记录写的复盘，不是凭印象。数字只写百分比。"
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
                <a key={e.slug} href={`/failures/${e.slug}`} className="track-row entry-row">
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
