# IB ACIO Tier-2 App — Master Build Prompt

> Copy everything below the line into Cursor (Agent mode) inside `/Users/apple/Desktop/Project/IBACIOTIER2`.
> Reference sibling app: `/Users/apple/Desktop/Project/IB-ACIO` (Tier-1) for UI/UX patterns, theme hex values, navigation, i18n, OTA, and student-loving copy — **adapt for descriptive Tier-2, do not clone MCQ-only flows blindly**.

---

## ROLE

You are building **IB ACIO Tier-2 2026** — a React Native CLI exam-prep app for Intelligence Bureau ACIO Grade-II/Executive **Tier-2 (descriptive paper)**. Students who cleared Tier-1 need writing practice, model answers, topics, and daily current-affairs writing prompts. Make it warm, motivating, and habit-forming — “Made with ❤️ for aspirants”.

**Stack already present:** React Native **0.86**, React **19.2**, TypeScript (`App.tsx`). Keep TypeScript. Install the same feature deps as Tier-1 (adapt versions for RN 0.86):

- `@react-navigation/native`, `native-stack`, `drawer`
- `react-native-gesture-handler`, `reanimated`, `screens`, `safe-area-context`
- `@react-native-async-storage/async-storage`
- `i18next`, `react-i18next`
- `react-native-calendars`, `react-native-vector-icons`, `react-native-webview`
- `react-native-responsive-screen`

Package name / display: `IBACIOTIER2` / **IB ACIO Tier-2**. Version start at `1.0.0`.

---

## EXAM TRUTH (Tier-2) — BUILD AROUND THIS

Official pattern (MHA / IB ACIO notification):

| Section | Marks | Nature |
|--------|------:|--------|
| Essay Writing | 20 | One essay (~400–500 words), Intro–Body–Conclusion |
| English Comprehension | 10 | Passage + descriptive answers |
| Long Answer Questions | 20 | **2 questions × 10 marks** on Current Affairs / Economics / Socio-political issues |
| **Total** | **50** | **60 minutes**, English medium, descriptive (pen-paper exam) |
| Qualifying | ~33% | Often cited as minimum to proceed toward interview |

**Tier-3** = Interview (100 marks) — optional light “Interview Tips” section later; do not overbuild yet.

There is **no fixed topic list**. Content themes for essays & long answers:

- Current Affairs (national / international / defence / schemes)
- Economics & development
- Socio-political issues
- Internal security, borders, cyber, intelligence awareness (balanced, factual — no sensationalism)
- Governance, Constitution basics as applied to current issues
- Social justice, environment, science & tech policy angles

---

## VISUAL THEME — MATCH TIER-1 EXACTLY

Hardcode the same dark Tailwind-slate look (no purple-on-white AI look). Document tokens in a short `THEME.md` and reuse hex everywhere:

| Token | Hex | Use |
|-------|-----|-----|
| Background | `#0b1220` | App canvas |
| Card / header | `#111827` | Surfaces |
| Border | `#1f2937` | Dividers |
| Primary | `#3b82f6` | CTAs, accents |
| Success | `#10b981` | Done / good |
| Warning | `#f59e0b` | Timer / caution |
| Error | `#ef4444` | Alerts |
| Text primary | `#ffffff` | Titles |
| Text muted | `#9ca3af` | Subtitles |
| Text soft | `#e5e7eb` | Body |

**Section accent colors** (home cards):

| Module | Accent |
|--------|--------|
| Essay Writing | `#38bdf8` |
| English Comprehension | `#f472b6` |
| Long Answer Practice | `#a78bfa` |
| Topic Bank / Current Issues | `#f59e0b` |
| Daily Writing Prompt (OTA) | `#10b981` |
| Full Mock Descriptive | `#3b82f6` |
| Model Answers / Evaluation Tips | `#14b8a6` |

Use `wp` / `hp` from `react-native-responsive-screen`. Prefer StyleSheet + hex like Tier-1 (no mandatory ThemeContext unless helpful). Soft motion: splash spring, home pulse on “today’s prompt”, shimmer on NEW badge — 2–3 intentional animations only.

---

## APP STRUCTURE (mirror Tier-1 architecture)

```
App.tsx → NavigationContainer → AppNavigator
  Splash → DrawerNavigator ("Home")
    HomeDrawer → HomeScreen
    DailyPromptsDrawer → DailyWritingScreen   (OTA — GitHub)
    PracticeDrawer → PracticeHubScreen
    MockTestsDrawer → DescriptiveMocksScreen
    ModelAnswersDrawer → ModelAnswersScreen
    PreviousPapers → PreviousYearPapersScreen (WebView / Drive)
    About → AboutScreen
  Stack overlays:
    EssayPractice → EssayTopic → EssayWrite (timer + word count)
    ComprehensionPractice → PassageDetail
    LongAnswerPractice → QuestionDetail → Write
    DailyPromptDetail
    MockDescriptive → MockResult (self-score checklist)
```

Folder layout:

```
src/
  config/          # OTA URLs, cache TTL
  services/        # dailyPromptService (like dailyNewsService)
  navigation/
  screens/
  i18n/            # EN + HI
  utils/           # wordCount, timer helpers
  assets/
    essays/        # bundled sample topics + model outlines
    comprehension/
    long-answers/
    mocks/
    daily-prompts/ # bundled fallback editions + manifest.json
```

---

## CORE FEATURES (student-loving)

### 1. Home
- Greeting: “Welcome Aspirant” / Hindi equivalent
- Exam strip: **Tier-2 · 50 marks · 60 mins · Essay + RC + 2 LAQs**
- Cards for: Essay, Comprehension, Long Answers, Daily Writing Prompt (highlight + NEW/pulse if today’s OTA edition exists), Full Mock, Model Answers
- EN / HI language toggle (animated)
- Drawer: branding, version, fake-social proof style stats (honest placeholder until real), WhatsApp support `+919380552833`

### 2. Essay Writing module
- Topic categories: Current Affairs, Economy, Socio-political, Security & Governance, Abstract/General
- For each topic: title, hints (3–5 bullets), suggested structure, word target 400–500, difficulty
- **Write mode:** timer (suggest 25–30 min for essay section), live word count, optional local draft save (AsyncStorage)
- After submit: show **model outline / sample answer** (bundled or OTA) + self-evaluation checklist (Intro clarity, Facts, Balance, Conclusion, Language)
- Levels/unlocks optional (gamified like Tier-1) — e.g. unlock next 5 topics after completing 3 writes

### 3. English Comprehension
- Passages (300–450 words) + 4–6 descriptive Qs (not MCQ-only; allow short written answers)
- Reveal model answers after attempt
- Tips: inference, vocabulary in context, time management (~10–12 min)

### 4. Long Answer Questions (2 × 10 marks)
- Questions tagged: Current Affairs | Economics | Socio-political
- Practice one-at-a-time with 10–12 min timer, word target ~150–200
- Model answer + key points bullet list
- “Today’s pair” mode: 2 random LAQs to mimic exam section (20 marks)

### 5. Full Descriptive Mock (exam simulation)
- 60-minute timer for whole paper
- Structure: 1 Essay (20) + 1 Passage set (10) + 2 LAQs (20)
- Self-score rubric at end (sliders or checklists per section) — store history
- Negative marking N/A (descriptive)

### 6. Daily Writing Prompt — **OTA via GitHub** (critical)
Mirror Tier-1 `dailyNews` pattern exactly:

**Config** `src/config/dailyPrompts.js`:
```js
export const DAILY_PROMPTS_BASE_URL =
  'https://raw.githubusercontent.com/<YOUR_GITHUB_USER>/ibacio-tier2-daily-prompts/main';
export const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
```

**Remote layout:**
- `{BASE}/manifest.json` → `{ "dates": ["2026-07-20", ...] }`
- `{BASE}/2026-07-20.json` → daily edition

**Edition schema (EN + HI fields):**
```json
{
  "date": "2026-07-20",
  "editionTitle": "Tier-2 Daily Desk",
  "editionTitle_hi": "...",
  "essayTopic": {
    "title": "...",
    "title_hi": "...",
    "category": "Socio-political",
    "hints": ["...", "..."],
    "hints_hi": ["..."],
    "modelOutline": "...",
    "modelOutline_hi": "..."
  },
  "longAnswers": [
    {
      "id": "la1",
      "domain": "Economics",
      "question": "...",
      "question_hi": "...",
      "keyPoints": ["..."],
      "keyPoints_hi": ["..."],
      "modelAnswer": "...",
      "modelAnswer_hi": "..."
    },
    {
      "id": "la2",
      "domain": "Current Affairs",
      "question": "...",
      "question_hi": "...",
      "keyPoints": ["..."],
      "keyPoints_hi": ["..."],
      "modelAnswer": "...",
      "modelAnswer_hi": "..."
    }
  ],
  "comprehension": {
    "passage": "...",
    "passage_hi": "...",
    "questions": [
      { "q": "...", "q_hi": "...", "model": "...", "model_hi": "..." }
    ]
  },
  "tipOfDay": "...",
  "tipOfDay_hi": "..."
}
```

Flow: **cloud first → AsyncStorage cache → bundled `src/assets/daily-prompts/`**. Pull-to-refresh. Images optional; prefer `null` (copyright-safe). Calendar UI like Tier-1 Daily News.

Ship **3–5 sample bundled days** so the app works offline on day one. Document in comments how to publish new JSON to GitHub without an app store release.

### 7. Model Answers & Writing Tips
- Static guides: Essay structure, how examiners score, common mistakes, vocabulary for governance/economy
- Sample high-quality essays (bundled JSON)
- “Do’s & Don’ts” for IB descriptive tone (factual, balanced, non-political rant)

### 8. Previous Year Papers
- WebView + Google Drive `/preview` URLs (same pattern as Tier-1 `PreviousYearPapersScreen`)
- Placeholder years with “Coming Soon” if URL missing

### 9. About
- Mission for Tier-2 aspirants, features list, WhatsApp support, version badge

### 10. i18n
- Full EN + HI strings for UI (content may be English-first for Tier-2 exam medium, but UI + OTA fields bilingual)

---

## CONTENT STARTER PACK (bundle enough to feel real)

Create realistic **sample** content (not empty placeholders):

- **30+ essay topics** across categories with hints + short model outlines
- **15+ comprehension passages** with model answers
- **40+ long-answer questions** (CA / Economy / Socio-political) with key points + model answers
- **3 full mock papers**
- **3–5 daily-prompt editions** + `manifest.json`

JSON shapes should be consistent and easy to extend via GitHub OTA later (you may later OTA topic banks the same way as daily prompts).

---

## UX DETAILS THAT MAKE STUDENTS LOVE IT

- Warm copy, not corporate; celebrate streaks (“3 days writing streak”)
- Word count + gentle timer colors (green → amber → red)
- Progress saved locally; never lose a draft silently
- Empty states that teach (“Add today’s prompt on GitHub” only in About/dev notes — users see friendly “Check back tomorrow”)
- Accessible tap targets, SafeAreaView, notch-safe
- One WhatsApp CTA for doubt support
- Home must read as **one composition**: brand + exam strip + primary modules — no dashboard clutter of stats piles

---

## IMPLEMENTATION ORDER

1. Install deps, fix babel (reanimated plugin), vector-icons Android/iOS setup
2. Theme tokens + Splash + Drawer + Stack navigation shell
3. Home + About + i18n skeleton
4. Essay / Comprehension / Long Answer screens with bundled JSON
5. Write mode (timer, word count, AsyncStorage drafts)
6. Daily prompts OTA service + calendar UI + bundled fallbacks
7. Full mock + self-score
8. Previous papers WebView
9. Polish motion, empty states, README for content authors

---

## DO / DON’T

**DO**
- Match Tier-1 colors, drawer, splash energy, OTA pattern
- Keep content factual and exam-useful
- Prefer offline-first with cloud refresh
- Use TypeScript cleanly

**DON’T**
- Build another Tier-1 MCQ app with 5 objective subjects
- Invent fake official cutoffs as guarantees
- Use Inter/Roboto-only boring light purple SaaS UI
- Put secrets in the repo; only public raw GitHub URLs
- Overbuild AI auto-grading in v1 (self-check + model answers only)

---

## SUCCESS CRITERIA

- App opens to dark branded splash → home with Tier-2 syllabus modules
- Student can practice essay / RC / LAQ with timers and model answers
- Today’s writing desk loads from GitHub when online, works offline from cache/bundle
- EN/HI UI toggle works
- Feels like a sibling of IB-ACIO Tier-1 — same love, different exam skill (writing)

---

## OPTIONAL LATER (v1.1+)

- Interview (Tier-3) tips pack via OTA
- Share essay draft as text
- Streak notifications
- More OTA topic packs (`/topics/essays.json` etc.)

When done, write a short `VERSION_1_SUMMARY.md` documenting theme tokens, OTA repo layout, and how to add a new daily edition.
