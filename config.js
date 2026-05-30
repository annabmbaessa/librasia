/** Canvas & avatar body configuration constants */
export const CW = 520;
export const CH = 640;
export const DPR = Math.min(window.devicePixelRatio || 1, 3);
/** Avatar body proportions (legacy 2-D reference) */
export const BODY = {
  cx: CW / 2,
  headCY: 100,
  headR: 46,
  neckTop: 142,
  shoulderY: 162,
  shoulderHW: 44,
  torsoW: 88,
  torsoH: 130,
  uaLen: 72,   // upper-arm length
  uaW: 19,     // upper-arm width
  faLen: 66,   // forearm length
  faW: 16,
  handW: 22,
  handH: 15,
  fLens: [12, 16, 18, 16, 13],  // finger base lengths [thumb … pinky]
  fW: 4,       // finger width
  tW: 5,       // thumb width
};
/** Colour palette */
export const COL = {
  skin:    '#EDBA87',
  skinLt:  '#F6D0A8',
  skinDk:  '#C99660',
  hair:    '#1E272E',
  hairLt:  '#2C3A47',
  shirt:   '#154360',
  shirtLt: '#1B5E7C',
  shirtDk: '#0A2D42',
  eyeW:    '#FFF',
  iris:    '#1A2530',
  pupil:   '#0A0A0A',
  lip:     '#B03A2E',
  brow:    '#1A1A1A',
};
