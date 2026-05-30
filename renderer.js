/** 3D Avatar renderer — Three.js  (Ultra-Realistic) */
import * as THREE from 'three';
import { CW, CH } from './config.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';
/* ================================================================
   SCENE  SETUP
   ================================================================ */
const canvas = document.getElementById('avatar');
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(26, CW / CH, 0.1, 100);
camera.position.set(0, 0.38, 5.4);
camera.lookAt(0, 0.2, 0);
const gl = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
gl.setSize(CW, CH);
gl.setPixelRatio(Math.min(window.devicePixelRatio, 3));
gl.toneMapping      = THREE.ACESFilmicToneMapping;
gl.toneMappingExposure = 1.2;
gl.outputColorSpace = THREE.SRGBColorSpace;
gl.shadowMap.enabled = true;
gl.shadowMap.type    = THREE.PCFSoftShadowMap;
/* ================================================================
   PROCEDURAL  ENVIRONMENT  MAP
   ================================================================ */
(function createEnvMap() {
  const pmrem    = new THREE.PMREMGenerator(gl);
  const envScene = new THREE.Scene();
  /* soft gradient sky-sphere */
  const envGeo   = new THREE.SphereGeometry(10, 32, 32);
  const colors   = [];
  const pos      = envGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) + 10) / 20;           // 0 bottom → 1 top
    colors.push(
      THREE.MathUtils.lerp(0.04, 0.16, t),
      THREE.MathUtils.lerp(0.06, 0.20, t),
      THREE.MathUtils.lerp(0.14, 0.38, t),
    );
  }
  envGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  envScene.add(new THREE.Mesh(envGeo,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  /* warm area-light simulation */
  const envBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff5e0 }),
  );
  envBulb.position.set(3, 4, 5);
  envScene.add(envBulb);
  const envMap = pmrem.fromScene(envScene, 0, 0.1, 100).texture;
  scene.environment = envMap;
  pmrem.dispose();
})();
/* ================================================================
   STUDIO  LIGHTING
   ================================================================ */
/* ambient base */
scene.add(new THREE.AmbientLight(0xc8d4f0, 0.55));
/* key light — warm, casts shadows */
const keyLight = new THREE.DirectionalLight(0xfff5e0, 1.5);
keyLight.position.set(2.5, 4, 5);
keyLight.castShadow                = true;
keyLight.shadow.mapSize.width      = 1024;
keyLight.shadow.mapSize.height     = 1024;
keyLight.shadow.camera.near        = 0.5;
keyLight.shadow.camera.far         = 15;
keyLight.shadow.camera.left        = -2;
keyLight.shadow.camera.right       =  2;
keyLight.shadow.camera.top         =  2;
keyLight.shadow.camera.bottom      = -2;
keyLight.shadow.bias               = -0.0008;
keyLight.shadow.normalBias         = 0.04;
scene.add(keyLight);
/* fill light — cool, softer */
const fillLight = new THREE.DirectionalLight(0x88aadd, 0.5);
fillLight.position.set(-3, 2, 4);
scene.add(fillLight);
/* rim / back light — edge separation */
const rimLight = new THREE.DirectionalLight(0x99aadd, 0.7);
rimLight.position.set(0, 2, -4);
scene.add(rimLight);
/* bounce light — subtle warm from below */
const bounceLight = new THREE.DirectionalLight(0xffd4a0, 0.15);
bounceLight.position.set(0, -3, 2);
scene.add(bounceLight);
/* ================================================================
   PROCEDURAL  IRIS  TEXTURE
   ================================================================ */
function createIrisTexture() {
  const S   = 256;
  const c   = document.createElement('canvas');
  c.width   = S; c.height = S;
  const ctx = c.getContext('2d');
  /* base radial gradient */
  const g = ctx.createRadialGradient(S / 2, S / 2, S * 0.05, S / 2, S / 2, S / 2);
  g.addColorStop(0,   '#2a4a40');
  g.addColorStop(0.2, '#3d6b5a');
  g.addColorStop(0.5, '#5a8f7a');
  g.addColorStop(0.7, '#4a7a65');
  g.addColorStop(0.9, '#3a5a4a');
  g.addColorStop(1,   '#1a3028');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  /* radial fibers */
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 120; i++) {
    const a  = (i / 120) * Math.PI * 2 + Math.random() * 0.05;
    const r0 = S * 0.08 + Math.random() * S * 0.05;
    const r1 = S * 0.42 + Math.random() * S * 0.06;
    ctx.strokeStyle = Math.random() > 0.5 ? '#7ab098' : '#3a6050';
    ctx.lineWidth   = 0.8 + Math.random() * 0.8;
    ctx.beginPath();
    ctx.moveTo(S / 2 + Math.cos(a) * r0, S / 2 + Math.sin(a) * r0);
    ctx.lineTo(S / 2 + Math.cos(a) * r1, S / 2 + Math.sin(a) * r1);
    ctx.stroke();
  }
  /* limbal ring (dark outer edge) */
  ctx.globalAlpha  = 0.6;
  ctx.strokeStyle  = '#0a1a14';
  ctx.lineWidth    = S * 0.04;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S * 0.46, 0, Math.PI * 2);
  ctx.stroke();
  /* corona (lighter ring around pupil area) */
  ctx.globalAlpha = 0.3;
  const cg = ctx.createRadialGradient(S / 2, S / 2, S * 0.06, S / 2, S / 2, S * 0.2);
  cg.addColorStop(0, '#8ab898');
  cg.addColorStop(1, 'transparent');
  ctx.fillStyle = cg;
  ctx.fillRect(0, 0, S, S);
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
/* ================================================================
   MATERIALS  (MeshPhysicalMaterial)
   ================================================================ */
const irisTexture = createIrisTexture();
const skinMat = new THREE.MeshPhysicalMaterial({
  color: 0xFFDFC0,  roughness: 0.55,  metalness: 0,
  sheen: 0.5,  sheenRoughness: 0.5,  sheenColor: new THREE.Color(0xFFE8D0),
  clearcoat: 0.03,  clearcoatRoughness: 0.9,
});
const skinDkMat = new THREE.MeshPhysicalMaterial({
  color: 0xE1B995,  roughness: 0.6,  metalness: 0,
  sheen: 0.4,  sheenRoughness: 0.6,  sheenColor: new THREE.Color(0xDEBFA0),
});
const hairMat = new THREE.MeshPhysicalMaterial({
  color: 0xC0956A,  roughness: 0.85,  metalness: 0.02,
  sheen: 1.0,  sheenRoughness: 0.3,  sheenColor: new THREE.Color(0xE0C090),
});
const shirtMat = new THREE.MeshPhysicalMaterial({
  color: 0xF5F5F5,  roughness: 0.6,  metalness: 0,
  sheen: 0.8,  sheenRoughness: 0.4,  sheenColor: new THREE.Color(0xFFFFFF),
});
const shirtDkMat = new THREE.MeshPhysicalMaterial({
  color: 0x1A1A1A,  roughness: 0.55,  metalness: 0,
  sheen: 0.6,  sheenRoughness: 0.5,  sheenColor: new THREE.Color(0x333333),
});
const eyeWMat = new THREE.MeshPhysicalMaterial({
  color: 0xFFFFF8,  roughness: 0.1,  metalness: 0,
  clearcoat: 1.0,  clearcoatRoughness: 0.03,
  sheen: 0.3,  sheenColor: new THREE.Color(0xE8E8F4),
});
const irisMat = new THREE.MeshPhysicalMaterial({
  map: irisTexture,  roughness: 0.3,  metalness: 0,
  clearcoat: 0.8,  clearcoatRoughness: 0.1,
});
const pupilMat = new THREE.MeshPhysicalMaterial({
  color: 0x030303,  roughness: 0.1,  metalness: 0,
  clearcoat: 1.0,  clearcoatRoughness: 0.05,
});
const lipMat = new THREE.MeshPhysicalMaterial({
  color: 0xCF6C6C,  roughness: 0.35,  metalness: 0,
  sheen: 0.5,  sheenRoughness: 0.3,  sheenColor: new THREE.Color(0xFF9090),
  clearcoat: 0.25,  clearcoatRoughness: 0.4,
});
const browMat = new THREE.MeshPhysicalMaterial({
  color: 0x8F6F4F,  roughness: 0.8,  metalness: 0,
});
const nailMat = new THREE.MeshPhysicalMaterial({
  color: 0xFFE5D5,  roughness: 0.25,  metalness: 0,
  clearcoat: 0.8,  clearcoatRoughness: 0.2,
  sheen: 0.3,  sheenColor: new THREE.Color(0xFFF0E0),
});
const redAccentMat = new THREE.MeshPhysicalMaterial({
  color: 0xCC1111,  roughness: 0.5,  metalness: 0,
  sheen: 0.6,  sheenRoughness: 0.4,  sheenColor: new THREE.Color(0xFF4444),
});
const mouthOpenMat = new THREE.MeshPhysicalMaterial({
  color: 0x3a100e,  roughness: 0.5,  metalness: 0,
});
/* ================================================================
   PROPORTIONS  (unchanged from original)
   ================================================================ */
const P = {
  headR: 0.3,
  neckH: 0.07,
  torsoH: 0.62, torsoW: 0.28, torsoD: 0.18,
  shoulderW: 0.36, shoulderY: 0.25,
  uaLen: 0.48, uaR: 0.06,
  faLen: 0.43, faR: 0.052,
  handW: 0.14, handH: 0.11, handD: 0.045,
  fingerLen: [0.12, 0.15, 0.165, 0.15, 0.12],
  fingerR: 0.022, thumbR: 0.026,
};
/* ================================================================
   CHARACTER  BUILDER
   ================================================================ */
const J         = {};             // joint references (same keys as before)
const character = new THREE.Group();
scene.add(character);
/* ================================================================
   GLTF  AVATAR  LOADER  (Ready Player Me)
   ================================================================ */
let avatarModel = null;
const bones = {};
// Helper to set morph target influences on all child meshes
function setMorphInfluence(name, value) {
  if (!avatarModel) return;
  avatarModel.traverse((child) => {
    if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
      const idx = child.morphTargetDictionary[name];
      if (idx !== undefined) {
        child.morphTargetInfluences[idx] = value;
      }
    }
  });
}
// Finger bone helper
const fingerNames = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
function getFingerBones(side, fingerIndex) {
  const name = fingerNames[fingerIndex];
  const list = [];
  for (let s = 1; s <= 3; s++) {
    const bone = bones[`${side}Hand${name}${s}`];
    if (bone) list.push(bone);
  }
  return list;
}
function applyFacialExpressions(pose) {
  if (!avatarModel) return;
  const morphs = [
    'eyeBlinkLeft', 'eyeBlinkRight',
    'browInnerUp', 'browOuterUpLeft', 'browOuterUpRight',
    'browDownLeft', 'browDownRight',
    'mouthSmileLeft', 'mouthSmileRight',
    'jawOpen', 'mouthFunnel', 'mouthPucker'
  ];
  morphs.forEach(m => setMorphInfluence(m, 0));
  const blink = 1 - pose.ey;
  setMorphInfluence('eyeBlinkLeft', blink);
  setMorphInfluence('eyeBlinkRight', blink);
  if (pose.eb > 0) {
    setMorphInfluence('browInnerUp', pose.eb);
    setMorphInfluence('browOuterUpLeft', pose.eb);
    setMorphInfluence('browOuterUpRight', pose.eb);
  } else if (pose.eb < 0) {
    setMorphInfluence('browDownLeft', -pose.eb);
    setMorphInfluence('browDownRight', -pose.eb);
  }
  const mi = typeof pose.mo === 'number' ? pose.mo : 0;
  if (mi === 1) {
    setMorphInfluence('mouthSmileLeft', 0.8);
    setMorphInfluence('mouthSmileRight', 0.8);
  } else if (mi === 2) {
    setMorphInfluence('jawOpen', 0.7);
    setMorphInfluence('mouthFunnel', 0.2);
  } else if (mi === 3) {
    setMorphInfluence('mouthPucker', 0.8);
    setMorphInfluence('jawOpen', 0.3);
  }
}
const loader = new GLTFLoader();
loader.load(
  'https://met4citizen.github.io/talkinghead/models/brunette.glb',
  (gltf) => {
    avatarModel = gltf.scene;
    scene.add(avatarModel);
    // Position and scale avatar to fit frame nicely and prevent arm movements cutoff
    avatarModel.scale.set(0.75, 0.75, 0.75);
    avatarModel.position.set(0, -0.95, 2.0);
    avatarModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        if (child.material) {
          child.material.envMapIntensity = 1.2;
          
          // Realistic Hair shading
          if (child.name.toLowerCase().includes('hair')) {
            child.material.roughness = 0.65;
            child.material.metalness = 0.0;
            if (child.material.sheen !== undefined) {
              child.material.sheen = 0.35;
              child.material.sheenRoughness = 0.4;
              child.material.sheenColor = new THREE.Color(0xd4b290);
            }
          }
          // Realistic Skin/Face/Body shading
          else if (child.name.toLowerCase().includes('skin') || child.name.toLowerCase().includes('face') || child.name.toLowerCase().includes('body')) {
            child.material.roughness = 0.55;
            child.material.metalness = 0.0;
            if (child.material.sheen !== undefined) {
              child.material.sheen = 0.4;
              child.material.sheenRoughness = 0.5;
              child.material.sheenColor = new THREE.Color(0xffe8d0);
            }
          }
          // Realistic Glassy Eye reflection
          else if (child.name.toLowerCase().includes('eye')) {
            child.material.roughness = 0.1;
            child.material.metalness = 0.0;
            child.material.clearcoat = 1.0;
            child.material.clearcoatRoughness = 0.05;
          }
          
          child.material.needsUpdate = true;
        }
      }
      if (child.isBone) {
        bones[child.name] = child;
      }
    });
    // Hide procedural character once GLTF is loaded
    character.visible = false;
  },
  undefined,
  (error) => {
    console.error('Error loading Ready Player Me avatar:', error);
  }
);
/* ---- High-resolution geometry helpers ---- */
function cap(r, h, mat) {
  return new THREE.Mesh(new THREE.CapsuleGeometry(r, h, 16, 32), mat);
}
function sph(r, mat, ws = 48, hs = 48) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), mat);
}
function box(w, h, d, mat) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 4, 4, 4), mat);
}
/* ---- Torso ---- */
const torso = cap(P.torsoW, P.torsoH, shirtMat);
character.add(torso);
/* Shoulder sleeve caps */
const sleeveL = sph(0.09, shirtDkMat);
sleeveL.scale.set(1, 0.7, 0.8);
sleeveL.position.set(-P.shoulderW, P.shoulderY, 0);
character.add(sleeveL);
const sleeveR = sph(0.09, shirtDkMat);
sleeveR.scale.set(1, 0.7, 0.8);
sleeveR.position.set(P.shoulderW, P.shoulderY, 0);
character.add(sleeveR);
/* Red accent rings */
const sleeveRedL = sph(0.092, redAccentMat);
sleeveRedL.scale.set(0.9, 0.1, 0.82);
sleeveRedL.position.set(-P.shoulderW - 0.01, P.shoulderY - 0.05, 0);
character.add(sleeveRedL);
const sleeveRedR = sph(0.092, redAccentMat);
sleeveRedR.scale.set(0.9, 0.1, 0.82);
sleeveRedR.position.set(P.shoulderW + 0.01, P.shoulderY - 0.05, 0);
character.add(sleeveRedR);
/* ---- Neck (smoother transition) ---- */
const neck = cap(0.058, P.neckH, skinMat);
neck.position.y = P.torsoH / 2 + P.neckH / 2 + 0.04;
character.add(neck);
const neckBase = sph(0.07, skinMat);
neckBase.scale.set(1.2, 0.5, 0.8);
neckBase.position.y = P.torsoH / 2 + 0.03;
character.add(neckBase);
/* ---- Head ---- */
const headGroup = new THREE.Group();
headGroup.position.y = P.torsoH / 2 + P.neckH + P.headR + 0.02;
character.add(headGroup);
J.head = headGroup;
/* cranium — slightly elliptical for realism */
const headMesh = sph(P.headR, skinMat);
headMesh.scale.set(1.0, 1.08, 0.95);
headGroup.add(headMesh);
/* forehead bulge */
const forehead = sph(P.headR * 0.7, skinMat);
forehead.scale.set(1.0, 0.5, 0.5);
forehead.position.set(0, P.headR * 0.55, P.headR * 0.5);
headGroup.add(forehead);
/* cheeks */
for (const s of [-1, 1]) {
  const cheek = sph(0.08, skinMat);
  cheek.scale.set(0.8, 0.7, 0.5);
  cheek.position.set(s * 0.13, -0.06, P.headR * 0.68);
  headGroup.add(cheek);
}
/* chin */
const chin = sph(0.06, skinMat);
chin.scale.set(0.85, 0.7, 0.6);
chin.position.set(0, -P.headR * 0.75, P.headR * 0.4);
headGroup.add(chin);
/* jaw line */
for (const s of [-1, 1]) {
  const jaw = sph(0.05, skinMat);
  jaw.scale.set(0.8, 0.6, 0.5);
  jaw.position.set(s * 0.12, -P.headR * 0.5, P.headR * 0.35);
  headGroup.add(jaw);
}
/* ---- Hair ---- */
const hairBack = sph(P.headR * 1.04, hairMat);
hairBack.scale.set(1.0, 1.08, 1.0);
hairBack.position.set(0, 0.02, -0.06);
headGroup.add(hairBack);
const hairTop = sph(P.headR * 1.06, hairMat);
hairTop.scale.set(1.02, 0.6, 0.8);
hairTop.position.set(0, P.headR * 0.65, -0.02);
headGroup.add(hairTop);
/* side bangs */
for (const s of [-1, 1]) {
  const bang = sph(P.headR * 0.4, hairMat);
  bang.scale.set(0.6, 1.0, 0.8);
  bang.position.set(s * 0.2, 0.12, P.headR * 0.5);
  headGroup.add(bang);
}
/* centre fringe */
const hairFringe = sph(P.headR * 0.35, hairMat);
hairFringe.scale.set(1.2, 0.4, 0.6);
hairFringe.position.set(0, P.headR * 0.7, P.headR * 0.45);
headGroup.add(hairFringe);
/* long hair strands */
const hairLongL = cap(0.09, 0.38, hairMat);
hairLongL.position.set(-0.16, -0.18, -0.08);
hairLongL.rotation.z = -0.15;
headGroup.add(hairLongL);
const hairLongR = cap(0.09, 0.38, hairMat);
hairLongR.position.set(0.16, -0.18, -0.08);
hairLongR.rotation.z = 0.15;
headGroup.add(hairLongR);
/* ---- Eyes ---- */
function buildEye(xSign) {
  const g = new THREE.Group();
  g.position.set(xSign * 0.1, 0.03, P.headR * 0.94);
  /* subtle eye socket depression */
  const socket = sph(0.055, skinDkMat);
  socket.scale.set(1.0, 0.8, 0.2);
  g.add(socket);
  /* sclera */
  const white = sph(0.046, eyeWMat);
  white.scale.z = 0.32;
  g.add(white);
  /* iris with procedural texture */
  const iris = sph(0.03, irisMat, 32, 32);
  iris.position.z = 0.017;
  iris.scale.z    = 0.3;
  g.add(iris);
  /* pupil */
  const pupil = sph(0.013, pupilMat, 24, 24);
  pupil.position.z = 0.026;
  g.add(pupil);
  /* primary specular highlight */
  const hl = sph(0.007, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  hl.position.set(-0.010, 0.010, 0.029);
  g.add(hl);
  /* secondary smaller highlight */
  const hl2 = sph(0.004,
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }));
  hl2.position.set(0.008, -0.005, 0.028);
  g.add(hl2);
  /* upper eyelid crease */
  const lidCrease = cap(0.003, 0.04, skinDkMat);
  lidCrease.rotation.z = Math.PI / 2;
  lidCrease.position.set(0, 0.042, 0.005);
  g.add(lidCrease);
  return g;
}
const eyeL = buildEye(-1);
const eyeR = buildEye(1);
headGroup.add(eyeL);
headGroup.add(eyeR);
J.eyeL = eyeL;
J.eyeR = eyeR;
/* ---- Eyebrows ---- */
function buildBrow(xSign) {
  /* wrap in group so applyPose can set position.y / rotation.z on it */
  const g = new THREE.Group();
  g.position.set(xSign * 0.1, 0.11, P.headR * 0.92);
  /* main brow shape (capsule, horizontal) */
  const b = cap(0.007, 0.05, browMat);
  b.rotation.z = Math.PI / 2;
  b.rotation.x = -0.15;
  g.add(b);
  /* thicker inner brow */
  const inner = sph(0.012, browMat);
  inner.scale.set(1.2, 0.6, 0.5);
  inner.position.set(-xSign * 0.018, 0, 0.002);
  g.add(inner);
  return g;
}
const browL = buildBrow(-1);
const browR = buildBrow(1);
headGroup.add(browL);
headGroup.add(browR);
J.browL = browL;
J.browR = browR;
/* ---- Nose (multi-part) ---- */
/* bridge */
const noseBridge = sph(0.018, skinMat);
noseBridge.scale.set(0.5, 1.5, 0.5);
noseBridge.position.set(0, -0.01, P.headR * 0.96);
headGroup.add(noseBridge);
/* tip */
const noseTip = sph(0.024, skinDkMat);
noseTip.scale.set(0.8, 0.6, 0.65);
noseTip.position.set(0, -0.06, P.headR * 1.0);
headGroup.add(noseTip);
/* nostrils */
for (const s of [-1, 1]) {
  const nostril = sph(0.011, skinDkMat);
  nostril.scale.set(0.7, 0.45, 0.45);
  nostril.position.set(s * 0.016, -0.072, P.headR * 0.94);
  headGroup.add(nostril);
}
/* ---- Ears ---- */
for (const s of [-1, 1]) {
  const earOuter = sph(0.042, skinMat);
  earOuter.scale.set(0.45, 0.85, 0.5);
  earOuter.position.set(s * (P.headR - 0.005), -0.01, 0);
  headGroup.add(earOuter);
  const earInner = sph(0.028, skinDkMat);
  earInner.scale.set(0.3, 0.6, 0.3);
  earInner.position.set(s * (P.headR + 0.002), -0.01, 0.005);
  headGroup.add(earInner);
}
/* ---- Mouths (4 shapes, toggled by visibility) ---- */
const mouths = [];
/* 0 = neutral line */
const m0 = cap(0.004, 0.05, lipMat);
m0.rotation.z = Math.PI / 2;
m0.position.set(0, -0.12, P.headR * 0.94);
headGroup.add(m0);  mouths.push(m0);
/* 1 = smile (wider) */
const m1 = cap(0.005, 0.065, lipMat);
m1.rotation.z = Math.PI / 2;
m1.position.set(0, -0.115, P.headR * 0.94);
m1.visible = false;
headGroup.add(m1);  mouths.push(m1);
/* 2 = open */
const m2 = sph(0.03, mouthOpenMat);
m2.scale.set(1, 0.7, 0.5);
m2.position.set(0, -0.12, P.headR * 0.94);
m2.visible = false;
headGroup.add(m2);  mouths.push(m2);
/* 3 = oh */
const m3 = sph(0.025, mouthOpenMat);
m3.scale.set(0.7, 1, 0.5);
m3.position.set(0, -0.12, P.headR * 0.94);
m3.visible = false;
headGroup.add(m3);  mouths.push(m3);
/* ================================================================
   ARM  BUILDER  (identical joint hierarchy)
   ================================================================ */
function buildArm(sign) {
  const shoulder = new THREE.Group();
  shoulder.position.set(sign * P.shoulderW, P.shoulderY, 0);
  character.add(shoulder);
  const ua = cap(P.uaR, P.uaLen - P.uaR * 2, skinMat);
  ua.position.y = -P.uaLen / 2;
  shoulder.add(ua);
  const elbow = new THREE.Group();
  elbow.position.y = -P.uaLen;
  shoulder.add(elbow);
  /* elbow joint sphere */
  const elbowBall = sph(P.uaR + 0.005, skinMat, 32, 32);
  elbow.add(elbowBall);
  const fa = cap(P.faR, P.faLen - P.faR * 2, skinMat);
  fa.position.y = -P.faLen / 2;
  elbow.add(fa);
  const wrist = new THREE.Group();
  wrist.position.y = -P.faLen;
  elbow.add(wrist);
  /* wrist joint */
  const wristBall = sph(P.faR + 0.003, skinMat, 24, 24);
  wrist.add(wristBall);
  /* palm */
  const palm = sph(P.handW * 0.6, skinMat);
  palm.scale.set(1, 1.2, 0.4);
  palm.position.y = -P.handH / 2 - 0.01;
  wrist.add(palm);
  /* fingers (articulated phalanges) */
  const fingersData = [];
  const spacing = P.handW / 5;
  for (let i = 0; i < 5; i++) {
    const isThumb  = (i === 0);
    const fR       = isThumb ? P.thumbR : P.fingerR;
    const totalLen = P.fingerLen[i];
    const baseJoint = new THREE.Group();
    if (isThumb) {
      baseJoint.position.set(sign * (P.handW * 0.4), -P.handH * 0.25, 0.02);
      baseJoint.rotation.z = sign * 0.6;
      baseJoint.rotation.y = sign * 0.3;
      baseJoint.rotation.x = 0.2;
    } else {
      const xOff = (i - 2.5) * spacing + spacing / 2;
      baseJoint.position.set(xOff, -P.handH * 0.85, 0);
      baseJoint.rotation.z = -xOff * 2;
      baseJoint.rotation.x = 0.05;
    }
    wrist.add(baseJoint);
    const animBaseJoint = new THREE.Group();
    baseJoint.add(animBaseJoint);
    const numSegs    = isThumb ? 2 : 3;
    const segLen     = totalLen / numSegs;
    const jointsArr  = [animBaseJoint];
    let parentGroup  = animBaseJoint;
    for (let s = 0; s < numSegs; s++) {
      const taper    = 1 - (s * 0.15);
      const currentR = fR * taper;
      const segMesh = cap(currentR, segLen - currentR, skinMat);
      segMesh.position.y = -segLen / 2;
      parentGroup.add(segMesh);
      /* knuckle sphere */
      const jointSph = sph(currentR + 0.002, skinMat, 16, 16);
      parentGroup.add(jointSph);
      if (s === numSegs - 1) {
        /* fingernail on distal phalanx */
        const nail = sph(currentR + 0.003, nailMat, 16, 16);
        nail.position.set(0, -segLen + currentR * 1.5, 0.015);
        nail.scale.set(0.85, 1.3, 0.3);
        parentGroup.add(nail);
      } else {
        const nextJoint = new THREE.Group();
        nextJoint.position.y = -segLen;
        parentGroup.add(nextJoint);
        jointsArr.push(nextJoint);
        parentGroup = nextJoint;
      }
    }
    fingersData.push(jointsArr);
  }
  return { shoulder, elbow, wrist, fingers: fingersData, sign };
}
const armR = buildArm(-1);
const armL = buildArm(1);
J.rShoulder = armR.shoulder; J.rElbow = armR.elbow; J.rWrist = armR.wrist; J.rFingers = armR.fingers;
J.lShoulder = armL.shoulder; J.lElbow = armL.elbow; J.lWrist = armL.wrist; J.lFingers = armL.fingers;
/* ================================================================
   SOFT  PROCEDURAL  SHADOW  DISC
   ================================================================ */
const shCanvas  = document.createElement('canvas');
shCanvas.width  = 128;  shCanvas.height = 128;
const shCtx     = shCanvas.getContext('2d');
const shGrad    = shCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
shGrad.addColorStop(0,   'rgba(0,0,0,0.22)');
shGrad.addColorStop(0.5, 'rgba(0,0,0,0.10)');
shGrad.addColorStop(1,   'rgba(0,0,0,0)');
shCtx.fillStyle = shGrad;
shCtx.fillRect(0, 0, 128, 128);
const shadowTex = new THREE.CanvasTexture(shCanvas);
const shadow = new THREE.Mesh(
  new THREE.CircleGeometry(0.5, 48),
  new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = -P.torsoH / 2 - 0.35;
character.add(shadow);
/* ================================================================
   ENABLE  SELF-SHADOWING  ON  CHARACTER
   ================================================================ */
character.traverse(child => {
  if (child.isMesh) {
    child.castShadow    = true;
    child.receiveShadow = true;
  }
});
/* ================================================================
   POSE  APPLICATION  (identical logic)
   ================================================================ */
function applyPose(pose) {
  // 1. Apply to GLTF Avatar (Ready Player Me) if loaded
  if (avatarModel && bones.LeftArm) {
    // Left Arm (Z-rotation swings outward/upward from resting point -1.25)
    bones.LeftArm.rotation.set(-pose.lua * 0.15, 0, -1.25 + pose.lua);
    // Left Forearm (Elbow bend): rotates around local X-axis. lfa is negative when bent
    bones.LeftForeArm.rotation.set(-pose.lfa, 0, 0);
    // Left Wrist
    bones.LeftHand.rotation.set(0, 0, -pose.lha);
    // Right Arm (Z-rotation swings outward/upward from resting point 1.25)
    bones.RightArm.rotation.set(-pose.rua * 0.15, 0, 1.25 - pose.rua);
    // Right Forearm (Elbow bend): rfa is negative when bent
    bones.RightForeArm.rotation.set(-pose.rfa, 0, 0);
    // Right Wrist
    bones.RightHand.rotation.set(0, 0, pose.rha);
    // Head and Neck tilt/rotation
    bones.Head.rotation.set(0, pose.ht * 0.5, pose.ht);
    bones.Neck.rotation.set(0, pose.ht * 0.25, pose.ht * 0.5);
    // Fingers flexion
    for (let i = 0; i < 5; i++) {
      const rc = pose.rf[i];
      const lc = pose.lf[i];
      
      const rAngle = (i === 0) ? rc * 0.6 : rc * 1.1;
      const lAngle = (i === 0) ? lc * 0.6 : lc * 1.1;
      const rFingerBones = getFingerBones('Right', i);
      rFingerBones.forEach(bone => {
        if (bone) bone.rotation.x = rAngle; // Hinge flexion on local X
      });
      const lFingerBones = getFingerBones('Left', i);
      lFingerBones.forEach(bone => {
        if (bone) bone.rotation.x = lAngle;
      });
    }
    // Facial Morph Targets
    applyFacialExpressions(pose);
  }
  // 2. Also apply to procedural joints (keeps compatibility)
  J.rShoulder.rotation.z = -pose.rua;
  J.rElbow.rotation.z    =  pose.rfa;
  J.rWrist.rotation.z    =  pose.rha;
  J.lShoulder.rotation.z =  pose.lua;
  J.lElbow.rotation.z    = -pose.lfa;
  J.lWrist.rotation.z    = -pose.lha;
  /* Fingers */
  for (let i = 0; i < 5; i++) {
    const rc = pose.rf[i];
    const lc = pose.lf[i];
    const rAngle = (i === 0) ? rc * 0.8 : rc * 1.3;
    J.rFingers[i].forEach(joint => { joint.rotation.x = rAngle; });
    const lAngle = (i === 0) ? lc * 0.8 : lc * 1.3;
    J.lFingers[i].forEach(joint => { joint.rotation.x = lAngle; });
  }
  /* Head */
  J.head.rotation.z = pose.ht;
  /* Eyes (blink via scale.y) */
  const ey = Math.max(pose.ey, 0.05);
  J.eyeL.scale.y = ey;
  J.eyeR.scale.y = ey;
  /* Eyebrows */
  const ebOff = pose.eb * 0.025;
  J.browL.position.y = 0.09 + ebOff;
  J.browR.position.y = 0.09 + ebOff;
  J.browL.rotation.z =  pose.eb * 0.2;
  J.browR.rotation.z = -pose.eb * 0.2;
  /* Mouth */
  const mi = typeof pose.mo === 'number' ? pose.mo : 0;
  mouths.forEach((m, idx) => { m.visible = idx === mi; });
}
/* ================================================================
   EXPORTS  (same API as before)
   ================================================================ */
let idleOffY = 0;
export function setIdleOffset(y) {
  idleOffY = y;
}
export function render(pose) {
  character.position.y = idleOffY * 0.05;
  applyPose(pose);
  gl.render(scene, camera);
}
