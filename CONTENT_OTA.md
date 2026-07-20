# How to Add Daily Writing Content Remotely (GitHub OTA)

Publish new **Tier-2 Daily Writing Desk** editions on GitHub. Students get them in the app **without a Play Store / App Store update**.

---

## 1. One-time: create the public repo

1. On GitHub, create a **public** repository named:

   `ibacio-tier2-daily-prompts`

2. Default branch: **`main`**

3. Confirm the app URL matches (already set in code):

```text
https://raw.githubusercontent.com/BaluG123/ibacio-tier2-daily-prompts/main
```

File in app: `src/config/dailyPrompts.ts` → `DAILY_PROMPTS_BASE_URL`

If your GitHub username or repo name is different, change that constant once and ship a normal app update. After that, **only JSON** needs publishing.

---

## 2. Repo layout

```text
ibacio-tier2-daily-prompts/
├── manifest.json          ← list of available dates
├── 2026-07-20.json        ← one edition per day
├── 2026-07-21.json
└── README.md              ← optional notes for authors
```

Raw URLs the app fetches:

| File | URL |
|------|-----|
| Manifest | `{BASE}/manifest.json` |
| Edition | `{BASE}/2026-07-21.json` |

---

## 3. `manifest.json`

Always keep an up-to-date list of dates that exist as JSON files.

```json
{
  "dates": [
    "2026-07-21",
    "2026-07-20",
    "2026-07-19"
  ]
}
```

**Tips**
- Newest date first (easier for humans; app does not require order).
- Every date in `dates` must have a matching `{date}.json` file.
- Use `YYYY-MM-DD` only.

---

## 4. Daily edition file `{YYYY-MM-DD}.json`

Copy this template, fill EN (and HI when ready), save as e.g. `2026-07-21.json`.

```json
{
  "date": "2026-07-21",
  "editionTitle": "Tier-2 Daily Desk",
  "editionTitle_hi": "टियर-2 डेली डेस्क",
  "essayTopic": {
    "title": "Climate Justice and India's Development Imperative",
    "title_hi": "जलवायु न्याय और भारत का विकास लक्ष्य",
    "category": "Current Affairs",
    "hints": [
      "Explain CBDR-RC in simple words",
      "Mention India's renewable / NDC direction",
      "Balance growth with adaptation for the vulnerable",
      "End with a practical way forward"
    ],
    "hints_hi": [
      "CBDR-RC को सरल भाषा में समझाएँ",
      "भारत के नवीकरणीय / NDC दिशा का उल्लेख करें",
      "विकास और अनुकूलन का संतुलन रखें",
      "व्यावहारिक आगे का रास्ता लिखकर समाप्त करें"
    ],
    "modelOutline": "Intro: equity in climate talks. Body: energy transition, finance gap, vulnerable communities. Conclusion: leadership without compromising development.",
    "modelOutline_hi": "परिचय: जलवायु वार्ताओं में समानता। मुख्य भाग: ऊर्जा संक्रमण, वित्त अंतर, कमज़ोर वर्ग। निष्कर्ष: विकास के साथ नेतृत्व।"
  },
  "longAnswers": [
    {
      "id": "la1",
      "domain": "Economics",
      "question": "Discuss the role of MSMEs in employment generation in India.",
      "question_hi": "भारत में रोज़गार सृजन में MSME की भूमिका की चर्चा कीजिए।",
      "keyPoints": [
        "Large share of employment",
        "Credit and formalisation challenges",
        "Market access and exports",
        "Policy support and skilling"
      ],
      "keyPoints_hi": [
        "रोज़गार में बड़ा हिस्सा",
        "ऋण और औपचारिकीकरण चुनौतियाँ",
        "बाज़ार पहुँच और निर्यात",
        "नीति समर्थन और कौशल"
      ],
      "modelAnswer": "MSMEs are the backbone of employment... (150–200 words, balanced, factual).",
      "modelAnswer_hi": "MSME रोज़गार की रीढ़ हैं... (150–200 शब्द)।"
    },
    {
      "id": "la2",
      "domain": "Socio-political",
      "question": "Examine urbanisation challenges and the idea of inclusive cities.",
      "question_hi": "शहरीकरण की चुनौतियों और समावेशी शहरों के विचार की जाँच कीजिए।",
      "keyPoints": [
        "Housing and transit",
        "Informal workers",
        "Environment and climate risk",
        "Participatory planning"
      ],
      "keyPoints_hi": [
        "आवास और परिवहन",
        "अनौपचारिक श्रमिक",
        "पर्यावरण और जलवायु जोखिम",
        "सहभागी नियोजन"
      ],
      "modelAnswer": "Inclusive cities plan with the poor, not only for them... (150–200 words).",
      "modelAnswer_hi": "समावेशी शहर गरीबों के साथ योजना बनाते हैं...।"
    }
  ],
  "comprehension": {
    "passage": "Paste a 300–450 word factual passage here. Keep tone calm and exam-useful. No copyrighted news reprint — write original or paraphrase public facts.",
    "passage_hi": "यहाँ 300–450 शब्दों का गद्यांश...",
    "questions": [
      {
        "q": "What is the central idea of the passage?",
        "q_hi": "गद्यांश का केंद्रीय विचार क्या है?",
        "model": "One or two clear sentences grounded in the passage.",
        "model_hi": "गद्यांश पर आधारित एक-दो स्पष्ट वाक्य।"
      },
      {
        "q": "List two challenges mentioned in the passage.",
        "q_hi": "गद्यांश में उल्लिखित दो चुनौतियाँ बताइए।",
        "model": "Challenge A; Challenge B.",
        "model_hi": "चुनौती A; चुनौती B।"
      }
    ]
  },
  "tipOfDay": "Spend 3 minutes outlining before you write the essay — structure wins marks.",
  "tipOfDay_hi": "निबंध लिखने से पहले 3 मिनट रूपरेखा बनाएँ — संरचना अंक दिलाती है।"
}
```

### Field rules

| Field | Notes |
|-------|--------|
| `date` | Must match filename |
| `longAnswers` | Prefer **exactly 2** (exam section is 2 × 10) |
| `comprehension.questions` | 4–6 descriptive Qs |
| `*_hi` | **Required for Hindi UI** — real Devanagari, not English copies |
| Images | Prefer **none** (copyright-safe). Do not add image URLs unless you own rights |

When the app language is Hindi, every `title`, `hints`, `question`, `passage`, `modelAnswer`, and `tipOfDay` is shown from the matching `*_hi` field.

### Domains / categories (keep consistent)

- Essay `category`: `Current Affairs` · `Economy` · `Socio-political` · `Security & Governance` · `Abstract/General`
- LAQ `domain`: `Current Affairs` · `Economics` · `Socio-political`

---

## 5. Publish checklist (every day)

1. Write `YYYY-MM-DD.json` locally (validate JSON — no trailing commas).
2. Add the date string to `manifest.json` → `dates`.
3. Commit and push to `main`:

```bash
git add manifest.json 2026-07-21.json
git commit -m "Add daily desk 2026-07-21"
git push origin main
```

4. Smoke-test in browser:

```text
https://raw.githubusercontent.com/BaluG123/ibacio-tier2-daily-prompts/main/manifest.json
https://raw.githubusercontent.com/BaluG123/ibacio-tier2-daily-prompts/main/2026-07-21.json
```

Both should show raw JSON (not 404).

5. In the app: open **Daily Writing Desk** → pull to refresh (or leave and reopen).  
   Flow: **cloud → AsyncStorage cache → bundled fallback**.

---

## 6. What students see if GitHub is down

App still works from:

1. Last successful cache on device  
2. Bundled samples in `src/assets/daily-prompts/`

Empty / missing day → friendly **“Check back tomorrow”** (not a crash).

---

## 7. Tone guidelines (IB descriptive)

- Factual, balanced, non-sensational  
- No party rants; critique policies/institutions, not communities  
- Security topics: calm, rights-aware, no fear-mongering  
- Prefer schemes, institutions, constitutional values as examples  

---

## 8. Optional later: OTA topic banks

Same pattern can later host:

```text
{BASE}/topics/essays.json
{BASE}/topics/long-answers.json
{BASE}/topics/comprehension.json
```

Not wired in v1.0 — daily desk only. See `VERSION_1_SUMMARY.md`.
