// Pista Cláudio Coutinho — página standalone (Produto 4), aberta pelo QR da placa na trilha.
// Herda do app principal (Fase B/C do plano sleepy-gathering-kazoo.md, mais a rodada de revisão
// tela a tela de 26/08/2026): rodapé global Voltar/Seguir/Sair, tela de modo (Turística/PCD), tela
// de plano (Básico com anúncio/Premium com pagamento simulado), e a trilha de continuação da Íris
// em áudio no modo PCD — mesmos padrões de app.js, adaptados pra a sequência linear de paradas.

// Build 2026-08-28 (Auditoria 05, achado crítico C-04) — ver o mesmo comentário em app.js:
// captions.json/i18n.json eram buscados com cache:"no-store" (desperdício de banda numa trilha com
// sinal instável); troca pra query string de versão, que só força novo download quando o conteúdo
// realmente muda (bump manual deste número), aproveitando o cache HTTP normal no resto do tempo.
//
// Build 2026-08-29 (achado crítico, causa raiz de "o site não atualizou" mesmo com CACHE_NAME
// bumpado): este número TAMBÉM precisa ser copiado manualmente pro "?v=" de
// `<script src="assets/js/pista.js?v=...">` e `<link href="assets/css/app.css?v=...">` em
// pista.html (e os equivalentes app.js/app.css em index.html) a cada deploy. Sem isso, o cache
// HTTP comum do navegador (não o service worker — esse já tinha sido corrigido) pode segurar uma
// cópia velha de pista.js/app.js mesmo com o HTML novo sendo servido, e o JS velho tenta mexer em
// elementos que o HTML novo já removeu → TypeError, app trava inteiro depois da tela de idioma.
const DATA_VERSION = "2026-09-03.4";

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

const LANGS = [
  { code: "pt-br", name: "Português (Brasil)" },
  { code: "pt-pt", name: "Português (Portugal)" },
  { code: "en-us", name: "English (US)" },
  { code: "en-gb", name: "English (UK)" },
  { code: "es-es", name: "Español (España)" },
  { code: "es-ar", name: "Español (Argentina)" },
  { code: "fr-fr", name: "Français" },
  { code: "de-de", name: "Deutsch" },
  { code: "it-it", name: "Italiano" },
  { code: "zh-cn", name: "中文（简体）" },
  { code: "zh-tw", name: "中文（繁體）" },
  { code: "ja-jp", name: "日本語" },
  { code: "ru-ru", name: "Русский" },
  { code: "ar-ma", name: "العربية", dir: "rtl" },
];

// Mesmo padrão de app.js (LANGS[].audioKey / langForAudio()): idiomas "default de mercado" gravam
// com sufixo curto (pt-br→pt, en-us→en, es-es→es, fr-fr→fr, it-it→it) reaproveitando arquivos que
// nasceram assim; as demais variantes regionais mantêm o code completo como sufixo de arquivo.
const AUDIO_KEY = {
  "pt-br": "pt", "pt-pt": "pt-pt", "en-us": "en", "en-gb": "en-gb", "es-es": "es",
  "es-ar": "es-ar", "fr-fr": "fr", "de-de": "de-de", "it-it": "it", "zh-cn": "zh-cn",
  "zh-tw": "zh-tw", "ja-jp": "ja-jp", "ru-ru": "ru-ru", "ar-ma": "ar-ma",
};

// Idiomas com as 11 peças da trilha (apresentação + 9 paradas + convite) já traduzidas e narradas —
// cresce um idioma por vez, tradução por @locucao-XX seguida de geração de áudio (mesma disciplina
// da skill localizar-audioguia-mirante do app principal). 14/14 idiomas completos (26/08/2026).
const AUDIO_LANGS_PRONTOS = new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "es-ar", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]);

// Idiomas com a trilha de continuação da Íris (PCD) já narrada — hoje só pt-br; cresce um idioma
// por vez, mesmo padrão de AUDIO_IRIS_LANGS_PRONTOS em app.js.
const AUDIO_IRIS_LANGS_PRONTOS = new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "es-ar", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]);

// Idiomas com a camada de segurança/orientação física (@bussola, achado A-02 da auditoria de
// 26/08) já narrada — toca ANTES da trilha da Íris, mesmo padrão incremental. POR PONTO, não mais
// global — cobertura de idioma é diferente por ponto (P1-P9 só pt-br; o Ponto 10/bônus tem os 14).
// Build 2026-08-27 (bug real encontrado pelo CEO, comparando pt-BR × es-AR na navegação de
// verdade): até essa correção, isto era um Set único global — então mesmo com os 14 áudios de
// segurança do Ponto 10 gravados e corretos, `tocarTrilhaIrisSeAplicavel` pulava a segurança e ia
// direto pra Íris em qualquer idioma que não pt-br, porque o gate global só liberava pt-br pra
// TODOS os pontos. Ver `segurancaProntaPara(ponto)` logo abaixo — é ela quem decide agora, por
// ponto, não mais este objeto direto.
const AUDIO_SEGURANCA_LANGS_PRONTOS = {
  pista_p10: new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "es-ar", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  // Build 2026-08-28 (Auditoria 05, achado do @advogado-do-diabo): os 14 áudios de pista_p2_seguranca_*
  // já estavam gravados e publicados desde a reformulação da Praia Vermelha, mas este objeto nunca
  // foi atualizado — pista_p2 caía no "default" (só pt-br), então visitantes PCD em qualquer outro
  // idioma nunca ouviam o aviso de rampas/escadas/ausência de corrimão da Praia Vermelha, mesmo com
  // o áudio pronto. Mesma classe de bug do gate global corrigido em 27/08 pro Ponto 10, reencontrada
  // aqui por não ter sido generalizada na hora.
  pista_p2: new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "es-ar", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  // Build 2026-08-28 (Auditoria 6, pedido do CEO — fechar paridade com P2/P10 nos 14 idiomas):
  // P1, P3-P8 ganham entrada própria, um idioma de cada vez, começando por es-ar. P9 fica de fora
  // de propósito — é só uma placa, decisão do CEO, não precisa de camada de segurança física.
  // Build 2026-08-28 (achado tardio — zh-tw tinha ficado de fora dos 6 pares anteriores por
  // engano; corrigido nesta rodada, agora sim 14/14 de verdade).
  pista_p1: new Set(["pt-br", "es-ar", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  pista_p3: new Set(["pt-br", "es-ar", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  pista_p4: new Set(["pt-br", "es-ar", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  pista_p5: new Set(["pt-br", "es-ar", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  pista_p6: new Set(["pt-br", "es-ar", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  pista_p7: new Set(["pt-br", "es-ar", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  pista_p8: new Set(["pt-br", "es-ar", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  // Build 2026-09-02: P9 entrou como Set vazio ("é só uma placa").
  // Build 2026-09-03 (REVERSÃO, pedido do CEO): a placa do mapa do Morro da Urca É um ponto de
  // decisão para a subida perigosa — ganha camada de segurança/O&M própria. Áudio
  // pista_p9_seguranca_<id> agora gravado nos 14 idiomas (en-us/fr/it via Kokoro, zh-cn/zh-tw/ar-ma via MOSS).
  pista_p9: new Set(["pt-br", "es-ar", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]),
  default: new Set(["pt-br"]),
};
function segurancaProntaPara(ponto) {
  // Build 2026-09-03 (pedido do CEO): a camada de segurança / orientação e mobilidade
  // (pista_pN_seguranca) só entra no fluxo de navegação do MODO PCD. Na Narração Turística
  // pura ela não toca mais — reverte o build de 02/09 que a encadeava nos dois modos.
  // O aviso de risco real do Ponto 10 (pista_p10_aviso, via tocarAvisoReal) tem gate próprio
  // em renderPontoBonus e passou a ser PCD-only na mesma leva.
  if (!state.pcdProfile) return false;
  return (AUDIO_SEGURANCA_LANGS_PRONTOS[ponto.tipo] || AUDIO_SEGURANCA_LANGS_PRONTOS.default).has(state.lang.code);
}

function langForAudio() {
  return state.lang ? AUDIO_KEY[state.lang.code] : "pt";
}

// Aviso mostrado quando o idioma escolhido ainda não está em AUDIO_LANGS_PRONTOS. Curto e
// funcional — não é conteúdo de audiodescrição, então traduzido direto aqui, sem passar pelos
// agentes de locução por idioma.
const NOTICE_AUDIO_PENDENTE = {
  "pt-pt": "A narração desta trilha ainda só está disponível em português do Brasil. Aproveite as fotos e a descrição abaixo enquanto preparamos as restantes traduções.",
  "en-us": "Narration for this trail is currently available only in Portuguese. Enjoy the photos and description below while we prepare the other translations.",
  "en-gb": "Narration for this trail is currently only available in Portuguese. Enjoy the photos and description below while we prepare the other translations.",
  "es-es": "La narración de este sendero todavía solo está disponible en portugués. Disfrute de las fotos y la descripción de abajo mientras preparamos las demás traducciones.",
  "es-ar": "La narración de este sendero todavía solo está disponible en portugués. Disfrutá de las fotos y la descripción de abajo mientras preparamos las demás traducciones.",
  "fr-fr": "La narration de ce sentier n'est pour l'instant disponible qu'en portugais. Profitez des photos et de la description ci-dessous pendant que nous préparons les autres traductions.",
  "de-de": "Die Erzählung für diesen Wanderweg ist derzeit nur auf Portugiesisch verfügbar. Genießen Sie inzwischen die Fotos und die Beschreibung unten, während wir die weiteren Übersetzungen vorbereiten.",
  "it-it": "La narrazione di questo sentiero è per ora disponibile solo in portoghese. Goditi le foto e la descrizione qui sotto mentre prepariamo le altre traduzioni.",
  "zh-cn": "本步道的语音讲解目前仅提供葡萄牙语版本。在我们准备其他语言翻译期间，欢迎欣赏下方的照片和描述。",
  "zh-tw": "本步道的語音導覽目前僅提供葡萄牙語版本。在我們準備其他語言翻譯期間，歡迎欣賞下方的照片與描述。",
  "ja-jp": "このトレイルのナレーションは現在ポルトガル語のみでご利用いただけます。他の言語の翻訳を準備する間、下記の写真と説明をお楽しみください。",
  "ru-ru": "Озвучивание этой тропы пока доступно только на португальском языке. Наслаждайтесь фотографиями и описанием ниже, пока мы готовим остальные переводы.",
  "ar-ma": "السرد الصوتي لهذا المسار متاح حاليا باللغة البرتغالية فقط. استمتع بالصور والوصف أدناه بينما نجهز الترجمات الأخرى.",
};

// Aviso para pontos que ainda não têm narração em NENHUM idioma (hoje: nenhum — os 9 pontos e a
// apresentação/convite já têm pt-br + as outras 13 traduções). Mantido para pontos futuros.
const NOTICE_NARRACAO_EM_PRODUCAO = "A narração deste ponto ainda está em produção — aproveite a foto e a descrição abaixo enquanto preparamos o áudio.";

// Mensagem de falha de rede em selectLanguage() (achado T-01 da auditoria de 26/08) — precisa ficar
// FORA de i18n.json de propósito: é exibida exatamente no cenário em que aquele arquivo falhou ao
// carregar, então não há tradução disponível vinda da rede pra usar. Tabela local, independente de
// qualquer fetch, cobrindo os 14 idiomas do roster com l.code (não audioKey).
const NETWORK_ERROR_MSG = {
  "pt-br": ["Sem conexão — não foi possível carregar o conteúdo.", "Tentar novamente"],
  "pt-pt": ["Sem ligação — não foi possível carregar o conteúdo.", "Tentar novamente"],
  "en-us": ["No connection — couldn't load the content.", "Try again"],
  "en-gb": ["No connection — couldn't load the content.", "Try again"],
  "es-es": ["Sin conexión — no se pudo cargar el contenido.", "Intentar de nuevo"],
  "es-ar": ["Sin conexión — no se pudo cargar el contenido.", "Intentar de nuevo"],
  "fr-fr": ["Pas de connexion — le contenu n'a pas pu être chargé.", "Réessayer"],
  "de-de": ["Keine Verbindung — Inhalt konnte nicht geladen werden.", "Erneut versuchen"],
  "it-it": ["Nessuna connessione — impossibile caricare il contenuto.", "Riprova"],
  "zh-cn": ["无网络连接——内容加载失败。", "重试"],
  "zh-tw": ["無網路連線——內容載入失敗。", "重試"],
  "ja-jp": ["接続がありません——コンテンツを読み込めませんでした。", "再試行"],
  "ru-ru": ["Нет соединения — не удалось загрузить контент.", "Повторить попытку"],
  "ar-ma": ["لا يوجد اتصال — تعذّر تحميل المحتوى.", "إعادة المحاولة"],
};

// 9 paradas da trilha, na ordem real de caminhada — curadoria em relatorio-fotos-pista-v2.md
// (Fase A: triagem de ~230 fotos brutas de pao/imagens/20ago, sessão de campo 19/08/2026).
// audioPronto: true — narração pt-BR gravada (Fase C, roteiro em pista_pontos_roteiro_v1.md,
// revisado por @lente a partir do rascunho do CEO, corrigido pelo fact-check de
// @tour-content-historian nos pontos 2/7/8). Outros idiomas ainda mostram NOTICE_AUDIO_PENDENTE até
// a localização rodar. temIris: true quando existe assets/audio/<tipo>_iris_<audioKey>.mp3 — hoje
// só pt-br (AUDIO_IRIS_LANGS_PRONTOS).
// Build 2026-08-27 (pedido do CEO): Ponto 1 e Ponto 4 trocaram de posição na sequência — troca
// cirúrgica só de ordem no array (o bloco de cada um, com todo o conteúdo, migrou de lugar);
// nomes/tipo/áudio continuam ligados ao mesmo conteúdo de sempre, só mudou ONDE na sequência cada
// um aparece. O número exibido no topo do card ainda não foi ajustado (pedido explícito do CEO
// pra fazer depois, à parte).
const PISTA_PONTOS = [
  { tipo: "pista_p4", nome: "A Enseada dos Mergulhadores", foto: "assets/img/pista_coutinho/pista_p4.jpg", audioPronto: true, temIris: true,
    descricaoIris: "A água muda de dourado-claro junto às pedras para um verde-turquesa profundo mar adentro; cinco pessoas de roupa escura boiam e nadam devagar, aparentemente observando a vida marinha; ao fundo à esquerda, o paredão do Pão de Açúcar fecha a moldura, e pequenos barcos brancos balançam ancorados mais além." },
  // Build 2026-08-27 (pedido do CEO): Parada 2 reformulada por completo — nome, foto e conteúdo
  // trocados de "O Paredão Visto da Enseada" pra "Praia Vermelha" (foto gerada por IA, não é
  // captura de campo real como as outras 9 — ver PENDENCIAS.md Rodada 23 pro histórico completo
  // de correções de campo/fact-check que geraram o texto atual).
  { tipo: "pista_p2", nome: "Praia Vermelha", foto: "assets/img/pista_coutinho/pista_p2.jpg", audioPronto: true, temIris: true,
    descricaoIris: "A areia da Praia Vermelha desaparece sob guarda-sóis coloridos — azuis, vermelhos, verdes — lado a lado, com banhistas espalhados sob o sol da manhã; a água passa do verde-esmeralda raso junto à faixa de areia para um azul mais fechado mar adentro; ao fundo, o paredão de granito do Pão de Açúcar se ergue sobre a mata que cobre a base do morro, e no alto arredondado avista-se a pequena estação do bondinho recortada contra o céu limpo." },
  { tipo: "pista_p3", nome: "O Gigante e a Baía", foto: "assets/img/pista_coutinho/pista_p3.jpg", audioPronto: true, temIris: true,
    descricaoIris: "O Pão de Açúcar aparece inteiro, do sopé arborizado ao topo rochoso com a estação do teleférico; a baía se abre à direita, com um navio pequeno cruzando as águas calmas ao fundo, entre outros morros que se sucedem até a neblina do horizonte." },
  { tipo: "pista_p1", nome: "Aqui Começa a Pista", foto: "assets/img/pista_coutinho/pista_p1.jpg", audioPronto: true, temIris: true,
    descricaoIris: "Uma placa marrom em formato de morro se ergue sobre um pedestal de pedra, com o nome da trilha em letras amarelas e um desenho estilizado do Pão de Açúcar visto da água; ao lado, uma placa menor lista em ícones o que não é permitido; sob os pés, um caminho de pedras portuguesas curva-se entre um muro branco baixo e a mata densa que emoldura a entrada." },
  { tipo: "pista_p5", nome: "O Caminho Sob as Árvores", foto: "assets/img/pista_coutinho/pista_p5.jpg", audioPronto: true, temIris: true,
    descricaoIris: "O caminho pavimentado se abre numa curva suave sob o teto verde da mata; à direita, bancos de tronco e pedra marcam um pequeno ponto de descanso entre arbustos; à esquerda, a vegetação fecha densa até a beira do caminho." },
  { tipo: "pista_p6", nome: "Mar Aberto, Manhã Calma", foto: "assets/img/pista_coutinho/pista_p6.jpg", audioPronto: true, temIris: true,
    descricaoIris: "O mar se estende em azul profundo e quase sem ondulação até um ilhote arredondado e verde no horizonte à direita; ao centro, minúsculo, um caiaque desliza sozinho pela água; galhos escuros emolduram o canto esquerdo do quadro, framing natural da trilha." },
  { tipo: "pista_p7", nome: "A Fortaleza no Alto do Morro", foto: "assets/img/pista_coutinho/pista_p7.jpg", audioPronto: true, temIris: true,
    descricaoIris: "No topo de um morro arredondado, muros baixos de pedra clara marcam os restos de uma fortificação, com uma bandeira do Brasil hasteada ao lado; um segundo morro, mais escuro e sem construção, se ergue ao lado; o mar azul-claro ocupa a base do quadro." },
  { tipo: "pista_p8", nome: "Chegada à Urca", foto: "assets/img/pista_coutinho/pista_p8.jpg", audioPronto: true, temIris: true,
    // Build 2026-08-29 (correção autorizada pelo CEO): "barracas de sol e banhistas" e "um hotel"
    // não eram sustentáveis pela foto em alta resolução (checagem de @audiodescricao/Íris) — a
    // areia tem só uma faixa indistinta de ocupação, e os prédios ao fundo não têm elemento que
    // confirme "hotel". Texto corrigido, replicado nos 14 idiomas (mesma alegação existia em todos).
    descricaoIris: "A trilha se abre numa última curva sobre uma enseada onde a areia recebe, ao longe, uma faixa indistinta de ocupação; morros de pedra nua descem dos dois lados até a água calma, e ao fundo, prédios brancos se acomodam junto à praia." },
  { tipo: "pista_p9", nome: "Mapa da Trilha", foto: "assets/img/pista_coutinho/p6_mapa_trilha.jpg", audioPronto: true, temIris: true,
    descricaoIris: "Uma placa grande, marrom com faixa amarela no topo, apresenta o mapa da trilha do Morro da Urca com curvas de nível e distâncias em dois idiomas." },
];

// ---------- Ponto 10 — faixa bônus/surpresa, pedido do CEO 27/08 ----------
// NÃO faz parte de PISTA_PONTOS de propósito: a trilha continua sendo descrita/contada como "9
// paradas" em todo lugar (pista_progresso_template usa PISTA_PONTOS.length) — o ponto 10 não pode
// alterar essa contagem nem aparecer citado antes da hora. É surpresa: só existe para quem chegar
// até o fim da parada 9, nunca é mencionado nas 9 paradas oficiais nem no rodapé/progresso.
// Local: final da Pista Cláudio Coutinho, onde o trecho de atletismo completa os 1250m.
// Foto trazida pelo CEO em 27/08 (pao/imagens/20ago/20260819_154822.jpg), copiada pra
// assets/img/pista_coutinho/pista_p10.jpg (rotação EXIF corrigida depois).
// LIGADO À NAVEGAÇÃO em 27/08 (ver renderPontoBonus/irParaPontoBonus/state.naPontoBonus): entra
// no fluxo entre a Parada 9 e o convite ("Você não está lá. Ainda."), sem virar uma 10ª parada
// oficial — pontoIndex nunca chega a apontar pra ele.
const PISTA_PONTO_BONUS = {
  tipo: "pista_p10", nome: "Final da Pista", foto: "assets/img/pista_coutinho/pista_p10.jpg",
  audioPronto: true, temIris: true, // áudio nos 14 idiomas gravado em 27/08 (cada locução própria
  // calibrou antes, Diretiva 05 — ver PENDENCIAS.md Rodada 18/21). audioPronto/temIris seguem o
  // mesmo padrão dos 9 pontos oficiais (indica "existe áudio real"; idioma específico é decidido
  // pelos sets AUDIO_LANGS_PRONTOS/AUDIO_IRIS_LANGS_PRONTOS, e por `segurancaProntaPara(ponto)` pra
  // segurança — esse ponto tem os 14 liberados, os 9 oficiais só pt-br; ver comentário mais acima).
  // nome "Final da Pista" CONFIRMADO pelo CEO em 27/08 (não é mais placeholder) — @lente sugeriu
  // alternativas ("Onde a Cidade/o Rio Nasceu", "Aos Pés do Pão de Açúcar", "Entre a Cotunduba e
  // o Leme"), CEO optou por manter o nome original.
  // descricaoIris (@audiodescricao, 27/08) — 2ª versão, com a foto já corrigida de rotação EXIF
  // (assets/img/pista_coutinho/pista_p10.jpg, reprocessado com ImageOps.exif_transpose) e
  // recortes de zoom na placa do cilindro e no totem verde de avisos.
  // Texto pt-BR das 3 camadas do Ponto 10, fechado e com áudio nos 14 idiomas (ver PENDENCIAS.md,
  // Rodadas 16-18): pista_p10_pt.txt (narração turística, por @lente + fact-check de
  // @tour-content-historian sobre a fundação da cidade em 1565 bem ali perto),
  // pista_p10_seguranca_pt.txt (Bússola, com a técnica de orientação auditiva pelo intervalo de
  // passadas de corredores) e esta descricaoIris.
  descricaoIris: "O caminho de asfalto rachado sobe em suave perspectiva sob um arco denso de galhos que se estendem de um lado ao outro da trilha; à direita, uma mureta baixa de concreto acompanha o percurso com folhas secas acumuladas na sua base, marcando o limite sobre a encosta; à esquerda, a vegetação avança sem barreira alguma, com trepadeiras subindo pelo tronco de uma árvore que se inclina sobre o caminho. Ao fundo, o caminho é interrompido pela presença de um grande cilindro de concreto, estrutura cinza-acastanhada e desgastada com cerca de dois metros de diâmetro e seis metros de altura, que se ergue como um pilar maciço, com uma pequena placa branca de aviso afixada em sua superfície. Ao lado do cilindro, encostado à vegetação, um totem verde em formato arqueado se apoia sobre um poste metálico fino — é um painel oficial de risco da unidade de conservação, com texto bilíngue em português e inglês, cada coluna encimada por um triângulo amarelo de alerta e um pictograma de pessoa em terreno inclinado.",
};

// Build 2026-08-29 (pedido do CEO): carrossel de 2 fotos na tela "Final da Pista" (Ponto 10
// bônus) — a foto original (pista_p10.jpg) por 10s, depois a nova (pista_p10_b.jpg, trazida pelo
// CEO em pao/imagens/20ago/20260819_155544.jpg) por 10s, volta pra original, e segue nesse vaivém
// pra sempre. Roda em paralelo à narração (aviso→turística→segurança), independente dela — mesmo
// espírito do carrossel do convite (renderPistaCarousel), só que com 2 fotos fixas em vez de 8 e
// intervalo próprio. Para quando a Íris começa (o storyboard, se existir, precisa da MESMA foto
// original o tempo todo pros recortes por marco citado baterem com a narração) ou quando a tela
// muda — ver pararStoryboardAR(), que cancela os dois junto.
const PISTA_P10_CAROUSEL_FOTOS = ["assets/img/pista_coutinho/pista_p10.jpg", "assets/img/pista_coutinho/pista_p10_b.jpg"];
const PISTA_P10_CAROUSEL_MS = 10000;

// 8 fotos reais da Pista Cláudio Coutinho, tiradas pelo CEO em visita de campo — mesmo conteúdo
// e mesma ordem de PISTA_FOTOS em assets/js/app.js (p1 a p7, depois p10 — p8/p9 não existem no
// lote). Descrição da Íris (@audiodescricao), só português nesta fase. Usadas só na peça final
// "pista_convite" (carrossel), que fecha a sequência da trilha.
const PISTA_FOTOS = [
  { foto: "assets/img/pista_coutinho/p1_placa_entrada.jpg", nome: "Aqui Começa a Pista",
    descricaoIris: "Uma placa marrom e amarela se ergue entre folhas secas e pedras, anunciando em português e inglês o nome da trilha; ao fundo, a mata fecha o horizonte em verde denso." },
  { foto: "assets/img/pista_coutinho/p2_caminho_mata.jpg", nome: "Túnel Verde",
    descricaoIris: "Um caminho de terra batida serpenteia sob um túnel de galhos e folhas verdes; à esquerda, uma lixeira vermelha lembra a presença humana na natureza preservada." },
  { foto: "assets/img/pista_coutinho/p3_trilha_beira_mar.jpg", nome: "A Trilha à Beira-Mar",
    descricaoIris: "A trilha acompanha a borda da mata, protegida por um corrimão simples de metal; à direita, entre as árvores, a água calma da baía aparece em vislumbres." },
  { foto: "assets/img/pista_coutinho/p4_face_morro.jpg", nome: "A Face do Morro Vista de Baixo",
    descricaoIris: "A trilha sobe suavemente entre arbustos até revelar, no alto, a face de granito nu do morro, coroada por uma estrutura onde os cabos do teleférico se encontram." },
  { foto: "assets/img/pista_coutinho/p5_enseada_escondida.jpg", nome: "A Enseada Escondida",
    descricaoIris: "Uma pequena enseada se abre entre dois morros de pedra nua coberta de vegetação; à direita, discreta, uma construção branca se aninha à beira da água." },
  { foto: "assets/img/pista_coutinho/p6_mapa_trilha.jpg", nome: "Mapa da Trilha",
    descricaoIris: "Uma placa grande, marrom com faixa amarela no topo, apresenta o mapa da trilha do Morro da Urca com curvas de nível e distâncias em dois idiomas." },
  { foto: "assets/img/pista_coutinho/p7_vista_nublada.jpg", nome: "Vista Nublada da Trilha",
    descricaoIris: "Da trilha, entre galhos, a baía se abre em tom acinzentado sob céu encoberto; ao fundo os prédios da Urca se acomodam à beira d'água." },
  { foto: "assets/img/pista_coutinho/p10_escada_raizes.jpg", nome: "Escada de Raízes",
    descricaoIris: "Pedras arredondadas e raízes grossas formam degraus naturais e irregulares, sem corrimão, sob um teto denso de folhas que reduz a luz — este é um trecho da subida ao Morro da Urca, a trilha de 900 m que começa depois do fim da Pista Cláudio Coutinho, não a pista plana narrada nos 9 pontos anteriores." },
];
const PISTA_CAROUSEL_MS = 4000;

const state = {
  lang: null,
  captions: null,
  pontoIndex: 0,
  naConvite: false,
  naPontoBonus: false, // true na tela do Ponto 10 (bônus), entre a Parada 9 e o convite — não conta
  // pra PISTA_PONTOS.length nem pro "Parada X de 9" (ver renderPontoBonus/PISTA_PONTO_BONUS)
  pcdProfile: false, // escolhido em screen-modo (única autoridade — sem toggle duplicado em Ajustes, mesmo padrão do app principal) — controla a trilha Íris em áudio
  plano: null, // "basico" (com anúncio entre telas) | "premium" (sem anúncio)
  pendingAdCallback: null,
  adInterval: null,
  tocandoTrilhaIris: false, // true enquanto a trilha de continuação da Íris está tocando na parada atual
  // Build 2026-08-28 (Auditoria 05, achado alto A-01): identidade do ponto exibido agora — usado
  // pra guarda de race condition no fetch do storyboard (ver tocarTrilhaIrisSeAplicavel). Antes a
  // guarda comparava só `tocandoTrilhaIris === false`, um booleano global: se o visitante avançasse
  // de parada enquanto o fetch da parada ANTERIOR ainda estivesse em voo (plausível com sinal
  // instável), a checagem passava mesmo assim (a nova parada também religa a mesma flag), e o
  // storyboard antigo sobrescrevia foto/timing da parada errada. app.js já resolvia isso comparando
  // identidade (`state.vistaTipoAtual`) — mesmo princípio aqui.
  pontoAtualTipo: null,
  // Build 2026-08-28 (Auditoria 05, achado alto A-06): posição salva ao trocar de idioma no meio
  // da trilha, pra retomar dali em vez de reiniciar do Ponto 1 — ver voltarParaIdioma()/irParaTrilha().
  posicaoAoTrocarIdioma: null,
};

function $(sel) { return document.querySelector(sel); }

// ---------- Varredura automática (auto-sweep) — mesmo motor de app.js (calcularVarredura/
// aplicarVarredura, Core Principle 10 do agente @foco), com um modo novo: "rtl" (direita→esquerda),
// pedido do CEO pra Pista — a moldura de exibição é quadrada (.vista-media, aspect-ratio:1/1) mas
// as fotos-fonte são retangulares, então toda vista com sweep varre da direita pra esquerda aqui
// (diferente do "ltr" default do app principal). Não normaliza velocidade (shots curtos percorrem
// menos distância, nunca aceleram), faixa segura 15%-85% (pan) ou 40%-60% (micro), piso de duração
// 3,5s, ease-in-out com hold no início/fim, sincronizado com play/pause do áudio.
const AR_VELOCIDADE_PCT_S = 8;
const AR_HOLD_INICIO_S = 0.4;
const AR_HOLD_FIM_S = 0.25;
const AR_PISO_DURACAO_S = 3.5;
const AR_FAIXAS = { pan: [15, 85], micro: [40, 60] };

function arReducedMotionAtivo() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function calcularVarredura(pan, duracaoSegundos, velocidadePctS = AR_VELOCIDADE_PCT_S) {
  if (!pan || pan === "none" || duracaoSegundos < AR_PISO_DURACAO_S) return null;
  const faixa = pan === "micro" ? AR_FAIXAS.micro : AR_FAIXAS.pan;
  const eixo = pan === "ttb" ? "y" : "x";
  const invertido = pan === "rtl"; // direita→esquerda — default deste produto (ver comentário acima)
  const tempoDisponivel = Math.max(duracaoSegundos - AR_HOLD_INICIO_S - AR_HOLD_FIM_S, 0);
  if (tempoDisponivel <= 0) return null;
  const distanciaMax = faixa[1] - faixa[0];
  const distancia = Math.min(velocidadePctS * tempoDisponivel, distanciaMax);
  const tempoPan = distancia / velocidadePctS;
  const fracaoIni = Math.min(AR_HOLD_INICIO_S / duracaoSegundos, 1);
  const fracaoFim = Math.min(fracaoIni + tempoPan / duracaoSegundos, 1);
  const de = invertido ? faixa[1] : faixa[0];
  const para = invertido ? faixa[1] - distancia : faixa[0] + distancia;
  return { eixo, de, para, fracaoIni, fracaoFim };
}

let arCurrentAnimation = null;
// Build 2026-08-28 (pedido do CEO): velocidadePctS opcional — 4º parâmetro, default
// AR_VELOCIDADE_PCT_S (mantém todo chamador existente sem mudança de comportamento). Usado pela
// varredura turística pra rodar na metade da velocidade padrão sem afetar a da Íris, que continua
// no motor original (ambas compartilham o mesmo calcularVarredura/AR_FAIXAS).
function aplicarVarredura(fotoEl, pan, duracaoSegundos, velocidadePctS = AR_VELOCIDADE_PCT_S) {
  if (arCurrentAnimation) { arCurrentAnimation.cancel(); arCurrentAnimation = null; }
  const calc = arReducedMotionAtivo() ? null : calcularVarredura(pan, duracaoSegundos, velocidadePctS);
  if (!calc) { fotoEl.style.objectPosition = "50% 50%"; return; }
  const outro = "50%";
  const posIni = calc.eixo === "x" ? `${calc.de}% ${outro}` : `${outro} ${calc.de}%`;
  const posFim = calc.eixo === "x" ? `${calc.para}% ${outro}` : `${outro} ${calc.para}%`;
  const keyframes = [
    { objectPosition: posIni, offset: 0 },
    { objectPosition: posIni, offset: calc.fracaoIni },
    { objectPosition: posFim, offset: calc.fracaoFim },
    { objectPosition: posFim, offset: 1 },
  ];
  arCurrentAnimation = fotoEl.animate(keyframes, { duration: duracaoSegundos * 1000, easing: "ease-in-out", fill: "forwards" });
  if (audioElAtivo && audioElAtivo.paused) arCurrentAnimation.pause();
}

// Build 2026-08-29 (pedido do CEO): varredura CONTÍNUA em vaivém — esquerda→direita, depois volta
// pra esquerda, e segue assim indefinidamente. Substitui a varredura única de antes (ancorada na
// duração de UM áudio específico) nas telas de foto estática fora da trilha da Íris: apresentação,
// e a narração turística + camada de segurança de cada parada (antes esta última ficava sem nenhuma
// varredura — a foto congelava durante o aviso de segurança). Só termina quando a tela muda (todo
// render*() já chama pararStoryboardAR() no início, ou tocarIris()/aplicarVarredura/
// renderArStoryboardLoop cancelam arCurrentAnimation ao assumir) ou quando a audiodescrição da Íris
// começa de fato (tocarIris() cancela explicitamente antes de tocar). "Imagens paradas" só — não se
// aplica ao carrossel do convite (fotos diferentes a cada troca, ver renderPistaCarousel) nem à
// varredura por shots do storyboard da Íris (já dirigida por marco citado, própria lógica).
function iniciarVarreduraContinua(fotoEl) {
  if (arCurrentAnimation) { arCurrentAnimation.cancel(); arCurrentAnimation = null; }
  if (arReducedMotionAtivo()) { fotoEl.style.objectPosition = "50% 50%"; return; }
  const faixa = AR_FAIXAS.pan;
  const distancia = faixa[1] - faixa[0];
  // Mesmo ritmo já calibrado pro CEO pra varredura turística (metade de AR_VELOCIDADE_PCT_S) — só
  // que agora sem fim, em vez de ancorada numa duração de áudio específica.
  const duracaoLegSegundos = distancia / (AR_VELOCIDADE_PCT_S / 2);
  const keyframes = [
    { objectPosition: `${faixa[0]}% 50%` },
    { objectPosition: `${faixa[1]}% 50%` },
  ];
  arCurrentAnimation = fotoEl.animate(keyframes, {
    duration: duracaoLegSegundos * 1000,
    easing: "ease-in-out",
    iterations: Infinity,
    direction: "alternate", // esquerda→direita, depois direita→esquerda, repetindo pra sempre
  });
}

let audioElAtivo = null;
function attachArPauseSync(audioEl) {
  audioElAtivo = audioEl;
  if (audioEl.dataset.arSyncAttached) return;
  audioEl.dataset.arSyncAttached = "1";
  audioEl.addEventListener("pause", () => { if (arCurrentAnimation) arCurrentAnimation.pause(); });
  audioEl.addEventListener("play", () => { if (arCurrentAnimation) arCurrentAnimation.play(); });
}

// Storyboard AR por ponto (recortes sincronizados com a trilha da Íris) — carregado sob demanda de
// assets/data/pista_storyboards/pista_pN_iris_storyboard.json quando existir (ver @foco). Enquanto
// não existir pra um ponto, cai no fallback: varredura única "rtl" na foto inteira já exibida.
const arStoryboardCache = {};
function carregarStoryboardIris(tipo) {
  if (arStoryboardCache[tipo] !== undefined) return Promise.resolve(arStoryboardCache[tipo]);
  // Build 2026-08-29 (Auditoria 8, achado alto de @streaming-infra-architect): faltava o mesmo
  // "?v=DATA_VERSION" que captions.json/i18n.json já têm — sem isso, `cache:"no-store"` não
  // adianta nada, porque o service worker intercepta o fetch ANTES da negociação HTTP e devolve
  // cache-first pra qualquer coisa sob /assets/ (ver sw.js), ignorando a opção do request. Um
  // storyboard atualizado (ex. @foco recalibrando um recorte) ficava preso na versão antiga pra
  // qualquer visitante que já tivesse aberto aquela parada antes — mesma classe de bug já corrigida
  // 2x nesta sessão, só que num arquivo de dados que passa batido do checklist "é JS/CSS/áudio?".
  return fetch(`assets/data/pista_storyboards/${tipo}_iris_storyboard.json?v=${DATA_VERSION}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((json) => { arStoryboardCache[tipo] = json; return json; })
    .catch(() => { arStoryboardCache[tipo] = null; return null; });
}

let arStoryboardTimer = null;
function renderArStoryboardLoop(storyboard, audioEl, fotoEl, imgBaseDir) {
  if (arStoryboardTimer) clearInterval(arStoryboardTimer);
  attachArPauseSync(audioEl);
  const shots = storyboard.shots;
  let currentIdx = null;
  const aplicarShot = (shot) => {
    const duracao = Math.max(shot.end - shot.start, 0.1);
    const novoSrc = `${imgBaseDir}/${shot.file}`;
    if (fotoEl.getAttribute("data-shot-file") !== novoSrc) {
      fotoEl.setAttribute("data-shot-file", novoSrc);
      const aoCarregar = () => aplicarVarredura(fotoEl, shot.pan, duracao);
      fotoEl.onload = aoCarregar;
      fotoEl.src = novoSrc;
      if (fotoEl.complete) aoCarregar();
    } else {
      aplicarVarredura(fotoEl, shot.pan, duracao);
    }
  };
  const applyShot = () => {
    const tAtual = audioEl.currentTime;
    let idx = shots.findIndex((s) => tAtual >= s.start && tAtual < s.end);
    if (idx === -1) idx = shots.length - 1;
    if (idx === currentIdx) return;
    currentIdx = idx;
    aplicarShot(shots[idx]);
  };
  applyShot();
  arStoryboardTimer = setInterval(applyShot, 200);
}
function pararStoryboardAR() {
  if (arStoryboardTimer) { clearInterval(arStoryboardTimer); arStoryboardTimer = null; }
  if (arCurrentAnimation) { arCurrentAnimation.cancel(); arCurrentAnimation = null; }
  // Ver iniciarCarouselPontoBonus() — mesmo ponto único de "parar todo efeito visual ambiente da
  // foto", pra ficar automaticamente coberto onde quer que pararStoryboardAR() já seja chamado
  // (troca de tela, início da Íris em tocarIris(), etc.), sem precisar duplicar chamadas.
  if (pontoBonusCarouselTimer) { clearInterval(pontoBonusCarouselTimer); pontoBonusCarouselTimer = null; }
}

// Build 2026-08-29 (Auditoria 8, achado de @advogado-do-diabo): a varredura contínua (vaivém
// esquerda-direita) rodava também durante os trechos críticos de segurança/aviso (mesma lista de
// TRECHOS_AUDIO_CRITICOS usada em tapNaFotoSeguro) — a foto ficava se mexendo bem no momento em
// que o produto está tentando comunicar um alerta físico real. Pausa (não cancela) no início desses
// trechos e retoma no fim — congela no frame atual, sem perder o estado da animação; nos pontos
// P1-P9/P10 isso já é irrelevante segundos depois de qualquer forma (tocarIris() cancela a
// animação por completo ao assumir), mas cobre o intervalo real em que o aviso está tocando.
function pausarVarreduraCritica() { if (arCurrentAnimation) arCurrentAnimation.pause(); }
function retomarVarreduraCritica() { if (arCurrentAnimation) arCurrentAnimation.play(); }

// Ver comentário de PISTA_P10_CAROUSEL_FOTOS/MS acima — 2 fotos fixas, mesmo padrão de índice
// circular de renderPistaCarousel(), mas com timer próprio (não interfere no carrossel do convite).
// Build 2026-08-29 (pedido do CEO): varredura contínua em vaivém somada ao carrossel — antes cada
// foto ficava estática (object-fit:cover cortando as bordas), agora desliza da esquerda pra direita
// e volta, cobrindo a imagem inteira. iniciarVarreduraContinua() é chamada UMA vez, fora de
// aplicarFoto(): a animação (Web Animations API, alvo é objectPosition do <img>, não o `src`)
// continua tocando ininterrupta por cima da troca de foto a cada ciclo, sem reiniciar o vaivém
// no meio do percurso. Isso também tira o Ponto 10 da exceção antiga documentada em
// AUDIO_P10_AVISO_LANGS_PRONTOS (arCurrentAnimation deixa de ficar sempre null aqui) — ver
// pausarVarreduraCritica()/retomarVarreduraCritica() agora chamadas em renderPontoBonus() também.
let pontoBonusCarouselTimer = null;
function iniciarCarouselPontoBonus(fotoEl) {
  if (pontoBonusCarouselTimer) clearInterval(pontoBonusCarouselTimer);
  let idx = 0;
  const aplicarFoto = () => {
    fotoEl.src = PISTA_P10_CAROUSEL_FOTOS[idx];
    idx = (idx + 1) % PISTA_P10_CAROUSEL_FOTOS.length;
  };
  aplicarFoto(); // mostra a foto original de imediato, sem esperar o primeiro ciclo do timer
  pontoBonusCarouselTimer = setInterval(aplicarFoto, PISTA_P10_CAROUSEL_MS);
  iniciarVarreduraContinua(fotoEl);
}

// Build 2026-08-29 (pedido do CEO): intervalo de 2s na transição entre telas, exceto as telas de
// parada — screen-percurso é a MESMA tela reaproveitada pra todos os pontos (P1...P10, bônus,
// convite; ver renderPonto/renderPontoBonus/renderConvite) e screen-anuncio é o interstício de 5s
// entre paradas do plano Básico (já tem timer próprio, não ganha +2s por cima). Ali a imediatidade
// importa mais — é uso real, andando na trilha física. Nas telas de configuração (idioma → modo →
// plano → pagamento → apresentação) o intervalo dá tempo do áudio da tela anterior encerrar de
// forma limpa antes do próximo começar, sem sobreposição. A troca da PRIMEIRA tela (carregamento
// inicial, state.currentScreen ainda vazio) também é sempre imediata.
// Build 2026-08-29 (Auditoria 8, achado de @advogado-do-diabo): screen-capa também isenta —
// diferente das outras telas de configuração, ela não tem NENHUM áudio (nem loop nem instrução),
// então a justificativa do intervalo ("dar tempo do áudio anterior encerrar sem sobrepor") não se
// aplica — era só atrito morto (2s de tela parada) antes mesmo de chegar na escolha de idioma.
const TELAS_SEM_ATRASO_NA_TRANSICAO = new Set(["screen-percurso", "screen-anuncio", "screen-capa"]);
const INTERVALO_TROCA_TELA_MS = 2000;
// Guarda a troca ainda pendente (agendada pelos 2s) — se outra ação disparar um novo showScreen()
// antes dela executar (ex.: usuário toca "Voltar" durante o intervalo), cancela a pendente em vez
// de deixar as duas trocarem de tela em sequência (flash da tela errada por uma fração de segundo).
let telaPendenteTimeout = null;

// depoisDeTrocar: callback opcional executado só DEPOIS da troca de tela de fato acontecer (e do
// atraso, quando houver) — necessário para telas que disparam áudio/render próprio ao entrar nelas
// (ex.: escolherModoPCD/renderApresentacao), pra não tocar áudio 2s antes da tela aparecer.
function showScreen(id, depoisDeTrocar) {
  if (telaPendenteTimeout) { clearTimeout(telaPendenteTimeout); telaPendenteTimeout = null; }

  const anterior = state.currentScreen;
  const semAtraso = !anterior
    || TELAS_SEM_ATRASO_NA_TRANSICAO.has(anterior)
    || TELAS_SEM_ATRASO_NA_TRANSICAO.has(id);

  const trocar = () => {
    telaPendenteTimeout = null;
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $("#" + id).classList.add("active");
    const scrollArea = $("#app-screens");
    if (scrollArea) scrollArea.scrollTop = 0; else window.scrollTo(0, 0);
    state.currentScreen = id;
    atualizarLoopMultilingue(id);
    // Build 2026-08-29 (Auditoria 8, achado de @advogado-do-diabo): "Voltar" não faz nada em
    // screen-capa/screen-lang (não tem pra onde ir, ver fallback final de voltarGlobal()) — antes
    // ficava com a MESMA aparência ativa de qualquer outro botão, sem nenhuma pista visual de que
    // ali ele é inerte. Opacidade reduzida + sem cursor de "clicável", sem esconder (o rodapé
    // inteiro continua visível/consistente) nem desabilitar de verdade (tocar nele não quebra nada,
    // só não faz nada — comportamento inalterado, só a sinalização visual é nova).
    $("#btn-voltar-global").classList.toggle("footer-btn-inerte", id === "screen-capa" || id === "screen-lang");
    // Build 2026-08-29 (pedido do CEO): mesma sinalização visual em screen-plano — "Seguir" ali não
    // é uma opção disponível (a decisão exige tocar no cartão Básico ou Premium), mas antes parecia
    // tão clicável quanto qualquer outro botão do rodapé.
    $("#btn-seguir-global").classList.toggle("footer-btn-inerte", id === "screen-plano");
    if (depoisDeTrocar) depoisDeTrocar();
  };

  if (semAtraso) {
    trocar();
    return;
  }
  // Corta o áudio de instrução da tela atual imediatamente ao iniciar a transição — evita que ele
  // continue tocando durante os 2s de intervalo até a próxima tela aparecer.
  const loopEl = $("#loop-multilang-audio");
  if (loopEl) loopEl.pause();
  telaPendenteTimeout = setTimeout(trocar, INTERVALO_TROCA_TELA_MS);
}

// ---------- Áudio de instrução nas telas de configuração (pedido do CEO 2026-08-28, lógica
// revista no mesmo dia) ----------
// screen-lang é a ÚNICA que mantém o loop nas 14 línguas — ninguém escolheu idioma ainda ao
// chegar nela, então precisa anunciar em todas. Substitui o título "Escolha seu idioma" (removido
// do HTML, só sr-only agora). As outras 3 (screen-modo/plano/pagamento) já têm idioma escolhido —
// tocam a frase de instrução UMA VEZ, só no idioma selecionado (arquivo por idioma, mesmo padrão
// de sufixo de AUDIO_KEY), sem loop. Trocar de tela sempre interrompe o áudio da tela anterior —
// reatribuir .src já corta a reprodução em andamento, não precisa de lógica extra pra isso.
// Build 2026-08-29 (Auditoria 8, achado crítico de @bussola + @localization-lead): screen-final
// não tinha NENHUM áudio — era a única tela de decisão do produto sem instrução automática nem
// hover-voice. Mesmo padrão das outras 3 acima (arquivo loop_final_<idioma>.mp3, toca uma vez, sem
// loop de verdade); os 2 cards também ganharam data-voice (ver pista.html/attachHoverVoice).
const AUDIO_LOOP_TELA = {
  "screen-modo": "loop_modo",
  "screen-plano": "loop_plano",
  "screen-pagamento": "loop_pagamento",
  "screen-final": "loop_final",
};

function atualizarLoopMultilingue(id) {
  const loopEl = $("#loop-multilang-audio");
  if (!loopEl) return;

  if (id === "screen-lang") {
    loopEl.loop = true;
    loopEl.src = "assets/audio/ui/loop_idioma_todos.mp3";
    const tentarTocar = () => {
      const p = loopEl.play();
      if (p && p.catch) p.catch(() => {});
    };
    tentarTocar();
    // Build 2026-08-29 (pedido do CEO): confirma que o loop realmente começou — alguns navegadores
    // atrasam ou bloqueiam o play() inicial silenciosamente. Depois de 100ms, só tenta de novo SE
    // ainda estiver pausado (não começou de verdade); se já está tocando, não faz nada — não
    // sobrepõe duas instâncias do mesmo áudio, é sempre o mesmo <audio>, uma faixa por vez.
    setTimeout(() => { if (loopEl.paused) tentarTocar(); }, 100);
    return;
  }

  const arquivo = AUDIO_LOOP_TELA[id];
  if (!arquivo) {
    loopEl.pause();
    loopEl.removeAttribute("src");
    loopEl.loop = false;
    return;
  }
  loopEl.loop = false;
  loopEl.src = `assets/audio/ui/${arquivo}_${langForAudio()}.mp3`;
  const playPromise = loopEl.play();
  // Autoplay bloqueado até 1º toque na página é comportamento normal de navegador — sem erro
  // nenhum a tratar aqui, mesmo padrão silencioso já usado no resto do produto.
  if (playPromise && playPromise.catch) playPromise.catch(() => {});
}

// Build 2026-08-29 (pedido do CEO): "garantir com toda certeza" que o loop toca ao carregar a
// tela das bandeiras — no celular, sem NENHUM toque prévio na página, o navegador bloqueia
// play()/áudio com som de forma silenciosa (retry de 100ms em atualizarLoopMultilingue não resolve
// isso: se a política de autoplay bloqueou, ela bloqueia de novo). A saída real é iniciar o play()
// dentro do handler do PRIMEIRO gesto do usuário na página (toque em qualquer lugar, não precisa
// ser num botão específico) — é o único play() que a política do navegador aceita sem exceção.
// Roda em capture nos eventos mais cedo disponíveis (pointerdown antes de click) e some sozinho
// assim que confirmar que o loop está tocando de fato.
let loopIdiomaDestravado = false;
function tentarDestravarLoopIdioma() {
  if (loopIdiomaDestravado) return;
  const loopEl = $("#loop-multilang-audio");
  if (!loopEl || state.currentScreen !== "screen-lang") return;
  if (!loopEl.paused) { loopIdiomaDestravado = true; return; }
  const p = loopEl.play();
  if (p && p.then) p.then(() => { loopIdiomaDestravado = true; }).catch(() => {});
}
function registrarDestravamentoLoopIdioma() {
  ["pointerdown", "touchstart", "click", "keydown"].forEach((evt) => {
    document.addEventListener(evt, tentarDestravarLoopIdioma, { passive: true, capture: true });
  });
  // iOS/Android às vezes suspendem áudio ao minimizar/trocar de app — reforça ao voltar à aba.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tentarDestravarLoopIdioma();
  });
}

// ---------- Navegação com anúncio intersticial (plano Básico) — mesmo padrão de navigateTo/
// showAdThen em app.js, adaptado: aqui não existe pilha de telas (a trilha é linear), só decide se
// mostra o anúncio de 5s antes de executar a transição de fato. ----------
function irComAnuncio(fn) {
  if (state.plano === "basico") {
    showAdThen(fn);
  } else {
    fn();
  }
}

function showAdThen(callback) {
  pararNarracaoAtual();
  state.pendingAdCallback = callback;
  showScreen("screen-anuncio");
  let seconds = 5;
  const timerEl = $("#anuncio-timer");
  timerEl.textContent = seconds;
  clearInterval(state.adInterval);
  state.adInterval = setInterval(() => {
    seconds--;
    timerEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(state.adInterval);
      state.adInterval = null;
      const cb = state.pendingAdCallback;
      state.pendingAdCallback = null;
      if (cb) cb();
    }
  }, 1000);
}

function buildLanguageGrid() {
  const grid = $("#lang-grid");
  grid.innerHTML = "";
  LANGS.forEach((l) => {
    // Build 2026-08-28 (Auditoria 05, achado crítico C-09): <button> real em vez de <div>+onclick —
    // sem isso, os 14 cartões de idioma (primeira tela que 100% dos usuários encontram) ficavam fora
    // da ordem de tabulação e sem semântica pra teclado/leitor de tela. FLAG_SVG[l.code] continua indo
    // por innerHTML porque é constante estática do próprio código-fonte (não dado de runtime — não é
    // o mesmo vetor do achado C-11 em app.js).
    const card = document.createElement("button");
    card.type = "button";
    card.className = "lang-card";
    card.innerHTML = `<span class="flag">${FLAG_SVG[l.code]}</span><span class="name">${l.name}</span>`;
    card.onclick = () => selectLanguage(l);
    grid.appendChild(card);
  });
}

async function loadCaptions() {
  if (state.captions) return;
  const res = await fetch(`assets/data/captions.json?v=${DATA_VERSION}`);
  state.captions = await res.json();
}

// ---------- i18n da interface (chrome fixo: telas, botões, avisos) — mesmo arquivo compartilhado
// do app principal (assets/data/i18n.json), reaproveitando as chaves que já existem lá (modo/plano/
// anúncio/pagamento/confirmação de saída são idênticos) + um punhado de chaves novas só da Pista
// (prefixo "pista_"/"footer_seguir"). AUDIO_KEY já é exatamente o i18nKey usado no app principal
// (mesma tabela pt-br→pt, en-us→en etc.), não precisa de mapeamento separado. ----------
async function loadI18n() {
  if (state.i18n) return;
  const res = await fetch(`assets/data/i18n.json?v=${DATA_VERSION}`);
  state.i18n = await res.json();
}

function t(key) {
  const i18nKey = state.lang ? AUDIO_KEY[state.lang.code] : "pt";
  return (state.i18n && state.i18n[i18nKey] && state.i18n[i18nKey][key])
    || (state.i18n && state.i18n.pt && state.i18n.pt[key])
    || key;
}

// Build 2026-08-29 (achado do CEO — "inscrições em branco ao centro da imagem" não traduzidas):
// ponto.nome era usado direto (só português, fixo) como legenda visível sobre a foto de cada
// parada — em qualquer outro idioma, o visitante via o nome em português mesmo com o resto da
// tela já traduzida. Revisado nos 14 idiomas pelos 13 agentes de locução (ver PENDENCIAS.md) —
// chave <tipo>_nome em i18n.json, com fallback pro nome em português (campo ponto.nome) se a
// chave ainda não existir pra um ponto novo que não tenha passado por essa revisão.
function nomeDoPonto(ponto) {
  const traduzido = t(`${ponto.tipo}_nome`);
  return traduzido === `${ponto.tipo}_nome` ? ponto.nome : traduzido;
}

function applyLanguagePista(l) {
  const i18nKey = AUDIO_KEY[l.code];
  if (!state.i18n || !state.i18n[i18nKey]) return;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const txt = state.i18n[i18nKey][key];
    if (txt) el.textContent = txt;
  });
  // Build 2026-08-29 (Auditoria 8, achado de @localization-lead): o `alt` da imagem do cabeçalho
  // (fora de #app-screens, visível em toda tela) ficava fixo em português/inglês-de-marca nos 14
  // idiomas — quem usa leitor de tela em árabe/japonês/russo/mandarim ouvia sempre a mesma frase
  // que não entende. `alt` não é `textContent`, então fica fora do loop `[data-i18n]` acima.
  const cabecalhoImg = $("#topbar-pista .topbar-pista-img");
  const altTraduzido = state.i18n[i18nKey].pista_cabecalho_alt;
  if (cabecalhoImg && altTraduzido) cabecalhoImg.alt = altTraduzido;
}

// ---------- Locução de voz pré-gravada ao passar o cursor sobre cartões/botões de decisão (modo,
// plano, pagamento, rodapé) — mesmo padrão de playUiVoice/attachHoverVoice em app.js. Reaproveita os
// MESMOS arquivos de áudio já gravados pro app principal (assets/audio/ui/<key>_<audioKey>.mp3) —
// telas de modo/plano/pagamento são idênticas nos dois produtos, mesmo texto/i18n key, sem precisar
// gravar nada de novo pra esses 7 botões. Único item novo é "footer_seguir" (a Pista usa "Seguir" em
// vez de "Home" no rodapé). Sempre ativa — a Pista não tem tela de Ajustes com o toggle que o app
// principal tem, então não há como desligar (mesmo comportamento padrão "ativada por padrão" de lá). ----------
function playUiVoice(key) {
  if (!state.lang) return;
  const el = $("#ui-voice-audio");
  if (!el) return;
  el.pause();
  el.src = `assets/audio/ui/${key}_${langForAudio()}.mp3`;
  el.currentTime = 0;
  el.play().catch(() => {});
}

function attachHoverVoice() {
  document.querySelectorAll("[data-voice]").forEach((el) => {
    el.addEventListener("mouseenter", () => playUiVoice(el.getAttribute("data-voice")));
  });
}

// Achado de auditoria 26/08: sem try/catch, uma falha de rede (sinal fraco na trilha, o cenário mais
// provável de uso real) deixava a exceção subir sem tratamento — o visitante tocava no idioma e nada
// acontecia, sem nenhuma mensagem. Agora mostra aviso + botão de tentar de novo em vez de travar.
async function selectLanguage(l) {
  state.lang = l;
  document.documentElement.setAttribute("dir", l.dir || "ltr");
  document.documentElement.setAttribute("lang", l.code);
  const notice = $("#lang-notice");
  notice.style.display = "none";
  try {
    await loadI18n();
    applyLanguagePista(l);
    await loadCaptions();
    // Achado de auditoria 26/08: o modo PCD só tem a trilha da Íris em pt-BR — sem este aviso, quem
    // escolhe PCD num idioma sem essa camada só percebia a ausência no silêncio ao fim da narração
    // turística, sem nenhum sinal do porquê. Mostra a ressalva já na tela de escolha do modo.
    $("#modo-pcd-notice").style.display = AUDIO_IRIS_LANGS_PRONTOS.has(l.code) ? "none" : "block";
  } catch (err) {
    notice.innerHTML = "";
    const [msgTexto, retryTexto] = NETWORK_ERROR_MSG[l.code] || NETWORK_ERROR_MSG["pt-br"];
    const msg = document.createElement("span");
    msg.textContent = msgTexto + " ";
    const retry = document.createElement("button");
    retry.className = "btn small";
    retry.style.marginTop = "8px";
    retry.textContent = retryTexto;
    retry.onclick = () => selectLanguage(l);
    notice.appendChild(msg);
    notice.appendChild(document.createElement("br"));
    notice.appendChild(retry);
    notice.style.display = "block";
    return;
  }
  showScreen("screen-modo");
}

// ---------- Tela de escolha do tipo de narração (Narração Turística × Audiodescrição PCD) ----------
// Build 2026-08-28 (pedido do CEO): a tela de apresentação da trilha agora toca logo após a escolha
// do modo, ANTES da escolha de plano — mas só no caminho PCD (card de baixo). No caminho Turística
// (card de cima) ela some por completo: segue direto pra escolha de plano, sem passar pela
// apresentação em nenhum ponto do fluxo. Mudança puramente de ordem/visibilidade de navegação
// (nenhum áudio/texto/tradução foi tocado; vale para os 14 idiomas automaticamente).
function escolherModoTuristica() {
  state.pcdProfile = false;
  irParaEscolhaDePlano();
}
function escolherModoPCD() {
  state.pcdProfile = true;
  // Build 2026-09-02 (pedido do CEO): o caminho PCD deixa de passar pela tela de apresentacao
  // (foto com varredura + narracao de chegada/seguranca/cortesia) — vai direto para a escolha de
  // plano, igual ao caminho Turistica. screen-apresentacao/renderApresentacao ficam sem uso.
  irParaEscolhaDePlano();
}

// Build 2026-08-29 (Auditoria 8, achado do CEO): se o visitante já escolheu um plano nesta MESMA
// sessão (ex.: pagou o Premium, depois trocou de idioma no meio da trilha), não deve ser levado de
// volta pra tela de plano/pagamento — `state.plano` só volta a `null` recarregando a página do
// zero (Sair fecha a aba/leva pra encerrado.html), nunca durante a navegação normal. Quem já é
// Premium segue direto pra trilha sem anúncio (irComAnuncio só mostra anúncio se
// `state.plano === "basico"`); quem é Básico continua vendo o anúncio normalmente a cada troca de
// tela, exatamente como já acontecia — só a TELA DE ESCOLHA em si que passa a ser pulada.
function irParaEscolhaDePlano() {
  if (state.plano) { irParaTrilha(); return; }
  showScreen("screen-plano");
}

// ---------- Tela de escolha de plano (Básico com anúncio / Premium com pagamento simulado) ----------
// A apresentação já tocou (ver acima) — daqui em diante só falta entrar na trilha, com ou sem anúncio.
function escolherPlanoBasico() {
  state.plano = "basico";
  irParaTrilha();
}
function escolherPlanoPremium() {
  showScreen("screen-pagamento");
}
function confirmarPagamento() {
  const status = $("#pagamento-status");
  status.style.display = "block";
  status.textContent = t("pagamento_processando");
  setTimeout(() => {
    state.plano = "premium";
    status.style.display = "none";
    irParaTrilha();
  }, 900);
}

function setMediaCaption(texto) {
  const box = $("#vista-media-caption");
  if (texto) {
    // Build 2026-08-28 (Auditoria 05, achado A-04): mesma classe de furo do C-11 em app.js — antes
    // montava por innerHTML com `texto`/`t(...)` interpolado sem escaping. Hoje os 3 call-sites só
    // passam null (código morto), mas ficava pronto pra reintroduzir o vetor assim que reativado —
    // corrigido preventivamente com DOM real antes de qualquer reativação.
    const tag = document.createElement("span");
    tag.className = "caption-tag";
    tag.textContent = t("pista_caption_tag_iris");
    box.replaceChildren(tag, document.createTextNode(texto));
    box.style.display = "block";
  } else {
    box.style.display = "none";
    box.replaceChildren();
  }
}

// Build 2026-08-29 (pedido do CEO): o rótulo central da foto (nome do ponto/mensagem de chegada)
// agora só fica visível nos primeiros 5s de cada exibição, com fade suave — chamar de novo a cada
// render (mesmo elemento reaparecendo) reinicia a contagem, então cancela o timer anterior antes.
let labelTemporarioTimer = null;
function mostrarLabelTemporario(labelEl) {
  if (!labelEl) return;
  if (labelTemporarioTimer) clearTimeout(labelTemporarioTimer);
  labelEl.classList.remove("label-oculto");
  labelTemporarioTimer = setTimeout(() => { labelEl.classList.add("label-oculto"); }, 5000);
}

// Build 2026-09-02 (pedido do CEO): tarja vermelha translucida com "Audio de seguranca" (letra
// branca) na base da foto por 5s, sempre que uma narracao de seguranca/aviso comeca a tocar — nos
// DOIS modos (Turistica e PCD). Mesmo mecanismo do rotulo do nome do lugar, so muda a cor/texto.
let tarjaSegurancaTimer = null;
function mostrarTarjaSeguranca() {
  const el = document.getElementById("tarja-seguranca");
  if (!el) return;
  el.textContent = t("pista_tarja_seguranca");
  if (tarjaSegurancaTimer) clearTimeout(tarjaSegurancaTimer);
  el.classList.remove("tarja-oculta");
  tarjaSegurancaTimer = setTimeout(() => { el.classList.add("tarja-oculta"); }, 5000);
}
function esconderTarjaSeguranca() {
  const el = document.getElementById("tarja-seguranca");
  if (el) el.classList.add("tarja-oculta");
  if (tarjaSegurancaTimer) { clearTimeout(tarjaSegurancaTimer); tarjaSegurancaTimer = null; }
}

// Toca a narracao de seguranca da parada (pista_pN_seguranca_<idioma>.mp3, ja gravada em 14
// idiomas para P1-P8 e P10; P9 e placa, sem camada). Mostra a tarja vermelha por 5s. Ao terminar,
// chama aoTerminar. So toca no modo PCD (ver segurancaProntaPara); encadeia para a Iris.
// Build 2026-09-03 (pedido do CEO): a varredura horizontal continua NAO pausa mais durante a
// camada de seguranca — a foto segue com o mesmo movimento da narracao turistica (antes ela
// congelava no frame, decisao de 29/08 do @advogado-do-diabo, agora revertida pelo CEO).
// O aviso de risco REAL do Ponto 10 (pista_p10_aviso) segue congelando, gate proprio la.
function tocarSegurancaDoPonto(ponto, audioEl, audioKey, aoTerminar) {
  const tocar = () => {
    audioEl.onended = null;
    audioEl.src = `assets/audio/${ponto.tipo}_seguranca_${audioKey}.mp3`;
    mostrarTarjaSeguranca();
    const p = audioEl.play();
    if (p && p.catch) p.catch(() => { $("#player-playpause").classList.add("autoplay-blocked"); });
    $("#player-mini").setAttribute("aria-label", `${nomeDoPonto(ponto)} — ${t("pista_seguranca_iris_label")}`);
    renderCaptionLoop(`${ponto.tipo}_seguranca`, audioKey, audioEl);
    audioEl.onended = () => { aoTerminar(); };
  };
  // O rótulo falado "Narração de segurança." só existe no modo PCD (a Narração Turística pura não
  // ganha rótulo nenhum, regra do CEO). Em Turística a sinalização é a tarja vermelha visual.
  if (state.pcdProfile) tocarComRotuloDeFaixa("seguranca", audioEl, tocar);
  else tocar();
}

let captionTimer = null;
// Generalizado (mesma assinatura de renderCaptionLoop em app.js, + boxId porque este produto tem
// duas caixas de legenda em telas diferentes — #apresentacao-caption-box e #caption-box — enquanto
// app.js só tem uma). boxId default cobre o caso mais comum (screen-percurso/convite).
function renderCaptionLoop(tipo, lang, audioEl, boxId) {
  if (captionTimer) clearInterval(captionTimer);
  const segs = state.captions[tipo] && state.captions[tipo][lang] && state.captions[tipo][lang].segments;
  if (!segs) return;
  const box = $("#" + (boxId || "caption-box"));
  captionTimer = setInterval(() => {
    const tAtual = audioEl.currentTime;
    const seg = segs.find((s) => tAtual >= s.start && tAtual <= s.end);
    box.textContent = seg ? seg.text : "…";
  }, 200);
}

// Build 2026-08-28 (Auditoria 05, achado alto A-05): sem isso, uma falha de rede no meio do
// carregamento/playback de um áudio (esperada em trilha com sinal instável) deixava o player
// travado sem nenhum evento tratado — visualmente indistinguível de "travou" ou "terminou em
// silêncio". Reaproveita NETWORK_ERROR_MSG, já traduzido nos 14 idiomas (mesmo padrão já usado em
// selectLanguage()) — nenhuma tradução nova, nenhum áudio novo. Wireado uma única vez no
// DOMContentLoaded (não a cada render de parada) — mesma lição do achado A-03 (listener duplicado).
function wireAudioErrorRecovery(audioEl, noticeEl) {
  if (!noticeEl) return;
  let stalledTimer = null;
  const cancelarAviso = () => { clearTimeout(stalledTimer); stalledTimer = null; };
  const mostrarErro = () => {
    noticeEl.innerHTML = "";
    const [msgTexto, retryTexto] = NETWORK_ERROR_MSG[state.lang.code] || NETWORK_ERROR_MSG["pt-br"];
    const msg = document.createElement("span");
    msg.textContent = msgTexto + " ";
    const retry = document.createElement("button");
    retry.className = "btn small";
    retry.style.marginTop = "8px";
    retry.textContent = retryTexto;
    retry.onclick = () => {
      noticeEl.style.display = "none";
      audioEl.load();
      const p = audioEl.play();
      if (p && p.catch) p.catch(() => {});
    };
    noticeEl.appendChild(msg);
    noticeEl.appendChild(document.createElement("br"));
    noticeEl.appendChild(retry);
    noticeEl.style.display = "block";
  };
  audioEl.addEventListener("error", () => { cancelarAviso(); mostrarErro(); });
  // "stalled" isolado costuma ser uma soluço momentânea que se resolve sozinho — só avisa se não
  // recuperar (nem "playing" nem "progress") em 8s.
  audioEl.addEventListener("stalled", () => { cancelarAviso(); stalledTimer = setTimeout(mostrarErro, 8000); });
  audioEl.addEventListener("playing", cancelarAviso);
  audioEl.addEventListener("progress", cancelarAviso);
}

// ---------- Tocador de áudio compacto (substitui os controles nativos do <audio> — sem menu "⋮",
// metade da altura, mesma paleta do app) — só play/pause e barra de progresso clicável para buscar
// (seek). Uma chamada por par áudio/botão/barra, na carga da página; o <audio> troca de src depois
// à vontade, o tocador segue o elemento. ----------
function wireMiniPlayer(audioId, btnId, trackId, progressId) {
  const audioEl = $("#" + audioId);
  const btn = $("#" + btnId);
  const track = $("#" + trackId);
  const progress = $("#" + progressId);
  btn.onclick = () => { if (audioEl.paused) audioEl.play(); else audioEl.pause(); };
  track.onclick = (ev) => {
    if (!audioEl.duration) return;
    const rect = track.getBoundingClientRect();
    const razao = Math.min(Math.max((ev.clientX - rect.left) / rect.width, 0), 1);
    audioEl.currentTime = razao * audioEl.duration;
  };
  audioEl.addEventListener("play", () => { btn.textContent = "⏸"; btn.classList.remove("autoplay-blocked"); });
  audioEl.addEventListener("pause", () => { btn.textContent = "▶"; });
  audioEl.addEventListener("ended", () => { btn.textContent = "▶"; });
  audioEl.addEventListener("timeupdate", () => {
    if (!audioEl.duration) return;
    progress.style.width = `${(audioEl.currentTime / audioEl.duration) * 100}%`;
  });
}

// ---------- Tela de apresentação (peça de chegada, toca uma vez após escolher idioma/modo/plano) ----------
// Idiomas com a camada de segurança da TELA DE APRESENTAÇÃO (@bussola, achado A-02 — desambiguar
// "parede dos dois lados", quantificar a subida da entrada, avisar a troca de piso pra pedra
// portuguesa) já narrada — completo nos 14 idiomas (29/08, textos revisados por cada agente de
// locução conforme Diretriz 05 antes da geração de áudio).
const AUDIO_APRESENTACAO_SEGURANCA_LANGS_PRONTOS = new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "es-ar", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]);
// Build 2026-08-28 (Auditoria 6, achado C-07 redefinido pelo CEO): não é mais "aviso de segurança
// ausente" — virou uma cortesia exclusiva do modo PCD, prévia GERAL da trilha (não ponto a ponto),
// pra decidir se vale caminhar os 2.500m antes de se comprometer. Última da cadeia da apresentação,
// depois da segurança. Mesmo padrão incremental por idioma das outras camadas.
const AUDIO_APRESENTACAO_CORTESIA_LANGS_PRONTOS = new Set(["pt-br", "es-ar", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]);

// Build 2026-08-29 (pedido do CEO): rótulo curto de tipo de faixa ("Narração turística."/"Narração
// de segurança."/"Audiodescrição."/"Aviso de segurança."), tocado ANTES de cada uma das camadas que
// compõem a trilha sonora do modo PCD — em qualquer um dos 10 pontos + apresentação. A Narração
// Turística pura (modo não-PCD) NÃO ganha rótulo nenhum, pedido explícito do CEO — só o rótulo
// "turistica" é condicionado a state.pcdProfile nos pontos de chamada; os outros 3 só tocam mesmo
// dentro de trechos que já são exclusivos do modo PCD (segurança/Íris via tocarTrilhaIrisSeAplicavel),
// exceto o "aviso" do Ponto 10 — esse toca nos dois modos, igual o próprio aviso de risco real já
// tocava antes desta mudança (achado do CEO: o alerta de risco de morte não deve variar por modo).
const AUDIO_ROTULO_ARQUIVO = {
  turistica: "label_narracao_turistica",
  seguranca: "label_narracao_seguranca",
  audiodescricao: "label_audiodescricao",
  aviso: "label_aviso_seguranca",
};
const AUDIO_ROTULO_LANGS_PRONTOS = new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "es-ar", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]);
// `tocarConteudo` é sempre chamado no fim — se o idioma não tiver rótulo pronto, ou se o áudio do
// rótulo falhar/for bloqueado por autoplay, pula direto pro conteúdo real (nunca trava a narração
// por causa do rótulo).
function tocarComRotuloDeFaixa(tipoRotulo, audioEl, tocarConteudo) {
  if (!state.lang || !AUDIO_ROTULO_LANGS_PRONTOS.has(state.lang.code)) { tocarConteudo(); return; }
  const audioKey = langForAudio();
  audioEl.onended = null;
  audioEl.src = `assets/audio/ui/${AUDIO_ROTULO_ARQUIVO[tipoRotulo]}_${audioKey}.mp3`;
  const playPromise = audioEl.play();
  if (playPromise && playPromise.catch) playPromise.catch(() => { tocarConteudo(); });
  audioEl.onended = tocarConteudo;
}

function renderApresentacao() {
  const audioEl = $("#apresentacao-audio");
  const fotoEl = $("#apresentacao-foto");
  fotoEl.src = "assets/img/pista_coutinho/pista_apresentacao.jpg";
  fotoEl.alt = `${t("pista_foto_alt_prefixo")} — ${t("pista_entrada_alt_sufixo")}`;
  // Build 2026-08-29 (pedido do CEO): varredura contínua em vaivém — a apresentação não tem trilha
  // da Íris (vira cortesia, ver AUDIO_APRESENTACAO_CORTESIA_LANGS_PRONTOS), então aqui só termina
  // com a saída da tela (voltarGlobal/seguirGlobal já chamam pararNarracaoAtual → pararStoryboardAR).
  iniciarVarreduraContinua(fotoEl);
  mostrarLabelTemporario($("#apresentacao-label"));
  $("#apresentacao-caption-box").textContent = "…";
  audioEl.onended = null;
  if (AUDIO_LANGS_PRONTOS.has(state.lang.code)) {
    const audioKey = langForAudio();
    const tocarCortesia = () => {
      audioEl.onended = null;
      audioEl.src = `assets/audio/pista_apresentacao_cortesia_${audioKey}.mp3`;
      const p3 = audioEl.play();
      if (p3 && p3.catch) p3.catch(() => { $("#apresentacao-playpause").classList.add("autoplay-blocked"); });
      renderCaptionLoop("pista_apresentacao_cortesia", audioKey, audioEl, "apresentacao-caption-box");
      audioEl.onended = tocarDicaSeguirFoto; // fim de tudo — avisa que dá pra seguir
    };

    const tocarNarracaoChegada = () => {
      audioEl.onended = null;
      audioEl.src = `assets/audio/pista_apresentacao_${audioKey}.mp3`;
      const playPromise = audioEl.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => { $("#apresentacao-playpause").classList.add("autoplay-blocked"); });
      renderCaptionLoop("pista_apresentacao", audioKey, audioEl, "apresentacao-caption-box");

      // Modo PCD: camada de segurança física toca logo após a narração de chegada, antes de o
      // visitante seguir pra trilha — mesmo princípio "segurança antes de estética" usado nos 9
      // pontos. Encadeia pra cortesia depois, se estiver pronta nesse idioma.
      if (state.pcdProfile && AUDIO_APRESENTACAO_SEGURANCA_LANGS_PRONTOS.has(state.lang.code)) {
        audioEl.onended = () => {
          pausarVarreduraCritica();
          const tocarSegurancaChegada = () => {
            audioEl.onended = null;
            audioEl.src = `assets/audio/pista_apresentacao_seguranca_${audioKey}.mp3`;
            const p2 = audioEl.play();
            if (p2 && p2.catch) p2.catch(() => { $("#apresentacao-playpause").classList.add("autoplay-blocked"); });
            renderCaptionLoop("pista_apresentacao_seguranca", audioKey, audioEl, "apresentacao-caption-box");
            audioEl.onended = () => {
              retomarVarreduraCritica();
              (state.pcdProfile && AUDIO_APRESENTACAO_CORTESIA_LANGS_PRONTOS.has(state.lang.code) ? tocarCortesia : tocarDicaSeguirFoto)();
            };
          };
          // Build 2026-08-29 (pedido do CEO): rótulo "Narração de segurança." antes da camada de
          // segurança da apresentação — mesmo rótulo usado nos 10 pontos da trilha.
          tocarComRotuloDeFaixa("seguranca", audioEl, tocarSegurancaChegada);
        };
      } else if (state.pcdProfile && AUDIO_APRESENTACAO_CORTESIA_LANGS_PRONTOS.has(state.lang.code)) {
        // segurança da apresentação ainda não pronta nesse idioma, mas a cortesia já está — pula direto pra ela
        audioEl.onended = tocarCortesia;
      } else {
        // Narração turística (sem PCD) ou PCD sem nenhuma das duas camadas extras prontas nesse
        // idioma — a apresentação sozinha já é o fim da cadeia.
        audioEl.onended = tocarDicaSeguirFoto;
      }
    };
    // Build 2026-08-29 (pedido do CEO): rótulo "Narração turística." só no modo PCD — a Narração
    // Turística pura não ganha rótulo nenhum, mesma regra dos 10 pontos da trilha.
    if (state.pcdProfile) tocarComRotuloDeFaixa("turistica", audioEl, tocarNarracaoChegada); else tocarNarracaoChegada();
  } else {
    audioEl.removeAttribute("src");
    if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
    $("#apresentacao-caption-box").textContent = NOTICE_AUDIO_PENDENTE[state.lang.code] || "";
  }
}

function irParaTrilha() {
  if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
  $("#apresentacao-audio").pause();
  // Build 2026-08-28 (Auditoria 05, achado alto A-06): se havia uma posição salva de ANTES de
  // trocar de idioma (ver voltarParaIdioma), retoma dali; senão (primeira entrada na trilha) começa
  // do zero, como sempre.
  const retomar = state.posicaoAoTrocarIdioma;
  state.posicaoAoTrocarIdioma = null;
  if (retomar) {
    state.pontoIndex = retomar.pontoIndex;
    state.naPontoBonus = retomar.naPontoBonus;
    state.naConvite = retomar.naConvite;
  } else {
    state.pontoIndex = 0;
    state.naPontoBonus = false;
    state.naConvite = false;
  }
  irComAnuncio(() => {
    showScreen("screen-percurso");
    if (state.naConvite) renderConvite();
    else if (state.naPontoBonus) renderPontoBonus();
    else renderPonto();
  });
}

// Build 2026-08-27 (pedido do CEO): avanço automático, sem precisar tocar "Seguir" — só nos 2 elos
// pedidos, Parada 9 → Ponto 10 (bônus) → Convite. Os demais pontos (P1-P8 → próximo) continuam
// exigindo o toque no rodapé, de propósito — o visitante controla o próprio ritmo na exploração
// normal; só a virada pro bônus/surpresa e o fechamento pro convite são automáticos, como um
// encadeamento natural de "acabou de chegar ao fim". Chamado quando a narração INTEIRA de um ponto
// termina — só a turística, se não estiver em PCD ou o ponto não tiver Íris; turística+segurança+
// Íris completas, se estiver (ver tocarTrilhaIrisSeAplicavel/tocarIris logo abaixo).
function aoTerminarNarracaoDoPonto(ponto) {
  if (ponto === PISTA_PONTOS[PISTA_PONTOS.length - 1]) { irParaPontoBonus(); return; }
  if (ponto === PISTA_PONTO_BONUS) { irParaConvite(); return; }
  // Build 2026-08-29 (pedido do CEO): nos pontos que esperam o toque do visitante pra avançar
  // (todos exceto os 2 elos automáticos acima), avisa em áudio, no idioma já selecionado, que dá
  // pra seguir — sem isso, quem não vê a tela não tinha nenhum sinal de que a narração acabou.
  tocarDicaSeguirFoto();
}

// Dica curta "toque em Seguir ou na foto" — toca uma vez, no idioma já selecionado (não é loop
// multilíngue como as 4 telas de configuração: aqui o idioma já foi escolhido há muito tempo).
// Dispara ao final de QUALQUER narração que termine esperando o toque do visitante: apresentação da
// trilha (ver renderApresentacao) e as Paradas 1-8 (ver aoTerminarNarracaoDoPonto acima) — não toca
// na Parada 9 nem no Ponto 10, porque esses dois avançam sozinhos assim que a narração termina, sem
// nenhuma janela de espera em que a dica faria sentido.
function tocarDicaSeguirFoto() {
  const dicaEl = $("#dica-audio");
  if (!dicaEl) return;
  dicaEl.src = `assets/audio/ui/dica_seguir_foto_${langForAudio()}.mp3`;
  const playPromise = dicaEl.play();
  if (playPromise && playPromise.catch) playPromise.catch(() => {});
}

// ---------- Trilha de continuação da Íris (PCD) — toca ao final da narração turística de cada
// parada quando state.pcdProfile está ativo, mesmo padrão de tocarTrilhaIrisSeAplicavel em app.js,
// simplificado (sem storyboard/slideshow — a Pista não tem AR por enquanto, só a foto estática já
// exibida). Devolve true se trocou pra trilha da Íris (quem chamou não deve trocar de tela ainda). ----------
function tocarTrilhaIrisSeAplicavel(ponto) {
  if (!state.pcdProfile || state.tocandoTrilhaIris || !ponto || !ponto.temIris) return false;
  const audioKey = langForAudio();
  if (!AUDIO_IRIS_LANGS_PRONTOS.has(state.lang.code)) return false; // idioma ainda não localizado pra trilha Íris
  state.tocandoTrilhaIris = true;
  const audioEl = $("#player-audio");
  const fotoEl = $("#vista-media-photo");

  // Camada de segurança/orientação física (@bussola) toca ANTES da Íris quando existe pro idioma —
  // mesma foto/tela, só troca o áudio/legenda/aria-label; ao terminar, encadeia pra tocarIris().
  function tocarIris() {
    // Build 2026-08-29 (pedido do CEO): corta a varredura contínua (esquerda-direita-esquerda) NO
    // INSTANTE em que a audiodescrição da Íris começa — cancela aqui, explícito, em vez de esperar o
    // storyboard/fallback assumirem sozinhos (que só aconteceria depois do fetch/loadedmetadata,
    // com folga perceptível de foto ainda vagando por conta própria após o áudio já ter começado).
    pararStoryboardAR();
    const tocarAudiodescricao = () => {
      audioEl.onended = null;
      audioEl.src = `assets/audio/${ponto.tipo}_iris_${audioKey}.mp3`;
      const playPromise = audioEl.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => { $("#player-playpause").classList.add("autoplay-blocked"); });
      $("#player-mini").setAttribute("aria-label", `${nomeDoPonto(ponto)} — ${t("pista_descricao_iris_label")}`);
      renderCaptionLoop(`${ponto.tipo}_iris`, audioKey, audioEl);
      audioEl.onended = () => { aoTerminarNarracaoDoPonto(ponto); }; // ver comentário acima de tocarTrilhaIrisSeAplicavel

      // Storyboard AR (recortes por marco citado, gerados por @foco) se existir; senão, varredura
      // única "rtl" na foto inteira já exibida, ancorada na duração real do áudio da Íris.
      carregarStoryboardIris(ponto.tipo).then((storyboard) => {
        // Build 2026-08-28 (Auditoria 05, achado A-01): identidade do ponto, não só o booleano
        // `tocandoTrilhaIris` — esse também é religado por uma parada NOVA, então por si só não
        // detectava "esse fetch é de uma parada que eu já deixei pra trás" (ver state.pontoAtualTipo).
        if (state.tocandoTrilhaIris === false || state.pontoAtualTipo !== ponto.tipo) return;
        if (storyboard && storyboard.shots && storyboard.shots.length) {
          renderArStoryboardLoop(storyboard, audioEl, fotoEl, `assets/img/pista_storyboards/${ponto.tipo}`);
        } else {
          fotoEl.removeAttribute("data-shot-file");
          const aplicarSweep = () => { fotoEl.onload = null; aplicarVarredura(fotoEl, "rtl", audioEl.duration || 20); };
          if (audioEl.readyState >= 1 && audioEl.duration) aplicarSweep();
          else audioEl.addEventListener("loadedmetadata", aplicarSweep, { once: true });
        }
      });
    };
    // Build 2026-08-29 (pedido do CEO): rótulo "Audiodescrição." antes de cada trilha da Íris —
    // ver AUDIO_ROTULO_ARQUIVO/tocarComRotuloDeFaixa acima.
    tocarComRotuloDeFaixa("audiodescricao", audioEl, tocarAudiodescricao);
  }

  // Build 2026-09-02: a camada de seguranca passou a ser tocada por tocarSegurancaDoPonto() (mesma
  // funcao usada no modo Turistica), que ja mostra a tarja vermelha por 5s. Em PCD, ao terminar ela
  // encadeia para a Iris.
  if (segurancaProntaPara(ponto)) {
    tocarSegurancaDoPonto(ponto, audioEl, audioKey, tocarIris);
  } else {
    tocarIris();
  }
  return true;
}

// Build 2026-08-28 (pedido do CEO): card invisível sobre a foto — funciona como o botão "Seguir" do
// rodapé, só ativo nas Paradas 1-9 (não no Ponto 10 bônus nem no Convite). Mesma função, sem lógica
// nova: chama seguirGlobal(), que já sabe o que fazer em cada contexto.
function setVistaMediaTapAtivo(ativo) {
  const btn = $("#vista-media-tap");
  if (ativo) btn.removeAttribute("disabled");
  else btn.setAttribute("disabled", "");
}

// Build 2026-08-28 (Auditoria 05, achado crítico C-08): o card cobre a foto inteira, sem indicação
// visual de que existe ali — um toque sem querer (mão escorregando enquanto maneja a bengala) não
// pode cortar no meio um áudio "_seguranca_" (rampa/escada/ausência de corrimão etc.). Enquanto esse
// áudio estiver tocando, o toque não faz nada — o rodapé "Seguir" continua funcionando normalmente,
// é só este atalho extra que fica suspenso durante a camada mais crítica da narração.
// Build 2026-08-29 (Auditoria 8, achado crítico de @bussola): a trava só reconhecia
// "_seguranca_" — no Ponto 10 bônus, o aviso de área de risco REAL de morte (costão, ver
// project_costao_pao_acucar_risco_morte.md) toca como "pista_p10_aviso_*", um nome de arquivo
// diferente, então um toque acidental durante esse aviso específico pulava direto pro convite,
// saltando o resto do aviso, a narração, a segurança e a Íris inteiros. Lista explícita em vez de
// uma substring única — cobre os dois trechos críticos, e qualquer aviso futuro do mesmo tipo só
// precisa entrar nesta lista.
const TRECHOS_AUDIO_CRITICOS = ["_seguranca_", "_aviso_"];
function tapNaFotoSeguro() {
  const audioEl = $("#player-audio");
  const emTrechoCritico = TRECHOS_AUDIO_CRITICOS.some((trecho) => audioEl.src.includes(trecho));
  if (emTrechoCritico && !audioEl.paused && !audioEl.ended) return;
  seguirGlobal();
}

// Build 2026-08-29 (pedido do CEO): mesmo toque-na-foto-como-atalho-de-Seguir de tapNaFotoSeguro,
// equivalente pra tela de apresentação — antes só existia nas Paradas. Mesma trava de segurança:
// suspenso enquanto a camada "_seguranca_" da apresentação estiver tocando.
function tapNaFotoApresentacaoSeguro() {
  const audioEl = $("#apresentacao-audio");
  const naSeguranca = audioEl.src.includes("_seguranca_");
  if (naSeguranca && !audioEl.paused && !audioEl.ended) return;
  seguirGlobal();
}

// ---------- Tela de percurso (sequência de paradas, navegação pelo rodapé global) ----------
function renderPonto() {
  const ponto = PISTA_PONTOS[state.pontoIndex];
  const audioEl = $("#player-audio");
  const noticeEl = $("#audio-pendente-notice");
  const fotoEl = $("#vista-media-photo");

  state.naConvite = false;
  state.naPontoBonus = false;
  state.tocandoTrilhaIris = false; // reset — cada parada nova começa do zero
  state.pontoAtualTipo = ponto.tipo; // ver achado A-01
  setVistaMediaTapAtivo(true);
  if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
  // Build 2026-08-27 (achado do CEO — "Voltar" do convite parecia quebrado): o carrossel de fotos
  // do convite continuava rodando em segundo plano depois de sair da tela, sobrescrevendo a
  // foto/legenda daqui a cada poucos segundos. O carrossel deve rodar enquanto se está NO convite,
  // não depois — para aqui, e em renderPontoBonus(), sempre que se entra em qualquer outra tela.
  if (pistaCarouselTimer) { clearInterval(pistaCarouselTimer); pistaCarouselTimer = null; }
  pararStoryboardAR(); // encerra qualquer storyboard/varredura da Íris da parada anterior
  audioEl.pause();
  audioEl.removeAttribute("src");
  audioEl.onended = null;
  $("#player-mini").style.display = "none";
  $("#caption-box").style.display = "none";

  fotoEl.removeAttribute("data-shot-file");
  // Limpa qualquer onload que tenha sobrado do storyboard da Íris da parada anterior (ver
  // renderArStoryboardLoop) — sem isso, ele dispararia sozinho quando ESTA foto terminasse de
  // carregar e aplicaria a varredura (pan/duração) da parada errada por cima da contínua abaixo.
  fotoEl.onload = null;
  fotoEl.src = ponto.foto;
  fotoEl.alt = `${t("pista_foto_alt_prefixo")} — ${nomeDoPonto(ponto)}`;
  // Build 2026-08-29 (pedido do CEO): varredura contínua em vaivém desde já — roda durante a
  // narração turística E a camada de segurança que pode vir em seguida (antes esse trecho ficava
  // sem nenhuma varredura), até tocarIris() cortar explicitamente ou a tela mudar.
  iniciarVarreduraContinua(fotoEl);
  // Build 2026-08-27 (pedido do CEO): a descrição da Íris NUNCA aparece aqui como texto bruto
  // sólido/imediato — só existe a caixa de legenda sincronizada (#caption-box), que toca a
  // narração turística e, em modo PCD, encadeia segurança → Íris (ver tocarTrilhaIrisSeAplicavel),
  // linha por linha, com fundo preto/letra branca, em qualquer um dos 14 idiomas já localizados.
  // Mesmo padrão de playTrack() em app.js (setMediaCaption(null) na vista real; a versão com
  // descricaoIris só é legítima nas previews sem áudio e no carrossel promocional pista_convite,
  // que reaproveita esta mesma caixa via renderPistaCarousel).
  setMediaCaption(null);
  esconderTarjaSeguranca(); // Build 2026-09-02: some com a tarja da parada anterior antes de renderizar a nova
  $("#vista-media-label").textContent = nomeDoPonto(ponto);
  mostrarLabelTemporario($("#vista-media-label"));
  $("#player-mini").setAttribute("aria-label", `${nomeDoPonto(ponto)} — ${state.lang.name}`);

  if (ponto.audioPronto && AUDIO_LANGS_PRONTOS.has(state.lang.code)) {
    const audioKey = langForAudio();
    $("#player-mini").style.display = "flex";
    $("#caption-box").style.display = "";
    const tocarNarracao = () => {
      audioEl.onended = null;
      audioEl.src = `assets/audio/${ponto.tipo}_${audioKey}.mp3`;
      const playPromise = audioEl.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => { $("#player-playpause").classList.add("autoplay-blocked"); });
      renderCaptionLoop(ponto.tipo, audioKey, audioEl);
      // Build 2026-09-02 (pedido do CEO): a narracao de seguranca da parada agora toca nos DOIS
      // modos (antes so em PCD, dentro de tocarTrilhaIrisSeAplicavel). Em PCD segue para a Iris;
      // em Turistica encerra a parada. Sempre com a tarja vermelha por 5s.
      audioEl.onended = () => {
        if (tocarTrilhaIrisSeAplicavel(ponto)) return;
        if (segurancaProntaPara(ponto)) {
          tocarSegurancaDoPonto(ponto, audioEl, audioKey, () => aoTerminarNarracaoDoPonto(ponto));
          return;
        }
        aoTerminarNarracaoDoPonto(ponto);
      };
    };
    if (state.pcdProfile) tocarComRotuloDeFaixa("turistica", audioEl, tocarNarracao); else tocarNarracao();
    noticeEl.style.display = "none";
  } else {
    noticeEl.textContent = ponto.audioPronto
      ? (NOTICE_AUDIO_PENDENTE[state.lang.code] || "")
      : NOTICE_NARRACAO_EM_PRODUCAO;
    noticeEl.style.display = "block";
  }
}

// Sem anúncio ao voltar — mesmo padrão de irParaTras() em app.js (anúncio só em navegação pra
// frente, nunca ao voltar).
function pontoAnterior() {
  if (state.pontoIndex === 0) return;
  state.pontoIndex--;
  showScreen("screen-percurso");
  renderPonto();
}

function pontoProximo() {
  if (state.pontoIndex >= PISTA_PONTOS.length - 1) return;
  // Build 2026-08-27: o índice do PRÓXIMO ponto só é gravado quando o anúncio de fato termina (ou
  // é pulado, plano premium) — antes ficava incrementado durante o anúncio inteiro, o que deixava
  // "Voltar" sem ter pra onde voltar de verdade se cancelado no meio dele (ver voltarGlobal).
  const proximoIndex = state.pontoIndex + 1;
  irComAnuncio(() => { state.pontoIndex = proximoIndex; showScreen("screen-percurso"); renderPonto(); });
}

// ---------- Ponto 10 (bônus/surpresa) — pedido do CEO 27/08: entra no fluxo depois da Parada 9 e
// antes do convite ("Você não está lá. Ainda."), sem contar como uma 10ª parada oficial. Função
// paralela a renderPonto(), não reaproveitada dela de propósito (troca cirúrgica, sem mexer no
// fluxo já testado dos 9 pontos) — mesmo espírito de renderConvite() já ser separada de
// renderPonto(). state.pontoIndex fica intocado (continua em PISTA_PONTOS.length-1, a última
// parada oficial) enquanto state.naPontoBonus estiver true. ----------
// Set incremental por idioma pro aviso de área de risco real (achado A-08) — ver renderPontoBonus().
const AUDIO_P10_AVISO_LANGS_PRONTOS = new Set(["pt-br", "es-ar", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "de-de", "it-it", "zh-cn", "zh-tw", "ja-jp", "ru-ru", "ar-ma"]);
function renderPontoBonus() {
  const ponto = PISTA_PONTO_BONUS;
  const audioEl = $("#player-audio");
  const noticeEl = $("#audio-pendente-notice");
  const fotoEl = $("#vista-media-photo");

  state.naConvite = false;
  state.naPontoBonus = true;
  state.tocandoTrilhaIris = false;
  state.pontoAtualTipo = ponto.tipo; // ver achado A-01
  // Build 2026-08-29 (pedido do CEO): mesma regra de "toque em Seguir ou na foto" das Paradas
  // 1-9, estendida daqui até o final da experiência — tocar na foto do Ponto 10 bônus também avança.
  setVistaMediaTapAtivo(true);
  if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
  if (pistaCarouselTimer) { clearInterval(pistaCarouselTimer); pistaCarouselTimer = null; } // ver comentário em renderPonto()
  pararStoryboardAR();
  audioEl.pause();
  audioEl.removeAttribute("src");
  audioEl.onended = null;
  $("#player-mini").style.display = "none";
  $("#caption-box").style.display = "none";

  fotoEl.removeAttribute("data-shot-file");
  fotoEl.onload = null; // ver comentário equivalente em renderPonto() — limpa onload que sobrou do storyboard anterior
  fotoEl.alt = `${t("pista_foto_alt_prefixo")} — ${nomeDoPonto(ponto)}`;
  // Build 2026-08-29 (pedido do CEO): carrossel de 2 fotos (não a varredura contínua de imagem
  // parada — esta tela deixou de mostrar uma única foto estática) — ver PISTA_P10_CAROUSEL_FOTOS.
  // Já define fotoEl.src (foto original primeiro), não precisa atribuir de novo aqui.
  iniciarCarouselPontoBonus(fotoEl);
  setMediaCaption(null); // mesma regra do renderPonto() — Íris só via legenda sincronizada, nunca texto bruto
  esconderTarjaSeguranca(); // Build 2026-09-02: some com a tarja da parada anterior antes de renderizar a nova
  $("#vista-media-label").textContent = nomeDoPonto(ponto);
  mostrarLabelTemporario($("#vista-media-label"));
  $("#player-mini").setAttribute("aria-label", `${nomeDoPonto(ponto)} — ${state.lang.name}`);

  if (ponto.audioPronto && AUDIO_LANGS_PRONTOS.has(state.lang.code)) {
    const audioKey = langForAudio();
    $("#player-mini").style.display = "flex";
    $("#caption-box").style.display = "";
    noticeEl.style.display = "none";

    const tocarNarracao = () => {
      audioEl.onended = null;
      audioEl.src = `assets/audio/${ponto.tipo}_${audioKey}.mp3`;
      const playPromise = audioEl.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => { $("#player-playpause").classList.add("autoplay-blocked"); });
      renderCaptionLoop(ponto.tipo, audioKey, audioEl);
      // Build 2026-09-02 (pedido do CEO): mesma regra de renderPonto() — a narracao de seguranca
      // do Ponto 10 toca nos dois modos, com a tarja vermelha; em PCD encadeia para a Iris.
      audioEl.onended = () => {
        if (tocarTrilhaIrisSeAplicavel(ponto)) return;
        if (segurancaProntaPara(ponto)) {
          tocarSegurancaDoPonto(ponto, audioEl, audioKey, () => aoTerminarNarracaoDoPonto(ponto));
          return;
        }
        aoTerminarNarracaoDoPonto(ponto);
      };
    };
    // Build 2026-08-29 (pedido do CEO): rótulo "Narração turística." só no modo PCD, mesma regra
    // de renderPonto() — a Narração Turística pura não ganha rótulo nenhum.
    const tocarConteudoDoPonto = () => {
      if (state.pcdProfile) tocarComRotuloDeFaixa("turistica", audioEl, tocarNarracao); else tocarNarracao();
    };

    // Build 2026-08-28 (Auditoria 6, achado A-08): aviso de área de risco real, tocado uma vez
    // antes da narração normal do ponto — sem exigir toque, encadeia sozinho pro conteúdo depois,
    // mesmo padrão de avanço automático já usado no resto da trilha. Set incremental por idioma,
    // mesmo princípio de AUDIO_APRESENTACAO_SEGURANCA_LANGS_PRONTOS.
    // Build 2026-09-03 (pedido do CEO): passa a tocar SÓ no modo PCD — junto com o resto da
    // camada de segurança, que saiu do fluxo da Narração Turística. Na Turística o P10 vai
    // direto pra narração. (Reverte a regra de 28/08 de tocar nos dois modos.)
    if (state.pcdProfile && AUDIO_P10_AVISO_LANGS_PRONTOS.has(state.lang.code)) {
      // Build 2026-08-29 (pedido do CEO): o carrossel do Ponto 10 ganhou a varredura contínua (ver
      // iniciarCarouselPontoBonus()) — arCurrentAnimation deixou de ficar sempre null nesta tela,
      // então agora pausa/retoma durante o aviso crítico, mesmo padrão do resto da trilha.
      pausarVarreduraCritica();
      const tocarAvisoReal = () => {
        audioEl.onended = null;
        audioEl.src = `assets/audio/pista_p10_aviso_${audioKey}.mp3`;
        mostrarTarjaSeguranca(); // Build 2026-09-02: tarja vermelha tambem no aviso de risco real
        const playPromise = audioEl.play();
        if (playPromise && playPromise.catch) playPromise.catch(() => { $("#player-playpause").classList.add("autoplay-blocked"); });
        renderCaptionLoop("pista_p10_aviso", audioKey, audioEl);
        audioEl.onended = () => { retomarVarreduraCritica(); tocarConteudoDoPonto(); };
      };
      // Build 2026-08-29 (pedido do CEO): rótulo "Aviso de segurança." antes do aviso de risco real
      // — toca nos dois modos (Turística e PCD), igual o próprio aviso já tocava antes desta
      // mudança (é alerta de segurança física real, não conteúdo exclusivo de audiodescrição).
      tocarComRotuloDeFaixa("aviso", audioEl, tocarAvisoReal);
    } else {
      tocarConteudoDoPonto();
    }
  } else {
    noticeEl.textContent = ponto.audioPronto
      ? (NOTICE_AUDIO_PENDENTE[state.lang.code] || "")
      : NOTICE_NARRACAO_EM_PRODUCAO;
    noticeEl.style.display = "block";
  }
}

function irParaPontoBonus() {
  irComAnuncio(() => {
    if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
    $("#player-audio").pause();
    showScreen("screen-percurso");
    renderPontoBonus();
  });
}

// ---------- Tela final "pista_convite" (carrossel de fotos + peça promocional) ----------
let pistaCarouselTimer = null;
function renderPistaCarousel(fotoEl) {
  if (pistaCarouselTimer) clearInterval(pistaCarouselTimer);
  pararStoryboardAR(); // encerra storyboard/varredura da Íris se vinha tocando na parada anterior
  fotoEl.removeAttribute("data-shot-file");
  let idx = 0;
  const aplicarFoto = () => {
    const item = PISTA_FOTOS[idx];
    fotoEl.src = item.foto;
    fotoEl.alt = `${t("pista_foto_alt_prefixo")} — ${item.nome}`;
    // Build 2026-08-27 (pedido do CEO, em todos os idiomas): a descrição da Íris NÃO aparece mais
    // aqui — essa tela é o convite pra subir de bondinho ao Pão de Açúcar, e as fotos do carrossel
    // não correspondem ao que está sendo narrado no áudio da peça; audiodescrever "o que a foto
    // mostra" não faz sentido pra quem ainda não subiu (e pode nem subir). item.descricaoIris
    // continua existindo em PISTA_FOTOS (dado não removido), só não é mais exibida aqui.
    idx = (idx + 1) % PISTA_FOTOS.length;
  };
  aplicarFoto(); // mostra a primeira foto de imediato, sem esperar o primeiro ciclo do timer
  pistaCarouselTimer = setInterval(aplicarFoto, PISTA_CAROUSEL_MS);
}

function irParaConvite() {
  irComAnuncio(() => {
    if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
    $("#player-audio").pause();
    showScreen("screen-percurso"); // mesma tela dos pontos — o convite é a última "parada" da sequência
    renderConvite();
  });
}

function renderConvite() {
  const audioEl = $("#player-audio");
  const noticeEl = $("#audio-pendente-notice");
  const fotoEl = $("#vista-media-photo");

  state.naConvite = true;
  state.naPontoBonus = false;
  state.pontoAtualTipo = null; // ver achado A-01 — convite não tem trilha Íris
  // Build 2026-08-29 (pedido do CEO): mesma regra de "toque em Seguir ou na foto", estendida até
  // o final — tocar na foto/carrossel do convite também avança (pra tela final, guia+fim).
  setVistaMediaTapAtivo(true);
  audioEl.onended = null;
  setMediaCaption(null); // garante a caixa escondida — o carrossel não usa mais (ver renderPistaCarousel)
  renderPistaCarousel(fotoEl);
  $("#vista-media-label").textContent = t("pista_convite_label");
  mostrarLabelTemporario($("#vista-media-label"));

  if (AUDIO_LANGS_PRONTOS.has(state.lang.code)) {
    const audioKey = langForAudio();
    noticeEl.style.display = "none";
    $("#player-mini").style.display = "flex";
    $("#caption-box").style.display = "";
    $("#player-mini").setAttribute("aria-label", `${t("pista_convite_label")} — ${state.lang.name}`);
    audioEl.src = `assets/audio/pista_convite_${audioKey}.mp3`;
    const playPromise = audioEl.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => { $("#player-playpause").classList.add("autoplay-blocked"); });
    renderCaptionLoop("pista_convite", audioKey, audioEl);
    // Build 2026-08-29 (Auditoria 8, achado de @bussola e @advogado-do-diabo, os dois
    // independentemente): era a única narração do produto que terminava em silêncio total, sem
    // nenhum sinal de que dá pra seguir — o áudio já existe nos 14 idiomas (mesma dica das Paradas
    // 1-8), só faltava este wiring.
    audioEl.onended = tocarDicaSeguirFoto;
  } else {
    if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
    audioEl.pause();
    audioEl.removeAttribute("src");
    $("#player-mini").style.display = "none";
    $("#caption-box").style.display = "none";
    $("#player-mini").setAttribute("aria-label", `${t("pista_convite_label")} — ${state.lang.name}`);
    noticeEl.textContent = NOTICE_AUDIO_PENDENTE[state.lang.code] || "";
    noticeEl.style.display = "block";
  }
}

// ---------- Rodapé global — Voltar / Seguir / Sair ----------
// "Voltar"/"Seguir" são sensíveis ao contexto (tela atual + posição na sequência de paradas), no
// espírito do irParaTras()/navigateTo() de app.js, mas simplificado porque a Pista é uma sequência
// linear fixa, sem pilha de navegação livre.
// Para a narração (turística ou Íris) em andamento ao trocar de tela — mesmo princípio do app
// principal: só uma narração toca por vez, e mudar de tela sempre interrompe a que estiver ativa.
function pararNarracaoAtual() {
  if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
  pararStoryboardAR();
  esconderTarjaSeguranca();
  $("#player-audio").pause();
  $("#apresentacao-audio").pause();
}

function voltarGlobal() {
  const tela = state.currentScreen;
  // Build 2026-08-29 (pedido do CEO): tela final (guia externo + fim) — "Voltar" retorna pro
  // convite, de onde ela só é alcançável.
  if (tela === "screen-final") { showScreen("screen-percurso"); renderConvite(); return; }
  if (tela === "screen-modo") { showScreen("screen-lang"); return; }
  // Build 2026-09-02 (pedido do CEO): a apresentação saiu do fluxo do PCD — os dois caminhos (Turística
  // e PCD) agora vão modo → plano direto, então "Voltar" de screen-plano sempre cai em screen-modo.
  // (screen-apresentacao/renderApresentacao ficam sem uso; os handlers abaixo são inofensivos.)
  if (tela === "screen-apresentacao") { pararNarracaoAtual(); showScreen("screen-modo"); return; }
  if (tela === "screen-plano") { showScreen("screen-modo"); return; }
  if (tela === "screen-pagamento") { showScreen("screen-plano"); return; }
  if (tela === "screen-percurso") {
    // Build 2026-08-27: convite volta pro Ponto 10 (bônus), não direto pra Parada 9 — o bônus
    // agora fica entre os dois na sequência. pontoIndex nem chega a ser tocado aqui: continua na
    // última parada oficial (ver renderPontoBonus).
    if (state.naConvite) { state.naConvite = false; renderPontoBonus(); return; }
    if (state.naPontoBonus) { state.naPontoBonus = false; renderPonto(); return; }
    if (state.pontoIndex > 0) { pontoAnterior(); return; }
    // Build 2026-08-28: a apresentação já tocou antes do plano — voltar da Parada 1 agora cai na
    // escolha de plano (o passo imediatamente anterior à entrada na trilha), não mais na apresentação.
    pararNarracaoAtual();
    showScreen("screen-plano");
    return;
  }
  // Build 2026-08-27: "Voltar" durante o anúncio de 5s (plano básico) não fazia nada antes — ficava
  // escondido porque o anúncio só aparecia depois de um toque manual em "Seguir"; agora que Parada
  // 9 → Ponto 10 → Convite avançam sozinhos, o visitante pode tentar voltar bem nesse meio-tempo.
  // pontoIndex/naPontoBonus/naConvite ainda não mudaram nesse momento (só mudam quando o anúncio
  // termina de verdade, ver pontoProximo/irParaPontoBonus/irParaConvite) — cancelar e re-renderizar
  // com o estado atual já basta pra voltar pro que estava sendo mostrado antes do anúncio começar.
  if (tela === "screen-anuncio") {
    clearInterval(state.adInterval);
    state.adInterval = null;
    state.pendingAdCallback = null;
    showScreen("screen-percurso");
    if (state.naConvite) { renderConvite(); }
    else if (state.naPontoBonus) { renderPontoBonus(); }
    else { renderPonto(); }
    return;
  }
  // screen-capa/screen-lang: nada antes — não faz nada (capa é a primeira tela desde 2026-08-29,
  // "Voltar" nela não tem pra onde ir; screen-lang também fica sem "Voltar" de propósito, mesmo
  // padrão de antes — não foi pedido levar de volta pra capa).
}

function seguirGlobal() {
  const tela = state.currentScreen;
  // Build 2026-08-29 (pedido do CEO): tela de capa (QR da placa) — "Seguir" leva direto pra
  // escolha de idioma, mesmo destino do toque na imagem (ver capa-media-tap).
  if (tela === "screen-capa") { showScreen("screen-lang"); return; }
  // Build 2026-08-28: "Seguir" na apresentação agora leva pra escolha de plano, não mais direto pra
  // trilha (irParaTrilha só é chamado depois, ao escolher Básico/Premium — ver escolherPlanoBasico/
  // confirmarPagamento). Build 2026-08-29 (Auditoria 8): pula a escolha de plano se já foi feita
  // nesta sessão — ver irParaEscolhaDePlano().
  if (tela === "screen-apresentacao") { pararNarracaoAtual(); irParaEscolhaDePlano(); return; }
  // Build 2026-08-29 (pedido do CEO): "Seguir" em screen-lang, sem nenhuma bandeira tocada ainda,
  // agora adota Português (Brasil) — mesmo caminho de quem toca o cartão pt-br (LANGS[0]).
  if (tela === "screen-lang") { selectLanguage(LANGS[0]); return; }
  // Build 2026-08-29 (pedido do CEO): "Seguir" em screen-pagamento, sem escolher forma de
  // pagamento, agora equivale a desistir do Premium e seguir no Básico (com anúncios) — mesma
  // função usada pelo cartão "Básico" da tela anterior.
  if (tela === "screen-pagamento") { escolherPlanoBasico(); return; }
  if (tela === "screen-percurso") {
    // Build 2026-08-29 (pedido do CEO): "Seguir" no convite agora leva pra tela final (guia
    // externo + fim), última tela do produto — antes não fazia nada aqui.
    if (state.naConvite) { showScreen("screen-final"); return; }
    // Build 2026-08-27: da Parada 9, "Seguir" agora passa pelo Ponto 10 (bônus) antes do convite.
    if (state.naPontoBonus) { irParaConvite(); return; }
    if (state.pontoIndex < PISTA_PONTOS.length - 1) { pontoProximo(); return; }
    irParaPontoBonus();
    return;
  }
  // screen-modo/plano: avançar exige tocar num cartão específico, "Seguir" não faz nada aqui
  // (screen-plano tem sinalização visual disso — ver footer-btn-inerte em showScreen()).
}

function abrirConfirmSair() { $("#confirm-sair-modal").classList.add("show"); }
function fecharConfirmSair() { $("#confirm-sair-modal").classList.remove("show"); }
function confirmarSair() {
  fecharConfirmSair();
  pararNarracaoAtual();
  // Mesmo padrão de confirmarSair() em app.js: window.close() só funciona em aba aberta via script,
  // então cai no fallback de página estática própria (fora do app, sem navegação) em vez de
  // about:blank — achado de auditoria 26/08: tela branca vazia parecia o app ter travado.
  window.close();
  setTimeout(() => { window.location.href = "encerrado.html"; }, 60);
}

function voltarParaIdioma() {
  if (pistaCarouselTimer) { clearInterval(pistaCarouselTimer); pistaCarouselTimer = null; }
  // Ver achado A-06 / irParaTrilha() — só salva posição se já estava de fato na trilha (senão é a
  // primeira vez, antes de qualquer parada, não há nada pra retomar).
  state.posicaoAoTrocarIdioma = state.currentScreen === "screen-percurso"
    ? { pontoIndex: state.pontoIndex, naPontoBonus: state.naPontoBonus, naConvite: state.naConvite }
    : null;
  pararNarracaoAtual();
  showScreen("screen-lang");
}

// Build 2026-08-28 (Auditoria 05, achado crítico C-05) — ver sw.js e o mesmo registro em app.js.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}

window.addEventListener("DOMContentLoaded", () => {
  buildLanguageGrid();
  wireMiniPlayer("apresentacao-audio", "apresentacao-playpause", "apresentacao-track", "apresentacao-progress");
  wireMiniPlayer("player-audio", "player-playpause", "player-track", "player-progress");
  wireAudioErrorRecovery($("#apresentacao-audio"), $("#apresentacao-audio-notice"));
  wireAudioErrorRecovery($("#player-audio"), $("#audio-pendente-notice"));
  $("#modo-turistica").onclick = escolherModoTuristica;
  $("#modo-pcd").onclick = escolherModoPCD;
  $("#plano-basico").onclick = escolherPlanoBasico;
  $("#plano-premium").onclick = escolherPlanoPremium;
  document.querySelectorAll(".payment-option").forEach((el) => { el.onclick = confirmarPagamento; });
  $("#btn-voltar-global").onclick = voltarGlobal;
  $("#btn-seguir-global").onclick = seguirGlobal;
  $("#vista-media-tap").onclick = tapNaFotoSeguro; // ver setVistaMediaTapAtivo/tapNaFotoSeguro
  $("#apresentacao-media-tap").onclick = tapNaFotoApresentacaoSeguro;
  // Build 2026-08-29 (pedido do CEO): na tela de capa, "Seguir" pode ser tanto o botão do rodapé
  // quanto QUALQUER ponto da tela (não só a foto) — handler na section inteira, não só no overlay
  // #capa-media-tap (que continua existindo, redundante mas inofensivo: o clique nele também
  // borbulha pra section e dispara o mesmo handler).
  // Build 2026-08-29 (Auditoria 8, achado médio de @security-auditor): guarda de `target` — se
  // algum dia um link/botão próprio for adicionado dentro desta tela (ex. aviso legal), o clique
  // NELE não deve também disparar a navegação por bubbling; só a tela em si (ou o overlay legado
  // #capa-media-tap, sem handler próprio) deve.
  $("#screen-capa").onclick = (ev) => {
    const el = ev.target.closest("a, button");
    if (el && el.id !== "capa-media-tap") return;
    showScreen("screen-lang"); // sem áudio nesta tela, sem guarda de segurança — toque direto
  };
  $("#final-fim").onclick = abrirConfirmSair; // mesmo fluxo do "Sair" do rodapé (mesmo modal de confirmação)
  $("#btn-sair-global").onclick = abrirConfirmSair;
  $("#confirm-sair-sim").onclick = confirmarSair;
  $("#confirm-sair-nao").onclick = fecharConfirmSair;
  attachHoverVoice();
  registrarDestravamentoLoopIdioma();
  showScreen("screen-capa"); // Build 2026-08-29 (pedido do CEO): capa (QR) agora é a primeira tela, antes do idioma
});
