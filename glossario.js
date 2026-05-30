/** Portuguese → Libras Gloss converter */
import { SIGNS, COMPOUNDS } from './signs.js';
import { ALPHABET } from './alphabet.js';
const STOPWORDS = new Set([
  'o','a','os','as','um','uma','uns','umas',
  'de','do','da','dos','das','em','no','na','nos','nas',
  'para','pra','pro','por','pelo','pela','pelos','pelas',
  'com','sem','sob','sobre','ao','à','aos','às',
  'e','ou','mas','porém','que','se','já','também',
  'é','são','foi','era','será','está','estão','estava',
  'este','esta','esse','essa','isso','isto','aquele','aquela',
  'muito','mais','menos','então','aí','lá','aqui',
]);
const CONJUGATIONS = {
  'quero':'QUERER','quer':'QUERER','queremos':'QUERER','querem':'QUERER','queria':'QUERER',
  'gosto':'GOSTAR','gosta':'GOSTAR','gostamos':'GOSTAR','gostam':'GOSTAR','gostei':'GOSTAR',
  'sei':'SABER','sabe':'SABER','sabemos':'SABER','sabem':'SABER','sabia':'SABER',
  'vou':'IR','vai':'IR','vamos':'IR','vão':'IR','fui':'IR',
  'venho':'VIR','vem':'VIR','vemos':'VIR','viemos':'VIR',
  'falo':'FALAR','fala':'FALAR','falamos':'FALAR','falam':'FALAR','falei':'FALAR',
  'como':'COMER','come':'COMER','comemos':'COMER','comem':'COMER','comi':'COMER',
  'preciso':'PRECISAR','precisa':'PRECISAR','precisamos':'PRECISAR','precisam':'PRECISAR',
  'entendo':'ENTENDER','entende':'ENTENDER','entendem':'ENTENDER','entendi':'ENTENDER',
  'ajudo':'AJUDAR','ajuda':'AJUDAR','ajudam':'AJUDAR','ajudei':'AJUDAR',
  'posso':'PODER','pode':'PODER','podemos':'PODER','podem':'PODER',
  'tenho':'TER','tem':'TER','temos':'TER','têm':'TER','tive':'TER',
  'meu':'EU','minha':'EU','meus':'EU','minhas':'EU',
  'seu':'VOCÊ','sua':'VOCÊ','seus':'VOCÊ','suas':'VOCÊ',
  'dele':'ELE','dela':'ELE',
  'olá':'OI','oi':'OI',
  'sim':'SIM','não':'NÃO','nao':'NÃO',
  'bom':'BOM','boa':'BOM','bons':'BOM','boas':'BOM',
  'ruim':'RUIM',
  'obrigado':'OBRIGADO','obrigada':'OBRIGADO',
  'desculpa':'DESCULPA','desculpe':'DESCULPA',
  'casa':'CASA','escola':'ESCOLA','trabalho':'TRABALHO',
  'água':'ÁGUA','nome':'NOME',
  'amigo':'AMIGO','amiga':'AMIGO','amigos':'AMIGO',
  'grande':'GRANDE','grandes':'GRANDE',
  'pequeno':'PEQUENO','pequena':'PEQUENO',
  'bonito':'BONITO','bonita':'BONITO','lindo':'BONITO','linda':'BONITO',
  'dia':'DIA','noite':'NOITE',
  'pessoa':'PESSOA','pessoas':'PESSOA',
  'bem':'BEM','tudo':'TUDO',
};
/**
 * Convert Portuguese text into an array of gloss tokens.
 * Compound phrases are detected first, then individual words.
 */
export function textoParaGlosa(texto) {
  const clean = texto.toLowerCase().replace(/[.,!?;:()"""'']/g, '');
  let words = clean.split(/\s+/).filter(w => w.length > 0);
  // Remove stopwords
  words = words.filter(w => !STOPWORDS.has(w));
  // Map conjugations / known words
  words = words.map(w => {
    if (CONJUGATIONS[w]) return CONJUGATIONS[w];
    return w.toUpperCase();
  });
  // Detect compound phrases (2-word combos)
  const result = [];
  for (let i = 0; i < words.length; i++) {
    if (i < words.length - 1) {
      const pair = words[i] + ' ' + words[i + 1];
      if (COMPOUNDS[pair]) {
        result.push(pair);
        i++; // skip next word
        continue;
      }
    }
    result.push(words[i]);
  }
  return result.filter(w => w.length > 0);
}
