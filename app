/** Application entry-point – wires UI events */
import { handleText } from './controller.js';
import { SIGNS, COMPOUNDS } from './signs.js';
import * as speech from './speech.js';
/* ---- Legenda ---- */
function mostrarLegenda(texto) {
  const el = document.getElementById('legenda');
  if (texto.length > 55) {
    const m = Math.floor(texto.length / 2);
    const b = texto.lastIndexOf(' ', m);
    if (b > 0) texto = texto.slice(0, b) + '\n' + texto.slice(b + 1);
  }
  el.innerText = texto;
  el.classList.add('show');
  clearTimeout(window._lt);
  window._lt = setTimeout(() => el.classList.remove('show'), 4000);
}
/* ---- Mic ---- */
const circle = document.getElementById('micCircle');
const status = document.getElementById('status');
function updateMicUI() {
  if (speech.listening()) {
    circle.classList.add('listening');
    status.textContent = '🎙️ Ouvindo...';
    status.classList.add('active');
  } else {
    circle.classList.remove('listening');
    status.textContent = 'Toque no microfone para começar';
    status.classList.remove('active');
  }
}
document.getElementById('micBtn').onclick = () => {
  if (!speech.isSupported()) {
    alert('Seu navegador não suporta reconhecimento de voz. Use o Google Chrome.');
    return;
  }
  speech.toggle();
  updateMicUI();
};
/* ---- Speech init ---- */
speech.init({
  onFinal:   (t) => handleText(t),
  onPartial: (t) => mostrarLegenda(t),
});
/* ---- Text input ---- */
document.getElementById('sendBtn').onclick = () => {
  const input = document.getElementById('textInput');
  const txt = input.value.trim();
  if (txt) {
    mostrarLegenda(txt);
    handleText(txt);
    input.value = '';
  }
};
document.getElementById('textInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('sendBtn').click();
});
/* ---- Help modal ---- */
document.getElementById('helpBtn').onclick = () =>
  document.getElementById('helpModal').classList.add('show');
document.getElementById('closeHelp').onclick = () =>
  document.getElementById('helpModal').classList.remove('show');
document.getElementById('helpModal').onclick = (e) => {
  if (e.target === document.getElementById('helpModal'))
    document.getElementById('helpModal').classList.remove('show');
};
/* ---- Signs panel ---- */
const list = document.getElementById('signsList');
const allKeys = [...Object.keys(SIGNS), ...Object.keys(COMPOUNDS)].sort();
allKeys.forEach(key => {
  const chip = document.createElement('button');
  chip.className = 'sign-chip';
  chip.textContent = key;
  chip.onclick = () => handleText(key);
  list.appendChild(chip);
});
document.getElementById('signsToggle').onclick = () =>
  list.classList.toggle('show');
/* ---- Auto-demo ---- */
setTimeout(() => handleText('Olá'), 2000);
