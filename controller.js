/** Translation controller – orchestrates sign execution */
import { SIGNS, COMPOUNDS } from './signs.js';
import { ALPHABET } from './alphabet.js';
import { NEUTRAL } from './poses.js';
import { textoParaGlosa } from './glossary.js';
import { animateTo, delay, setSigning } from './animation.js';
let translating = false;
let pendingText = '';
let cancelToken = { cancelled: false };
/* ---- Execute a multi-keyframe word sign ---- */
async function executeWordSign(keyframes, token) {
  for (const kf of keyframes) {
    if (token.cancelled) return;
    await animateTo(kf.p, kf.d);
    if (token.cancelled) return;
    await delay(50);
  }
}
/* ---- Fingerspell a word letter by letter ---- */
async function fingerspellWord(word, token) {
  for (const ch of word) {
    if (token.cancelled) return;
    const pose = ALPHABET[ch];
    if (pose) {
      await animateTo(pose, 280);
      if (token.cancelled) return;
      await delay(100);
    }
  }
}
/* ---- Translate a full text ---- */
async function traduzir(texto, token) {
  const gloss = textoParaGlosa(texto);
  if (!gloss.length) return;
  setSigning(true);
  const card  = document.getElementById('avatarCard');
  const label = document.getElementById('signLabel');
  card.classList.add('signing');
  for (const word of gloss) {
    if (token.cancelled) break;
    // Compound phrases resolve to multiple signs
    if (COMPOUNDS[word]) {
      label.textContent = word;
      for (const sub of COMPOUNDS[word]) {
        if (token.cancelled) break;
        if (SIGNS[sub]) await executeWordSign(SIGNS[sub], token);
        if (!token.cancelled) { await animateTo(NEUTRAL, 180); await delay(60); }
      }
    } else if (SIGNS[word]) {
      label.textContent = word;
      await executeWordSign(SIGNS[word], token);
    } else {
      label.textContent = '✋ ' + word;
      await fingerspellWord(word, token);
    }
    if (token.cancelled) break;
    await animateTo(NEUTRAL, 220);
    await delay(70);
  }
  label.textContent = '';
  card.classList.remove('signing');
  setSigning(false);
  await animateTo(NEUTRAL, 300);
}
/** Public entry-point – queues / interrupts translations */
export async function handleText(texto) {
  if (translating) {
    pendingText = texto;
    cancelToken.cancelled = true;
    return;
  }
  translating = true;
  cancelToken = { cancelled: false };
  await traduzir(texto, cancelToken);
  translating = false;
  if (pendingText) {
    const next = pendingText;
    pendingText = '';
    handleText(next);
  }
}
