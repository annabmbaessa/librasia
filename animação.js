/** Animation system – interpolation, idle, render loop */
import { clonePose, lerpPose, ease, NEUTRAL } from './poses.js';
import { render, setIdleOffset } from './renderer.js';
let currentPose  = clonePose(NEUTRAL);
let animTarget   = null;
let animStart    = null;
let animStartTime = 0;
let animDur      = 0;
let animResolve  = null;
let isSigning    = false;
export function setSigning(v) { isSigning = v; }
/** Smoothly animate to a target pose over `duration` ms. Returns a Promise. */
export function animateTo(pose, duration) {
  return new Promise(resolve => {
    animStart     = clonePose(currentPose);
    animTarget    = pose;
    animDur       = Math.max(duration, 50);
    animStartTime = performance.now();
    animResolve   = resolve;
  });
}
export function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
/* ---- Process one animation frame ---- */
function processAnim(now) {
  if (!animTarget) return;
  const t = Math.min((now - animStartTime) / animDur, 1);
  currentPose = lerpPose(animStart, animTarget, ease(t));
  if (t >= 1) {
    currentPose = clonePose(animTarget);
    animTarget  = null;
    if (animResolve) { const r = animResolve; animResolve = null; r(); }
  }
}
/* ---- Idle animation (breathing, blink, arm sway) ---- */
function applyIdle(now) {
  if (animTarget) return;
  const t = now / 1000;
  setIdleOffset(Math.sin(t * 1.2) * 1.2);
  const sway = Math.sin(t * .7) * .015;
  currentPose.rua = NEUTRAL.rua + sway;
  currentPose.lua = NEUTRAL.lua + sway;
  currentPose.rfa = NEUTRAL.rfa;
  currentPose.lfa = NEUTRAL.lfa;
  // Blink every ~4 s
  const bc = t % 4.2;
  currentPose.ey = (bc > 3.9 && bc < 4.1) ? 0 : 1;
}
/* ---- Main loop ---- */
function loop(now) {
  processAnim(now);
  if (!animTarget && !isSigning) applyIdle(now);
  render(currentPose);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
