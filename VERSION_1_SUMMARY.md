# IB ACIO Tier-2 — Version 1.0 Summary

Warm, habit-forming descriptive prep for IB ACIO Grade-II/Executive **Tier-2** (50 marks · 60 mins · Essay + RC + 2 LAQs). Sibling of Tier-1 in look and love — different skill: **writing**.

## Theme tokens

See `THEME.md`. Core: background `#0b1220`, card `#111827`, border `#1f2937`, primary `#3b82f6`, success `#10b981`, warning `#f59e0b`, error `#ef4444`.

Section accents: Essay `#38bdf8` · RC `#f472b6` · LAQ `#a78bfa` · Daily `#10b981` · Mock `#3b82f6` · Model `#14b8a6`.

## Stack

- React Native **0.86** · React **19.2** · TypeScript
- React Navigation (native-stack + drawer)
- gesture-handler · reanimated 4.5 · screens · safe-area
- AsyncStorage · i18next · calendars · vector-icons · webview · responsive-screen

Package: `IBACIOTIER2` / display **IB ACIO Tier-2** · version **1.0.0** · Android id `com.ibaciotier2`

## App map

```
Splash → Drawer (Home, Daily Writing Desk, Practice Hub, Mocks, Model Answers, Previous Papers, About)
Stack overlays: Essay / RC / LAQ flows, DailyPromptDetail, MockDescriptive → MockResult
```

## Bundled starter content

| Pack | Count | Path |
|------|------:|------|
| Essay topics | 32 | `src/assets/essays/topics.json` |
| Writing guides | — | `src/assets/essays/guides.json` |
| Comprehension passages | 16 | `src/assets/comprehension/passages.json` |
| Long-answer questions | 42 | `src/assets/long-answers/questions.json` |
| Full mocks | 3 | `src/assets/mocks/papers.json` |
| Daily prompt editions | 5 | `src/assets/daily-prompts/` + `manifest.json` |

## Daily Writing Desk — OTA (GitHub)

**Author docs:** [`CONTENT_OTA.md`](./CONTENT_OTA.md) (full) · [`CONTENT_AUTHOR_QUICKSTART.md`](./CONTENT_AUTHOR_QUICKSTART.md) (short)

Config: `src/config/dailyPrompts.ts`

```
BASE = https://raw.githubusercontent.com/BaluG123/ibacio-tier2-daily-prompts/main
```

**Resolution order:** cloud fetch → AsyncStorage cache → bundled JSON.

### Remote layout

1. `{BASE}/manifest.json` → `{ "dates": ["2026-07-20", ...] }`
2. `{BASE}/{YYYY-MM-DD}.json` → daily edition

### Edition schema (EN + `_hi` fields)

```json
{
  "date": "2026-07-20",
  "editionTitle": "Tier-2 Daily Desk",
  "editionTitle_hi": "...",
  "essayTopic": {
    "title": "...",
    "title_hi": "...",
    "category": "Socio-political",
    "hints": ["..."],
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

### How to publish a new day (no Play Store release)

1. Create/clone public repo `ibacio-tier2-daily-prompts` (branch `main`).
2. Add `2026-07-21.json` following the schema above (keep `image` null / omit images).
3. Prepend `"2026-07-21"` to `manifest.json` → `dates`.
4. Push to GitHub. In-app: pull-to-refresh or reopen Daily Writing Desk.

If the remote repo is missing, the app still works from **bundled** `src/assets/daily-prompts/`.

Update `DAILY_PROMPTS_BASE_URL` in `src/config/dailyPrompts.ts` if the GitHub user/repo name differs.

## Student UX highlights

- Timers with green → amber → red; live word counts
- AsyncStorage drafts (essays / LAQs) so writing is not lost silently
- Writing streak + essay unlocks (complete 3 → unlock next 5)
- Self-score rubric after full mocks (no fake AI grading)
- EN / HI UI toggle; exam medium remains English-first for content
- WhatsApp support CTA (number kept internal for deep links; not shown in UI)
- Qualifying ~33% mentioned only as a commonly cited guide — not a guarantee

## Run

```bash
npm install
npm start
npm run android   # or npm run ios
```

Android: vector-icons fonts applied via `fonts.gradle` in `android/app/build.gradle`.

## Optional later (v1.1+)

- Tier-3 interview tips OTA pack
- Share draft as text
- Streak notifications
- OTA topic banks (`/topics/essays.json`, etc.)
