/** Word-sign dictionary – each key maps to an array of {p:Pose, d:durationMs} */
import { makePose as mp } from './poses.js';
export const SIGNS = {
  OI: [
    { p: mp({ rua:1.3, rfa:-2.8, rf:[0,0,0,0,0], mo:1 }), d:280 },
    { p: mp({ rua:1.0, rfa:-2.8, rf:[0,0,0,0,0], mo:1 }), d:220 },
    { p: mp({ rua:1.3, rfa:-2.8, rf:[0,0,0,0,0], mo:1 }), d:220 },
  ],
  EU: [
    { p: mp({ rua:.4, rfa:-1.6, rf:[1,0,1,1,1] }), d:450 },
  ],
  'VOCÊ': [
    { p: mp({ rua:.6, rfa:-1.2, rf:[1,0,1,1,1] }), d:450 },
  ],
  ELE: [
    { p: mp({ rua:.8, rfa:-1.0, rf:[1,0,1,1,1] }), d:400 },
  ],
  SIM: [
    { p: mp({ rua:.7, rfa:-2.8, rf:[1,1,1,1,1] }), d:250 },
    { p: mp({ rua:.7, rfa:-2.4, rf:[1,1,1,1,1] }), d:250 },
    { p: mp({ rua:.7, rfa:-2.8, rf:[1,1,1,1,1] }), d:250 },
  ],
  'NÃO': [
    { p: mp({ rua:.8, rfa:-2.6, rf:[1,0,0,1,1], eb:-1 }), d:200 },
    { p: mp({ rua:.6, rfa:-2.6, rf:[1,0,0,1,1], eb:-1 }), d:200 },
    { p: mp({ rua:.8, rfa:-2.6, rf:[1,0,0,1,1], eb:-1 }), d:200 },
    { p: mp({ rua:.6, rfa:-2.6, rf:[1,0,0,1,1], eb:-1 }), d:200 },
  ],
  BOM: [
    { p: mp({ rua:.5, rfa:-2.0, rf:[0,0,0,0,0], mo:1 }), d:300 },
    { p: mp({ rua:.7, rfa:-1.6, rf:[0,0,0,0,0], mo:1 }), d:350 },
  ],
  RUIM: [
    { p: mp({ rua:.5, rfa:-2.0, rf:[0,0,0,0,0], eb:-1 }), d:300 },
    { p: mp({ rua:.3, rfa:-1.0, rf:[0,0,0,0,0], eb:-1 }), d:350 },
  ],
  OBRIGADO: [
    { p: mp({ rua:.5, rfa:-2.2, rf:[0,0,0,0,0], mo:1 }), d:300 },
    { p: mp({ rua:.6, rfa:-1.5, rf:[0,0,0,0,0], mo:1 }), d:400 },
  ],
  DESCULPA: [
    { p: mp({ rua:.35, rfa:-1.8, rf:[0,0,0,0,0] }), d:300 },
    { p: mp({ rua:.25, rfa:-1.6, rf:[0,0,0,0,0] }), d:300 },
    { p: mp({ rua:.35, rfa:-1.8, rf:[0,0,0,0,0] }), d:300 },
  ],
  GOSTAR: [
    { p: mp({ rua:.3, rfa:-1.8, rf:[0,0,0,0,0], mo:1 }), d:300 },
    { p: mp({ rua:.25, rfa:-1.6, rf:[0,0,0,0,0], mo:1 }), d:350 },
  ],
  QUERER: [
    { p: mp({ rua:.6, rfa:-1.8, rf:[.4,.4,.4,.4,.4] }), d:250 },
    { p: mp({ rua:.35, rfa:-1.4, rf:[.8,.8,.8,.8,.8] }), d:350 },
  ],
  ENTENDER: [
    { p: mp({ rua:.9, rfa:-2.8, rf:[1,0,1,1,1] }), d:300 },
    { p: mp({ rua:.9, rfa:-3.0, rf:[0,0,1,1,1] }), d:250 },
  ],
  SABER: [
    { p: mp({ rua:.9, rfa:-2.9, rf:[1,0,1,1,1] }), d:400 },
  ],
  CASA: [
    { p: mp({ rua:1.0, rfa:-2.4, rha:.3, rf:[0,0,0,0,0], lua:1.0, lfa:-2.4, lha:-.3, lf:[0,0,0,0,0] }), d:500 },
  ],
  ESCOLA: [
    { p: mp({ rua:.6, rfa:-2.0, rf:[0,0,0,0,0], lua:.6, lfa:-2.0, lf:[0,0,0,0,0] }), d:220 },
    { p: mp({ rua:.5, rfa:-1.8, rf:[0,0,0,0,0], lua:.5, lfa:-1.8, lf:[0,0,0,0,0] }), d:220 },
    { p: mp({ rua:.6, rfa:-2.0, rf:[0,0,0,0,0], lua:.6, lfa:-2.0, lf:[0,0,0,0,0] }), d:220 },
  ],
  TRABALHO: [
    { p: mp({ rua:.5, rfa:-1.6, rf:[1,1,1,1,1], lua:.5, lfa:-1.6, lf:[1,1,1,1,1] }), d:250 },
    { p: mp({ rua:.45, rfa:-1.4, rf:[1,1,1,1,1], lua:.45, lfa:-1.4, lf:[1,1,1,1,1] }), d:250 },
    { p: mp({ rua:.5, rfa:-1.6, rf:[1,1,1,1,1], lua:.5, lfa:-1.6, lf:[1,1,1,1,1] }), d:250 },
  ],
  'ÁGUA': [
    { p: mp({ rua:.7, rfa:-2.4, rf:[1,0,0,0,1], mo:2 }), d:400 },
  ],
  COMER: [
    { p: mp({ rua:.7, rfa:-2.6, rf:[.5,.5,.5,.5,.5], mo:2 }), d:250 },
    { p: mp({ rua:.6, rfa:-2.4, rf:[.5,.5,.5,.5,.5], mo:2 }), d:250 },
    { p: mp({ rua:.7, rfa:-2.6, rf:[.5,.5,.5,.5,.5], mo:2 }), d:250 },
  ],
  AJUDAR: [
    { p: mp({ rua:.4, rfa:-1.2, rf:[0,0,0,0,0], lua:.4, lfa:-1.2, lf:[0,0,0,0,0] }), d:300 },
    { p: mp({ rua:.5, rfa:-1.8, rf:[0,0,0,0,0], lua:.5, lfa:-1.8, lf:[0,0,0,0,0] }), d:350 },
  ],
  AMIGO: [
    { p: mp({ rua:.5, rfa:-1.6, rf:[1,0,1,1,1], lua:.5, lfa:-1.6, lf:[1,0,1,1,1] }), d:400 },
  ],
  GRANDE: [
    { p: mp({ rua:1.2, rfa:-1.0, rf:[0,0,0,0,0], lua:1.2, lfa:-1.0, lf:[0,0,0,0,0] }), d:450 },
  ],
  PEQUENO: [
    { p: mp({ rua:.3, rfa:-1.0, rf:[0,0,0,0,0], lua:.3, lfa:-1.0, lf:[0,0,0,0,0] }), d:450 },
  ],
  NOME: [
    { p: mp({ rua:.8, rfa:-2.6, rf:[1,0,0,1,1] }), d:250 },
    { p: mp({ rua:.75, rfa:-2.4, rf:[1,0,0,1,1] }), d:200 },
    { p: mp({ rua:.8, rfa:-2.6, rf:[1,0,0,1,1] }), d:250 },
  ],
  FALAR: [
    { p: mp({ rua:.6, rfa:-2.2, rf:[1,0,1,1,1], mo:2 }), d:300 },
    { p: mp({ rua:.7, rfa:-1.8, rf:[1,0,1,1,1], mo:2 }), d:350 },
  ],
  IR: [
    { p: mp({ rua:.6, rfa:-1.4, rf:[1,0,1,1,1] }), d:300 },
    { p: mp({ rua:.7, rfa:-1.0, rf:[1,0,1,1,1] }), d:350 },
  ],
  VIR: [
    { p: mp({ rua:.7, rfa:-1.0, rf:[1,0,1,1,1] }), d:300 },
    { p: mp({ rua:.5, rfa:-1.6, rf:[1,0,1,1,1] }), d:350 },
  ],
  PRECISAR: [
    { p: mp({ rua:.5, rfa:-1.8, rf:[1,0,1,1,1] }), d:250 },
    { p: mp({ rua:.45, rfa:-1.6, rf:[1,0,1,1,1] }), d:200 },
    { p: mp({ rua:.5, rfa:-1.8, rf:[1,0,1,1,1] }), d:250 },
  ],
  COMO: [
    { p: mp({ rua:.7, rfa:-1.4, rf:[0,0,0,0,0], lua:.7, lfa:-1.4, lf:[0,0,0,0,0], eb:1, mo:3 }), d:500 },
  ],
  ONDE: [
    { p: mp({ rua:.7, rfa:-2.2, rf:[1,0,1,1,1], eb:1, mo:3 }), d:250 },
    { p: mp({ rua:.6, rfa:-2.2, rf:[1,0,1,1,1], eb:1, mo:3 }), d:200 },
    { p: mp({ rua:.7, rfa:-2.2, rf:[1,0,1,1,1], eb:1, mo:3 }), d:250 },
  ],
  DIA: [
    { p: mp({ rua:1.1, rfa:-2.0, rf:[0,0,0,0,0] }), d:300 },
    { p: mp({ rua:1.3, rfa:-2.8, rf:[0,0,0,0,0] }), d:400 },
  ],
  NOITE: [
    { p: mp({ rua:1.0, rfa:-2.6, rf:[0,0,0,0,0] }), d:300 },
    { p: mp({ rua:.8, rfa:-2.0, rf:[0,0,0,0,0] }), d:400 },
  ],
  PESSOA: [
    { p: mp({ rua:.6, rfa:-2.4, rf:[1,0,1,1,1] }), d:350 },
    { p: mp({ rua:.4, rfa:-1.8, rf:[1,0,1,1,1] }), d:350 },
  ],
  BONITO: [
    { p: mp({ rua:.8, rfa:-2.6, rf:[0,0,0,0,0], mo:1 }), d:250 },
    { p: mp({ rua:.6, rfa:-2.2, rf:[0,0,0,0,0], mo:1 }), d:350 },
  ],
  TER: [
    { p: mp({ rua:.5, rfa:-1.6, rf:[.4,.4,.4,.4,.4] }), d:350 },
  ],
  PODER: [
    { p: mp({ rua:.5, rfa:-1.8, rf:[1,1,1,1,1] }), d:250 },
    { p: mp({ rua:.4, rfa:-1.4, rf:[1,1,1,1,1] }), d:300 },
  ],
  BEM: [
    { p: mp({ rua:.5, rfa:-1.8, rf:[0,0,0,0,0], mo:1 }), d:400 },
  ],
  TUDO: [
    { p: mp({ rua:.7, rfa:-1.4, rf:[0,0,0,0,0], lua:.7, lfa:-1.4, lf:[0,0,0,0,0] }), d:400 },
  ],
};
/** Compound phrases – arrays of sign keys to play sequentially */
export const COMPOUNDS = {
  'BOM DIA':    ['BOM', 'DIA'],
  'BOA TARDE':  ['BOM', 'DIA'],   // simplified
  'BOA NOITE':  ['BOM', 'NOITE'],
  'TUDO BEM':   ['TUDO', 'BEM'],
};
