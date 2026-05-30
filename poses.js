/** Pose system – creation, cloning, interpolation */
/** Create a pose with defaults for unspecified properties */
export function makePose(o = {}) {
  return {
    rua: o.rua ?? 0.18,   rfa: o.rfa ?? 0.15,   rha: o.rha ?? 0,
    rf:  o.rf  ?? [.6,.6,.6,.6,.6],
    lua: o.lua ?? 0.18,   lfa: o.lfa ?? 0.15,   lha: o.lha ?? 0,
    lf:  o.lf  ?? [.6,.6,.6,.6,.6],
    ht:  o.ht  ?? 0,      // head tilt
    eb:  o.eb  ?? 0,      // eyebrow raise
    mo:  o.mo  ?? 0,      // mouth shape
    ey:  o.ey  ?? 1,      // eyes open
  };
}
/** Deep-clone a pose (copies finger arrays) */
export function clonePose(p) {
  return { ...p, rf: [...p.rf], lf: [...p.lf] };
}
/** Scalar lerp */
export function lerp(a, b, t) { return a + (b - a) * t; }
/** Interpolate between two poses */
export function lerpPose(a, b, t) {
  return {
    rua: lerp(a.rua, b.rua, t), rfa: lerp(a.rfa, b.rfa, t), rha: lerp(a.rha, b.rha, t),
    rf:  a.rf.map((v, i) => lerp(v, b.rf[i], t)),
    lua: lerp(a.lua, b.lua, t), lfa: lerp(a.lfa, b.lfa, t), lha: lerp(a.lha, b.lha, t),
    lf:  a.lf.map((v, i) => lerp(v, b.lf[i], t)),
    ht:  lerp(a.ht, b.ht, t), eb: lerp(a.eb, b.eb, t),
    mo:  t < .5 ? a.mo : b.mo,
    ey:  t < .5 ? a.ey : b.ey,
  };
}
/** Ease-in-out quadratic */
export function ease(t) {
  return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
/** Default resting pose */
export const NEUTRAL = makePose({});
