// Pista Cláudio Coutinho — página standalone (Produto 4), aberta pelo QR da placa na trilha.
// Herda do app principal (Fase B/C do plano sleepy-gathering-kazoo.md, mais a rodada de revisão
// tela a tela de 26/08/2026): rodapé global Voltar/Seguir/Sair, tela de modo (Turística/PCD), tela
// de plano (Básico com anúncio/Premium com pagamento simulado), e a trilha de continuação da Íris
// em áudio no modo PCD — mesmos padrões de app.js, adaptados pra a sequência linear de paradas.

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
  default: new Set(["pt-br"]), // P1-P9: só pt-br por enquanto, ver PENDENCIAS.md
};
function segurancaProntaPara(ponto) {
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
    descricaoIris: "O caminho pavimentado se abre numa curva suave sob o teto verde da mata; à esquerda, bancos de tronco e pedra marcam um pequeno ponto de descanso entre samambaias e arbustos; à direita, a vegetação fecha densa até a beira do caminho." },
  { tipo: "pista_p6", nome: "Mar Aberto, Manhã Calma", foto: "assets/img/pista_coutinho/pista_p6.jpg", audioPronto: true, temIris: true,
    descricaoIris: "O mar se estende em azul profundo e quase sem ondulação até um ilhote arredondado e verde no horizonte à direita; ao centro, minúsculo, um caiaque desliza sozinho pela água; galhos escuros emolduram o canto esquerdo do quadro, framing natural da trilha." },
  { tipo: "pista_p7", nome: "A Fortaleza no Alto do Morro", foto: "assets/img/pista_coutinho/pista_p7.jpg", audioPronto: true, temIris: true,
    descricaoIris: "No topo de um morro arredondado, muros baixos de pedra clara marcam os restos de uma fortificação, com uma bandeira do Brasil hasteada ao lado; um segundo morro, mais escuro e sem construção, se ergue ao lado; o mar azul-claro ocupa a base do quadro." },
  { tipo: "pista_p8", nome: "Chegada à Urca", foto: "assets/img/pista_coutinho/pista_p8.jpg", audioPronto: true, temIris: true,
    descricaoIris: "A trilha se abre numa última curva sobre uma enseada onde a areia recebe barracas de sol e banhistas ao longe; morros de pedra nua descem dos dois lados até a água calma, e ao fundo, prédios brancos e um hotel se acomodam junto à praia." },
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

function calcularVarredura(pan, duracaoSegundos) {
  if (!pan || pan === "none" || duracaoSegundos < AR_PISO_DURACAO_S) return null;
  const faixa = pan === "micro" ? AR_FAIXAS.micro : AR_FAIXAS.pan;
  const eixo = pan === "ttb" ? "y" : "x";
  const invertido = pan === "rtl"; // direita→esquerda — default deste produto (ver comentário acima)
  const tempoDisponivel = Math.max(duracaoSegundos - AR_HOLD_INICIO_S - AR_HOLD_FIM_S, 0);
  if (tempoDisponivel <= 0) return null;
  const distanciaMax = faixa[1] - faixa[0];
  const distancia = Math.min(AR_VELOCIDADE_PCT_S * tempoDisponivel, distanciaMax);
  const tempoPan = distancia / AR_VELOCIDADE_PCT_S;
  const fracaoIni = Math.min(AR_HOLD_INICIO_S / duracaoSegundos, 1);
  const fracaoFim = Math.min(fracaoIni + tempoPan / duracaoSegundos, 1);
  const de = invertido ? faixa[1] : faixa[0];
  const para = invertido ? faixa[1] - distancia : faixa[0] + distancia;
  return { eixo, de, para, fracaoIni, fracaoFim };
}

let arCurrentAnimation = null;
function aplicarVarredura(fotoEl, pan, duracaoSegundos) {
  if (arCurrentAnimation) { arCurrentAnimation.cancel(); arCurrentAnimation = null; }
  const calc = arReducedMotionAtivo() ? null : calcularVarredura(pan, duracaoSegundos);
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
  return fetch(`assets/data/pista_storyboards/${tipo}_iris_storyboard.json`, { cache: "no-store" })
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
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  const scrollArea = $("#app-screens");
  if (scrollArea) scrollArea.scrollTop = 0; else window.scrollTo(0, 0);
  state.currentScreen = id;
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
    const card = document.createElement("div");
    card.className = "lang-card";
    card.innerHTML = `<span class="flag">${FLAG_SVG[l.code]}</span><span class="name">${l.name}</span>`;
    card.onclick = () => selectLanguage(l);
    grid.appendChild(card);
  });
}

async function loadCaptions() {
  if (state.captions) return;
  const res = await fetch("assets/data/captions.json", { cache: "no-store" });
  state.captions = await res.json();
}

// ---------- i18n da interface (chrome fixo: telas, botões, avisos) — mesmo arquivo compartilhado
// do app principal (assets/data/i18n.json), reaproveitando as chaves que já existem lá (modo/plano/
// anúncio/pagamento/confirmação de saída são idênticos) + um punhado de chaves novas só da Pista
// (prefixo "pista_"/"footer_seguir"). AUDIO_KEY já é exatamente o i18nKey usado no app principal
// (mesma tabela pt-br→pt, en-us→en etc.), não precisa de mapeamento separado. ----------
async function loadI18n() {
  if (state.i18n) return;
  const res = await fetch("assets/data/i18n.json", { cache: "no-store" });
  state.i18n = await res.json();
}

function t(key) {
  const i18nKey = state.lang ? AUDIO_KEY[state.lang.code] : "pt";
  return (state.i18n && state.i18n[i18nKey] && state.i18n[i18nKey][key])
    || (state.i18n && state.i18n.pt && state.i18n.pt[key])
    || key;
}

function applyLanguagePista(l) {
  const i18nKey = AUDIO_KEY[l.code];
  if (!state.i18n || !state.i18n[i18nKey]) return;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const txt = state.i18n[i18nKey][key];
    if (txt) el.textContent = txt;
  });
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
  $("#lang-current-flag").innerHTML = FLAG_SVG[l.code];
  $("#lang-current-name").textContent = l.name;
  $("#lang-current-flag-2").innerHTML = FLAG_SVG[l.code];
  $("#lang-current-name-2").textContent = l.name;
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
  showScreen("screen-plano");
}
function escolherModoPCD() {
  state.pcdProfile = true;
  showScreen("screen-apresentacao");
  renderApresentacao();
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
    box.innerHTML = `<span class="caption-tag">${t("pista_caption_tag_iris")}</span>${texto}`;
    box.style.display = "block";
  } else {
    box.style.display = "none";
    box.innerHTML = "";
  }
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
// portuguesa) já narrada — hoje só pt-BR, mesmo padrão incremental das outras camadas de segurança.
const AUDIO_APRESENTACAO_SEGURANCA_LANGS_PRONTOS = new Set(["pt-br"]);

function renderApresentacao() {
  const audioEl = $("#apresentacao-audio");
  const fotoEl = $("#apresentacao-foto");
  fotoEl.src = "assets/img/pista_coutinho/pista_apresentacao.jpg";
  fotoEl.alt = `${t("pista_foto_alt_prefixo")} — ${t("pista_entrada_alt_sufixo")}`;
  $("#apresentacao-caption-box").textContent = "…";
  audioEl.onended = null;
  if (AUDIO_LANGS_PRONTOS.has(state.lang.code)) {
    const audioKey = langForAudio();
    audioEl.src = `assets/audio/pista_apresentacao_${audioKey}.mp3`;
    const playPromise = audioEl.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => { $("#apresentacao-playpause").classList.add("autoplay-blocked"); });
    renderCaptionLoop("pista_apresentacao", audioKey, audioEl, "apresentacao-caption-box");
    // Modo PCD: camada de segurança física toca logo após a narração de chegada, antes de o
    // visitante seguir pra trilha — mesmo princípio "segurança antes de estética" usado nos 9 pontos.
    if (state.pcdProfile && AUDIO_APRESENTACAO_SEGURANCA_LANGS_PRONTOS.has(state.lang.code)) {
      audioEl.onended = () => {
        audioEl.onended = null;
        audioEl.src = `assets/audio/pista_apresentacao_seguranca_${audioKey}.mp3`;
        const p2 = audioEl.play();
        if (p2 && p2.catch) p2.catch(() => { $("#apresentacao-playpause").classList.add("autoplay-blocked"); });
        renderCaptionLoop("pista_apresentacao_seguranca", audioKey, audioEl, "apresentacao-caption-box");
      };
    }
  } else {
    audioEl.removeAttribute("src");
    if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
    $("#apresentacao-caption-box").textContent = NOTICE_AUDIO_PENDENTE[state.lang.code] || "";
  }
}

function irParaTrilha() {
  if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
  $("#apresentacao-audio").pause();
  state.pontoIndex = 0;
  state.naConvite = false;
  irComAnuncio(() => { showScreen("screen-percurso"); renderPonto(); });
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
    audioEl.src = `assets/audio/${ponto.tipo}_iris_${audioKey}.mp3`;
    const playPromise = audioEl.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => { $("#player-playpause").classList.add("autoplay-blocked"); });
    $("#player-mini").setAttribute("aria-label", `${ponto.nome} — ${t("pista_descricao_iris_label")}`);
    renderCaptionLoop(`${ponto.tipo}_iris`, audioKey, audioEl);
    audioEl.onended = () => { aoTerminarNarracaoDoPonto(ponto); }; // ver comentário acima de tocarTrilhaIrisSeAplicavel

    // Storyboard AR (recortes por marco citado, gerados por @foco) se existir; senão, varredura
    // única "rtl" na foto inteira já exibida, ancorada na duração real do áudio da Íris.
    carregarStoryboardIris(ponto.tipo).then((storyboard) => {
      if (state.tocandoTrilhaIris === false) return; // narração já avançou antes do fetch voltar
      if (storyboard && storyboard.shots && storyboard.shots.length) {
        renderArStoryboardLoop(storyboard, audioEl, fotoEl, `assets/img/pista_storyboards/${ponto.tipo}`);
      } else {
        fotoEl.removeAttribute("data-shot-file");
        const aplicarSweep = () => { fotoEl.onload = null; aplicarVarredura(fotoEl, "rtl", audioEl.duration || 20); };
        if (audioEl.readyState >= 1 && audioEl.duration) aplicarSweep();
        else audioEl.addEventListener("loadedmetadata", aplicarSweep, { once: true });
      }
    });
  }

  if (segurancaProntaPara(ponto)) {
    audioEl.src = `assets/audio/${ponto.tipo}_seguranca_${audioKey}.mp3`;
    const playPromise = audioEl.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => { $("#player-playpause").classList.add("autoplay-blocked"); });
    $("#player-mini").setAttribute("aria-label", `${ponto.nome} — ${t("pista_seguranca_iris_label")}`);
    renderCaptionLoop(`${ponto.tipo}_seguranca`, audioKey, audioEl);
    audioEl.onended = tocarIris;
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

// ---------- Tela de percurso (sequência de paradas, navegação pelo rodapé global) ----------
function renderPonto() {
  const ponto = PISTA_PONTOS[state.pontoIndex];
  const audioEl = $("#player-audio");
  const noticeEl = $("#audio-pendente-notice");
  const fotoEl = $("#vista-media-photo");

  state.naConvite = false;
  state.naPontoBonus = false;
  state.tocandoTrilhaIris = false; // reset — cada parada nova começa do zero
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
  fotoEl.src = ponto.foto;
  fotoEl.alt = `${t("pista_foto_alt_prefixo")} — ${ponto.nome}`;
  // Build 2026-08-27 (pedido do CEO): a descrição da Íris NUNCA aparece aqui como texto bruto
  // sólido/imediato — só existe a caixa de legenda sincronizada (#caption-box), que toca a
  // narração turística e, em modo PCD, encadeia segurança → Íris (ver tocarTrilhaIrisSeAplicavel),
  // linha por linha, com fundo preto/letra branca, em qualquer um dos 14 idiomas já localizados.
  // Mesmo padrão de playTrack() em app.js (setMediaCaption(null) na vista real; a versão com
  // descricaoIris só é legítima nas previews sem áudio e no carrossel promocional pista_convite,
  // que reaproveita esta mesma caixa via renderPistaCarousel).
  setMediaCaption(null);
  $("#vista-media-label").textContent = ponto.nome;
  $("#player-mini").setAttribute("aria-label", `${ponto.nome} — ${state.lang.name}`);
  $("#ponto-progresso").textContent = t("pista_progresso_template")
    .replace("{n}", state.pontoIndex + 1).replace("{total}", PISTA_PONTOS.length);

  if (ponto.audioPronto && AUDIO_LANGS_PRONTOS.has(state.lang.code)) {
    const audioKey = langForAudio();
    $("#player-mini").style.display = "flex";
    $("#caption-box").style.display = "";
    audioEl.src = `assets/audio/${ponto.tipo}_${audioKey}.mp3`;
    const playPromise = audioEl.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => { $("#player-playpause").classList.add("autoplay-blocked"); });
    renderCaptionLoop(ponto.tipo, audioKey, audioEl);
    audioEl.onended = () => { if (!tocarTrilhaIrisSeAplicavel(ponto)) aoTerminarNarracaoDoPonto(ponto); };
    noticeEl.style.display = "none";

    // Build 2026-08-27 (pedido do CEO — a foto ficava parada, cortada, sem mostrar a cena
    // inteira): varredura automática esquerda→direita ("ltr") durante a narração turística,
    // ancorada na duração real do áudio — mesmo mecanismo/motor já usado no fallback da trilha da
    // Íris logo abaixo (ver tocarTrilhaIrisSeAplicavel), só que ali o padrão do produto é "rtl"
    // (decisão anterior do CEO, ver comentário do motor de varredura acima). Aqui, na narração
    // turística, o CEO pediu "esquerda para direita" explicitamente — direção diferente por
    // camada de narração, não um erro/inconsistência.
    const aplicarSweepTuristica = () => { fotoEl.onload = null; aplicarVarredura(fotoEl, "ltr", audioEl.duration || 20); };
    if (audioEl.readyState >= 1 && audioEl.duration) aplicarSweepTuristica();
    else audioEl.addEventListener("loadedmetadata", aplicarSweepTuristica, { once: true });
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
function renderPontoBonus() {
  const ponto = PISTA_PONTO_BONUS;
  const audioEl = $("#player-audio");
  const noticeEl = $("#audio-pendente-notice");
  const fotoEl = $("#vista-media-photo");

  state.naConvite = false;
  state.naPontoBonus = true;
  state.tocandoTrilhaIris = false;
  setVistaMediaTapAtivo(false); // fora das Paradas 1-9
  if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
  if (pistaCarouselTimer) { clearInterval(pistaCarouselTimer); pistaCarouselTimer = null; } // ver comentário em renderPonto()
  pararStoryboardAR();
  audioEl.pause();
  audioEl.removeAttribute("src");
  audioEl.onended = null;
  $("#player-mini").style.display = "none";
  $("#caption-box").style.display = "none";

  fotoEl.removeAttribute("data-shot-file");
  fotoEl.src = ponto.foto;
  fotoEl.alt = `${t("pista_foto_alt_prefixo")} — ${ponto.nome}`;
  setMediaCaption(null); // mesma regra do renderPonto() — Íris só via legenda sincronizada, nunca texto bruto
  $("#vista-media-label").textContent = ponto.nome;
  $("#player-mini").setAttribute("aria-label", `${ponto.nome} — ${state.lang.name}`);
  $("#ponto-progresso").textContent = ""; // fora da contagem oficial de 9, mesmo padrão do convite

  if (ponto.audioPronto && AUDIO_LANGS_PRONTOS.has(state.lang.code)) {
    const audioKey = langForAudio();
    $("#player-mini").style.display = "flex";
    $("#caption-box").style.display = "";
    audioEl.src = `assets/audio/${ponto.tipo}_${audioKey}.mp3`;
    const playPromise = audioEl.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => { $("#player-playpause").classList.add("autoplay-blocked"); });
    renderCaptionLoop(ponto.tipo, audioKey, audioEl);
    audioEl.onended = () => { if (!tocarTrilhaIrisSeAplicavel(ponto)) aoTerminarNarracaoDoPonto(ponto); };
    noticeEl.style.display = "none";

    const aplicarSweepTuristica = () => { fotoEl.onload = null; aplicarVarredura(fotoEl, "ltr", audioEl.duration || 20); };
    if (audioEl.readyState >= 1 && audioEl.duration) aplicarSweepTuristica();
    else audioEl.addEventListener("loadedmetadata", aplicarSweepTuristica, { once: true });
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
  setVistaMediaTapAtivo(false); // fora das Paradas 1-9
  audioEl.onended = null;
  setMediaCaption(null); // garante a caixa escondida — o carrossel não usa mais (ver renderPistaCarousel)
  renderPistaCarousel(fotoEl);
  $("#vista-media-label").textContent = t("pista_convite_label");

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
  $("#ponto-progresso").textContent = "";
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
  $("#player-audio").pause();
  $("#apresentacao-audio").pause();
}

function voltarGlobal() {
  const tela = state.currentScreen;
  if (tela === "screen-modo") { showScreen("screen-lang"); return; }
  // Build 2026-08-28: apresentação agora fica ENTRE modo e plano, mas só existe no caminho PCD (ver
  // escolherModoTuristica/PCD) — voltar de screen-plano cai na apresentação se veio do PCD, ou
  // direto no modo se veio da Turística (que nunca passa pela apresentação).
  if (tela === "screen-apresentacao") { pararNarracaoAtual(); showScreen("screen-modo"); return; }
  if (tela === "screen-plano") { showScreen(state.pcdProfile ? "screen-apresentacao" : "screen-modo"); return; }
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
  // screen-lang: nada antes — não faz nada.
}

function seguirGlobal() {
  const tela = state.currentScreen;
  // Build 2026-08-28: "Seguir" na apresentação agora leva pra escolha de plano, não mais direto pra
  // trilha (irParaTrilha só é chamado depois, ao escolher Básico/Premium — ver escolherPlanoBasico/
  // confirmarPagamento).
  if (tela === "screen-apresentacao") { pararNarracaoAtual(); showScreen("screen-plano"); return; }
  if (tela === "screen-percurso") {
    if (state.naConvite) return; // fim da trilha — nada mais a seguir
    // Build 2026-08-27: da Parada 9, "Seguir" agora passa pelo Ponto 10 (bônus) antes do convite.
    if (state.naPontoBonus) { irParaConvite(); return; }
    if (state.pontoIndex < PISTA_PONTOS.length - 1) { pontoProximo(); return; }
    irParaPontoBonus();
    return;
  }
  // screen-lang/modo/plano/pagamento: avançar exige tocar num cartão específico, "Seguir" não faz nada aqui.
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
  pararNarracaoAtual();
  showScreen("screen-lang");
}

window.addEventListener("DOMContentLoaded", () => {
  buildLanguageGrid();
  wireMiniPlayer("apresentacao-audio", "apresentacao-playpause", "apresentacao-track", "apresentacao-progress");
  wireMiniPlayer("player-audio", "player-playpause", "player-track", "player-progress");
  $("#btn-trocar-idioma").onclick = voltarParaIdioma;
  $("#modo-turistica").onclick = escolherModoTuristica;
  $("#modo-pcd").onclick = escolherModoPCD;
  $("#plano-basico").onclick = escolherPlanoBasico;
  $("#plano-premium").onclick = escolherPlanoPremium;
  document.querySelectorAll(".payment-option").forEach((el) => { el.onclick = confirmarPagamento; });
  $("#btn-voltar-global").onclick = voltarGlobal;
  $("#btn-seguir-global").onclick = seguirGlobal;
  $("#vista-media-tap").onclick = seguirGlobal; // ver setVistaMediaTapAtivo — mesma função do Seguir
  $("#btn-sair-global").onclick = abrirConfirmSair;
  $("#confirm-sair-sim").onclick = confirmarSair;
  $("#confirm-sair-nao").onclick = fecharConfirmSair;
  attachHoverVoice();
  showScreen("screen-lang");
});
