// The failure log: one entry per post-mortem, newest first.
// Every visible string is written twice ({ en, zh }), like the homepage.
export type Text = { en: string; zh: string };

export interface FailureEntry {
  slug: string;
  date: string; // YYYY-MM-DD, when the post-mortem was written
  title: Text;
  summary: Text;
  tags: string[];
}

export const ENTRIES: FailureEntry[] = [
  {
    slug: "us-stocks-2025-2026",
    date: "2026-11-24",
    title: {
      en: "23 months of picking US stocks: the index made money, my picks didn't",
      zh: "美股选股 23 个月：指数在赚，我挑的股票在亏",
    },
    summary: {
      en: "I replayed every order since January 2025. The account is down 18.55% while the S&P 500 is up about 20%. The losses came from my own picks and my own habits, so I wrote new rules.",
      zh: "我把 2025 年 1 月以来的每一笔订单都复盘了一遍。账户累计 -18.55%，同期标普 500 涨了约 20%。亏损来自我自己挑的股票和我自己的交易习惯，所以我给自己定了新规则。",
    },
    tags: ["investing", "post-mortem"],
  },
];
