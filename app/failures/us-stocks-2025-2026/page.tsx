import type { Metadata } from "next";
import SubHeader from "../../SubHeader";
import T from "../../T";
import type { Text } from "../entries";

export const metadata: Metadata = {
  title: "23 months of picking US stocks · Peng Cheng",
  description:
    "A post-mortem of my US stock account, January 2025 to November 2026. 我的美股账户复盘，2025 年 1 月到 2026 年 11 月。",
};

// ─── Headline numbers (percentages only) ─────────────────────────────
const NUMBERS: { label: Text; value: string }[] = [
  {
    label: { en: "My account, cumulative", zh: "我的账户，累计" },
    value: "−18.55%",
  },
  { label: { en: "S&P 500, same period", zh: "标普 500，同期" }, value: "+20.61%" },
  { label: { en: "NASDAQ, same period", zh: "纳斯达克，同期" }, value: "+23.30%" },
  {
    label: { en: "My index ETFs (VOO + QQQ), unrealized", zh: "我的指数 ETF（VOO + QQQ），浮动" },
    value: "+2.6%",
  },
  {
    label: { en: "Stocks I picked myself, unrealized", zh: "我自己挑的个股，浮动" },
    value: "−19%",
  },
];

// ─── Body ────────────────────────────────────────────────────────────
interface Section {
  heading: Text;
  paras: Text[];
}

const SECTIONS: Section[] = [
  {
    heading: { en: "What I did", zh: "我做了什么" },
    paras: [
      {
        en: "I opened a US brokerage account in early 2025 with no real method. I bought index ETFs, but also leveraged and inverse ETFs, recent IPOs, and small companies tied to whatever theme was hot: nuclear power, rare minerals, quantum computing, stablecoins, memory chips. About 230 orders in 23 months.",
        zh: "2025 年初我开了美股账户，没有什么方法。买了指数 ETF，也买了杠杆和反向 ETF、刚上市的新股，还有各种热门题材的小公司：核电、稀有矿产、量子计算、稳定币、存储芯片。23 个月大约下了 230 笔单。",
      },
      {
        en: "In November 2026 I exported every order and the current positions, and replayed them lot by lot. The numbers above come from that replay and from the broker's own P&L page. The broker computes returns differently from an index, so the gap with the S&P 500 is approximate. It is still roughly 40 percentage points.",
        zh: "2026 年 11 月，我把所有订单和当前持仓导出来，逐笔重新算了一遍。上面的数字来自这次复盘和券商自己的收益页面。券商算收益的方法和指数涨幅不完全一样，所以和标普 500 的差距只是大概，但大概也有 40 个百分点。",
      },
    ],
  },
  {
    heading: { en: "Where the money went", zh: "钱亏在哪里" },
    paras: [
      {
        en: "Not on the index. VOO and QQQ, bought with no timing at all, are slightly up. Almost every loss came from stocks I chose myself, and the biggest realized losses all came from small theme stocks.",
        zh: "不是指数。我没有任何择时、随手买的 VOO 和 QQQ，现在是小幅盈利。几乎所有的亏损都来自我自己挑的股票，已实现亏损最大的几笔全是题材小票。",
      },
      {
        en: "My portfolio also looked more diversified than it was. About 62% is in index ETFs and 35% in single stocks, but nearly all of those stocks are big US tech and AI names that already sit at the top of QQQ. It was one bet, made several times.",
        zh: "组合看起来也比实际更分散。大约 62% 是指数 ETF，35% 是个股，但这些个股几乎都是美国科技和 AI 大公司，本来就是 QQQ 的前几大权重。其实是同一个赌注，下了好几次。",
      },
    ],
  },
  {
    heading: { en: "Four habits the records show", zh: "记录里看到的四个习惯" },
    paras: [
      {
        en: "1. I averaged down on falling theme stocks without rechecking why I owned them. I bought a nuclear startup three times on the way down and sold it 84% below my first price. Another nuclear name: bought four times, sold 78% below the first buy.",
        zh: "1. 题材股下跌时，我一次次加仓摊低成本，却没有重新检查当初为什么买。一只核电初创股，我在下跌途中买了三次，最后卖出的价格比第一次买入低 84%。另一只核电股买了四次，卖出时比第一次买入低 78%。",
      },
      {
        en: "2. I held losers longer than winners. Weighted by money, losing positions were held about 175 days on average, winning ones about 110. I took profits early and waited for losses to come back.",
        zh: "2. 亏的拿得比赚的久。按金额加权，亏损的仓位平均持有约 175 天，盈利的约 110 天。赚了就早早卖掉，亏了就等它回本。",
      },
      {
        en: "3. I bet both ways on the same day. Twice I bought a 3× long Nasdaq ETF and a 3× short Nasdaq ETF on the same day. The bets cancelled out, and I paid the decay and fees on both. It meant I had no view, only activity.",
        zh: "3. 同一天两头下注。我有两次在同一天既买了 3 倍做多纳指的 ETF，又买了 3 倍做空纳指的 ETF。两边互相抵消，我还要付两边的损耗和手续费。说明我没有判断，只是在操作。",
      },
      {
        en: "4. I chased what was hot. My best trade was a stablecoin company: bought soon after its IPO, sold 48% higher. Then I bought it back three more times after it had run up much further. That position is now down 41%. The winning trade had a reason; the losing ones only had heat.",
        zh: "4. 追热度。我最好的一笔交易是一家稳定币公司：上市不久买入，涨了 48% 卖出。之后它又涨了很多，我在高位又买回来三次，现在这个仓位亏 41%。赚钱的那笔有理由，亏钱的那几笔只有热度。",
      },
      {
        en: "Smaller ones: many orders were so small that the minimum fee alone was 5% to 25% of the order. And twice I sold a whole batch of theme stocks in a few minutes. That was tiredness, not a decision.",
        zh: "还有一些小问题：很多单子金额太小，光最低手续费就占了这笔单的 5% 到 25%。还有两次，我在几分钟内一口气清掉一批题材股。那是累了，不是决定。",
      },
    ],
  },
  {
    heading: { en: "What this does and doesn't prove", zh: "这能说明什么，不能说明什么" },
    paras: [
      {
        en: "It doesn't prove I can never pick stocks. It's 23 months, one market regime and a few dozen decisions, and none of them were written down when I made them. What it does show is that so far my stock picking has not beaten the index, and my habits made it worse.",
        zh: "这证明不了我永远不会选股。只有 23 个月、一种市场环境、几十个决策，而且当时一个都没有写下来。它能说明的是：到目前为止，我挑股票没有跑赢指数，而我的交易习惯让结果更差。",
      },
    ],
  },
  {
    heading: { en: "The rules I wrote afterwards", zh: "之后给自己定的规则" },
    paras: [
      {
        en: "• Buy one share of VOO and one share of QQQ on the 15th of every month. No timing, no skipping.",
        zh: "• 每月 15 日各买 1 股 VOO 和 1 股 QQQ。不择时，不跳过。",
      },
      {
        en: "• Leave the existing single stocks alone: no adding, no watching.",
        zh: "• 现有的个股不管：不加仓，也不盯盘。",
      },
      {
        en: "• A new single stock needs a written decision record first: the thesis, what would prove me wrong, the valuation, why the market is mispricing it, and my confidence. Then 48 hours of waiting, and one round of someone trying to break the argument.",
        zh: "• 新买个股之前，先写一份决策记录：thesis、什么情况证明我错了、估值、市场为什么定错了价、我的信心有几成。写完等 48 小时，再找人专门挑一轮漏洞。",
      },
      {
        en: "• No leverage, no inverse ETFs, no options for now. No borrowing, ever.",
        zh: "• 不碰杠杆和反向 ETF，暂时不碰期权。永远不借钱投资。",
      },
      {
        en: "• No order under $500.",
        zh: "• 单笔低于 500 美元不下单。",
      },
      {
        en: "• Review every three months, and only change the rules at a review, never on a day the market moves a lot.",
        zh: "• 每三个月复盘一次。规则只在复盘时改，不在大涨大跌的当天改。",
      },
      {
        en: "I'll come back to this entry at each review and add whether I actually followed them.",
        zh: "之后每次复盘，我都会回到这篇，补上我到底有没有照做。",
      },
    ],
  },
];

export default function UsStocksPostMortem() {
  return (
    <>
      <SubHeader />
      <main>
        <article className="wrap">
          <p className="section-label">
            <a href="/failures">
              <T en="Failure log" zh="失败记录" />
            </a>{" "}
            · 2026-11-24
          </p>
          <h1 className="hero-headline">
            <T
              en="23 months of picking US stocks: the index made money, my picks didn't"
              zh="美股选股 23 个月：指数在赚，我挑的股票在亏"
            />
          </h1>

          <div className="track-list post-numbers">
            {NUMBERS.map((n) => (
              <div key={n.label.en} className="track-row">
                <div className="track-role post-number">{n.value}</div>
                <div className="track-detail">
                  <T en={n.label.en} zh={n.label.zh} />
                </div>
              </div>
            ))}
          </div>
          <p className="build-metric">
            <T
              en="January 2025 – November 2026. Account and index figures from the broker's P&L page; ETF and single-stock figures from position data."
              zh="2025 年 1 月 – 2026 年 11 月。账户和指数数字来自券商收益页面；ETF 和个股的数字来自持仓数据。"
            />
          </p>

          {SECTIONS.map((s) => (
            <section key={s.heading.en} className="post-section">
              <h2 className="post-heading">
                <T en={s.heading.en} zh={s.heading.zh} />
              </h2>
              {s.paras.map((p) => (
                <p key={p.en} className="about-body post-para">
                  <T en={p.en} zh={p.zh} />
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <a href="/failures" className="footer-note">
            <T en="← failure log" zh="← 失败记录" />
          </a>
          <span className="footer-note">
            <T en="building in public" zh="边做边公开" />
          </span>
        </div>
      </footer>
    </>
  );
}
