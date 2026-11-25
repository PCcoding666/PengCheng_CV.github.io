// The learning column: one entry per study note, newest first.
// Every visible string is written twice ({ en, zh }), like the failure log.
export type Text = { en: string; zh: string };

export interface LearningEntry {
  slug: string;
  date: string; // YYYY-MM-DD, when the note was written
  title: Text;
  summary: Text;
  tags: string[];
}

export const ENTRIES: LearningEntry[] = [
  {
    slug: "mimo-kv-2026-11",
    date: "2026-11-25",
    title: {
      en: "Hand-calculating MiMo's KV, from the tokenizer to one config",
      zh: "手算 MiMo 的 KV：从分词到一张 config",
    },
    summary: {
      en: "From 19 to 24 November I went from a toy tokenizer to Xiaomi MiMo's config, and calculated per-token KV plus how many requests fit at 8K and 32K. An afternoon self-test on the first three KV questions came back at about 1.8 out of 18. I asked why bytes_to_unicode exists, caught a unit error in my own concurrency math, and still felt that the right answers made sense without staying with me.",
      zh: "11 月 19 日到 24 日，我从一个玩具分词器走到小米 MiMo 的 config，自己算了每个 token 的 KV，以及 8K、32K 下能同时服务几条请求。当天下午 KV 前三题的自测大约 1.8 / 18。中间我问了为什么要 bytes_to_unicode，抓到自己一个并发单位错误，也还是觉得正确答案听得懂、记不牢。",
    },
    tags: ["inference", "mimo"],
  },
];
