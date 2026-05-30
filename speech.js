/** Speech recognition (Web Speech API) */
let recognition = null;
let isListening = false;
let onFinalResult = null;    // callback(text)
let onPartialResult = null;  // callback(text)
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export function isSupported() { return !!SR; }
export function init({ onFinal, onPartial }) {
  if (!SR) return;
  onFinalResult   = onFinal;
  onPartialResult = onPartial;
  recognition = new SR();
  recognition.lang = 'pt-BR';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onresult = (event) => {
    let finalText = '', partialText = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += t + ' ';
      else partialText += t;
    }
    const combined = (finalText + partialText).trim();
    if (combined.length && onPartialResult) onPartialResult(combined);
    if (finalText.trim().length && onFinalResult) onFinalResult(finalText.trim());
  };
  recognition.onend = () => {
    if (isListening) { try { recognition.start(); } catch (_) {} }
  };
  recognition.onerror = (e) => {
    if (e.error === 'not-allowed') {
      alert('Permissão do microfone negada!');
      stop();
    }
  };
}
export function start() {
  if (!recognition) return;
  isListening = true;
  try { recognition.start(); } catch (_) {}
}
export function stop() {
  isListening = false;
  try { recognition.stop(); } catch (_) {}
}
export function toggle() {
  if (isListening) stop(); else start();
  return isListening;
}
export function listening() { return isListening; }
