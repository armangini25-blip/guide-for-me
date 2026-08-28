const AUDIO_SEGURANCA_LANGS_PRONTOS = {
  pista_p10: new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "es-ar", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  default: new Set(["pt-br"]), // P1-P9: só pt-br por enquanto, ver PENDENCIAS.md
};
function segurancaProntaPara(ponto) {
  return (AUDIO_SEGURANCA_LANGS_PRONTOS[ponto.tipo] || AUDIO_SEGURANCA_LANGS_PRONTOS.default).has(state.lang.code);
}

let state = {};
function testar(tipo, lang) {
  state.lang = { code: lang };
  return segurancaProntaPara({ tipo });
}
console.log('pista_p10 + es-ar:', testar('pista_p10', 'es-ar'));
console.log('pista_p10 + pt-br:', testar('pista_p10', 'pt-br'));
console.log('pista_p10 + ja-jp:', testar('pista_p10', 'ja-jp'));
console.log('pista_p9  + es-ar:', testar('pista_p9', 'es-ar'));
console.log('pista_p9  + pt-br:', testar('pista_p9', 'pt-br'));
console.log('pista_p4  + en-us:', testar('pista_p4', 'en-us'));
