# AI Builder Portfolio Homepage Design

## Goal

Rebuild `pccoding666.com` from a resume-style page into a personal brand homepage for Peng Cheng as an AI Builder. The first version should make a visitor remember that Peng turns AI ideas into working products, while still showing enough past experience to establish credibility.

## Audience

The primary audience is personal brand and content viewers: people who discover Peng through projects, demos, GitHub, LinkedIn, videos, or shared links. They should quickly understand what Peng builds, what he has done before, and where to follow or contact him.

Secondary audiences include potential collaborators, hiring managers, and technical peers. The page should remain professional enough for them, but it should not read like a traditional CV.

## Positioning

Primary identity:

> AI Builder turning ideas into working AI products.

Supporting identity:

Peng has experience across AI product building, cloud solution architecture, developer tooling, content demos, and applied data or AI engineering internships. The homepage should present those as evidence behind the AI Builder identity instead of making them the main headline.

## Recommended Information Architecture

The page remains a single static Next.js homepage with sections in this order:

1. Hero
2. Featured Builds
3. Experiments / Fun Builds
4. Experience Timeline
5. Current Focus
6. Contact

### Hero

Purpose: establish the personal brand in under 10 seconds.

Content:

- Name: `Peng Cheng`
- Primary headline: `AI Builder turning ideas into working AI products.`
- Supporting copy: mention AI apps, local inference, agents, cloud-native solutions, and technical demos.
- Primary action: `View Builds`
- Secondary action: `GitHub` or `Contact`
- Trust strip: short labels such as `Alibaba Cloud SA`, `NUS`, `AI tools`, `Developer demos`

Design direction:

- Full-width hero, not a card.
- Calm technical look with strong typography and clear hierarchy.
- Avoid the current centered resume-card feel.

### Featured Builds

Purpose: prove the AI Builder claim with 2-3 concrete projects.

Initial projects:

- `On-Device Live Caption Translator (LCT)`
  - Position as a local AI tool for real-time caption translation.
  - Link: `https://lct-hub.lovable.app/`
- `VidSnap / YouTube Summarizer`
  - Position as an AI summarization tool for video understanding.
  - Links: `https://vidsnap.com` and `https://github.com/PCcoding666/my_youtube_summarizer`
- `Qoder AI App Demo`
  - Position as a creator/demo project showing full-cycle AI-assisted app development.
  - Link: existing YouTube demo.

Each project card should include:

- Category label
- Project name
- One-sentence value proposition
- Short build notes or tags
- One or two links

The section should be easy to extend when Peng adds more "fun builds."

### Experiments / Fun Builds

Purpose: leave visible space for future additions without making the first version look incomplete.

Initial content can be framed as:

- `More experiments coming soon`
- A short sentence: `A running lab for small AI tools, demos, and prototypes.`

This section should be implemented as data-driven items so new experiments can be added later without rewriting layout code.

### Experience Timeline

Purpose: show what Peng has done before without making the site feel like a resume.

Items:

- Alibaba Cloud: Solutions Architect
- Qoder: Brand Ambassador / AI IDE demo content
- Antalpha: AI Product User Research Intern
- HyperGAI: Data Engineer Intern
- Procter & Gamble: AI Engineer Intern
- National University of Singapore
- South China University of Technology

Design direction:

- Timeline or compact milestone list.
- Focus each item on credibility and domain exposure, not long resume bullets.
- Keep education below professional/building experience.

### Current Focus

Purpose: clarify what Peng is exploring now.

Suggested focus areas:

- AI apps and workflow automation
- Local inference and edge AI
- AI agents and developer tools
- Cloud architecture for AI products
- Technical storytelling through demos

This section should be concise. It should help visitors decide whether to follow, contact, or explore projects.

### Contact

Purpose: provide clear next steps.

Include:

- GitHub: `https://github.com/PCcoding666`
- LinkedIn: `https://www.linkedin.com/in/cheng-peng-30936a2a0/`
- Email: `e1143754@u.nus.edu`
- Optional video/demo link from Qoder

## Visual Direction

The first version should feel like a polished technical personal site, not a corporate resume.

Use:

- Clean typography
- Strong section rhythm
- Project-first layout
- Restrained but distinct color accents
- Subtle surfaces and borders
- Icons from `lucide-react`

Avoid:

- One big resume card
- Overly decorative gradients or abstract blobs
- Dense CV bullet lists
- Landing-page marketing fluff
- Visual complexity that requires custom assets before the content is ready

## Technical Design

Keep the current stack:

- Next.js 14
- Static export with `output: 'export'`
- Tailwind CSS
- `lucide-react`
- GitHub Pages workflow deployment

Implementation should remain simple:

- Keep a single homepage route.
- Move repeated content into arrays in `app/page.tsx` or a small local data object.
- Extract small presentational helpers only if it improves readability.
- Do not introduce a CMS, backend, animation library, or image pipeline in the first version.

## Content Defaults For First Version

Use current known content where user material is missing:

- No profile photo required.
- Use text-led project cards.
- Use existing project links and role names.
- Add a complete "Experiments" teaser that can stand on its own until more build details are added.

Future user-provided material can improve the site:

- Project screenshots
- More project links
- Short summaries of fun builds
- Personal photo or avatar
- Preferred contact channel

## Verification Criteria

Before considering implementation complete:

- `npm run build` succeeds.
- The generated static site still works with GitHub Pages.
- `http://pccoding666.com` returns the new homepage after deployment.
- Layout is checked on desktop and mobile.
- Text does not overflow buttons, cards, or narrow mobile containers.
- The page clearly communicates AI Builder first and past experience second.

## Out Of Scope For First Version

- Multi-page case studies
- Blog system
- CMS
- Authentication
- Dynamic data fetching
- Newsletter integration
- Custom illustration generation
- Full redesign of deployment workflow unless needed for Pages compatibility
