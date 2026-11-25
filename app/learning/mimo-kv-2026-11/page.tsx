import type { Metadata } from "next";
import SubHeader from "../../SubHeader";
import T from "../../T";
import type { Text } from "../entries";

export const metadata: Metadata = {
  title: "Hand-calculating MiMo's KV · Peng Cheng",
  description:
    "Study notes from 19–24 November 2026: tokenizer, embeddings, and a hand calculation of MiMo's KV cache. 2026 年 11 月 19 日到 24 日的学习记录：分词、词向量，以及手算 MiMo 的 KV。",
};

interface Block {
  kind: "p" | "formula" | "quote";
  text: Text;
}

interface Section {
  heading: Text;
  blocks: Block[];
}

const SECTIONS: Section[] = [
  {
    heading: { en: "Why I wrote this down", zh: "为什么写这篇" },
    blocks: [
      {
        kind: "p",
        text: {
          en: "From 19 to 24 November 2026 I studied the part of LLM inference I meet at work and had not calculated myself. The work touches Xiaomi model deployment, so I started from Xiaomi's MiMo. This note follows that thread: tokenizer, then the embedding table, then one config and the KV arithmetic. Multi-token prediction is only the door I opened. A handwritten forward pass, a full speculative-decoding write-up, serving metrics, and splitting prefill from decode across a cluster are not in here. I had not done them.",
          zh: "2026 年 11 月 19 日到 24 日，我在学大模型推理里我工作会碰到、自己却没算过的那一块。工作里会碰到小米模型的部署，所以我从小米的 MiMo 开始。这篇按这条线写：分词，然后词向量，然后一张 config 和 KV 的手算。多 token 预测只写我打开的那一道门。手写前向、完整的投机解码、服务指标、在集群上把 prefill 和 decode 拆开，都不在这篇里。我还没做。",
        },
      },
      {
        kind: "p",
        text: {
          en: "On the afternoon of the 24th, before the config arithmetic, I asked for a KV quiz. The first three questions scored about 1.8 out of 18. I write those questions, my answers, and the marks in the KV section, because that is the thread they belong to. What I asked right after the score is the reason the rest of the day was calculation rather than another explanation.",
          zh: "24 日下午，config 还没算，我先要求考一次 KV。前三题大约 1.8 分，满分 18。题目、我的答案和批改，我写在后面的 KV 那一节，因为它们属于那一条线。分数出来之后我追问的那一句，是后面改成自己算、而不是再听一遍的原因。",
        },
      },
    ],
  },
  {
    heading: { en: "The tokenizer", zh: "分词" },
    blocks: [
      {
        kind: "p",
        text: {
          en: "On 19 November the file in front of me was a toy tokenizer, and the first thing I asked was what those lines meant. The check walked through it as three steps: split the sentence on whitespace, look each word up with index, and return integer ids. A word missing from the list raises ValueError. I then asked whether split is a builtin. The answer was that it is a method on the string, not a builtin like len. strip, which I asked about next, removes whitespace at both ends, including the newline a file line usually keeps. index, in this file, is the step that turns the word into an id. With a vocab of Hello, world, and an exclamation mark, tokenize(\"Hello world\") is [0, 1].",
          zh: "11 月 19 日，我面前是一个玩具分词器。我先问这几行是什么意思。核对把它拆成三步：按空白切开，用 index 查每个词，返回整数 id。词不在表里会抛 ValueError。我接着问 split 是不是内置函数。回答是：它是字符串的方法，不是 len 那种内置函数。我又问 strip。它去掉两端的空白，包括从文件读进来时行尾通常带着的换行。在这个文件里，index 就是把词变成 id 的那一步。词表如果是 Hello、world 和一个感叹号，tokenize(\"Hello world\") 就是 [0, 1]。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I asked to clean up vocab.txt, and guessed it was a joke list. That was confirmed: a demo vocab, not a model's. \"Hello, world!\".split() is [\"Hello,\", \"world!\"], the ids are [2, 3], and running the script printed [2, 3]. Punctuation stayed glued to the words because the only rule was a space.",
          zh: "我让人整理 vocab.txt，并猜这是一张恶搞词表。核对确认了：这是演示用的假词表，不是模型的词表。\"Hello, world!\".split() 得到 [\"Hello,\", \"world!\"]，id 是 [2, 3]，跑脚本打出来的就是 [2, 3]。标点粘在词上，因为规则只有空格。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I then asked what a real vocabulary would look like, and put a GPT-2 one beside the toy. The same sentence did not come back as the same pieces, and I asked why the decode looked different. The check said the cuts are different rules, not a bug. The toy keeps two chunks, \"Hello,\" and \"world!\". GPT-2's byte-level BPE returns four: Hello, a comma, Ġworld, and an exclamation mark, with ids 15496, 11, 995, and 0. The Ġ is how that vocabulary writes a leading space. Decode still rebuilds \"Hello, world!\", so the encoding was consistent. Finer pieces are the point: punctuation and unseen words have somewhere to go.",
          zh: "我接着问，真词表长什么样，于是在旁边放了一份 GPT-2 的词表。同一句话，两边的碎片不一样，我问为什么 decode 看起来不同。核对说，这是两套切分，不是算错。玩具那边是两块，\"Hello,\" 和 \"world!\"。GPT-2 的 byte-level BPE 切成四块：Hello、逗号、Ġworld、感叹号，id 是 15496、11、995、0。Ġ 是这套词表用来写「前面有个空格」的记号。decode 仍然拼回 \"Hello, world!\"，所以编码是自洽的。切得更碎是故意的：标点和没见过的词要有地方可去。",
        },
      },
      {
        kind: "p",
        text: {
          en: "Once that case ran, I asked whether the tokenizer step was done, and what Xiaomi uses. The search came back as Qwen2Tokenizer: byte-level BPE, not SentencePiece, with vocab.json and merges.txt. The figure given for MiMo-7B was a vocabulary of 151680. MiMo-V2.5 was described as the same class, with a vocabulary around 152576. I was also told not to mix this up with MiMo's audio tokenizer, which is a different RVQ pipeline.",
          zh: "这个 case 跑通之后，我问 tokenizer 是不是可以进下一步，以及小米用的是什么。查到的结果是 Qwen2Tokenizer：byte-level BPE，不是 SentencePiece，文件是 vocab.json 和 merges.txt。当时给的 MiMo-7B 词表大小是 151680。MiMo-V2.5 被说成同一类，词表大约 152576。我也被告知，不要把这套和 MiMo 的音频 tokenizer 混在一起，音频那套是另一条 RVQ 管线。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The next question was how far apart the Chinese and English vocabularies are, and whether BPE, the Qwen2 tokenizer, and the GPT-2 tokenizer are three different things. I had already drawn them as one algorithm with two vocabularies underneath, and I asked to implement both. The check said that drawing is right, and that Qwen2 is not a second algorithm. Both are byte-level BPE. The vocabularies, the merges, the special tokens, and the pre-tokenize regex differ. On the local GPT-2, \"Hello, how are you today?\" was 25 characters and 7 tokens, while \"你好，你今天怎么样？\" was 10 characters and 21 tokens. A count of CJK characters among those 50257 GPT-2 tokens came back as zero, so Chinese was being spelled in byte pieces. The same Chinese sentence on the Qwen2/MiMo vocabulary was 6 tokens.",
          zh: "下一问是，中文和英文的词表差多远，以及 BPE、Qwen2 tokenizer、GPT-2 tokenizer 是不是三件不同的东西。我自己已经画成：上面是同一种算法，下面挂两套词表，并且要求两套都实现。核对说这张图是对的，Qwen2 不是另一种算法。两边都是 byte-level BPE。不同的是词表、merges、特殊 token，还有预切分的正则。本地 GPT-2 上，\"Hello, how are you today?\" 是 25 个字符、7 个 token；\"你好，你今天怎么样？\" 是 10 个字符、21 个 token。50257 个 GPT-2 token 里，汉字条目数出来是 0，中文是用字节碎片拼出来的。同一句中文，在 Qwen2/MiMo 那套词表上是 6 个 token。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I asked whether my own code actually contained BPE. The check split the files. The toy tokenizer does not. It only splits on spaces. The GPT-2 file loads merges.txt and applies it. That file is the encode direction: find the highest-priority pair, merge, repeat. It does not train the merges. The trained list is already in the file.",
          zh: "我问，BPE 在我自己的代码里有没有体现。核对把文件分开看。玩具分词器里没有，它只按空格切。GPT-2 那个文件会读 merges.txt 并用它。那是编码方向：找出优先级最高的一对，合并，再重复。它不负责训练 merges。训练好的名单已经在文件里。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I asked to rebuild the program as that tree, GPT-2 and Qwen2 side by side. A full rewrite showed up: a shared BPE core, two subclasses, and a comparison script. I stopped it. I said not to hand me the finished program, to leave blanks, and to go one step at a time. The rest of the tokenizer was small runs I did myself.",
          zh: "我要求按那棵树重写，GPT-2 和 Qwen2 并排。结果先出现的是一整份重写：共享的 BPE 核心、两个子类、一个对比脚本。我叫停了。我说不要把写完的程序给我，留空，一步一步来。后面的 tokenizer 就变成我自己跑的小实验。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The step I stopped on was why bytes_to_unicode and get_pairs exist. The answer: bytes 0 through 255 are mapped to printable characters before any merge, because raw bytes are a bad thing to store in a vocabulary, and a space is often written as Ġ. get_pairs only lists the neighboring pairs in the current string. For h, e, l, l, o the pairs are (h, e), (e, l), (l, l), (l, o). bpe_ranks, from merges.txt, decides which pair merges first. The check then asked me to think, before any more code, what would go wrong if I deleted bytes_to_unicode and ran BPE directly on Chinese characters.",
          zh: "我停下来的那一步是：为什么要有 bytes_to_unicode 和 get_pairs。回答是：合并之前，先把字节 0 到 255 映射成可打印字符，因为裸字节不适合直接放进词表；空格常常写成 Ġ。get_pairs 只列出当前这一串里的相邻对。h、e、l、l、o 的相邻对是 (h, e)、(e, l)、(l, l)、(l, o)。bpe_ranks 来自 merges.txt，决定哪一对先合。核对接着让我先想、先别改代码：如果删掉 bytes_to_unicode，直接对中文字符做 BPE，会出什么问题。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I asked that as a background question, not a trick. I am not from computer science. Text enters the machine as UTF-8 bytes, a Chinese character is often three bytes, an English letter usually one, and my guess was that without the mapping the computer could not handle Chinese. The check rejected the guess. The computer can already store and show Chinese. The mapping is a tokenizer choice: every script becomes bytes first, then one BPE; a rare symbol can fall back to single bytes; and the published merges were learned on that mapping. Delete it and the program can still run. What breaks is the match to the trained rules, so the ids change. I then printed the bytes of \"你\". The run was 228, 189, 160, written b'\\xe4\\xbd\\xa0'. The same three bytes through bytes_to_unicode were ä, ½, and ł, and that was marked as the match. The strange pieces in a GPT-2 vocabulary are aliases of those bytes. Decode maps them back to \"你\".",
          zh: "我是把它当成背景来问的，不是当成技巧。我不是学计算机的。文本进机器先是 UTF-8 字节，一个汉字常常是 3 个字节，一个英文字母通常是 1 个，我猜没有这层映射，计算机就处理不了中文。核对否定了这个猜法。计算机本来就能存中文、显示中文。映射是分词器的选择：所有文字先变成字节，再走同一套 BPE；罕见符号可以退回单个字节；已经发布的 merges 是在这层映射上学会的。删掉它，程序多半还能跑。断掉的是和训练好的规则之间的对应，于是 id 变了。我接着打印了「你」的字节。跑出来是 228、189、160，写成 b'\\xe4\\xbd\\xa0'。这三个字节再过 bytes_to_unicode，是 ä、½、ł，这一步被判为对上了。GPT-2 词表里那些怪碎片，是这些字节的化名。decode 再映回「你」。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I asked where merges.txt had come from, and how the order had been decided. The check: the file on my machine was downloaded from the public GPT-2 release, not written for the exercise. Training counts which adjacent pairs are common in a large English corpus, merges the most common, and writes the rule down, about 50,000 times. The first lines include Ġ t and h e. A smaller rank merges earlier. A pair that is not in the dict never merges. I printed the range and got 0 through 49999, 50,000 entries. That was marked correct. bpe() then picks, among the current pairs, the one with the smallest rank.",
          zh: "我问 merges.txt 是从哪来的，里面的顺序又是怎么定的。核对：我机器上的那份是从公开的 GPT-2 发布里下载的，不是为练习手写的。训练在很大的英文语料里统计哪些相邻对常见，把最常见的一对合并，写成一条规则，大约重复 5 万次。文件靠前的几条里有 Ġ t 和 h e。排名越小越先合并。字典里没有的那一对永远不合。我把取值范围打出来，是 0 到 49999，一共 50000 条。这一步被判对。bpe() 要做的，就是在当前这些对里挑排名最小的那一对。",
        },
      },
      {
        kind: "p",
        text: {
          en: "Looking at one printed example, I asked whether \"tokenization\" was two tokens. The check said yes. BPE splits that word into \"token\" and \"ization\", ids 30001 and 1634. One English word is not one token. The next distinction was pre-tokenize versus BPE, and I was asked to run the regex myself. \"Hello, world!\" came out as four chunks, which I reported. The check agreed, and pointed at the third chunk: it is \" world\" with the leading space, not \"world\". That space is what later becomes Ġ. \"tokenization\" is still one chunk after the regex, and only BPE splits it. I then mapped \" world\" and got Ġworld, still one piece after BPE, because that whole word is common.",
          zh: "看着一条打印出来的例子，我问 tokenization 是不是两个 token。核对说是。BPE 把它拆成 \"token\" 和 \"ization\"，id 是 30001 和 1634。一个英文单词不等于一个 token。下一层要分开的是预切分和 BPE，并让我自己跑正则。\"Hello, world!\" 出来是 4 块，我这么说了。核对同意，并指出第三块是带前导空格的 \" world\"，不是 \"world\"。这个空格后来才变成 Ġ。\"tokenization\" 过了正则仍是一块，要等 BPE 才拆开。我再把 \" world\" 映射过去，得到 Ġworld，BPE 之后仍是一块，因为这整个词很常见。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I asked whether a library already did this. I was not asking to be switched over to it. The answer listed Hugging Face transformers, the Rust tokenizers library underneath it, tiktoken, and sentencepiece, and said the handwritten path was the same path with the steps left visible. I asked whether the Chinese gap was just a different vocabulary and different merges. At that point the check said yes: same byte-level BPE, and the 21 versus 6 came mainly from the vocabulary and the merges, not from the name of the algorithm.",
          zh: "我问有没有库已经做了这件事。我不是要求改去用库。回答列了 Hugging Face 的 transformers、它下面的 Rust tokenizers、tiktoken，还有 sentencepiece，并说我手写的是同一条路径，只是把步骤留在外面。我问中文这边的差距是不是就是词表和 merges 不同。当时的核对是：是。同样的 byte-level BPE，21 对 6 主要来自词表和 merges，不是来自算法的名字。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The wrap-up on 24 November corrected something I had been ready to believe. Encode and decode round-tripped, on English, Chinese, emoji, and messy whitespace, for both GPT-2 and the local Qwen2 files. The Chinese sentence was 6 tokens and decoded back to the same string. The vocab.json and merges.txt I had been calling Qwen2 were byte-for-byte the same as the official Qwen2-7B files, by MD5. So Qwen and MiMo do not split differently. MiMo's config says Qwen2Tokenizer because it uses that tokenizer as it is. The plan I was following had told me to understand why the two splits differ. The check was that they do not. The real gap is GPT-2 against that one shared vocabulary. I still asked to be talked through as a beginner. I only did not want to stay on tokenizers.",
          zh: "24 日的收尾，纠正了一件我差点当成结论的事。英文、中文、emoji、乱七八糟的空白，GPT-2 和本地那份 Qwen2 都能 encode 再 decode 回原文。那句中文是 6 个 token，解回去还是原句。我一直叫成 Qwen2 的 vocab.json 和 merges.txt，和官方 Qwen2-7B 的文件用 MD5 对过，是同一份字节。所以 Qwen 和 MiMo 的切分并没有不同。MiMo 的 config 写 Qwen2Tokenizer，是因为它直接用了这套 tokenizer。我跟着的计划原本让我去理解两者为什么切得不一样。核对的结果是：它们没有不一样。真正的差距是 GPT-2 对上这一份共享词表。我还是要求按完全不懂来讲。只是不想再在 tokenizer 上耗着。",
        },
      },
    ],
  },
  {
    heading: { en: "The embedding table", zh: "词向量" },
    blocks: [
      {
        kind: "p",
        text: {
          en: "Token ids are integers. The embedding table is the next object: one row per id, and a lookup returns that whole row. I asked what shape means, because a lookup that started as a small grid of ids had come back with an extra number. The check: shape is the size of each level. A table built as 10 by 4 has shape [10, 4]. If the ids themselves have shape [2, 2], the lookup is [2, 2, 4]. The 4 is the length of every row. The 2s are only how the ids were packed.",
          zh: "token id 是整数。下一件东西是 embedding 表：一个 id 一行，查表取回一整行。我问 shape 是什么意思，因为一组很小的 id，查完多出了一个数。核对：shape 是每一层有多大。一张 10 行 4 列的表，shape 是 [10, 4]。如果 id 自己的形状是 [2, 2]，查完是 [2, 2, 4]。4 是每一行的长度。两个 2 只是 id 怎么排的。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I read torch.Size([2, 2, 4]) as 224, and asked what the 4 was. The check said those are three numbers, not two hundred twenty-four. The 4 is dim, the width I had set when building the table, so every id comes back as four numbers. I also asked how [[3, 0], [9, 1]] differs from writing the two rows without the outer brackets. The outer brackets are what makes one table. Without them, tensor() is given two positional arguments and raises TypeError: it takes one. I ran that and got the error.",
          zh: "我把 torch.Size([2, 2, 4]) 读成了 224，并问这个 4 是什么。核对说，这是分开的三个数，不是二百二十四。4 就是 dim，建表时我设的宽度，所以每个 id 取回来都是 4 个数。我还问 [[3, 0], [9, 1]] 和外面不再套一层括号有什么区别。外面那层括号才构成一张表。没有它，tensor() 收到两个位置参数，会报 TypeError：它只要一份数据。我跑了，报的就是这个错。",
        },
      },
      {
        kind: "p",
        text: {
          en: "A 10-row table cannot hold GPT-2 ids. I was asked to fill in torch.randn(____, 4), guess the shape, and only then print it. I guessed 50256. The check said no: ids run from 0 through 50256, so the table needs 50257 rows, one more than the largest id. Reading vocab_size off the tokenizer is the better of the two spellings, because the number then follows the vocabulary. I printed torch.Size([50257, 4]) and that was marked right.",
          zh: "10 行的表装不下 GPT-2 的 id。我被要求填 torch.randn(____, 4)，先猜 shape，再打印。我猜 50256。核对说不对：编号从 0 排到 50256，所以要 50257 行，比最大编号多 1。两种写法里，更好的是直接读 tokenizer 的 vocab_size，这样换词表不用改数字。我打出 torch.Size([50257, 4])，被判对。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The next guess was the shape of looking up \"Hello, world!\". Those ids are [15496, 11, 995, 0], four of them, each pointing at a 4-number row. I answered [4, 4]. Marked correct: four tokens in, four vectors out, and the shape grows by one dimension. I was then asked how many numbers would print for id 15496, the row for \"Hello\". I said four numbers. Marked correct. They are one row of the random table. Rebuild the table and they change. Inside one table, row 15496 stays the same row.",
          zh: "下一猜是查 \"Hello, world!\" 的形状。那些 id 是 [15496, 11, 995, 0]，四个，每个指向一行 4 个数。我答 [4, 4]。判对：四个 token 进去，四个向量出来，形状多了一维。接着问 id 15496，也就是 \"Hello\" 那一行，会打出几个数。我说 4 个。判对。它们是随机表里的一行。重新建表，数字会变。同一张表里，第 15496 行始终是那一行。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I was asked, in my own words, why a random vector cannot be used and has to be trained. I said the random numbers carry no meaning, and that four numbers cannot hold much meaning anyway. Both points were marked right. The check added the loop I had not said: predict the next token from the ones before it, measure how far off the guess is, push that error back into the relevant numbers, and repeat. The reply also cited a width I had searched earlier, 4096, as an example of a real MiMo-V2.5 hidden size. I am not using that search as the config. The Pro config I opened later the same evening says 6144, which is the number in the next section.",
          zh: "我被要求用自己的话说，为什么随机向量还不能用，一定要训练。我说这些随机数里没有语义，而且 4 个数也装不下多少意思。两点都被判对。核对补上了我没说的那个循环：用前面的词猜下一个词，看差多远，把误差推回表里相关的数字，再重复。回复里还引用了我更早搜到的一个宽度 4096，当作 MiMo-V2.5 真实 hidden size 的例子。我不用那次搜索代替 config。同一天晚上打开的 Pro 配置写的是 6144，这个数在下一节。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I asked whose embedding table people actually use, and what sizes are typical. The check: there is no shared standard table. Each model trains its own, and the rows have to match that model's tokenizer. A Qwen2 or MiMo id cannot be looked up in a GPT-2 table. Some other models' sizes were offered from memory, with an explicit warning to confirm them in config.json. That warning is why the next step was MiMo-7B's own file, not the remembered table.",
          zh: "我问 embedding 这张表大家用的是谁家的，一般有多大。核对：没有一张大家都用的标准表。每个模型自己训练自己的，行号必须和这个模型的 tokenizer 对上。Qwen2 或 MiMo 的 id 不能拿去查 GPT-2 的表。别的模型的大小是凭记忆列的，并且明确说了要以 config.json 为准。所以下一步是 MiMo-7B 自己的文件，不是那张凭记忆的表。",
        },
      },
    ],
  },
  {
    heading: { en: "The quiz, then MiMo-7B by hand", zh: "先是测验，再手算 MiMo-7B" },
    blocks: [
      {
        kind: "p",
        text: {
          en: "On the afternoon of 24 November I asked to be quizzed on KV cache, and then taught, because I want to work as an inference infra engineer and I did not know what I was still missing. I only answered the first three questions. The rest were left blank, so the mark was only those three: about 1.8 out of 18. The comment with the score was that the direction was often right, and that the misses were imprecision and not knowing how to compute.",
          zh: "11 月 24 日下午，我要求先考 KV cache，再补课。我想做推理 infra，又不知道自己还缺什么。我只答了前三题。后面是空的，所以分数只覆盖这三题：大约 1.8，满分 18。随分数来的评语是，方向常常是对的，丢分丢在说不精确，以及不会算。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The first question was why decode caches K and V but not Q. I answered in three passes. Q is an intermediate vector. A query comes in, attends over the previous weights, the KV is what gets stored, and the next token attends to that KV. Q is the state of the current token. Score 0.6 out of 1. The direction was accepted. The missing piece was causal attention: a past token never looks at a future token, so once its output is computed, its Q is never needed again. Every new token's Q has to attend to the K and V of all earlier tokens. Those K and V are reread on every later step. Q is used once. Cache is for what gets reused.",
          zh: "第一题：为什么 decode 缓存 K 和 V，不缓存 Q。我分三次答。Q 是中间过程的向量。一个 query 进来，要跟前面的权重做注意力，存下来的是 KV，下一个 token 再跟这些 KV 做注意力。Q 表示的是当前 token 的状态。0.6 分，满分 1。方向被接受了。缺的是因果注意力：过去的 token 不会去看未来的 token，所以它的输出算完一次，它的 Q 以后用不到。每个新 token 的 Q 都要和更早所有 token 的 K、V 做注意力。那些 K 和 V 会在后面每一步被再读。Q 只用一次。缓存留给会被重复用到的东西。",
        },
      },
      {
        kind: "p",
        text: {
          en: "That sentence did not stick, so I asked what a causal mask actually is. The check: when the model generates token i, that position may see itself and the past, not the future. Training feeds a whole sentence at once. In \"我爱吃苹果\", the position of \"爱\" could see \"吃\" and \"苹果\" if nothing blocked it, which would be reading the answer. The mask sets the upper triangle of the score matrix to negative infinity. Softmax turns that into zero, and the weights are a lower triangle. A past row never changes when new tokens arrive. That is the reason Q can be dropped and K and V cannot. The same check said the cache would not be valid without the mask: if every old token had to be recomputed when a new one arrived, there would be nothing stable to store.",
          zh: "这句话我没记住，所以单独问了因果 mask 到底是什么。核对：生成第 i 个 token 时，这个位置只能看见自己和过去，看不见未来。训练时整句是一次喂进去的。在「我爱吃苹果」里，如果不挡住，「爱」这个位置能看见「吃」和「苹果」，等于偷看答案。mask 把分数矩阵对角线右上方设成负无穷。softmax 之后那里变成 0，权重是一个下三角。新 token 到来时，过去那一行不再变。这就是 Q 可以丢掉、K 和 V 不能丢掉的原因。同一次核对还说，没有这层 mask，cache 就不成立：每来一个新 token，旧 token 都要重算的话，就没有一份稳定的东西可存。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The second question was whether prefill and decode are compute-bound or memory-bound, and why. I said prefill is compute-bound and decode is memory-bound. My reason: prefill has to compute attention over the whole input, while decode computes one token, with the KV cache moving from VRAM or even from RAM or SSD. Score 0.8 out of 1. The conclusion was accepted. The reason was not. The mark said the main fact is arithmetic intensity, not KV arriving from RAM or SSD. A decode step, for one sequence, computes a single token and still reads the whole weight tensor — the example used was about 16 GB — plus that sequence's KV, from HBM. Many bytes, few operations, so the GPU's math units wait on memory bandwidth. Prefill handles thousands of tokens against one read of the weights, so the math can fill up. Batching was named as the reason decode gains so much from a batch: the weights are read once and reused across sequences.",
          zh: "第二题：prefill 和 decode 分别是算力瓶颈还是带宽瓶颈，为什么。我说 prefill 是 compute-bound，decode 是 memory-bound。理由是：prefill 要算完当前输入的注意力，decode 只算一个 token，而 KV cache 要从显存甚至内存或 SSD 搬过来。0.8 分，满分 1。结论被接受了。理由没有。批改说，主要事实是算术强度低，不是 KV 从内存或 SSD 搬来。一步 decode，对一条序列，只算 1 个 token，却要把整个权重张量读一遍——例子里用的是大约 16 GB——再加上这条序列的 KV，从 HBM 读。字节很多，运算很少，GPU 的算力在等显存带宽。prefill 一次处理几千个 token，读一次权重可以算很多次，算力才填得满。batching 被点名为 decode 特别受益的原因：权重读一次，给许多条序列共用。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The third question was which factors set the KV cache's bytes, and to write the formula. I said I had not memorized one. I could derive that it depends on the length of the query and on the model's parameters, and then I stopped. Score 0.4 out of 1. The direction was accepted. \"The model's parameters\" was called too vague: the cache does not depend on the total parameter count, only on a few structural numbers. The formula I was given was this.",
          zh: "第三题：KV cache 的字节数由哪些因素决定，把公式写出来。我说公式我没背过。能推的是，它跟 query 的长度有关，也跟模型的参数有关，然后我就停了。0.4 分，满分 1。方向被接受了。「模型的参数」被说成太笼统：cache 不取决于总参数量，只跟少数几个结构数字有关。给我的公式是下面这一条。",
        },
      },
      {
        kind: "formula",
        text: {
          en: "KV bytes = 2 × layers × KV heads × head_dim × seq_len × batch × bytes per element",
          zh: "KV 字节数 = 2 × 层数 × KV 头数 × head_dim × 序列长度 × batch × 每个元素的字节数",
        },
      },
      {
        kind: "p",
        text: {
          en: "The worked example attached to that formula was Llama-3-8B, not MiMo, and I had not computed it. Per token: 2 × 32 layers × 8 KV heads × 128 × 2 bytes = 131072 bytes, called 128 KB. Batch 16, each sequence 8K: 128 KB × 16 × 8192 = 16 GB. If the 8 KV heads became 32, ordinary MHA, that example became 64 GB, and an 80 GB card with the weights loaded was described as no longer having room. I am keeping those figures labeled as the demonstration I was shown. The MiMo numbers below are the ones I calculated afterwards. The other quiz questions, including paging, preemption, and splitting prefill from decode, stayed unanswered, and I am not writing that lecture up as work I did.",
          zh: "配在这条公式后面的例题是 Llama-3-8B，不是 MiMo，也不是我算的。每个 token：2 × 32 层 × 8 个 KV 头 × 128 × 2 字节 = 131072 字节，被写成 128 KB。batch 为 16、每条序列 8K：128 KB × 16 × 8192 = 16 GB。如果那 8 个 KV 头变成 32，也就是普通 MHA，这个例子变成 64 GB，一张已经装上权重的 80 GB 卡被说成放不下。这些数字我标明是当时给我看的示范。下面的 MiMo 数字才是我后来自己算的。测验里其余的题，包括分页、抢占、把 prefill 和 decode 拆开，我没有答，那一节补课我也不把它写成自己做过的工作。",
        },
      },
      {
        kind: "quote",
        text: {
          en: "You explained the right answers and I understood them, but they never became a deep memory. Is that because I haven't done the work myself?",
          zh: "你跟我讲了正确答案我都懂，但是我没有形成很深刻的记忆。是因为我没有自己动手干过吗？",
        },
      },
      {
        kind: "p",
        text: {
          en: "I asked that because the score was low and the corrections still felt obvious once I read them. The assessment was that not having implemented it is part of the reason, and not the whole reason. Recognizing a written answer is a different act from producing it onto a blank page. The miss I was told I would actually remember was the second question: I had blamed decode on KV moving from RAM or SSD, and the correction was that each step reads the weights. A number I had not computed myself would stay a number. So the path I chose was Xiaomi's model, the one my work already touches, and the next concrete step I reported was MiMo-7B-Base's config.",
          zh: "我问这个，是因为分低，而纠正写出来之后又都显得显然。评估是：没动手是原因的一部分，不是全部。认出一段写好的答案，和在空白上自己写出来，不是同一件事。我被说成真正会记住的那一次失手，是第二题：我把 decode 慢归到 KV 从内存或 SSD 搬过来，纠正是每一步都要读权重。一个不是我自己算出来的数，就还只是一个数。所以我选的路径是小米的模型，工作里已经会碰到的那个，而我报上去的下一步，是 MiMo-7B-Base 的 config。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The exercise was to download only config.json, find the fields, calculate, and only then check. The file was fetched and the values were withheld: 988 bytes, 27 fields. I was told that a KeyError is information, because a name from the sheet might not exist, and that the two 2s in the KV formula are different: one for K and V, one for the two bytes of BF16. The first six numbers I sent back were marked correct: vocab_size 151680, hidden_size 4096, 36 layers, 32 query heads, intermediate_size 11008, and silu. A script I was using still named fields from some other model and raised KeyError. I asked not to repair that myself, and to compare the parameters. Counting vocab.json had given 151643 entries. The config's 151680 is the row count of the embedding table, 37 rows more, described as reserved space. The multiplication uses 151680. I also asked for a field I had been calling dim, and got KeyError. The check: dim was the variable name in the toy table. The config field is hidden_size.",
          zh: "练习是只下载 config.json，自己找字段，自己算，算完再对。文件取回来了，数字先不告诉我：988 字节，27 个字段。我被告知 KeyError 本身就是信息，因为练习单上的名字这份 config 里可能没有；KV 公式里的两个 2 也不一样，一个是 K 和 V，一个是 BF16 的 2 字节。我先交回去的 6 个数被判对：vocab_size 151680，hidden_size 4096，36 层，32 个 Query 头，intermediate_size 11008，激活函数 silu。我在用的一份脚本还留着别的模型的字段名，于是 KeyError。我要求不必自己修，只要对比参数。数 vocab.json 是 151643 条。config 的 151680 是 embedding 表的行数，多 37 行，被说成预留的位置。乘法用 151680。我还用练习里的名字 dim 去取，得到 KeyError。核对：dim 是玩具表里的变量名。config 里的字段是 hidden_size。",
        },
      },
      {
        kind: "p",
        text: {
          en: "Asked whether MiMo-7B is MHA or GQA, and if GQA how many query heads share one KV group, I answered: definitely GQA, 8. GQA was marked right. 8 was marked wrong. 8 is the number of KV heads. The hint was to split 32 query heads into 8 groups and count one group. I answered 4. That was marked right: 32 / 8 = 4, which is the 4:1 ratio.",
          zh: "问 MiMo-7B 是 MHA 还是 GQA，如果是 GQA，几个 Query 头共用一组 KV。我答：肯定是 GQA，8。GQA 被判对。8 被判错。8 是 KV 头的个数。提示是把 32 个 Query 头分成 8 组，再数一组里有几个。我改答 4。判对：32 / 8 = 4，也就是 4:1。",
        },
      },
      {
        kind: "p",
        text: {
          en: "For the embedding table I wrote 151680 × 4096, and asked what the rows and columns mean. The check: the product is how many numbers are in the table. A row is one token. A column is one number inside that vector, the same distinction as [50257, 4] earlier. I computed 621281280. Marked right, a bit over 621 million numbers. BF16 stores each number in 2 bytes, and the sheet used 1e9 as the divisor so that 1 GB means 10⁹ bytes, matching how card vendors label capacity. I got 1.24256256, about 1.24 GB. Marked right. Using 1024³ instead would come out a little smaller, and the check said so.",
          zh: "embedding 表我写下 151680 × 4096，并问行和列分别是什么意思。核对：这个乘积就是表里有多少个数。一行是一个 token，一列是这个向量里的一个数，和前面的 [50257, 4] 是同一件事。我算出 621281280。判对，六亿两千多万个数。BF16 每个数 2 字节，练习用 1e9 当除数，让 1 GB 表示 10⁹ 字节，和显卡厂商的标注一致。我得到 1.24256256，大约 1.24 GB。判对。如果改用 1024³，结果会小一点，核对也这么说了。",
        },
      },
      {
        kind: "p",
        text: {
          en: "Per-token KV was 2 × layers × KV heads × head_dim × 2 bytes. I wrote 2 × 36 × 32 × 8 × 128 × 2. The check said the extra 32 does not belong: 32 is the query-head count, and only K and V are stored. 32 is also 4 times 8, the same ratio as the groups, which is why the error looks like the group size, but the 32 is not a factor in the formula. I removed it.",
          zh: "每个 token 的 KV 是 2 × 层数 × KV 头数 × head_dim × 2 字节。我写成 2 × 36 × 32 × 8 × 128 × 2。核对说，多出来的 32 不该在里面：32 是 Query 头数，缓存的只有 K 和 V。32 又正好是 8 的 4 倍，和分组的比例相同，所以这个错误看起来像组的大小，但公式里没有这个 32。我把它去掉了。",
        },
      },
      {
        kind: "formula",
        text: {
          en: "2 × 36 × 8 × 128 × 2 = 147456 bytes = 144 KiB",
          zh: "2 × 36 × 8 × 128 × 2 = 147456 字节 = 144 KiB",
        },
      },
      {
        kind: "p",
        text: {
          en: "Dividing 147456 by 1024 gave 144, and that was marked right, with the unit named as the 1024-based one. The concurrency question assumed an 80 GB card, about 15 GB of weights, and 65 GB left for KV. I wrote 144 × 0.001 × 8000 = 1152, then 65 / 1152, and asked what was wrong. The check listed three mistakes. 144 × 0.001 turns KB into MB, so 1152 is megabytes and cannot be divided into 65 GB. On the 1024 scale I had been using, 8K is 8192 tokens, not 8000. And the conversion cannot switch to 1000 in the middle. I put the missing 0.001 in myself: 1.152 GB, and 65 / 1.152 = 56.",
          zh: "147456 除以 1024 得到 144，被判对，单位被标明是按 1024 的那一种。并发那题假设一张 80 GB 的卡，权重大约 15 GB，剩下 65 GB 给 KV。我写成 144 × 0.001 × 8000 = 1152，再算 65 / 1152，然后问哪里不对。核对列了三处。144 × 0.001 是把 KB 换成 MB，所以 1152 是兆字节，不能拿去和 65 GB 相除。按我前面一直用的 1024，8K 是 8192 个 token，不是 8000。换算也不能中途改用 1000。少掉的那个 0.001 是我自己补上的：1.152 GB，65 / 1.152 = 56。",
        },
      },
      {
        kind: "p",
        text: {
          en: "56 was not accepted. The structure was right, and the unit was still mixed. 144 came from dividing by 1024, so it is KiB. Multiplying by 0.001 twice treats a KiB as a 1000-byte KB. 56 was also described as a ceiling that still ignores activations and temporary buffers. I asked for the arithmetic to be finished in one unit system. In decimal GB, where 1 GB is 10⁹ bytes: 8192 × 147456 = 1207959552 bytes, about 1.208 GB, and 65 / 1.208 is about 53.8, which floors to 53 requests. At 8000 tokens the same check gives about 1.180 GB and floors to 55. The 56 was low because KiB had been treated as KB. I kept 53 as the checked figure for a standard 8K.",
          zh: "56 没有被接受。结构是对的，单位还是混的。144 来自除以 1024，所以是 KiB。再乘两次 0.001，是把 KiB 当成了 1000 字节的 KB。56 还被说成一个上限，激活和临时缓冲都还没扣。我请对方用同一套单位把算术做完。十进制 GB、1 GB = 10⁹ 字节：8192 × 147456 = 1207959552 字节，约 1.208 GB，65 / 1.208 约 53.8，取整 53 条。按 8000 个 token，同一次核对给出约 1.180 GB，取整 55 条。56 偏小，是因为把 KiB 当成了 KB。标准 8K 我记下的对过的数是 53。",
        },
      },
      {
        kind: "p",
        text: {
          en: "For 32K I calculated it myself. 147456 bytes per token. 32 × 1024 × 147456 = 4831838208. I called that 4.5 GB and divided 65 by 4.5 to get 14. The check: every step was right except the unit of the last one. 4831838208 / 1024³ is 4.5 GiB, not 4.5 decimal GB. In decimal GB the request is 4.83 GB, and 65 / 4.83 is about 13.45, so 13 requests fit and 14 do not. Fourteen would leave each request about 4.64 GB, which is less than 4.83. The sanity check that came with the mark: 32K is four times 8K, and 53 / 4 is also about 13.",
          zh: "32K 是我自己算的。每个 token 147456 字节。32 × 1024 × 147456 = 4831838208。我把它叫成 4.5 GB，65 / 4.5 = 14。核对：除了最后一步的单位，前面都对。4831838208 / 1024³ 是 4.5 GiB，不是十进制的 4.5 GB。十进制下一条请求是 4.83 GB，65 / 4.83 约 13.45，所以放得下 13 条，放不下 14 条。14 条会让每条只剩大约 4.64 GB，少于 4.83。批改附带的检查是：32K 是 8K 的 4 倍，53 / 4 大约也是 13。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The last 7B question was what the 8K concurrency becomes if MiMo used ordinary MHA, with as many KV heads as query heads. I said to divide by 4 and be done. That was marked right, and the reason was spelled out: KV heads go from 8 to 32, per-token KV grows by 4, the budget does not, so the count of requests shrinks by 4. The checked arithmetic was 2 × 36 × 32 × 128 × 2 = 589824 bytes per token, an 8K request of about 4.83 GB, and 65 / 4.83 about 13.45, which floors to 13. That matches 53 / 4. On this exercise, using 8 KV heads instead of 32 is what lets the same 65 GB serve about four times as many requests.",
          zh: "7B 的最后一题是：如果 MiMo 用普通 MHA，KV 头数等于 Query 头数，8K 的并发变成多少。我说直接除以 4 就行。判对，理由被写明：KV 头从 8 变成 32，每个 token 的 KV 变成 4 倍，预算不变，请求数就变成四分之一。对过的算式是 2 × 36 × 32 × 128 × 2 = 589824 字节每个 token，一条 8K 请求约 4.83 GB，65 / 4.83 约 13.45，取整 13。和 53 / 4 一致。在这道题里，用 8 个 KV 头而不是 32 个，就是同样 65 GB 能多服务大约 4 倍请求的原因。",
        },
      },
      {
        kind: "formula",
        text: {
          en: "MHA, 8K: 2 × 36 × 32 × 128 × 2 = 589824 bytes per token, about 13 requests",
          zh: "MHA，8K：2 × 36 × 32 × 128 × 2 = 589824 字节每个 token，大约 13 条请求",
        },
      },
    ],
  },
  {
    heading: {
      en: "What a KV head is, then V2.5-Pro",
      zh: "KV 头是什么，然后是 V2.5-Pro",
    },
    blocks: [
      {
        kind: "p",
        text: {
          en: "After the 7B arithmetic I still found the phrase \"KV head count\" abstract, and I said so. The explanation I was given used a library: each head looks for a different kind of relation, and each head has its own Q, K, and V. Q is the question and is thrown away after use. K is the label and is stored. V is the content and is stored. For MiMo-7B, hidden size 4096 was described as 32 heads times 128. MHA would store 32 sets of K and V. GQA stores 8, and 4 query heads share one set. The KV head count is how many of those sets are actually stored for one token in one layer. The query-head count does not change the cache. At compute time the 8 sets are expanded to line up with 32 queries, and that copy is not extra storage. A small script with the 7B numbers printed q [32, 128], k [8, 128], v [8, 128], the expanded k as [32, 128], 4 query heads per group, and 2048 cached numbers: 8 × 128 for K plus 8 × 128 for V.",
          zh: "7B 的算术做完，我还是觉得「KV 头数」抽象，就说了。当时给我的解释用了一个图书馆的比喻：每个头在找一种不同的关系，每个头有自己的 Q、K、V。Q 是提问，用完就扔。K 是标签，要存。V 是内容，要存。对 MiMo-7B，hidden size 4096 被说成 32 个头乘 128。MHA 会存 32 套 K 和 V。GQA 存 8 套，4 个 Query 头共用一套。KV 头数就是：一层里，一个 token 实际存下几套。Query 头数不改变 cache。计算时把 8 套展开去对齐 32 个 Query，那份复制不额外占存储。用 7B 数字写的小程序打出 q [32, 128]、k [8, 128]、v [8, 128]，展开后的 k 是 [32, 128]，每组 4 个 Query 头，要缓存的数字个数 2048：K 的 8 × 128 加上 V 的 8 × 128。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I asked why each token's 4096 has to become 32 × 128. That question came from the sentence above, which sounded like the original vector was being sliced. The correction: it is not sliced. The token vector is multiplied by Wq, the new vector is what gets reshaped into 32 heads of 128, and K and V are projected the same way before they are grouped. Several heads exist so softmax can hold several patterns at once. One head produces one set of weights. Setting heads times head dimension equal to the hidden size keeps the cost close to a single wide head. That equality is an engineering choice. V2.5-Pro breaks it: hidden size 6144, 128 query heads of 192, and 128 × 192 = 24576, which is then mapped back by the output projection. The direct consequence for the cache: KV bytes follow the KV head count and the K and V dimensions, not the hidden size.",
          zh: "我问，为什么每一个 token 的 4096 要变成 32 × 128。这是追着上面那句话问的，因为它听起来像是把原来的向量切开。纠正是：不是切开。token 的向量先乘 Wq，被 reshape 成 32 个头、每头 128 的是这个新向量；K 和 V 也是先投影，再分组。多个头是为了 softmax 可以同时有好几组权重。一个头只有一组。头数乘每头维度等于 hidden size 时，计算量和一个很宽的单头接近。这个相等是工程选择。V2.5-Pro 打破了它：hidden size 6144，128 个 Query 头、每头 192，128 × 192 = 24576，再由输出投影映回 6144。对 cache 的直接后果是：KV 的字节跟 KV 头数以及 K、V 的维度走，不跟 hidden size 走。",
        },
      },
      {
        kind: "p",
        text: {
          en: "7B was practice. The model I actually deal with is MiMo-V2.5-Pro, and I asked to put that config next to the 7B one. One file I opened that evening was named MiMo-V2.6-Pro-MOPD. I was told the language-model numbers match the V2.5-Pro I was trying to study, so the hand calculation below uses that name and these figures: vocabulary 152576, hidden size 6144, 70 layers, 128 query heads, 8 KV heads, K dimension 192, V dimension 128, a sliding window of 128, and a max position of 1048576. The same config also describes mixture-of-experts, vision, and audio. I did not calculate those. Q has to match K for the dot product, so Q is 192 as well. V is only weighted by those scores, so it can stay 128. After I changed the script, it printed q [128, 192], k [8, 192], v [8, 128], and 2560 cached numbers. Asked how many bytes one BF16 number takes, I said two. 2560 × 2 = 5120 bytes for one token in one full-attention layer.",
          zh: "7B 是练手。我实际要看的是 MiMo-V2.5-Pro，所以我要求把那份 config 和 7B 放在一起。那天晚上我打开的一份文件名叫 MiMo-V2.6-Pro-MOPD。我被告知，语言模型这部分的数字和我要学的 V2.5-Pro 一致，所以下面的手算用这个名字和这些数：词表 152576，hidden size 6144，70 层，128 个 Query 头，8 个 KV 头，K 的维度 192，V 的维度 128，滑动窗口 128，最大位置 1048576。同一份 config 里还有混合专家、视觉和音频。那些我没有算。Q 要和 K 做点积，所以 Q 也是 192。V 只是被这些分数加权，可以停在 128。脚本改完，打出 q [128, 192]、k [8, 192]、v [8, 128]，要缓存的数字个数 2560。被问 BF16 一个数占几个字节，我答两个。2560 × 2 = 5120，这是一个全注意力层里、一个 token 的字节数。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The 70 layers are not one kind of attention. I counted hybrid_layer_pattern: 70 layers, 10 zeros, 60 ones. I asked what that question was even asking, and how to tell SWA from full attention. The check: a full-attention layer can look back at every earlier token, so the KV has to keep the whole context. An SWA layer looks back only 128 tokens. Anything outside that window will not be read again by this layer, so the layer stores at most 128 tokens of KV no matter how long the context grows. The two are stacked. A full layer can carry distant information into the hidden state, and a later SWA layer works from that state, which is why the distant tokens are not simply gone. For an 8K context the expression I wrote, and that IPython evaluated, was this.",
          zh: "70 层不是同一种注意力。我数了 hybrid_layer_pattern：70 层，10 个 0，60 个 1。我问这道题到底在问什么，以及怎么区分 SWA 和全注意力。核对：全注意力层可以回头看前面每一个 token，所以 KV 得把整段上下文留着。SWA 层只回头看 128 个 token。窗口外面的，这一层不会再读，所以无论上下文多长，这一层最多留 128 个 token 的 KV。两种层是叠着的。全注意力层可以把远处的信息带进隐藏状态，后面的 SWA 层在这个状态上接着做，所以远处的 token 不是单纯消失。8K 上下文我写下、并由 IPython 算出的式子是这一条。",
        },
      },
      {
        kind: "formula",
        text: {
          en: "10 × 8192 × 5120 + 60 × 128 × 5120 = 458752000",
          zh: "10 × 8192 × 5120 + 60 × 128 × 5120 = 458752000",
        },
      },
      {
        kind: "p",
        text: {
          en: "458752000 was the printed result, and it was marked right, together with the all-full comparison. If all 70 layers were full attention, the same 8K request is 70 × 8192 × 5120 bytes: about 2.9 GB when 1 GB is 10⁹ bytes, or about 2.73 GiB. The mixed total is about 437.5 MiB. The two differ by about 6.4 times. The check then split the mixed total with the same factors: the 10 full layers are 10 × 8192 × 5120 = 400 MiB, and the 60 sliding-window layers are 60 × 128 × 5120 = 37.5 MiB.",
          zh: "458752000 是打出来的结果，和「如果 70 层全是全注意力」的对比一起被判对。如果 70 层全是全注意力，同一条 8K 请求是 70 × 8192 × 5120 字节：1 GB 按 10⁹ 字节计大约 2.9 GB，也就是大约 2.73 GiB。混合的这一份大约 437.5 MiB。两者相差约 6.4 倍。核对再用同样的因子把混合结果拆开：10 层全注意力是 10 × 8192 × 5120 = 400 MiB，60 层滑窗是 60 × 128 × 5120 = 37.5 MiB。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I was asked whether the SWA term, 60 × 128 × 5120, still matters once the context is very long, and whether the ratio of all-full to mixed would grow or shrink. I said the SWA part would not grow, because it is a constant. With L = 1048576 I ran hybrid / 2**30, full / 2**30, and full / hybrid, and got 50.03662109375, 350.0, and 6.9948767992193215. That was marked right. The reading that came back with the mark: full / hybrid moves toward 70 / 10 = 7 as L grows, because the sliding-window term does not scale. This was one of the few conclusions that week that I got by calculating the next case, rather than by recognizing a finished explanation.",
          zh: "我被问：上下文变得很长时，SWA 那一项 60 × 128 × 5120 还重不重要，以及「全注意力 / 混合」的倍数会变大还是变小。我说 SWA 那一部分不会变大，因为它是一个定值。我用 L = 1048576 算了 hybrid / 2**30、full / 2**30、full / hybrid，得到 50.03662109375、350.0、6.9948767992193215。判对。随判分回来的读法是：L 变大时，full / hybrid 靠近 70 / 10 = 7，因为滑窗那一项不随 L 涨。这是那几天里，少数我是靠把下一题算出来、而不是靠认出一段写好的解释才得到的结论。",
        },
      },
    ],
  },
  {
    heading: { en: "Stopping at the door of MTP", zh: "停在 MTP 门口" },
    blocks: [
      {
        kind: "p",
        text: {
          en: "MiMo-7B's config has num_nextn_predict_layers set to 1, and I was asked what that layer is for and why it would make inference faster, with speculative decoding as the hint. I described a small model guessing a draft, then a second model checking whether the draft passes. The correction was short, and I am leaving it short. The draft is not a separate small model. It is an extra prediction head on the main model, sharing most of the weights, and the 1 means it can guess one further token. The main model can check that draft in one forward pass.",
          zh: "MiMo-7B 的 config 里 num_nextn_predict_layers 是 1。我被问这一层是干什么的，为什么能让推理变快，提示是投机解码。我的说法是：一个小模型先猜一份草稿，再由另一个模型看这份草稿过不过。纠正很短，我也只记到这里。草稿不是另一个独立的小模型。它是主模型上多出来的一个预测头，大部分权重是共享的；这个 1 表示可以再多猜一个 token。主模型可以在一次前向里检查这份草稿。",
        },
      },
      {
        kind: "p",
        text: {
          en: "I asked to go straight into MTP. The next question was, for tokens t1 through t4, which token a normal model predicts from the position of t2, and which token the extra head predicts from that same position. I did not answer it. The evening moved to the V2.5-Pro shapes above. So in this note MTP is that opening, and the correction of the picture I had.",
          zh: "我问要不要直接去学 MTP。下一问是：token 从 t1 到 t4，普通模型在 t2 这个位置预测的是哪个 token，多出来的那个头在同一位置预测的又是哪个。我没有答。那天晚上转到了上面的 V2.5-Pro 形状。所以在这篇里，MTP 就是这个开头，加上对我那幅图的纠正。",
        },
      },
      {
        kind: "p",
        text: {
          en: "The feeling from the score was still there at the end of the 24th. I can follow the right answer, including the ones I got wrong and then corrected. It does not stay when I have only recognized it. The useful next step is to implement the cache. This note is the record of the questions and the checks, not that implementation.",
          zh: "24 日结束时，分数带来的那种感觉还在。正确答案我跟得上，包括我先答错、再改对的那些。只是认出来的话，它留不住。下一步有用的是自己把 cache 写出来。这篇是那些问题和核对的记录，不是那次实现。",
        },
      },
    ],
  },
];

export default function MimoKvNote() {
  return (
    <>
      <SubHeader />
      <main>
        <article className="wrap">
          <p className="section-label">
            <a href="/learning">
              <T en="Learning notes" zh="学习专栏" />
            </a>{" "}
            · 2026-11-25
          </p>
          <h1 className="hero-headline">
            <T
              en="Hand-calculating MiMo's KV, from the tokenizer to one config"
              zh="手算 MiMo 的 KV：从分词到一张 config"
            />
          </h1>
          <p className="hero-sub">
            <T
              en="19–24 November 2026. Written from my study sessions that week. Each section keeps the question I asked next, and the check I got back. The numbers are the ones I calculated or had marked, not a second pass from memory."
              zh="2026 年 11 月 19 日–24 日。按那一周的学习记录来写。每一节留下我接着问的那一句，以及回来的核对。数字是我算过或被判过的，不是事后凭印象再算一遍。"
            />
          </p>

          {SECTIONS.map((s) => (
            <section key={s.heading.en} className="post-section">
              <h2 className="post-heading">
                <T en={s.heading.en} zh={s.heading.zh} />
              </h2>
              {s.blocks.map((b) => {
                if (b.kind === "formula") {
                  return (
                    <p key={b.text.en} className="post-formula">
                      <T en={b.text.en} zh={b.text.zh} />
                    </p>
                  );
                }
                if (b.kind === "quote") {
                  return (
                    <blockquote key={b.text.en} className="about-pull">
                      <T en={b.text.en} zh={b.text.zh} />
                    </blockquote>
                  );
                }
                return (
                  <p key={b.text.en} className="about-body post-para">
                    <T en={b.text.en} zh={b.text.zh} />
                  </p>
                );
              })}
            </section>
          ))}
        </article>
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <a href="/learning" className="footer-note">
            <T en="← learning notes" zh="← 学习专栏" />
          </a>
          <span className="footer-note">
            <T en="building in public" zh="边做边公开" />
          </span>
        </div>
      </footer>
    </>
  );
}
