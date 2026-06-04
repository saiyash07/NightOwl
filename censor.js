/**
 * Night Owl — Censor Engine v3 (Paranoid Mode)
 * Roblox-style name/PII filtering — runs client-side BEFORE encryption.
 * 
 * Philosophy: BETTER TO OVER-CENSOR THAN LEAK IDENTITY.
 * If it looks even slightly like identifying info, censor it.
 */

import { FIRST_NAMES, SURNAMES, COLLEGE_NAMES, CITY_NAMES, SUBJECT_NAMES } from './names.js';

// ── Common English words that should NEVER be censored ──
const SAFE_WORDS = new Set([
  // articles, prepositions, pronouns, conjunctions
  'a', 'an', 'the', 'and', 'or', 'but', 'nor', 'for', 'so', 'yet',
  'at', 'by', 'in', 'of', 'on', 'to', 'up', 'as', 'if', 'no',
  'am', 'is', 'are', 'was', 'be', 'do', 'he', 'we', 'me', 'my', 'i', 'im', "i'm",
  'it', 'us', 'his', 'her', 'him', 'its', 'our', 'you', 'who',
  'has', 'had', 'can', 'may', 'did', 'not', 'now', 'own', 'out',
  'off', 'how', 'why', 'all', 'any', 'few', 'got', 'get', 'let',
  'put', 'run', 'say', 'see', 'sit', 'too', 'two', 'use', 'way',
  'old', 'new', 'big', 'one', 'set',
  // common verbs & adjectives
  'ask', 'back', 'been', 'came', 'come', 'done', 'each', 'even',
  'feel', 'felt', 'find', 'from', 'full', 'gave', 'give', 'goes',
  'gone', 'good', 'have', 'here', 'high', 'home', 'just', 'keep',
  'kind', 'knew', 'know', 'last', 'left', 'life', 'like', 'long',
  'look', 'lots', 'made', 'make', 'many', 'more', 'most', 'much',
  'must', 'need', 'next', 'only', 'open', 'over', 'part', 'play',
  'read', 'real', 'rest', 'said', 'same', 'show', 'side', 'some',
  'stop', 'such', 'sure', 'take', 'talk', 'tell', 'than', 'that',
  'them', 'then', 'they', 'this', 'time', 'took', 'told', 'true',
  'turn', 'upon', 'very', 'want', 'well', 'went', 'what', 'when',
  'will', 'with', 'word', 'work', 'year',
  // emotions & states
  'okay', 'fine', 'glad', 'hope', 'hurt', 'late', 'live', 'lost',
  'nice', 'poor', 'rich', 'safe', 'sick', 'soft', 'warm', 'weak',
  'alone', 'angry', 'happy', 'sorry', 'tired', 'wrong', 'right',
  'better', 'worse',
  // common chat words
  'hey', 'hi', 'hello', 'yeah', 'yes', 'nah', 'hmm', 'lol', 'haha',
  'omg', 'wow', 'aww', 'bruh', 'bro', 'dude', 'same', 'tho', 'ngl',
  'tbh', 'idk', 'ikr', 'btw', 'rn', 'imo', 'wbu', 'hbu',
  // common longer words
  'about', 'after', 'again', 'being', 'below', 'could',
  'doing', 'every', 'going', 'great', 'might', 'never',
  'night', 'other', 'quite', 'shall', 'should', 'since', 'sleep',
  'small', 'start', 'still', 'study', 'thank', 'their', 'there',
  'these', 'thing', 'think', 'those', 'today', 'under', 'until',
  'water', 'where', 'which', 'while', 'world', 'would', 'young',
  'always', 'because', 'before', 'between', 'during', 'enough',
  'actually', 'feeling', 'finally', 'getting', 'having', 'honestly',
  'literally', 'looking', 'nothing', 'really', 'something',
  'sometimes', 'talking', 'thinking', 'through', 'tonight',
  'trying', 'waiting', 'walking', 'wanting', 'without', 'working',
  // school-related common words (keep these visible)
  'exam', 'test', 'marks', 'grade', 'score', 'lecture', 'homework',
  'assignment', 'project', 'deadline', 'semester', 'midterm', 'final',
  'teacher', 'student', 'friends', 'friend', 'family', 'parents',
  'anxiety', 'stress', 'pressure', 'lonely', 'scared', 'worried',
  'depressed', 'overwhelmed', 'exhausted', 'frustrated', 'confused',
  'miss', 'move', 'end', 'lot', 'bad', 'day', 'cold', 'cool',
  'dark', 'dear', 'down', 'easy', 'fall', 'fast', 'hate', 'hear',
  'hot', 'light', 'little', 'loud', 'low', 'near', 'okay',
  'quiet', 'red', 'round', 'short', 'slow', 'sweet',
  'call', 'hand', 'hard', 'help', 'mind', 'name',
  'wonder', 'maybe', 'people', 'person', 'someone', 'anyone',
  'everyone', 'nobody',
  // additional common nouns, emotions, and states
  'love', 'peace', 'war', 'pain', 'trouble', 'danger', 'debt', 'doubt', 'touch', 'fear', 'joy', 'hope', 'grief', 'shame', 'guilt', 'pride', 'panic', 'calm', 'tears', 'cry', 'crying', 'laugh', 'laughing', 'smile', 'smiling',
  'home', 'work', 'bed', 'hospital', 'office', 'library', 'canteen', 'mess', 'cafe', 'gym', 'lab', 'classroom', 'hostel', 'room', 'house', 'street', 'road', 'city', 'town', 'country', 'world', 'universe',
  'morning', 'afternoon', 'evening', 'night', 'midnight', 'day', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'summer', 'winter', 'monsoon', 'spring', 'autumn',
  'talking', 'chatting', 'speaking', 'sleeping', 'eating', 'crying', 'thinking', 'reading', 'writing', 'studying', 'listening', 'helping', 'supporting', 'sharing', 'feeling', 'living', 'staying', 'going', 'coming', 'doing', 'making', 'getting', 'wanting', 'needing', 'hoping', 'understanding', 'worrying', 'spiraling', 'overthinking', 'censor', 'secret', 'relationship', 'friendship', 'partner', 'connection', 'conversation', 'chat',
  'anything', 'something', 'nothing', 'everything', 'everyone', 'someone', 'anyone', 'nobody', 'somebody', 'anybody', 'everybody',
  'slash', 'smash', 'clash', 'flash',
]);

// ── Compound words to not false-positive on ──
const COMPOUND_SAFE_CONTEXTS = [
  'ramadan', 'rampage', 'ramp', 'ramble', 'ramen', 'random',
  'programme', 'program', 'diagram', 'telegram', 'anagram',
  'paradise', 'paradigm', 'parallel', 'parameter', 'paranoid',
  'marathon', 'karate', 'marathi', 'martial',
  'sunrise', 'sunset', 'sunlight', 'sunflower', 'sunday', 'sunshine',
  'joyful', 'joyous', 'enjoy', 'enjoying',
  'grateful', 'graceful',
  'develop', 'devote', 'device', 'devil',
  'manage', 'manager', 'managing', 'manifest', 'manner',
  'champion', 'champagne', 'classroom', 'classmate',
];

// ── Identity triggers — censor words around these ──
const IDENTITY_TRIGGERS = [
  'class', 'section', 'batch', 'division', 'div', 'branch', 'dept',
  'department', 'hostel', 'room', 'floor', 'wing', 'block',
  'building', 'campus', 'roll', 'enrollment', 'registration',
  'prn', 'usn', 'reg', 'group', 'team', 'house',
  'college', 'school', 'university', 'uni', 'inst', 'institute',
  'location', 'city', 'town', 'suburb', 'area', 'place',
];

function hashOut(length) {
  return '#'.repeat(Math.max(length, 3));
}

function isName(word) {
  const lower = word.toLowerCase();
  if (lower.length < 2) return false;
  if (SAFE_WORDS.has(lower)) return false;
  return FIRST_NAMES.has(lower) || SURNAMES.has(lower);
}

function isPartOfCompound(word, fullMessage) {
  const lower = word.toLowerCase();
  const msgLower = fullMessage.toLowerCase();
  return COMPOUND_SAFE_CONTEXTS.some(compound => {
    if (compound.includes(lower) && compound !== lower) {
      return msgLower.includes(compound);
    }
    return false;
  });
}

/**
 * Normalize leet-speak: 4→a, 3→e, 1→i, 0→o, 5→s, 7→t, @→a
 */
function normalizeLeet(text) {
  return text
    .replace(/4/g, 'a')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's');
}

/**
 * Check if normalized version of a word is a name
 */
function isLeetName(word) {
  const normalized = normalizeLeet(word.toLowerCase());
  if (normalized === word.toLowerCase()) return false; // No leet chars found
  if (SAFE_WORDS.has(normalized)) return false;
  return FIRST_NAMES.has(normalized) || SURNAMES.has(normalized);
}

function getLevenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function isUserNameSimilar(word) {
  const lower = word.toLowerCase();
  if (lower.length < 3) return false;
  if (SAFE_WORDS.has(lower)) return false;

  // Highly targeted similarity check to prevent typos of the user's name
  const targetNames = ['saiyash', 'poojari'];
  for (const target of targetNames) {
    if (Math.abs(lower.length - target.length) > 3) continue;
    const dist = getLevenshteinDistance(lower, target);
    if (dist <= 3) {
      return true;
    }
  }
  return false;
}

/**
 * MAIN CENSOR FUNCTION — runs on every message before encryption
 */
export function censorMessage(message) {
  if (!message || typeof message !== 'string') return message;

  let result = message;

  // ═══ PHASE 1: Pattern-based censoring ═══

  // ── 1. Phone numbers ──
  result = result.replace(/(?:\+91[\s-]?|0)?[6-9]\d{9}/g, m => hashOut(m.length));
  // Also catch any 10+ digit sequence
  result = result.replace(/\d{10,}/g, m => hashOut(m.length));

  // ── 2. Email addresses ──
  result = result.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, m => hashOut(m.length));

  // ── 3. Social handles (@username) ──
  result = result.replace(/@[a-zA-Z0-9_.]{2,}/g, m => hashOut(m.length));

  // ── 3a. Underscore-based handles (e.g. saiyaas_hh, _saiyaas) ──
  result = result.replace(/\b(?=[a-zA-Z0-9_]*[a-zA-Z_])[a-zA-Z0-9_]*_[a-zA-Z0-9_]+\b/gi, m => hashOut(m.length));

  // ── 3b. Dot-based handles/domains (e.g. saiyaas.hh, saiyaas.12) ──
  result = result.replace(/\b(?=[a-zA-Z0-9_-]*[a-zA-Z_])[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]{2,}\b/gi, m => hashOut(m.length));

  // ── 3c. Spaced-out email addresses (e.g. saiyaas at gmail dot com) ──
  result = result.replace(/\b[a-zA-Z0-9._%+-]+\s+(?:at|@)\s+[a-zA-Z0-9.-]+\s+(?:dot|\.)\s+(?:com|in|org|net|co|edu)\b/gi, m => hashOut(m.length));

  // ── 3d. Social media trigger phrases (e.g. my insta is saiyaas, follow me on snap: saiyaas) ──
  const socialPatterns = [
    /(?:add\s+me\s+(?:on\s+)?(?:instagram|insta|ig|snapchat|snap|discord|dc|telegram|tg|sc|socials?)|follow\s+me\s+(?:on\s+)?(?:instagram|insta|ig|snapchat|snap)|my\s+(?:instagram|insta|ig|snapchat|snap|discord|dc|telegram|tg|sc|socials?)(?:\s*(?:id|handle|username))?\s*(?:is|:|@|=)?|(?:instagram|insta|ig|snapchat|snap|discord|dc|telegram|tg|sc|socials?)\s*[:\-@=]\s*)\s*([a-zA-Z0-9._-]{3,30})/gi
  ];
  for (const pattern of socialPatterns) {
    result = result.replace(pattern, (match, captured) => {
      if (SAFE_WORDS.has(captured.toLowerCase())) return match;
      return match.replace(captured, hashOut(captured.length));
    });
  }

  // ── 4. URLs ──
  result = result.replace(/https?:\/\/[^\s]+/gi, m => hashOut(m.length));
  result = result.replace(/www\.[^\s]+/gi, m => hashOut(m.length));
  result = result.replace(/[a-zA-Z0-9-]+\.(com|in|org|net|edu|ac|co)\b[^\s]*/gi, m => hashOut(m.length));

  // ── 5. Spaced-out letters: "s a i y a s h" or "s.a.i.y.a.s.h" or "s-a-i-y-a-s-h" ──
  result = result.replace(/\b([a-zA-Z][\s.\-_]){3,}[a-zA-Z]\b/g, m => hashOut(m.length));

  // ── 6. Identity phrases — censor ALL words after them ──
  //    "my name is X Y Z", "im X Y", "i am X", "call me X", "my name X"
  const identityPatterns = [
    /(?:my\s+name\s+is|my\s+name|my\s+name'?\s*s|i\s*'?\s*m|i\s+am|call\s+me|they\s+call\s+me|people\s+call\s+me|everyone\s+calls?\s+me|known\s+as|u\s+can\s+call\s+me|you\s+can\s+call\s+me)\s+([^\n.!?]{1,50})/gi,
  ];
  for (const pattern of identityPatterns) {
    result = result.replace(pattern, (match, captured) => {
      const words = captured.trim().split(/\s+/);
      const censored = words.map(w => {
        const clean = w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        if (SAFE_WORDS.has(clean)) return w;
        if (['and', 'the', 'a', 'from', 'but', 'its', 'lol', 'haha'].includes(clean)) return w;
        return hashOut(w.length);
      }).join(' ');
      return match.replace(captured, censored);
    });
  }

  // ── 7. "from X" patterns (college/place) ──
  result = result.replace(
    /(?:from|studying\s+(?:at|in)|goes?\s+to|go\s+to|attend|enrolled\s+(?:at|in)|student\s+(?:at|of)|live\s+(?:in|at|near)|stay\s+(?:in|at|near)|staying\s+(?:in|at|near)|living\s+near|based\s+in|reside\s+in|residing\s+in|put\s+up\s+in|putting\s+up\s+in|school\s+in|college\s+in|university\s+in|uni\s+in|currently\s+(?:in|at)|(?:i\s+)?am\s+(?:in|at)|i'?m\s+(?:in|at))\s+([^\n.!?]{1,40})/gi,
    (match, captured) => {
      const words = captured.trim().split(/\s+/);
      const censored = words.map(w => {
        const clean = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (SAFE_WORDS.has(clean)) return w;
        if (['the', 'of', 'and', 'for', 'a', 'an', 'near', 'in', 'at', 'on', 'with', 'to', 'from'].includes(clean)) return w;
        return hashOut(w.length);
      }).join(' ');
      return match.replace(captured, censored);
    }
  );

  // ── 8. Class/section/batch identifiers — censor words around them ──
  for (const trigger of IDENTITY_TRIGGERS) {
    // Words BEFORE: "sam altman class" → "### ###### class"
    const beforeRegex = new RegExp(
      `([a-zA-Z0-9]+(?:\\s+[a-zA-Z0-9]+){0,3})\\s+${trigger}\\b`,
      'gi'
    );
    result = result.replace(beforeRegex, (match, captured) => {
      const words = captured.split(/\s+/);
      const censored = words.map(w => {
        const lower = w.toLowerCase();
        if (SAFE_WORDS.has(lower)) return w;
        return hashOut(w.length);
      }).join(' ');
      return match.replace(captured, censored);
    });

    // Words AFTER: "class 12B" → "class ###"
    const afterRegex = new RegExp(
      `\\b${trigger}\\s+([a-zA-Z0-9]+(?:[\\s-][a-zA-Z0-9]+){0,2})`,
      'gi'
    );
    result = result.replace(afterRegex, (match, captured) => {
      const words = captured.split(/[\s-]+/);
      const censored = words.map(w => {
        const lower = w.toLowerCase();
        if (['is', 'was', 'are', 'the', 'a', 'an', 'has', 'have', 'and', 'or'].includes(lower)) return w;
        return hashOut(w.length);
      }).join(' ');
      return match.replace(captured, censored);
    });
  }

  // ── 9. Initials — aggressive ──
  // X.Y. or X.Y patterns
  result = result.replace(/\b[A-Za-z]\.[A-Za-z]\.?\b/g, m => hashOut(m.length));
  // Standalone 2-4 uppercase letters (initials)
  result = result.replace(/(?<=\s|^)[A-Z]{2,4}(?=\s|$|[.,!?])/g, m => hashOut(m.length));
  // Standalone 2-letter lowercase that could be initials after identity context
  result = result.replace(/(?:name|im|am)\s+([a-z]{2})(?=\s|$|[.,!?])/gi, (match, initials) => {
    if (SAFE_WORDS.has(initials.toLowerCase())) return match;
    return match.replace(initials, hashOut(initials.length));
  });

  // ═══ PHASE 2: Dictionary-based censoring ═══

  // ── 10. College names ──
  const tokens = result.split(/(\s+)/);
  result = tokens.map(word => {
    const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (clean.length >= 2 && COLLEGE_NAMES.has(clean)) {
      return word.replace(/[a-zA-Z]+/, m => hashOut(m.length));
    }
    return word;
  }).join('');

  // ── 11. City names (3+ chars to avoid false positives) ──
  const cityTokens = result.split(/(\s+)/);
  result = cityTokens.map(word => {
    const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (clean.length >= 3 && CITY_NAMES.has(clean)) {
      return word.replace(/[a-zA-Z]+/, m => hashOut(m.length));
    }
    return word;
  }).join('');

  // ── 11a. Subject/lecture names ──
  const subjectTokens = result.split(/(\s+)/);
  result = subjectTokens.map(word => {
    const clean = word.replace(/[^a-zA-Z0-9+]/g, '').toLowerCase();
    if (SUBJECT_NAMES.has(clean)) {
      return word.replace(/[a-zA-Z0-9+]+/, m => hashOut(m.length));
    }
    return word;
  }).join('');

  // ── 12. Name dictionary + proper noun detection ──
  const finalTokens = result.split(/(\s+)/);
  result = finalTokens.map((word, idx) => {
    const clean = word.replace(/[^a-zA-Z0-9]/g, '');
    if (clean.length < 2) return word;

    // Skip if already censored (contains ###)
    if (word.includes('#')) return word;

    // Compound word check
    if (isPartOfCompound(clean, message)) return word;

    // Dictionary name check
    if (isName(clean)) {
      return word.replace(/[a-zA-Z]+/, m => hashOut(m.length));
    }

    // Leet-speak name check ("s4iy4sh" → "saiyash")
    if (isLeetName(clean)) {
      return word.replace(/[a-zA-Z0-9]+/, m => hashOut(m.length));
    }

    // Similarity check for user's name (saiyash, poojari) to catch spelling mistakes/variations
    if (isUserNameSimilar(clean)) {
      return word.replace(/[a-zA-Z0-9]+/, m => hashOut(m.length));
    }

    // Proper noun detection: Capitalized word mid-sentence (not first word)
    if (idx > 0 && clean.length >= 3 && 
        clean[0] === clean[0].toUpperCase() && 
        clean[0] !== clean[0].toLowerCase() &&
        !SAFE_WORDS.has(clean.toLowerCase())) {
      return word.replace(/[a-zA-Z]+/, m => hashOut(m.length));
    }

    return word;
  }).join('');

  return result;
}

/**
 * Crisis keyword detection
 */
export function detectCrisis(message) {
  if (!message) return { isCrisis: false, type: null };

  const lower = message.toLowerCase();

  const selfHarmPhrases = [
    'kill myself', 'want to die', 'end my life', 'suicide', 'suicidal',
    'self harm', 'self-harm', 'cutting myself', 'hurt myself', 'no reason to live',
    'better off dead', 'don\'t want to be alive', 'wish i was dead', 'wanna die',
    'take my life', 'ending it all', 'end it all', 'not worth living',
    'give up on life', 'can\'t go on', 'nothing left', 'no way out',
    'overdose', 'jump off', 'hang myself', 'slit my',
  ];

  for (const phrase of selfHarmPhrases) {
    if (lower.includes(phrase)) {
      return { isCrisis: true, type: 'self-harm' };
    }
  }

  return { isCrisis: false, type: null };
}
