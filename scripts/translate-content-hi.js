#!/usr/bin/env node
/**
 * translate-content-hi.js
 * Applies real Hindi (Devanagari) translations to bundled JSON under src/assets/.
 * Translation maps live in scripts/hi-data/*.json (keyed by id).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'src', 'assets');
const DATA = path.join(__dirname, 'hi-data');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function loadData(name) {
  return readJson(path.join(DATA, name));
}

function hasDevanagari(text) {
  return /[\u0900-\u097F]/.test(String(text || ''));
}

const counts = {
  topics: 0,
  guides: 0,
  passages: 0,
  passageQuestions: 0,
  longAnswers: 0,
  mocks: 0,
  daily: 0,
};

function translateTopics() {
  const map = loadData('topics.json');
  const file = path.join(ASSETS, 'essays', 'topics.json');
  const data = readJson(file);

  for (const topic of data.topics) {
    const t = map.topics[topic.id];
    if (!t) {
      console.warn('Missing topic translation:', topic.id);
      continue;
    }
    topic.title_hi = t.title_hi;
    topic.hints_hi = t.hints_hi;
    topic.outline_hi = t.outline_hi;
    topic.category_hi = map.category[topic.category] || topic.category;
    topic.difficulty_hi = map.difficulty[topic.difficulty] || topic.difficulty;
    topic.structure_hi = map.structure.slice();
    counts.topics += 1;
  }

  writeJson(file, data);
  console.log(`✓ essays/topics.json — ${counts.topics} topics`);
}

function translateGuides() {
  const map = loadData('guides.json');
  const file = path.join(ASSETS, 'essays', 'guides.json');
  const data = readJson(file);

  for (const key of ['essayStructure', 'examinerLens', 'commonMistakes']) {
    Object.assign(data[key], {
      title_hi: map[key].title_hi,
      points_hi: map[key].points_hi,
    });
    counts.guides += 1;
  }

  data.dosDonts.title_hi = map.dosDonts.title_hi;
  data.dosDonts.dos_hi = map.dosDonts.dos_hi;
  data.dosDonts.donts_hi = map.dosDonts.donts_hi;
  counts.guides += 1;

  data.vocab.title_hi = map.vocab.title_hi;
  data.vocab.words = data.vocab.words.map((w, i) => ({
    ...w,
    term_hi: map.vocab.words[i].term_hi,
    meaning_hi: map.vocab.words[i].meaning_hi,
  }));
  counts.guides += 1;

  writeJson(file, data);
  console.log(`✓ essays/guides.json — ${counts.guides} sections`);
}

function translatePassages() {
  const map = loadData('passages.json');
  const file = path.join(ASSETS, 'comprehension', 'passages.json');
  const data = readJson(file);

  for (const passage of data.passages) {
    const p = map.passages[passage.id];
    if (!p) {
      console.warn('Missing passage translation:', passage.id);
      continue;
    }
    passage.title_hi = p.title_hi;
    passage.theme_hi = map.theme[passage.theme] || p.theme_hi || passage.theme;
    passage.passage_hi = p.passage_hi;
    passage.wordGuide_hi = map.wordGuide_hi;
    counts.passages += 1;

    const questions = passage.questions || [];
    for (const q of questions) {
      const qq = p.questions[q.id];
      if (!qq) {
        console.warn('Missing question translation:', q.id);
        continue;
      }
      q.q_hi = qq.q_hi;
      q.model_hi = qq.model_hi;
      counts.passageQuestions += 1;
    }
  }

  writeJson(file, data);
  console.log(
    `✓ comprehension/passages.json — ${counts.passages} passages, ${counts.passageQuestions} questions`
  );
}

function translateLongAnswers() {
  const map = loadData('longAnswers.json');
  const file = path.join(ASSETS, 'long-answers', 'questions.json');
  const data = readJson(file);

  for (const q of data.questions) {
    const t = map.questions[q.id];
    if (!t) {
      console.warn('Missing LA translation:', q.id);
      continue;
    }
    q.question_hi = t.question_hi;
    q.domain_hi = map.domain[q.domain] || q.domain;
    q.keyPoints_hi = t.keyPoints_hi;
    q.modelAnswer_hi = t.modelAnswer_hi;
    counts.longAnswers += 1;
  }

  writeJson(file, data);
  console.log(`✓ long-answers/questions.json — ${counts.longAnswers} questions`);
}

function translateMocks() {
  const map = loadData('mocks.json');
  const file = path.join(ASSETS, 'mocks', 'papers.json');
  const data = readJson(file);

  for (const mock of data.mocks) {
    const m = map[mock.id];
    if (!m) {
      console.warn('Missing mock translation:', mock.id);
      continue;
    }
    mock.instructions_hi = m.instructions_hi;
    counts.mocks += 1;
  }

  writeJson(file, data);
  console.log(`✓ mocks/papers.json — ${counts.mocks} mocks`);
}

function findTopicByTitle(title, topicsFile) {
  return topicsFile.topics.find((t) => t.title === title);
}

function findPassageByEnglish(passageText, passagesFile) {
  const needle = String(passageText || '').trim().slice(0, 80);
  return passagesFile.passages.find(
    (p) => String(p.passage || '').trim().startsWith(needle.slice(0, 40))
  );
}

function translateDaily() {
  const tips = loadData('dailyTips.json');
  const topicsFile = readJson(path.join(ASSETS, 'essays', 'topics.json'));
  const laFile = readJson(path.join(ASSETS, 'long-answers', 'questions.json'));
  const passagesFile = readJson(path.join(ASSETS, 'comprehension', 'passages.json'));
  const laById = Object.fromEntries(laFile.questions.map((q) => [q.id, q]));

  const dates = [
    '2026-07-16',
    '2026-07-17',
    '2026-07-18',
    '2026-07-19',
    '2026-07-20',
  ];

  for (const date of dates) {
    const file = path.join(ASSETS, 'daily-prompts', `${date}.json`);
    const data = readJson(file);

    // Essay topic from topics bank
    const topic = findTopicByTitle(data.essayTopic.title, topicsFile);
    if (topic) {
      data.essayTopic.title_hi = topic.title_hi;
      data.essayTopic.hints_hi = topic.hints_hi;
      data.essayTopic.modelOutline_hi = topic.outline_hi;
    } else {
      console.warn('Daily essay topic not found:', date, data.essayTopic.title);
    }

    // Long answers by id
    data.longAnswers = data.longAnswers.map((la) => {
      const src = laById[la.id];
      if (!src) {
        console.warn('Daily LA not found:', date, la.id);
        return la;
      }
      return {
        ...la,
        question_hi: src.question_hi,
        keyPoints_hi: src.keyPoints_hi,
        modelAnswer_hi: src.modelAnswer_hi,
        domain_hi: src.domain_hi,
      };
    });

    // Comprehension from passages bank
    const matched = findPassageByEnglish(data.comprehension.passage, passagesFile);
    if (matched) {
      data.comprehension.passage_hi = matched.passage_hi;
      const qMap = Object.fromEntries(
        (matched.questions || []).map((q) => [q.q, q])
      );
      data.comprehension.questions = data.comprehension.questions.map((q) => {
        const src = qMap[q.q];
        if (!src) {
          // fallback: match by index order if wording differs slightly
          return q;
        }
        return {
          ...q,
          q_hi: src.q_hi,
          model_hi: src.model_hi,
        };
      });

      // If some questions still English, map by index
      data.comprehension.questions = data.comprehension.questions.map((q, i) => {
        if (hasDevanagari(q.q_hi) && q.q_hi !== q.q) return q;
        const src = (matched.questions || [])[i];
        if (!src) return q;
        return { ...q, q_hi: src.q_hi, model_hi: src.model_hi };
      });
    } else {
      console.warn('Daily passage not matched:', date);
    }

    if (tips[date]?.tipOfDay_hi) {
      data.tipOfDay_hi = tips[date].tipOfDay_hi;
    }

    // Keep editionTitle_hi if already Hindi
    if (!hasDevanagari(data.editionTitle_hi)) {
      data.editionTitle_hi = 'टियर-2 डेली डेस्क';
    }

    writeJson(file, data);
    counts.daily += 1;
  }

  console.log(`✓ daily-prompts — ${counts.daily} editions`);
}

function main() {
  console.log('Translating bundled content to Hindi (Devanagari)...\n');
  translateTopics();
  translateGuides();
  translatePassages();
  translateLongAnswers();
  translateMocks();
  translateDaily();

  console.log('\nSummary of records updated:');
  console.log(JSON.stringify(counts, null, 2));
}

main();
