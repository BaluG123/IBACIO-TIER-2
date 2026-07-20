/**
 * Daily Writing Prompts — OTA via GitHub raw content.
 *
 * How to publish a new edition WITHOUT an app store release:
 * 1. Create a public repo (e.g. ibacio-tier2-daily-prompts) with branch `main`.
 * 2. Add/update `manifest.json` with a `"dates"` array of YYYY-MM-DD keys.
 * 3. Add `{date}.json` for that day (see schema in VERSION_1_SUMMARY.md).
 * 4. Push to GitHub. The app fetches on pull-to-refresh / focus (cloud → cache → bundle).
 *
 * Replace YOUR_GITHUB_USER below with the real GitHub username once the repo exists.
 */
export const DAILY_PROMPTS_BASE_URL =
  'https://raw.githubusercontent.com/BaluG123/ibacio-tier2-daily-prompts/main';

export const CACHE_PREFIX = 'daily_prompts_cache_';
export const MANIFEST_CACHE_KEY = 'daily_prompts_manifest';
export const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours (documented; forceRefresh bypasses)
export const LAST_SEEN_KEY = 'daily_prompts_last_seen';
