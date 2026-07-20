# Content Author Quick Card — Daily Desk

Short version of `CONTENT_OTA.md` for fast daily publishing.

## Repo

`https://github.com/BaluG123/ibacio-tier2-daily-prompts` (public, branch `main`)

App reads:

`https://raw.githubusercontent.com/BaluG123/ibacio-tier2-daily-prompts/main/...`

## Every day

1. Create `YYYY-MM-DD.json` (essay + 2 LAQs + comprehension + tip)
2. Add that date to `manifest.json` → `"dates"`
3. `git push` to `main`
4. Open app → Daily Writing Desk → pull to refresh

## Minimal valid edition

Must include: `date`, `editionTitle`, `essayTopic`, `longAnswers` (2 items), `comprehension`, `tipOfDay`.

Hindi fields (`*_hi`) optional but preferred.

## Do not

- Put secrets in the repo (public raw URLs only)
- Reuse copyrighted newspaper text as-is
- Forget to update `manifest.json` (file alone is not enough)

## Local fallback (shipped in app)

`src/assets/daily-prompts/` — edit only when you want an **app-store** release to include new offline samples.
