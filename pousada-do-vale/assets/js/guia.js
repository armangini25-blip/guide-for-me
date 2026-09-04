/* Guide For Me — protótipo padrão-ouro (template genérico).
   Fluxo: QR → 14 bandeiras → modo (turística/PCD) → plano → pagamento(premium) →
   apresentação → 10 pontos → final(Sair). Legendas sincronizadas frase a frase,
   quebradas nos grupos de respiração pelo passo 5/6 da Ferramenta de Locução. */

const DATA_VERSION = "0.6.3";               // == ?v= no guia.html; bumpar a cada mudança

/* 14 idiomas — mesma ordem e AUDIO_KEY do projeto original.
   audioKey: sufixo curto p/ os 5 "default de mercado", código completo p/ regionais. */
const LANGS = [
  { code: "pt-br", name: "Português (Brasil)",   audioKey: "pt", ready: true },
  { code: "pt-pt", name: "Português (Portugal)", audioKey: "pt-pt" },
  { code: "en-us", name: "English (US)",         audioKey: "en", ready: true },
  { code: "en-gb", name: "English (UK)",         audioKey: "en-gb" },
  { code: "es-es", name: "Español (España)",     audioKey: "es" },
  { code: "es-ar", name: "Español (Argentina)",  audioKey: "es-ar" },
  { code: "fr-fr", name: "Français",             audioKey: "fr" },
  { code: "de-de", name: "Deutsch",              audioKey: "de-de" },
  { code: "it-it", name: "Italiano",             audioKey: "it" },
  { code: "zh-cn", name: "中文（简体）",           audioKey: "zh-cn" },
  { code: "zh-tw", name: "中文（繁體）",           audioKey: "zh-tw" },
  { code: "ja-jp", name: "日本語",                audioKey: "ja-jp" },
  { code: "ru-ru", name: "Русский",              audioKey: "ru-ru" },
  { code: "ar-ma", name: "العربية", dir: "rtl",  audioKey: "ar-ma" },
];

/* Idiomas com narração/UI já gravadas (ready:true). Os demais entram no guia por
   fallback pt-br até @localization-lead traduzir e a Ferramenta de Locução gerar
   o áudio. A tela de bandeiras faz o carrossel de instrução só nos ready. */
const READY_LANGS = LANGS.filter((l) => l.ready);

/* Bandeiras em SVG inline (mesmo padrão da Pista) — emoji de bandeira não renderiza no Windows. */
const FLAG_SVG = {
  "pt-br": `<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#009739"/><polygon points="1.5,0.22 2.82,1 1.5,1.78 0.18,1" fill="#FEDD00"/><circle cx="1.5" cy="1" r="0.5" fill="#012169"/></svg>`,
  "pt-pt": `<svg viewBox="0 0 3 2"><rect width="1.2" height="2" fill="#046A38"/><rect x="1.2" width="1.8" height="2" fill="#DA291C"/><circle cx="1.2" cy="1" r="0.42" fill="#FFCC29" stroke="#046A38" stroke-width="0.03"/></svg>`,
  "en-us": `<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#B22234"/><g fill="#fff"><rect y="0.153" width="3" height="0.153"/><rect y="0.462" width="3" height="0.153"/><rect y="0.769" width="3" height="0.153"/><rect y="1.077" width="3" height="0.153"/><rect y="1.385" width="3" height="0.153"/><rect y="1.692" width="3" height="0.153"/></g><rect width="1.2" height="1.077" fill="#3C3B6E"/></svg>`,
  "en-gb": `<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#00247D"/><g stroke="#fff" stroke-width="0.4"><line x1="0" y1="0" x2="3" y2="2"/><line x1="3" y1="0" x2="0" y2="2"/></g><g stroke="#CF142B" stroke-width="0.15"><line x1="0" y1="0" x2="3" y2="2"/><line x1="3" y1="0" x2="0" y2="2"/></g><g stroke="#fff" stroke-width="0.5"><line x1="1.5" y1="0" x2="1.5" y2="2"/><line x1="0" y1="1" x2="3" y2="1"/></g><g stroke="#CF142B" stroke-width="0.28"><line x1="1.5" y1="0" x2="1.5" y2="2"/><line x1="0" y1="1" x2="3" y2="1"/></g></svg>`,
  "es-es": `<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#AA151B"/><rect y="0.5" width="3" height="1" fill="#F1BF00"/></svg>`,
  "es-ar": `<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><rect width="3" height="0.667" fill="#74ACDF"/><rect y="1.333" width="3" height="0.667" fill="#74ACDF"/><circle cx="1.5" cy="1" r="0.26" fill="#F6B40E" stroke="#85340A" stroke-width="0.02"/></svg>`,
  "fr-fr": `<svg viewBox="0 0 3 2"><rect width="1" height="2" fill="#0055A4"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#EF4135"/></svg>`,
  "de-de": `<svg viewBox="0 0 3 2"><rect width="3" height="0.667" fill="#000"/><rect y="0.667" width="3" height="0.667" fill="#DD0000"/><rect y="1.333" width="3" height="0.667" fill="#FFCE00"/></svg>`,
  "it-it": `<svg viewBox="0 0 3 2"><rect width="1" height="2" fill="#009246"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#CE2B37"/></svg>`,
  "zh-cn": `<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#DE2910"/><circle cx="0.55" cy="0.5" r="0.22" fill="#FFDE00"/><circle cx="1.05" cy="0.2" r="0.07" fill="#FFDE00"/><circle cx="1.2" cy="0.45" r="0.07" fill="#FFDE00"/><circle cx="1.15" cy="0.75" r="0.07" fill="#FFDE00"/><circle cx="0.9" cy="0.85" r="0.07" fill="#FFDE00"/></svg>`,
  "zh-tw": `<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#FE0000"/><rect width="1.5" height="1" fill="#000095"/><circle cx="0.75" cy="0.5" r="0.32" fill="#fff"/><circle cx="0.75" cy="0.5" r="0.05" fill="#000095"/></svg>`,
  "ja-jp": `<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><circle cx="1.5" cy="1" r="0.6" fill="#BC002D"/></svg>`,
  "ru-ru": `<svg viewBox="0 0 3 2"><rect width="3" height="0.667" fill="#fff"/><rect y="0.667" width="3" height="0.667" fill="#0039A6"/><rect y="1.333" width="3" height="0.667" fill="#D52B1E"/></svg>`,
  "ar-ma": `<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#C1272D"/><polygon points="1.5,0.62 1.65,1.05 2.1,1.05 1.73,1.3 1.87,1.73 1.5,1.47 1.13,1.73 1.27,1.3 0.9,1.05 1.35,1.05" fill="none" stroke="#006233" stroke-width="0.07"/></svg>`,
};

const state = {
  lang: null,          // objeto de LANGS
  pcd: false,          // modo audiodescrição
  plano: null,         // "basico" | "premium"
  i18n: {},            // i18n.json[lang.code]
  captions: {},        // captions.json inteiro
  pontos: [],          // pontos.json
  pontoIdx: 0,
  captionTimer: null,
  storyboard: null,    // apresentacao.storyboard.json (@foco)
};

const $ = (s) => document.querySelector(s);
/* Idioma não-`ready` não tem áudio gravado (só o texto do i18n.json cai em pt-br) —
   sem este fallback, todo <audio>.src apontaria para um arquivo inexistente
   (ex.: produto_fr.mp3) e a visita ficaria muda a partir da tela de bandeiras. */
const audioKey = () => (state.lang && state.lang.ready ? state.lang.audioKey : "pt");

/* ---------- telas ---------- */
const TELAS = ["screen-capa", "screen-lang", "screen-produto", "screen-modo", "screen-plano",
  "screen-anuncio", "screen-pagamento", "screen-apresentacao", "screen-percurso", "screen-final"];

/* Fecha TODO áudio em reprodução — de qualquer tela — antes de trocar de tela.
   Cada render* (renderApresentacao/renderProduto/renderPonto/...) atribui um
   .src novo ao seu <audio> antes de tocar, então parar aqui nunca deixa a
   próxima narração "nascer pausada"; só evita a da tela anterior vazar. */
function pararTodoAudio() {
  document.querySelectorAll("audio").forEach((a) => {
    if (!a.paused) a.pause();
    try { a.currentTime = 0; } catch (e) { /* sem media carregada ainda: ignora */ }
  });
}

function showScreen(id) {
  clearTimeout(avancoTimer);                 // cancela auto-avanço pendente (Voltar etc.)
  pararTodoAudio();
  TELAS.forEach((t) => $("#" + t).classList.toggle("active", t === id));
  pararLegenda();
  $("#app-screens").scrollTop = 0;
  atualizarRodape(id);
  tocarInstrucaoDaTela(id);
}

/* ---------- i18n ---------- */
async function carregarI18n() {
  try {
    const r = await fetch(`assets/data/i18n.json?v=${DATA_VERSION}`, { cache: "no-store" });
    const todos = await r.json();
    state.i18n = todos[state.lang.code] || todos["pt-br"] || {};
  } catch (e) { state.i18n = {}; }
  aplicarI18n();
  document.documentElement.lang = state.lang.code;
}
function t(key) { return state.i18n[key] || ""; }
function aplicarI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = state.i18n[el.getAttribute("data-i18n")];
    if (v) el.textContent = v;
  });
}

/* ---------- captions ---------- */
async function carregarCaptions() {
  try {
    const r = await fetch(`assets/data/captions.json?v=${DATA_VERSION}`, { cache: "no-store" });
    state.captions = await r.json();
  } catch (e) { state.captions = {}; }
}
function pararLegenda() {
  if (state.captionTimer) { clearInterval(state.captionTimer); state.captionTimer = null; }
}
/* Mostra o segmento cujo [start,end] contém o tempo atual. Os segmentos já vêm
   quebrados nos grupos de respiração (legenda.py --master). */
function renderLegenda(tipo, audioEl, boxSel) {
  pararLegenda();
  const box = $(boxSel);
  const segs = state.captions?.[tipo]?.[audioKey()]?.segments;
  if (!box) return;
  if (!segs || !segs.length) { box.hidden = false; box.textContent = "…"; return; }
  box.hidden = false;
  state.captionTimer = setInterval(() => {
    const tc = audioEl.currentTime;
    const s = segs.find((x) => tc >= x.start && tc <= x.end);
    box.textContent = s ? s.text : "…";
  }, 150);
}

/* ---------- storyboard da apresentação ----------
   Manifesto @foco (assets/data/apresentacao.storyboard.json): troca #apresentacao-foto
   durante a narração. shot ativo = o último shot cujo start_<lang> <= currentTime. */
async function carregarStoryboard() {
  try {
    const r = await fetch(`assets/data/apresentacao.storyboard.json?v=${DATA_VERSION}`, { cache: "no-store" });
    state.storyboard = await r.json();
  } catch (e) { state.storyboard = null; }
}
let _sbHandler = null;
function ligarStoryboardApresentacao(audioEl) {
  const foto = $("#apresentacao-foto");
  const sb = state.storyboard;
  if (_sbHandler) { audioEl.removeEventListener("timeupdate", _sbHandler); _sbHandler = null; }
  if (!sb || !Array.isArray(sb.shots) || !sb.shots.length) return;
  const base = sb.img_base || "assets/img/apresentacao/";
  const key = audioKey() === "en" ? "en" : "pt";       // demais idiomas caem no pt
  const arquivo = (s) => s.img || `${s.id}.svg`;        // s.img = override (ex.: foto .jpg)
  let atual = null;
  const aplicar = () => {
    const t0 = audioEl.currentTime;
    let shot = sb.shots[0];
    for (const s of sb.shots) {
      const st = (s["start_" + key] != null) ? s["start_" + key] : (s.start_pt || 0);
      if (t0 >= st) shot = s;
    }
    if (shot && shot.id !== atual) {
      atual = shot.id;
      foto.src = base + arquivo(shot);
      if (shot.img) mostrarTarjaVista(); else esconderTarjaVista();
    }
  };
  aplicar();                                            // shot de abertura já
  _sbHandler = aplicar;
  audioEl.addEventListener("timeupdate", aplicar);
}

/* ---------- áudio: player compacto ---------- */
function ligarMiniPlayer(audioEl, btnSel, progSel) {
  const btn = $(btnSel), prog = $(progSel);
  btn.onclick = () => { audioEl.paused ? audioEl.play() : audioEl.pause(); };
  audioEl.onplay = () => { btn.textContent = "⏸"; btn.classList.remove("autoplay-blocked"); };
  audioEl.onpause = () => { btn.textContent = "▶"; };
  audioEl.ontimeupdate = () => {
    if (audioEl.duration) prog.style.width = (100 * audioEl.currentTime / audioEl.duration) + "%";
  };
}
function tocar(audioEl, btnSel) {
  const p = audioEl.play();
  if (p && p.catch) p.catch(() => $(btnSel)?.classList.add("autoplay-blocked"));
}

/* ---------- instrução falada nas telas de config ---------- */
/* screen-lang: loop nas 14 línguas (ninguém escolheu idioma). Outras: uma vez, no idioma. */
const LOOP_POR_TELA = {
  "screen-lang": "loop_idioma",
  "screen-modo": "loop_modo",
  "screen-plano": "loop_plano",
  "screen-pagamento": "loop_pagamento",
};
let loopLangIdx = 0;
function tocarInstrucaoDaTela(id) {
  const el = $("#loop-multilang-audio");
  el.pause(); el.onended = null;
  const key = LOOP_POR_TELA[id];
  if (!key) return;
  if (id === "screen-lang") {
    // carrossel: repete a instrução "idioma disponível…" nos idiomas prontos,
    // cada um na própria língua, até o visitante tocar numa bandeira.
    const fila = READY_LANGS.length ? READY_LANGS : LANGS;
    loopLangIdx = 0;
    const proximo = () => {
      const lg = fila[loopLangIdx % fila.length];
      el.src = `assets/audio/ui/${key}_${lg.audioKey}.mp3`;
      loopLangIdx++;
      tocar(el, null);
      el.onended = proximo;
    };
    proximo();
  } else if (state.lang) {
    el.src = `assets/audio/ui/${key}_${audioKey()}.mp3`;
    tocar(el, null);
  }
}

/* voz de hover nos cartões de decisão (data-voice) */
document.addEventListener("pointerenter", (e) => {
  const alvo = e.target.closest?.("[data-voice]");
  if (!alvo || !state.lang) return;
  const a = $("#ui-voice-audio");
  a.src = `assets/audio/ui/${alvo.getAttribute("data-voice")}_${audioKey()}.mp3`;
  tocar(a, null);
}, true);

/* ---------- tela 2: idiomas ---------- */
function renderLangGrid() {
  const grid = $("#lang-grid");
  grid.innerHTML = "";
  LANGS.forEach((lg) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lang-card";
    b.innerHTML = `<span class="flag">${FLAG_SVG[lg.code] || ""}</span><span class="name">${lg.name}</span>`;
    b.onclick = async () => {
      grid.querySelectorAll(".lang-card").forEach((c) => c.classList.remove("selected"));
      b.classList.add("selected");
      state.lang = lg;
      await carregarI18n();
      $("#loop-multilang-audio").pause();               // corta o carrossel
      const nota = $("#lang-notice");
      if (lg.ready) {
        nota.hidden = true;
        irComAnuncio("screen-produto");                 // avança já, no idioma escolhido
      } else {
        nota.hidden = false;
        nota.textContent = t("lang_notice_pendente") ||
          "Tradução em preparação. A visita segue em português.";
        clearTimeout(avancoTimer);                       // achado @andre: timer solto podia
        avancoTimer = setTimeout(() => irComAnuncio("screen-produto"), 2400); // reentrar depois
      }
    };
    grid.appendChild(b);
  });
}

/* ---------- telas 3-5: modo, plano, pagamento ----------
   Regra (CEO): tocar numa opção JÁ segue para a próxima tela — sem depender do
   "Seguir". Pequeno atraso só p/ o visitante ver o cartão marcado. */
function escolher(cardSel, cb) {
  const c = $(cardSel);
  c.parentElement.querySelectorAll(".card").forEach((x) => x.classList.remove("selected"));
  c.classList.add("selected");
  cb();
}
let avancoTimer = null;
function avancarApos(destino, ms = 650) {
  clearTimeout(avancoTimer);
  avancoTimer = setTimeout(() => irComAnuncio(destino), ms);
}
$("#modo-turistica").onclick = () => escolher("#modo-turistica", () => { state.pcd = false; avancarApos("screen-plano"); });
$("#modo-pcd").onclick = () => escolher("#modo-pcd", () => { state.pcd = true; avancarApos("screen-plano"); });
$("#plano-basico").onclick = () => escolher("#plano-basico", () => { state.plano = "basico"; avancarApos("screen-apresentacao"); });
$("#plano-premium").onclick = () => escolher("#plano-premium", () => { state.plano = "premium"; avancarApos("screen-pagamento"); });
document.querySelectorAll(".payment-option").forEach((b) => {
  b.onclick = () => {
    const st = $("#pagamento-status");
    st.hidden = false;
    st.textContent = t("pagamento_confirmado") || "Pagamento simulado confirmado.";
    setTimeout(() => irPara("screen-apresentacao"), 1200);
  };
});

/* ---------- anúncio intersticial (plano Básico) ---------- */
let anuncioAtivo = false;
let anuncioInterval = null;
let anuncioDestino = null;                          // p/ retomar se "Sair" for cancelado no meio
function irComAnuncio(destino) {
  if (anuncioAtivo) return;                        // não re-entra durante um anúncio
  if (state.plano !== "basico") { irPara(destino); return; }
  anuncioAtivo = true;
  anuncioDestino = destino;
  showScreen("screen-anuncio");
  $("#btn-seguir-global").disabled = true;
  let n = 5;
  const tm = $("#anuncio-timer");
  tm.textContent = n;
  clearInterval(anuncioInterval);
  anuncioInterval = setInterval(() => {
    n--; tm.textContent = n;
    if (n <= 0) { clearInterval(anuncioInterval); anuncioAtivo = false; irPara(destino); }
  }, 1000);
}
/* achado @andre: "Sair" ficava clicável durante a contagem do anúncio e o intervalo
   nunca era limpo — ou navegava à força o visitante de volta (cancelar o modal) ou
   tentava re-renderizar telas já removidas do DOM (confirmar saída). */
function pararAnuncio() {
  clearInterval(anuncioInterval);
  anuncioAtivo = false;
}
/* irPara: destino direto, sem anúncio (usado por dentro do fluxo já-decidido).
   showScreen PRIMEIRO — ele chama pararLegenda(); só depois montamos a tela e a
   legenda, senão o timer da legenda da 1ª camada (turística) morre ao nascer. */
function irPara(id) {
  showScreen(id);
  if (id === "screen-percurso") { renderPonto(); }
  if (id === "screen-apresentacao") { renderApresentacao(); }
  if (id === "screen-produto") { renderProduto(); }
}

/* ---------- dica de navegação por voz ----------
   Toca ao fim de qualquer narração que espera o toque do visitante: "toque em
   Seguir ou na foto para continuar", no idioma já selecionado. Mesmo padrão da
   Pista. Áudio em assets/audio/dica_seguir_<audioKey>.mp3 (gerado pelo pipeline). */
function tocarDicaSeguirFoto() {
  const d = $("#dica-audio");
  if (!d) return;
  d.src = `assets/audio/dica_seguir_${audioKey()}.mp3`;
  tocar(d, null);
}

/* ---------- apresentação ---------- */
async function renderApresentacao() {
  const foto = $("#apresentacao-foto"), a = $("#apresentacao-audio");
  foto.src = "assets/img/apresentacao.jpg";           // fallback até o storyboard assumir
  $("#apresentacao-label").textContent = t("apresentacao_label") || "Bem-vindo";
  ligarMiniPlayer(a, "#apresentacao-playpause", "#apresentacao-progress");
  a.src = `assets/audio/apresentacao_${audioKey()}.mp3`;
  a.onended = () => { $("#btn-seguir-global").disabled = false; tocarDicaSeguirFoto(); };
  renderLegenda("apresentacao", a, "#apresentacao-caption-box");
  ligarStoryboardApresentacao(a);           // já aplica a tarja do shot de abertura
  tocar(a, "#apresentacao-playpause");
}
$("#apresentacao-media-tap").onclick = () => seguirGlobal();

/* ---------- tela 2b: pitch do produto Guide For Me ----------
   Mesmo padrão de apresentação/pontos: toca sozinha, com legenda sincronizada,
   e o visitante avança tocando em Seguir ou na própria ilustração (pan CSS
   infinito enquanto a tela estiver visível — ver .produto-pan em guia.css). */
async function renderProduto() {
  const a = $("#produto-audio");
  $("#produto-media-tap").disabled = false;
  ligarMiniPlayer(a, "#produto-playpause", "#produto-progress");
  a.src = `assets/audio/produto_${audioKey()}.mp3`;
  a.onended = () => { $("#btn-seguir-global").disabled = false; tocarDicaSeguirFoto(); };
  renderLegenda("produto", a, "#produto-caption-box");
  tocar(a, "#produto-playpause");
}
$("#produto-media-tap").onclick = () => seguirGlobal();

/* ---------- pontos (telas 6/7) ---------- */
async function carregarPontos() {
  try {
    const r = await fetch(`assets/data/pontos.json?v=${DATA_VERSION}`, { cache: "no-store" });
    state.pontos = await r.json();
  } catch (e) { state.pontos = []; }
}
function pontoAtual() { return state.pontos[state.pontoIdx] || {}; }

function renderPonto() {
  const p = pontoAtual();
  const foto = $("#vista-media-photo"), a = $("#player-audio");
  pararLegenda();
  esconderTarja();
  esconderTarjaIris();
  foto.src = p.foto || "assets/img/ponto_placeholder.svg";
  $("#vista-media-label").textContent = (p.nome && p.nome[state.lang.code]) || p.id || "";
  $("#vista-media-label").classList.remove("oculto");
  setTimeout(() => $("#vista-media-label").classList.add("oculto"), 3500);
  $("#ponto-descricao").textContent = (p.descricao && p.descricao[state.lang.code]) || "";
  $("#vista-media-tap").disabled = false;
  ligarMiniPlayer(a, "#player-playpause", "#player-progress");
  $("#player-mini").hidden = false;

  // encadeamento das camadas: turística → (PCD: segurança PRIMEIRO → turística → íris)
  const tocarCamada = (tipoBase, aoTerminar) => {
    const tipo = `${p.id}${tipoBase ? "_" + tipoBase : ""}`;
    a.onended = null;
    a.src = `assets/audio/${tipo}_${audioKey()}.mp3`;
    if (tipoBase === "seguranca" || tipoBase === "aviso") mostrarTarja();
    if (tipoBase === "iris") mostrarTarjaIris();
    renderLegenda(tipo, a, "#caption-box");
    $("#player-mini").hidden = false;
    a.onended = () => { esconderTarja(); esconderTarjaIris(); aoTerminar && aoTerminar(); };
    tocar(a, "#player-playpause");
  };

  const fim = () => { $("#btn-seguir-global").disabled = false; tocarDicaSeguirFoto(); };
  if (state.pcd) {
    // ordem PCD (decisão do CEO, 04/09): turística → segurança → íris.
    tocarCamada("", () =>
      tocarCamada("seguranca", () =>
        tocarCamada("iris", fim)));
  } else {
    tocarCamada("", fim);
  }
}
$("#vista-media-tap").onclick = () => seguirGlobal();

/* Fica visível pela duração REAL do áudio de segurança (~55-64s), não um tempo fixo
   curto — achado @bussola: 5s fixos cobriam só ~8% do áudio; esconderTarja() já é
   chamado no a.onended de tocarCamada, então isso basta. */
function mostrarTarja() {
  const el = $("#tarja-seguranca");
  el.classList.remove("tarja-oculta");
  clearTimeout(el._tm);
}
function esconderTarja() {
  const el = $("#tarja-seguranca");
  el.classList.add("tarja-oculta");
  clearTimeout(el._tm);
}
/* tarja verde "Audiodescrição" — mesmo padrão da tarja de segurança, mas 10s
   (pedido do CEO) e durante a camada iris. */
function mostrarTarjaIris() {
  const el = $("#tarja-iris");
  el.classList.remove("tarja-oculta");
  clearTimeout(el._tm);
  el._tm = setTimeout(() => el.classList.add("tarja-oculta"), 10000);
}
function esconderTarjaIris() {
  const el = $("#tarja-iris");
  el.classList.add("tarja-oculta");
  clearTimeout(el._tm);
}
/* tarja azul "Vista aumentada" — SÓ enquanto o plano ativo do storyboard tem foto
   real (shot.img), nunca durante os placeholders SVG esquemáticos. Achado
   convergente de 3 agentes (@advogado-do-diabo, @foco, @audiodescricao): rotular de
   "vista aumentada" um desenho esquemático genérico é uma alegação que a própria UI
   não sustenta. Sem aria-live (guia.html) — é sinal visual, não camada de áudio;
   não corresponde a nenhuma narração de audiodescrição (isso é a tarja verde). */
function mostrarTarjaVista() {
  const el = $("#tarja-vista-aumentada");
  if (!el) return;
  el.classList.remove("tarja-oculta");
}
function esconderTarjaVista() {
  const el = $("#tarja-vista-aumentada");
  if (!el) return;
  el.classList.add("tarja-oculta");
}

/* ---------- rodapé global: Voltar / Seguir / Sair ---------- */
function atualizarRodape(id) {
  $("#btn-voltar-global").disabled = (id === "screen-capa" || id === "screen-lang" || id === "screen-anuncio");
  $("#btn-seguir-global").disabled = (id === "screen-anuncio");
}
function seguirGlobal() {
  const cur = TELAS.find((t) => $("#" + t).classList.contains("active"));
  switch (cur) {
    case "screen-capa": showScreen("screen-lang"); break;
    case "screen-lang":
      if (!state.lang) return;
      irComAnuncio("screen-produto"); break;
    case "screen-produto": irComAnuncio("screen-modo"); break;
    case "screen-modo": irComAnuncio("screen-plano"); break;
    case "screen-plano":
      if (state.plano === "premium") irComAnuncio("screen-pagamento");
      else irComAnuncio("screen-apresentacao");
      break;
    case "screen-pagamento": irPara("screen-apresentacao"); break;
    case "screen-apresentacao": irComAnuncio("screen-percurso"); break;
    case "screen-percurso":
      if (state.pontoIdx < state.pontos.length - 1) {
        state.pontoIdx++;
        irComAnuncio("screen-percurso");
      } else {
        irComAnuncio("screen-final");
      }
      break;
    case "screen-final": abrirModalSair(); break;
  }
}
function voltarGlobal() {
  const cur = TELAS.find((t) => $("#" + t).classList.contains("active"));
  if (cur === "screen-percurso" && state.pontoIdx > 0) {
    state.pontoIdx--; irPara("screen-percurso"); return;
  }
  const ordem = ["screen-lang", "screen-produto", "screen-modo", "screen-plano", "screen-pagamento",
    "screen-apresentacao", "screen-percurso", "screen-final"];
  const i = ordem.indexOf(cur);
  // irPara (não showScreen puro): screen-produto/screen-apresentacao têm render* próprio
  // (áudio, legenda, storyboard, tarja) — showScreen sozinho deixava tudo isso obsoleto
  // ao voltar (achado @foco: legenda/tarja/imagem congeladas até nova reprodução manual).
  if (i > 0) irPara(ordem[i - 1]);
}
$("#btn-seguir-global").onclick = seguirGlobal;
$("#btn-voltar-global").onclick = voltarGlobal;
$("#capa-media-tap").onclick = () => showScreen("screen-lang");

/* ---------- Sair ---------- */
function abrirModalSair() { pararTodoAudio(); pararAnuncio(); $("#confirm-sair-modal").hidden = false; }
$("#btn-sair-global").onclick = abrirModalSair;
$("#final-fim").onclick = abrirModalSair;
$("#confirm-sair-nao").onclick = () => {
  $("#confirm-sair-modal").hidden = true;
  // cancelou "Sair" no meio do anúncio intersticial: pararAnuncio() já parou a
  // contagem em abrirModalSair() — completa a navegação em vez de deixar a tela de
  // anúncio presa sem Seguir habilitado e sem contagem rodando.
  if (anuncioDestino && $("#screen-anuncio").classList.contains("active")) {
    const destino = anuncioDestino;
    anuncioDestino = null;
    irPara(destino);
  }
};
$("#confirm-sair-sim").onclick = () => {
  document.querySelectorAll("audio").forEach((a) => { a.pause(); a.removeAttribute("src"); });
  pararLegenda();
  document.body.innerHTML = `<div style="padding:40px;text-align:center;font-family:sans-serif">
    <div style="font-size:3rem">🚪</div><p>${t("sessao_encerrada") || "Sessão encerrada."}</p></div>`;
};

/* ---------- init ---------- */
async function init() {
  renderLangGrid();
  await Promise.all([carregarCaptions(), carregarPontos(), carregarStoryboard()]);
  showScreen("screen-capa");
}
init();
