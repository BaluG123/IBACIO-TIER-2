# Play Store Deployment Guide — IB ACIO Tier-2

Step-by-step checklist to publish **IB ACIO Tier-2** (`com.ibaciotier2`) on Google Play, sibling of live Tier-1: [IB ACIO Exam Preparation 2026](https://play.google.com/store/apps/details?id=com.ibacio).

---

## Logo advice — keep same brand, mark Tier-2

**Recommendation: keep the same core logo, differentiate with a Tier-2 mark.**

| Option | Pros | Cons |
|--------|------|------|
| **Same logo + “2” badge (current)** | Instant family recognition with Tier-1; aspirants trust the brand | Must not confuse which exam (badge helps) |
| Completely new logo | Clear separation | Looks like a different publisher; weaker cross-sell |
| Same logo, no badge | Strongest brand match | Easy to mix up with Tier-1 on the home screen |

**What we generated for you**
- Android adaptive icons (dark `#0b1220` background + logo + blue **2** badge)
- Legacy `ic_launcher` / round mipmaps
- Play Store **512×512** icon → `store-assets/play_icon_512.png`
- Feature graphic **1024×500** → `store-assets/feature_graphic_1024x500.png`
- iOS App Icon set (for later)

You can replace these later with a designer export; keep **safe zone** clear for adaptive icons (important content inside ~66% center).

---

## 0. Before you start — what you should prepare / add

Please have ready (or create) these:

### Required for Play Console
- [ ] Google Play Developer account (same as Tier-1 / DiaryVault is fine)
- [ ] **Privacy Policy URL** — create Google Site, paste from `store-assets/PRIVACY_POLICY_TIER2.html`  
  (Tier-1 policy: https://sites.google.com/view/ibacioexampreparationapp/home — use a **new** page/site for Tier-2)
- [ ] Short description (≤ 80 chars) + Full description (EN + ideally HI)
- [ ] App category: **Education**
- [ ] Content rating questionnaire (Everyone — same as Tier-1)
- [ ] At least **2 phone screenshots** (1080×1920 recommended); 4–8 is better
- [ ] Feature graphic 1024×500 (draft in `store-assets/`)
- [ ] High-res icon 512×512 (`store-assets/play_icon_512.png`)
- [ ] Contact email (e.g. same as Tier-1: `balusgoudi11@gmail.com`)

### Strongly recommended
- [ ] Upload key / Play App Signing enrolled
- [ ] Release notes for `1.0.0`
- [ ] Clear **disclaimer** (not affiliated with MHA/IB) — already in-app; paste in store listing too
- [ ] Confirm OTA GitHub repo `ibacio-tier2-daily-prompts` exists (or app uses bundled fallbacks)
- [ ] Test WhatsApp support deep link on a real device
- [ ] Test Tier-1 cross-promo button opens:  
  https://play.google.com/store/apps/details?id=com.ibacio

### Optional later
- [ ] Hindi store listing translation
- [ ] Promo video
- [ ] Tablet screenshots
- [ ] Data safety form answers (Tier-1 declares no data collected — match if true)

### Tell us / prepare if missing
1. Final **Privacy Policy** URL you want linked  
2. Whether store listing email stays `balusgoudi11@gmail.com`  
3. Preferred display name: **IB ACIO Tier-2** vs **IB ACIO Tier-2 Descriptive 2026**  
4. Any custom icon PSD/PNG if you want a designer badge instead of the auto “2”

---

## 1. App identity (already in project)

| Item | Value |
|------|--------|
| Application ID | `com.ibaciotier2` |
| Display name | IB ACIO Tier-2 |
| Version name | `1.0.0` |
| Version code | `1` (bump every Play upload) |

Files:
- `android/app/build.gradle` → `applicationId`, `versionCode`, `versionName`
- `android/app/src/main/res/values/strings.xml` → `app_name`

---

## 2. Build a signed release AAB

### 2.1 Create an upload keystore (once)

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore ibacio-tier2-upload.keystore \
  -alias ibacio-tier2 \
  -keyalg RSA -keysize 2048 -validity 10000
```

Store the keystore + passwords in a password manager. **Do not commit the keystore to Git.**

### 2.2 Configure Gradle signing

1. Keep keystore at project root: `ibacio-tier2-upload.keystore` (gitignored).
2. Edit `android/keystore.properties` (gitignored) — replace placeholders:

```properties
storeFile=../../ibacio-tier2-upload.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=ibacio-tier2
keyPassword=YOUR_KEY_PASSWORD
```

If your key alias is different, change `keyAlias` to match what you typed when creating the keystore.

Template committed for reference: `android/keystore.properties.example`

`android/app/build.gradle` already loads this file for **release** signing.

### 2.3 Generate the bundle

```bash
cd android
./gradlew clean bundleRelease
```

Output:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Install a release APK locally to smoke-test (optional):

```bash
./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
```

---

## 3. Create the Play Console app

1. Open [Google Play Console](https://play.google.com/console)
2. **Create app** → name **IB ACIO Tier-2** · language English (India) · Free · Education
3. Complete **Dashboard** declarations (ads: No unless you add ads; COVID/news: No; etc.)
4. **App integrity** → use Play App Signing (recommended)

---

## 4. Store listing copy (starter)

### Short description (≤ 80 characters)

```text
IB ACIO Tier-2 descriptive prep — essays, RC, LAQs & daily writing desk.
```

### Full description (paste & edit)

```text
🚨 DISCLAIMER: Independent study tool. NOT affiliated with IB, MHA, or any government entity.

IB ACIO Tier-2 helps aspirants who cleared Tier-1 practise the descriptive paper:
• Essay writing (400–500 words) with timers & model outlines
• English comprehension with descriptive answers
• Long answer questions (Current Affairs / Economy / Socio-political)
• Full 60-minute descriptive mocks + self-score
• Daily Writing Desk (OTA updates without reinstalling)
• English & Hindi interface

Also prepare for Tier-1 MCQs with our companion app:
https://play.google.com/store/apps/details?id=com.ibacio

Made with ❤️ for aspirants.
```

### Graphics
- Upload `store-assets/play_icon_512.png`
- Upload `store-assets/feature_graphic_1024x500.png`
- Add phone screenshots from emulator/device (Home, Essay, Daily Desk, Mock)

---

## 5. Release track

1. **Testing → Internal testing** first (add your Gmail as tester)
2. Upload `app-release.aab`, set release name `1.0.0 (1)`
3. Smoke-test install from Play internal link
4. Promote to **Closed / Open testing** if desired
5. **Production** when ready → Countries (start with India)

After publish, update in-app Tier-2 update URL is already:

`https://play.google.com/store/apps/details?id=com.ibaciotier2`

(Drawer “Check for Update” uses this.)

---

## 6. Data safety & policy

Match Tier-1 if accurate:
- No data shared with third parties (if true)
- No / minimal data collected
- Link Privacy Policy
- Support phone / email as on Tier-1 listing if you want consistency

---

## 7. Version bumps (every update)

In `android/app/build.gradle`:

```gradle
versionCode 2        // must increase every upload
versionName "1.0.1"  // user-visible
```

Rebuild AAB → upload new release.

---

## 8. Cross-promo (already in app)

Tier-2 deep-links to live Tier-1:

- Home card → Get Tier-1 on Play Store  
- Drawer → IB ACIO Tier-1 App  
- About → same  

URL: https://play.google.com/store/apps/details?id=com.ibacio  

Optional later: add reverse link in Tier-1 (“Prepare for Tier-2 descriptive”) once this app is live.

---

## 9. Quick pre-submit QA

- [ ] Cold start → Splash → Home  
- [ ] EN / HI toggle  
- [ ] Essay / RC / LAQ write + model answers  
- [ ] Daily desk pull-to-refresh  
- [ ] Mock 60-min flow + self-score  
- [ ] Tier-1 Play Store button  
- [ ] WhatsApp support opens chat  
- [ ] Adaptive icon looks correct on Pixel / Samsung launcher  

---

## 10. Files reference

| Asset | Path |
|-------|------|
| Adaptive icon XML | `android/app/src/main/res/mipmap-anydpi-v26/` |
| Foreground | `android/app/src/main/res/drawable*/ic_launcher_foreground.png` |
| Play icon 512 | `store-assets/play_icon_512.png` |
| Feature graphic | `store-assets/feature_graphic_1024x500.png` |
| Play URLs | `src/config/playStore.ts` |

---

Made with ❤️ for aspirants — ship Tier-2 when the checklist above is green.
