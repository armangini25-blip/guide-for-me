// Protótipo de demonstração — Pão de Açúcar para Você
// Estado global simples, sem framework, sem build tool (roda direto no navegador).

// Windows (Segoe UI Emoji) não renderiza bandeiras Unicode como imagem — mostra o código
// de duas letras (ex.: "BR"). Testado neste protótipo via Playwright headless no Windows.
// Solução: bandeiras próprias em SVG inline, simplificadas, sem dependência externa.
// Build 2026-07-2X — expansão de 5 para as 14 variantes do roster de locução: cada bandeira
// agora representa a variante regional exata (Brasil x Portugal, EUA x Reino Unido, Espanha x
// Argentina, China continental x Taiwan, e Marrocos — não mais uma bandeira "genérica" do idioma).
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

// Nome de exibição + código lógico (variante completa, usado no state e na URL de recursos
// que já nascem com esse padrão) + i18nKey/audioKey (aponta para a chave/arquivo já existente
// no i18n.json e em assets/audio para os 5 idiomas originais, evitando renomear ~166 arquivos —
// os 9 idiomas novos usam o próprio "code" como i18nKey/audioKey, pois nascem já no padrão novo).
// entryAudioKey resolve o nome do arquivo do anúncio multilíngue da tela de entrada
// (assets/audio/anuncio_entrada_{entryAudioKey}.mp3) — esse conjunto já existia com sufixo
// curto para 10 idiomas antes desta expansão (incluindo de/zh/ja/ru/ar, que não tinham roteiro
// nem UI traduzida ainda); reaproveitado aqui sem regravar. Só pt-pt/en-gb/es-ar/zh-tw são novos.
const LANGS = [
  { code: "pt-br", i18nKey: "pt", audioKey: "pt", entryAudioKey: "pt", name: "Português (Brasil)" },
  { code: "pt-pt", i18nKey: "pt-pt", audioKey: "pt-pt", entryAudioKey: "pt-pt", name: "Português (Portugal)" },
  { code: "en-us", i18nKey: "en", audioKey: "en", entryAudioKey: "en", name: "English (US)" },
  { code: "en-gb", i18nKey: "en-gb", audioKey: "en-gb", entryAudioKey: "en-gb", name: "English (UK)" },
  { code: "es-es", i18nKey: "es", audioKey: "es", entryAudioKey: "es", name: "Español (España)" },
  { code: "es-ar", i18nKey: "es-ar", audioKey: "es-ar", entryAudioKey: "es-ar", name: "Español (Argentina)" },
  { code: "fr-fr", i18nKey: "fr", audioKey: "fr", entryAudioKey: "fr", name: "Français" },
  { code: "de-de", i18nKey: "de-de", audioKey: "de-de", entryAudioKey: "de", name: "Deutsch" },
  { code: "it-it", i18nKey: "it", audioKey: "it", entryAudioKey: "it", name: "Italiano" },
  { code: "zh-cn", i18nKey: "zh-cn", audioKey: "zh-cn", entryAudioKey: "zh", name: "中文（简体）" },
  { code: "zh-tw", i18nKey: "zh-tw", audioKey: "zh-tw", entryAudioKey: "zh-tw", name: "中文（繁體）" },
  { code: "ja-jp", i18nKey: "ja-jp", audioKey: "ja-jp", entryAudioKey: "ja", name: "日本語" },
  { code: "ru-ru", i18nKey: "ru-ru", audioKey: "ru-ru", entryAudioKey: "ru", name: "Русский" },
  { code: "ar-ma", i18nKey: "ar-ma", audioKey: "ar-ma", entryAudioKey: "ar", name: "العربية", dir: "rtl" },
];

// Build 2026-08-02 — os dois índices "a definir" que ganharam foto real nesta leva (10 e 15)
// foram renomeados com o nome descritivo dado pelo Lente ao analisar a foto (relatorio-fotos.md);
// os 3 "Vista Urca — a definir" seguem sem foto própria (não há candidata do lote de 28 que não
// esteja já atribuída a um mirante do mapa ou a outro item desta lista — ver VIEW_PREVIEWS).
const VIEWS_18 = [
  "Entrada — Av. Pasteur", "Praia do Flamengo", "Baía de Guanabara", "Praia do Leme",
  "Praia de Copacabana", "Praia Vermelha (Urca)", "Mirante Guardião da Pedra",
  "Vista Urca — a definir 1", "Vista Urca — a definir 2", "Vista Urca — a definir 3",
  "Niterói (Ponte + Forte de Santa Cruz)", "Topo Pão de Açúcar — Pôr do Sol",
  "Corcovado / Cristo Redentor", "Serra do Mar / Dedo de Deus", "Morro da Urca / Praia Vermelha",
  "Vista Pão de Açúcar — Skyline sob o Cristo", "Pista Cláudio Coutinho — início", "Pista Cláudio Coutinho — fim",
];
// Índices com conteúdo real (áudio + legenda; "mirante06" também tem foto de referência —
// ver playTrack()). "langs" restringe em quais idiomas o roteiro já foi revisado; sem essa
// chave, o conteúdo vale para os 5 idiomas do protótipo (mesmo padrão do array MIRANTES).
const FUNCTIONAL_VIEWS = {
  6: { tipo: "mirante06" }, // era "Enseada de Botafogo (candidata)" — renomeado para Mirante Guardião da Pedra, mesmo conteúdo do hotspot nº 6 do mapa. Áudio TTS + legenda já gerados para os 14 idiomas (traducoes/mirante06/) — restrição de idioma removida.
  11: { tipo: "tipo1" }, // "Topo Pão de Açúcar — Pôr do Sol"
  16: { tipo: "pista_convite", langs: ["pt-br"] }, // "Pista Cláudio Coutinho — início" — peça promocional nova (Produto 4), roteiro de @lente, 2026-07-26. Só PT nesta fase, sem tradução ainda.
};

// Build 2026-08-02 — itens de VIEWS_18 com foto real + descrição da Íris, mas ainda SEM áudio
// (distinto de FUNCTIONAL_VIEWS). Mesma lógica de "temFoto" do array MIRANTES — abre o preview
// estático (foto + legenda em português) em vez do stub de texto puro.
const VIEW_PREVIEWS = {
  10: { // "Niterói (Ponte + Forte de Santa Cruz)"
    foto: "assets/img/vistas/niteroi_ponte_fortesantacruz.jpg",
    descricaoIris: "A ponte se estende sobre a água calma ao entardecer, tom dourado no céu; uma ave cruza o quadro e um barco de pesca risca a água com sua esteira.",
  },
  15: { // "Vista Pão de Açúcar — Skyline sob o Cristo"
    foto: "assets/img/vistas/paodeacucar_skyline_cristo.jpg",
    descricaoIris: "A cidade se ergue em prédios altos contra um céu sem nuvens; ao fundo, discreto mas inconfundível, o Corcovado se destaca com suas antenas; embaixo à direita, uma marina reúne barcos brancos.",
  },
};

// Build 2026-08-02 — carrossel de fotos da Pista Cláudio Coutinho (Produto 4), pedido do CEO:
// todas as fotos em loop de 4s cada, independente da duração real do áudio (190,56s em pt-br —
// ver assets/data/captions.json) — o carrossel simplesmente reinicia do início (p1) enquanto a
// tela ficar aberta. Ordem literal pedida pelo CEO: p1 a p7, depois p10 (p8/p9 não existem no
// lote de fotos). Cada entrada tem a descrição da Íris, exibida abaixo da foto (ver
// PISTA_CAROUSEL_MS e renderPistaCarousel()); a legenda de narração (sincronizada por frase,
// já gravada) continua no caption-box de sempre, em paralelo.
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
    descricaoIris: "Pedras arredondadas e raízes grossas formam degraus naturais sob um teto denso de folhas; a luz do dia se filtra em manchas claras pelo caminho." },
];
const PISTA_CAROUSEL_MS = 4000;

// Build 2026-08-02 — fotos reais para as duas telas da sequência de introdução obrigatória
// (Segurança e Apresentação do Parque / História do Bondinho). As duas fotos do bondinho tiradas
// pelo CEO (b1/b2) foram divididas entre as duas telas em vez de repetir a mesma nas duas.
// Build 2026-08-15 — substituída a foto estática por vídeo real (pedido do CEO), filmado do
// lado da cabine voltado para o mar, na saída da estação Praia Vermelha, com vista do caminho
// aéreo (cabos) até o Morro da Urca. `foto` mantido como fallback caso o vídeo falhe ao carregar.
// descricaoIris revisada (Íris/@audiodescricao, 2026-08-15) contra os frames reais do vídeo: a
// versão anterior descrevia uma vista estática da plataforma olhando os cabos subir; a cena real
// é filmada de DENTRO da cabine já em movimento — corrigido para refletir isso, e complementados
// dois elementos que a versão anterior não citava (visíveis nos frames): o próprio Pão de Açúcar
// emoldurado pela estrutura da cabine, e a Enseada da Praia Vermelha (areia, ilha, costão) se
// abrindo embaixo. Abertura com aviso de segurança (vão plataforma-cabine), a pedido do CEO —
// mesma lógica de "risco antes de estética" da camada de deslocamento de @bussola (Skill 3 de
// Íris). Fechamento em 2ª pessoa ("para onde você segue") por pedido explícito do CEO em
// 2026-08-15 — exceção deliberada ao Core Principle 13 (terceira pessoa referencial), registrada
// aqui porque o mesmo roteiro-mestre alimenta legenda + voz + adaptação multilíngue: ao adaptar
// para os 14 idiomas de LANGS, cada locutor decide se mantém o "você" (2ª pessoa é natural em
// alguns idiomas/registros) ou devolve para 3ª pessoa onde soar mais nativo — não é regra rígida
// a replicar automaticamente. PENDENTE DE APROVAÇÃO DO CEO antes de virar roteiro-mestre para
// adaptação aos 14 idiomas (Core Principle 12/Skill 4 — ver LANGS). Texto pt-BR APROVADO pelo
// CEO em 2026-08-15; na mesma data, os 13 agentes locucao-xx adaptaram (não traduziram
// literalmente) para as demais variantes de LANGS — primeira descricaoIris do app com cobertura
// multilíngue completa (as demais, nos MIRANTES/HISTORIA_FOTO/PISTA_FOTOS, seguem só em
// português por ora). Chaves = audioKey de LANGS, mesmo esquema de captions.json.
//
// Duas decisões de Skill 8 (ordem de varredura) tomadas por Íris na consolidação:
// - zh-TW (Wei) perguntou se a lista "areia→ilha→mata da Urca" merecia reordenação por registro
//   vertical/tategaki: não — é ordem de PROFUNDIDADE (perto→longe→destino), não enumeração
//   paralela sem posição fixa, então não há convenção de leitura a aplicar; mantida como está.
// - ar-MA (Salma) fez a mesma pergunta pelo ângulo RTL, e also confirmou corretamente que
//   "à esquerda" do Pão de Açúcar é geografia real da câmera (nunca espelhada, Core Principle 2)
//   — mesma decisão de Íris: mantida a ordem original também em árabe.
//
// Divergência aceita conscientemente: zh-CN, zh-TW, ja-JP, ru-RU e ar-MA NÃO mantiveram os nomes
// próprios do parque em português/letras latinas soltas (diferente do pedido original) — cada um
// aplicou uma regra própria de domínio, já documentada e corrigida em 2026-07-24 nos respectivos
// agentes (`locucao-zh-tw.md` Core Principle 11, equivalente em ja-jp/zh-cn/ru-ru/ar-ma): em
// escrita não-latina, nome próprio nunca fica solto em letras latinas — a parte genérica (Morro,
// Praia, Estação) traduz, a parte específica (Urca, Vermelha) translitera foneticamente. Essa
// regra de domínio tem prioridade sobre a instrução genérica desta tarefa — aceita como correta.
const SEGURANCA_FOTO = {
  foto: "assets/img/bondinho/seguranca_apresentacao.jpg",
  video: "assets/video/bondinho/seguranca_apresentacao.mp4",
  // Build 2026-08-17 (pedido do CEO): só a trilha da Íris de video_seguranca vira slideshow (10s por
  // foto, ver tocarTrilhaIrisSeAplicavel) — as outras vistas continuam com sweep de foto única.
  slidesIris: [
    "assets/img/iris_seguranca/iris1-1.jpg",
    "assets/img/iris_seguranca/iris1-2.jpg",
    "assets/img/iris_seguranca/iris1-3.jpg",
    "assets/img/iris_seguranca/iris1-4.jpg",
  ],
  descricaoIris: {
    pt: "Cuidado com o vão entre a plataforma e a cabine ao embarcar. Do lado voltado para o mar, a cabine deixa a estação Praia Vermelha deslizando entre prédios baixos e ganha altura; à esquerda, emoldurado pela estrutura de vidro da cabine, o próprio Pão de Açúcar ainda aparece distante; embaixo, abre-se a Enseada da Praia Vermelha, com sua faixa de areia pontilhada de banhistas, uma pequena ilha ao longe e a mata cobrindo o costão do Morro da Urca, para onde você segue.",
    "pt-pt": "Cuidado com o vão entre o cais e a cabine ao entrar; do lado virado para o mar, a cabine deixa a estação Praia Vermelha, deslizando entre prédios baixos, e ganha altura; à esquerda, emoldurado pela estrutura envidraçada da cabine, o próprio Pão de Açúcar ainda se avista ao longe; lá em baixo, abre-se a enseada da Praia Vermelha, com a faixa de areia salpicada de banhistas, uma pequena ilha ao longe e a mata a cobrir a arriba do Morro da Urca, para onde segues.",
    en: "Watch the gap between the platform and the cabin as you board. Facing the sea, the cabin glides out of Praia Vermelha station between low buildings and starts climbing; on the left, framed by the cabin's glass structure, Sugarloaf itself still looks distant; below, the cove of Praia Vermelha opens up, its stretch of sand dotted with sunbathers, a small island in the distance, and forest covering the slope of Morro da Urca, where you're headed.",
    "en-gb": "Mind the gap between the platform and the cabin when boarding. On the side facing the sea, the cabin leaves Praia Vermelha station, gliding between low buildings as it gains height; to the left, framed by the cabin's glass structure, Sugarloaf itself still appears in the distance; below, the Praia Vermelha cove opens out, its stretch of sand dotted with bathers, a small island in the distance and the hillside of Morro da Urca covered in woodland, where you're headed.",
    es: "Cuidado con el hueco entre el andén y la cabina al embarcar. Por el lado orientado al mar, la cabina deja la estación Praia Vermelha deslizándose entre edificios bajos y va ganando altura; a la izquierda, enmarcado por la estructura de cristal de la cabina, el propio Pão de Açúcar todavía se ve a lo lejos; abajo se abre la ensenada de Praia Vermelha, con su franja de arena salpicada de bañistas, una pequeña isla en la distancia y la vegetación cubriendo la ladera del Morro da Urca, hacia donde te diriges.",
    "es-ar": "Tené cuidado con el hueco entre la plataforma y la cabina al embarcar. Del lado que mira al mar, la cabina deja la estación Praia Vermelha deslizándose entre edificios bajos y va ganando altura; a la izquierda, enmarcado por la estructura de vidrio de la cabina, el propio Pão de Açúcar todavía se ve distante; abajo, se abre la Enseada da Praia Vermelha, con su franja de arena salpicada de bañistas, una islita a lo lejos y el monte cubriendo la ladera del Morro da Urca, hacia donde vos vas.",
    fr: "Attention à l'espace entre le quai et la cabine lors de l'embarquement. Côté mer, la cabine quitte la station Praia Vermelha en glissant entre des immeubles bas et prend de l'altitude ; à gauche, encadré par la structure vitrée de la cabine, le Pão de Açúcar lui-même apparaît encore au loin ; en contrebas s'ouvre l'anse de Praia Vermelha, avec sa bande de sable parsemée de baigneurs, une petite île au loin et la végétation couvrant le flanc du Morro da Urca, vers où vous vous dirigez.",
    "de-de": "Achten Sie beim Einsteigen auf den Spalt zwischen Plattform und Kabine. Auf der Meerseite verlässt die Kabine die Station Praia Vermelha, gleitet zwischen niedrigen Gebäuden hindurch und gewinnt an Höhe; links, eingerahmt von der Glasstruktur der Kabine, ist der Pão de Açúcar selbst noch in der Ferne zu sehen; darunter öffnet sich die Bucht von Praia Vermelha mit ihrem von Badegästen gesäumten Sandstreifen, einer kleinen Insel am Horizont und dem Wald, der den Hang des Morro da Urca bedeckt, Ihr nächstes Ziel.",
    it: "Attenzione al vuoto tra la banchina e la cabina durante l'imbarco. Sul lato rivolto verso il mare, la cabina lascia la stazione di Praia Vermelha scivolando tra edifici bassi e guadagna quota; a sinistra, incorniciato dalla struttura in vetro della cabina, si scorge ancora in lontananza il Pão de Açúcar; in basso si apre l'insenatura di Praia Vermelha, con la sua striscia di sabbia punteggiata di bagnanti, una piccola isola all'orizzonte e la vegetazione che ricopre il fianco del Morro da Urca, verso cui stai salendo.",
    "zh-cn": "上下车时，请留意站台与车厢之间的空隙。面朝大海的一侧，缆车缓缓驶离红海滩站，穿行于低矮的建筑之间，逐渐攀升；左侧，透过车厢的玻璃结构望去，面包山本身依然遥遥可见；下方，红海滩湾徐徐展开，沙滩上点缀着戏水的游客，远处浮现一座小岛，青翠的植被覆盖着乌尔卡山的山坡——你正前往的地方。",
    "zh-tw": "上車時請留意月台與車廂之間的間隙；面向海的一側，纜車車廂駛離紅灘站，穿梭於低矮樓房之間並逐漸攀升；左方，透過車廂玻璃構成的畫框，糖麵包山本身仍隱約可見於遠方；下方，紅灘海灣豁然展開，沙灘上點綴著戲水的遊客，遠處可見一座小島，以及覆蓋烏爾卡山山坡的蒼翠植被——那裡正是您即將抵達的目的地。",
    "ja-jp": "乗車の際は、プラットホームとゴンドラの隙間にご注意ください。海側の窓からは、ゴンドラがプライア・ヴェルメーリャ駅を離れ、低い建物の間をすり抜けながら高度を上げていく様子がご覧いただけます。左手には、ゴンドラのガラス越しに、ポン・デ・アスーカル山がまだ遠くに見えています。眼下にはプライア・ヴェルメーリャの入り江が広がります。海水浴客が点在する砂浜、遠方の小さな島、そしてこれから向かうウルカの丘の斜面を覆う緑の森が見渡せます。",
    "ru-ru": "При посадке следите за зазором между платформой и кабиной; с той стороны, что обращена к морю, кабина отправляется со станции Прая-Вермелья, скользя между невысокими зданиями, и постепенно набирает высоту; слева, в обрамлении стеклянной конструкции кабины, вдалеке ещё виднеется сама гора Пан-ди-Асукар; внизу открывается бухта Прая-Вермелья с песчаной полосой пляжа, усеянной отдыхающими, вдали — небольшой остров и зелень, покрывающая склон горы Урка, куда Вы направляетесь.",
    "ar-ma": "يُرجى الانتباه إلى الفجوة بين الرصيف والعربة عند الصعود؛ ومع مغادرة العربة محطة شاطئ ڤيرميلها من الجهة المطلة على البحر، تنساب بين المباني المنخفضة وتكتسب ارتفاعًا تدريجيًا؛ وعلى اليسار، ضمن إطار الهيكل الزجاجي للعربة، يظهر باو دي أسوكار نفسه لا يزال بعيدًا؛ وفي الأسفل يتكشف خليج شاطئ ڤيرميلها بشريطه الرملي المرصّع بالمصطافين، وجزيرة صغيرة في البعد، والغابة التي تكسو منحدر تلة أوركا، وجهتك التالية.",
  },
};
const HISTORIA_FOTO = {
  foto: "assets/img/bondinho/historia_bondinho.jpg",
  descricaoIris: "A cabine branca e envidraçada paira suspensa por cabos grossos de aço; dentro, passageiros em pé se apoiam nas barras, vestindo cores vivas; ao lado, uma estrutura de metal verde ancora os cabos à estação.",
  // Build 2026-08-17 (pedido do CEO): a narração principal desta tela (todos os 14 idiomas) troca a
  // foto única parada por um carrossel de 36 fotos reais em sequência numérica, 5s cada — mesma
  // técnica da trilha da Íris de video_seguranca (ver iniciarSlideshowFotos), não depende de
  // pcdProfile nem de idioma localizado, roda sempre que a narração de tipo2 tocar.
  slidesNarracao: Array.from({ length: 36 }, (_, i) => `assets/img/historia_bondinho/${String(i + 1).padStart(3, "0")}.jpg`),
};

// Mapa dos 14 mirantes (aba Percurso) — coordenadas medidas por inspeção visual direta da
// imagem `mapa_mirantes.png` (582×380px), recortada e ampliada 3x para localizar o centro exato
// de cada círculo numerado; percentuais são relativos à imagem inteira (mapa + legenda).
// Nomes de mirante são nomes próprios do parque — nunca traduzir (glossário, seção 1.2.1 do plano).
//
// Build 2026-08-02 — "foto"/"descricaoIris" adicionados a 12 dos 14 mirantes (todos exceto o 6,
// que já tinha storyboard AR completo, e o 11, que já tinha o Tipo 1 funcional). Atribuição por
// ORDEM NUMÉRICA das 28 fotos que o CEO tirou em visita de campo (1.jpg → mirante 1, 2.jpg →
// mirante 2, ...) — não por confirmação visual individual de cada enquadramento contra o nome
// oficial do mirante (ver metodologia e nota de confiança em relatorio-fotos.md). Exceção: o
// mirante 14 usa `niteroi.jpg` em vez de `14.jpg` — a foto numerada tem resolução muito inferior
// ao resto do lote (1366×935 vs 3000-5760px nas demais, ver relatorio-fotos.md) e foi substituída
// por outra do mesmo tema/direção (Fortaleza de Santa Cruz, em Niterói) com qualidade adequada;
// `14.jpg` fica sem uso nesta fase, pendente de re-captação.
// `descricaoIris` é o texto de audiodescrição (Íris/@audiodescricao) — só português do Brasil
// nesta fase, ainda sem revisão para virar roteiro de voz (síntese de áudio fica para depois da
// revisão de texto, pedido do CEO 2026-08-02). `temFoto` (sem áudio ainda) é distinto de
// `funcional` (áudio real produzido para ESTE app) — controla o badge e o tipo de tela aberta.
//
// Build 2026-08-02 (2ª leva) — `audioExterno` adicionado a 12 dos 14 mirantes: link direto do
// MP3 já publicado no site ATUAL do cliente (bondinho.audima.co/<slug>.html, ver mirantes.txt
// para o mapeamento completo e a metodologia). É conteúdo de TERCEIRO — do site em produção
// hoje, não roteirizado por @lente nem revisado nos padrões de Audiodescrição Detalhada (PCD)
// deste projeto — por isso não vira `funcional:true` nem ganha storyboard/legenda sincronizada;
// é tocado como referência/preview, com nota explícita na tela (ver playTrack()). Os mirantes 6
// e 11 já têm áudio PRÓPRIO (storyboard AR e Tipo 1) — o link externo deles existe (ver
// mirantes.txt) mas não é usado aqui de propósito, para não substituir conteúdo já produzido.
// Build 2026-08-16 (pedido do CEO) — os 12 mirantes abaixo (todos exceto 6 e 11, que já tinham
// produção própria) foram promovidos de "preview" (foto + descricaoIris estática + áudio de
// referência de terceiro) para "funcional" completo, no mesmo padrão do mirante06: roteiro
// histórico 100% autoral (pesquisa de @tour-content-historian + polimento de @lente, ~30-42%
// mais curto que o áudio de terceiro que substituiu, nenhuma frase reaproveitada), áudio próprio
// (edge_tts/pt-BR-FranciscaNeural) e storyboard AR (@foco) com legenda sincronizada frase a frase
// — mesmo mecanismo de playTrack()/MIRANTES_COM_STORYBOARD_AR usado pelo mirante06. `descricaoIris`
// (a descrição estática da Íris sobre a composição da foto) saiu do MIRANTES porque a "audiodescrição"
// destes mirantes agora é o próprio roteiro narrado, sincronizado por frase — não mais um texto fixo
// abaixo da foto. `fotoOriginal` é só um fallback de segurança (ver playTrack) caso um idioma sem
// storyboard ainda seja selecionado; os crops reais do storyboard usam essa mesma foto como fonte.
// Só pt está pronto (roteiro/áudio/storyboard); os outros 13 idiomas ficam para uma leva futura —
// ver timing_nota em cada assets/data/ar_storyboards/miranteXX/ar_storyboard.json.
// `descricaoIris` volta a existir aqui (build 2026-08-16) — não é mais mostrada como texto sob a
// foto (isso já tinha sido descontinuado), agora é a FONTE do áudio extra da trilha PCD Tipo 2
// (ver AUDIO_IRIS_EXTRA / tocarTrilhaIrisSeAplicavel): quando state.pcdProfile === true, depois do
// áudio da narração turística, este texto vira uma segunda faixa de áudio ("trilha de continuação"
// da Íris), com sweep esquerda→direita sincronizado com a duração desse áudio extra.
const MIRANTES = [
  { num: 1, nome: "Mirante Despertar", x: 11.2, y: 41.6, funcional: true, tipo: "mirante01", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante01_despertar.jpg",
    descricaoIris: "Ao fundo, um paredão de pedra coberto de mata verde-escura ladeia o pátio de acesso ao teleférico; à esquerda, prédios residenciais e um estacionamento de carros dividem espaço com a estrutura curva e esverdeada da estação inferior do bondinho, encostada na encosta arborizada; no centro, o letreiro vermelho Bondinho Pão de Açúcar marca a entrada envidraçada, ladeada por painéis iluminados com fotos panorâmicas do Rio de Janeiro e pela bilheteria; à direita, um amplo telhado de ripas de madeira, sustentado por colunas escuras e ventiladores industriais suspensos, cobre o caminho por onde visitantes caminham entre grades metálicas e cordas de contenção." },
  { num: 2, nome: "Mirante Santuário Marinho", x: 26.6, y: 41.6, funcional: true, tipo: "mirante02", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante02_santuariomarinho.jpg",
    descricaoIris: "À esquerda, o mar azul-turquesa da enseada recebe veleiros e lanchas ancoradas junto a uma costa de pedra escura; ao centro, o Morro da Urca ergue sua cúpula de mata verde com a estação do bondinho no topo, e a rocha nua do granito desce em veios claros até a areia da Praia Vermelha, pontilhada de guarda-sóis coloridos e banhistas; à direita, os prédios brancos de telhado alaranjado da Escola Naval cercam um jardim com monumento, entre árvores e as primeiras ruas da cidade." },
  { num: 3, nome: "Mirante dos Pioneiros", x: 24.1, y: 31.1, funcional: true, tipo: "mirante03", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante03_pioneiros.jpg",
    descricaoIris: "Um paredão de granito nu, sulcado por escorrimentos escuros de chuva, ergue-se coberto de mata densa no topo e nas bordas, com o mar e um pequeno recorte de ilhota ao longe à esquerda; ao pé do morro, o bairro de Botafogo se estende em prédios brancos e torres residenciais, entre eles o edifício histórico do Colégio Naval; ao fundo à direita, o Morro Dois Irmãos surge azulado na neblina, sob um céu claro cortado por cabos do teleférico em primeiro plano." },
  { num: 4, nome: "Mirante dos Navegadores", x: 30.4, y: 7.1, funcional: true, tipo: "mirante04", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante04_navegadores.jpg",
    descricaoIris: "Uma orla de folhagem emoldura a base da imagem; à esquerda, um contraforte de pedra e mata desce até uma lâmina de mar recortada entre as encostas; ao centro, morros e serras se alinham em silhuetas cada vez mais claras pela neblina — entre eles, o perfil reconhecível da Pedra da Gávea — até o Cristo Redentor, minúsculo sobre o cume do Corcovado, à direita do centro; na base de todo o relevo, a cidade se estende em quarteirões densos de edifícios claros que descem até a orla, onde uma pequena marina no canto inferior direito reúne veleiros e lanchas ancorados sobre a água." },
  { num: 5, nome: "Mirante Fortaleza de S. João", x: 35.6, y: 7.1, funcional: true, tipo: "mirante05", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante05_fortalezasaojoao.jpg",
    descricaoIris: "Da moldura de mata densa em primeiro plano, a vista aérea se abre sobre a Baía de Guanabara, com a península verde da Fortaleza de São João no centro, seus muros de pedra amarelada e o conjunto de telhados vermelhos pousados junto à água; à esquerda, veleiros e lanchas ancoram nas águas próximas às casas coloridas da Urca, enquanto à direita uma faixa de areia clara contorna a base do morro coberto de mata; ao fundo, sob leve neblina, os morros da cidade e uma plataforma marítima se recortam no horizonte." },
  { num: 6, nome: "Mirante Guardião da Pedra", x: 50.3, y: 13.4, funcional: true, tipo: "mirante06" },
  { num: 7, nome: "Mirante das Mulheres", x: 58.1, y: 20.5, funcional: true, tipo: "mirante07", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante07_mulheres.jpg",
    descricaoIris: "À esquerda, o mar se estende em azul-esverdeado até se perder numa neblina leve, onde se distingue ao longe a linha baixa da cidade e uma faixa de praia; ao centro, morros arredondados emergem da bruma ao longo da Baía de Guanabara; à direita, o paredão de granito do Pão de Açúcar domina o quadro, com vegetação rala nas fendas da rocha e a estação do teleférico visível no topo; em primeiro plano, a mata densa cobre a encosta mais próxima, e um bondinho, suspenso por cabos de aço, se aproxima pela lateral direita." },
  { num: 8, nome: "Mirante da Biodiversidade", x: 64.1, y: 19.7, funcional: true, tipo: "mirante08", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante08_biodiversidade.jpg",
    descricaoIris: "Uma vertente de granito íngreme domina o quadro à esquerda, com a estação de teleférico visível no cume e os cabos do bondinho descendo em diagonal até o primeiro plano; a encosta se cobre de mata densa que desce até a base do morro, entre árvores verdes e alguns troncos secos; à direita, o mar se estende sob um céu nublado, pontuado por pequenas ilhas rochosas ao longe, um navio e embarcações menores, com ondas brancas quebrando junto à linha da costa." },
  { num: 9, nome: "Mirante Bossa Nova", x: 89.9, y: 26.3, funcional: true, tipo: "mirante09", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante09_bossanova.jpg",
    descricaoIris: "O mar aberto ocupa a metade esquerda do quadro, pontuado por dois ilhotes escuros no horizonte e um barco solitário que risca a água com um rastro branco; ao centro, um promontório de mata densa e verde-escura avança sobre o oceano e envolve uma enseada onde pequenos barcos boiam em águas verde-turquesa; à direita, uma praia em curva de areia clara se estende diante de prédios brancos, até um morro rochoso e íngreme, que fecha o horizonte ao fundo." },
  { num: 10, nome: "Mirante dos Escaladores", x: 90.7, y: 16.6, funcional: true, tipo: "mirante10", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante10_escaladores.jpg",
    descricaoIris: "O panorama se abre a partir do alto do Pão de Açúcar: à esquerda, o litoral recortado se dissolve numa bruma azulada, com o perfil pontudo do Morro Dois Irmãos contra o mar ao fundo, enquanto no canto inferior a estrutura de uma cabine do bondinho desliza por cabos de aço, minúscula sobre o desnível de pedra da Urca; ao centro, o bairro de Botafogo cobre o vale entre morros cobertos de mata densa, e no topo do Corcovado, ao fundo, distingue-se a silhueta minúscula do Cristo Redentor; à direita, a Baía de Guanabara desenha uma enseada em curva, pontilhada por dezenas de barcos brancos ancorados diante da faixa de areia e dos prédios da orla." },
  { num: 11, nome: "Mirante Pq. Bondinho do Pão de Açúcar", x: 84.5, y: 15.8, funcional: true, tipo: "tipo1" },
  { num: 12, nome: "Mirante dos 400", x: 83.0, y: 28.4, funcional: true, tipo: "mirante12", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante12_400.jpg",
    descricaoIris: "O mar aberto ocupa o horizonte à esquerda, pontuado por pequenas ilhas quase dissolvidas na neblina distante; ao centro, a praia de Copacabana traça uma longa curva clara entre a água azul-acinzentada e a fileira de prédios da orla; em primeiro plano à direita, dois costões cobertos de mata densa descem até uma enseada verde-turquesa onde barcos do tamanho de brinquedos, vistos desta altura, permanecem ancorados, enquanto a cidade se espalha entre morros até os picos recortados no horizonte." },
  { num: 13, nome: "Mirante do Gigante", x: 84.2, y: 36.1, funcional: true, tipo: "mirante13", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante13_gigante.jpg",
    descricaoIris: "À esquerda, o mar aberto se estende em azul-turquesa até uma pequena ilha em silhueta no horizonte enevoado, e uma praia curva-se em faixa clara junto à orla, ladeada por prédios baixos e por uma encosta verde e rochosa que domina o primeiro plano; ao centro, a cidade se espalha entre morros florestados cujos picos ultrapassam em altura os edifícios mais altos da orla, e montanhas azuladas pela neblina se sucedem em camadas até o fundo do quadro; à direita, no topo de um pico distante ergue-se em silhueta a estátua do Cristo Redentor, cabos do teleférico cruzam o primeiro plano em direção a uma estação sobre outro morro verde, e pequenos barcos brancos pontilham a baía logo abaixo." },
  { num: 14, nome: "Mirante Fortaleza de Santa Cruz", x: 96.7, y: 17.9, funcional: true, tipo: "mirante14", langs: ["pt-br", "pt-pt", "en-us", "en-gb", "es-es", "fr-fr", "es-ar", "de-de", "it-it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"],
    fotoOriginal: "assets/img/mirantes/mirante14_fortalezasantacruz.jpg",
    descricaoIris: "À esquerda, sob neblina clara que esmaece o horizonte, a longa faixa de areia de Icaraí, em Niterói, acompanha o perfil da cidade enquanto um cargueiro de casco vermelho-escuro cruza as águas, deixando atrás de si um rastro branco de espuma; ao centro, um morro rochoso de dois picos desce até o mar, onde as muralhas baixas da Fortaleza de Santa Cruz se alinham rente à água, na entrada da baía; à direita, a paisagem segue entre morros esmaecidos pela neblina, emoldurada em primeiro plano por galhos de árvore." },
];


// Telas que fazem parte do "shell" (mostram a barra de abas Percurso/Ajustes).
// screen-vista é reaproveitada tanto pelo shell (vistas normais) quanto pela sequência de
// introdução (vídeo de segurança/história) — nesse segundo caso a tabbar fica escondida
// (ver showScreen), para não deixar o visitante pular a introdução tocando numa aba.
const SCREENS_WITH_TABBAR = new Set(["screen-main", "screen-vista"]);
// Telas transitórias — nunca entram na pilha de navegação do botão Voltar
const SCREENS_NOT_STACKABLE = new Set(["screen-anuncio", "screen-pagamento"]);

const state = {
  lang: null,
  plano: null, // "basico" | "premium" — escolhido logo após o idioma
  presenterFollows: false, // controle do apresentador para o fluxo do brinde
  captions: null,
  arStoryboard: null, // manifesto de zoom/crop sincronizado do mirante06 (ver @foco / skill storyboard-ar)
  activeTab: "percurso",
  pcdProfile: false, // true = "Audiodescrição Detalhada — PCD (Tipo 2)", escolhido em screen-modo-narracao (ou toggle de Ajustes)
  tocandoTrilhaIris: false, // true enquanto a trilha de continuação da Íris está tocando (ver tocarTrilhaIrisSeAplicavel)
  i18n: null,
  entryAudioActive: false,
  entryAudioIndex: 0,
  hoverVoiceEnabled: true, // descrição por voz ao navegar — ativada por padrão; desativável em Ajustes
  currentScreen: "screen-entrada",
  navStack: [],
  adInterval: null,
  pendingAdCallback: null,
  vistaTipoAtual: null,
  introStep: null, // "seguranca" | "historia" | null — controla a sequência obrigatória pré-shell
  introConcluida: false, // uma vez concluída, não repete a sequência na mesma sessão (só Home reseta)
  mirantesVisitados: new Set(), // números dos mirantes já abertos pelo visitante (marca automática ao abrir a vista, controla verde/vermelho no mapa)
};

function $(sel) { return document.querySelector(sel); }
function $all(sel) { return document.querySelectorAll(sel); }

// ---------- Primitivo de exibição de tela (não mexe em pilha/anúncio — use navigateTo() para isso) ----------
function showScreen(id) {
  // Pedido explícito do CEO: qualquer troca de tela interrompe a locução em andamento —
  // ponto único de passagem de toda navegação (navigateTo, Voltar, troca de aba), então
  // parar o áudio aqui cobre todos os casos sem precisar espalhar a chamada.
  stopAllAudio();
  $all(".screen").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  // Build 2026-08-17: quem rola agora é #app-screens (área interna da moldura de celular), não a
  // janela do navegador — ver #app no CSS.
  const scrollArea = $("#app-screens");
  if (scrollArea) scrollArea.scrollTop = 0; else window.scrollTo(0, 0);
  const tabbar = $(".tabbar");
  // durante a sequência de introdução (vídeo segurança/história), a tabbar fica escondida mesmo
  // em screen-vista — senão o visitante pula a introdução tocando direto numa aba do shell.
  const showTabbar = SCREENS_WITH_TABBAR.has(id) && !state.introStep;
  if (tabbar) tabbar.style.display = showTabbar ? "flex" : "none";
}

// ---------- Navegação com pilha (para o botão Voltar) e interceptação de anúncio (plano Básico) ----------
function navigateTo(id, afterNav) {
  function doNav() {
    if (state.currentScreen && state.currentScreen !== id && !SCREENS_NOT_STACKABLE.has(state.currentScreen)) {
      state.navStack.push(state.currentScreen);
    }
    showScreen(id);
    state.currentScreen = id;
    if (afterNav) afterNav();
  }
  if (state.plano === "basico") {
    showAdThen(doNav);
  } else {
    doNav();
  }
}

// ---------- Espaço Comercial — repete a cada troca de tela enquanto o plano for Básico ----------
function showAdThen(callback) {
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

// ---------- Botão Voltar (rodapé global) — não dispara anúncio, para não travar a saída de uma tela ----------
function irParaTras() {
  stopAllAudio();
  const prev = state.navStack.pop();
  if (prev) {
    showScreen(prev);
    state.currentScreen = prev;
    // refresca verde/vermelho do mapa (mirante recém-visitado) ao voltar pra tela do Percurso
    if ($("#mapa-hotspots")) { buildMapaHotspots(); renderMapaLabels(); }
  } else {
    goHome();
  }
}

// ---------- i18n (interface segue o idioma escolhido; exceções: modal de stub e painel ficam sempre em PT) ----------
async function loadI18N() {
  if (state.i18n) return;
  // cache:"no-store" — sem isso, o navegador serve uma cópia antiga em cache indefinidamente
  // mesmo após F5/Ctrl+Shift+R (o hard-reload não alcança fetch()s feitos depois do carregamento
  // inicial da página). Achado durante o teste da remoção da aba "Ver Vista" (2026-08-02).
  const res = await fetch("assets/data/i18n.json", { cache: "no-store" });
  state.i18n = await res.json();
}

// Build 2026-08-17 (pedido do CEO): rótulos gravados em pixel na imagem do mapa (3 marcos +
// legenda de 14 mirantes) — carregados uma vez, cacheados, usados por renderMapaLabels().
async function loadMapaLabels() {
  if (state.mapaLabels) return;
  const res = await fetch("assets/data/mapa_labels_i18n.json", { cache: "no-store" });
  state.mapaLabels = await res.json();
}

function t(key) {
  const i18nKey = state.lang ? state.lang.i18nKey : "pt";
  return (state.i18n && state.i18n[i18nKey] && state.i18n[i18nKey][key]) || (state.i18n && state.i18n.pt && state.i18n.pt[key]) || key;
}

function applyLanguage(lang) {
  const i18nKey = lang.i18nKey;
  if (!state.i18n || !state.i18n[i18nKey]) return;
  $all("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const txt = state.i18n[i18nKey][key];
    if (txt) el.textContent = txt;
  });
}

// ---------- Locução de voz pré-gravada para elementos de decisão (abas, itens de Ajustes, botões do brinde, Voltar/Home/Sair, plano, pagamento) ----------
// Dispara ao passar o cursor (mouseenter), não ao clicar — pedido explícito do CEO.
// Ativada por padrão; desativável em Ajustes (toggle "Descrição por voz ao navegar").
function playUiVoice(key) {
  if (!state.hoverVoiceEnabled) return;
  if (!state.lang) return;
  const el = $("#ui-voice-audio");
  if (!el) return;
  el.pause();
  el.src = `assets/audio/ui/${key}_${state.lang.audioKey}.mp3`;
  el.currentTime = 0;
  el.play().catch(() => {});
}

function attachHoverVoice() {
  $all("[data-voice]").forEach((el) => {
    el.addEventListener("mouseenter", () => playUiVoice(el.getAttribute("data-voice")));
  });
}

// ---------- Parar todo áudio em reprodução (usado por Voltar, Home e Sair) ----------
function stopAllAudio() {
  const player = $("#player-audio");
  if (player) player.pause();
  const uiVoice = $("#ui-voice-audio");
  if (uiVoice) uiVoice.pause();
  if (captionTimer) { clearInterval(captionTimer); captionTimer = null; }
  if (arStoryboardTimer) { clearInterval(arStoryboardTimer); arStoryboardTimer = null; }
  if (pistaCarouselTimer) { clearInterval(pistaCarouselTimer); pistaCarouselTimer = null; }
  if (tipo1StoryboardTimer) { clearInterval(tipo1StoryboardTimer); tipo1StoryboardTimer = null; }
  pararSlideshowFotos(); // troca de tela interrompe qualquer carrossel de fotos em andamento (pedido do CEO)
  stopEntryAnnouncement();
}

// ---------- Anúncio multilíngue da tela de entrada (loop 14 idiomas, para no escaneamento) ----------
function startEntryAnnouncement() {
  state.entryAudioActive = true;
  state.entryAudioIndex = 0;
  playNextEntryAnnouncement();
}

function stopEntryAnnouncement() {
  state.entryAudioActive = false;
  const el = $("#entry-audio");
  if (el) { el.pause(); el.removeAttribute("src"); }
}

function playNextEntryAnnouncement() {
  if (!state.entryAudioActive) return;
  const lang = LANGS[state.entryAudioIndex % LANGS.length];
  state.entryAudioIndex++;
  const labelEl = $("#entry-audio-lang");
  if (labelEl) labelEl.textContent = lang.name;
  const el = $("#entry-audio");
  el.src = `assets/audio/anuncio_entrada_${lang.entryAudioKey}.mp3`;
  const playPromise = el.play();
  if (playPromise && playPromise.catch) {
    playPromise.catch(() => {
      // autoplay bloqueado pelo navegador (política padrão sem interação do usuário) — fallback visível e honesto
      state.entryAudioActive = false;
      $("#entry-audio-indicator").style.display = "none";
      $("#entry-audio-enable").style.display = "inline-block";
    });
  }
}

// ---------- Tela de entrada: (re)inicialização do anúncio, usada no load e no botão Home ----------
function resetEntryScreen() {
  $("#entry-audio-enable").style.display = "none";
  $("#entry-audio-indicator").style.display = "block";
  startEntryAnnouncement();
}

// ---------- Home: volta ao início, reseta idioma/plano, reinicia o anúncio multilíngue ----------
function goHome() {
  stopAllAudio();
  state.lang = null;
  state.plano = null;
  state.navStack = [];
  state.activeTab = "percurso";
  state.introStep = null;
  state.introConcluida = false; // reset completo: a próxima entrada no shell repete a sequência de introdução
  state.mirantesVisitados = new Set();
  document.documentElement.removeAttribute("dir");
  document.documentElement.setAttribute("lang", "pt-BR");
  // Bug reportado pelo CEO 17/08: applyLanguage() escreve o texto traduzido direto no textContent
  // dos elementos [data-i18n] — não existe um "desfazer" automático, então depois de escolher um
  // idioma de escrita não-ocidental (ex. 中文/日本語/العربية) e voltar pro Home, o rodapé (e qualquer
  // outro texto data-i18n) ficava preso nesses caracteres em vez de voltar ao estado inicial do app
  // (português, igual ao HTML antes de qualquer idioma ser escolhido). Reaplica "pt" explicitamente.
  if (state.i18n) applyLanguage({ i18nKey: "pt" });
  showScreen("screen-entrada");
  state.currentScreen = "screen-entrada";
  resetEntryScreen();
}

// ---------- Sair: confirma e encerra a sessão de verdade (pedido do CEO 17/08 — antes só mostrava
// a tela "screen-encerrada" dentro do próprio app, que ainda dava pra continuar navegando pelo
// rodapé; #screen-encerrada fica órfã no DOM, sem uso). ----------
function abrirConfirmSair() {
  $("#confirm-sair-modal").classList.add("show");
}
function fecharConfirmSair() {
  $("#confirm-sair-modal").classList.remove("show");
}
function confirmarSair() {
  fecharConfirmSair();
  stopAllAudio();
  // window.close() só funciona se a aba foi aberta via script (window.open) — navegador bloqueia
  // silenciosamente pra abas normais, sem lançar erro. Tenta mesmo assim (funciona em modo kiosk/
  // app de alguns navegadores) e usa about:blank como garantia de que a sessão termina de verdade
  // (sai do HTML do protótipo) mesmo quando o close silencioso falha.
  window.close();
  setTimeout(() => { window.location.href = "about:blank"; }, 60);
}

function showStub(title, whatWorks) {
  $("#stub-title").textContent = title;
  $("#stub-what-works").textContent = whatWorks;
  $("#stub-modal").classList.add("show");
}
function closeStub() {
  $("#stub-modal").classList.remove("show");
}

// ---------- Tela 1: entrada ----------
function simularEscaneamento() {
  stopEntryAnnouncement();
  loadI18N();
  buildLanguageGrid();
  navigateTo("screen-lang");
}

// ---------- Tela 2: idioma ----------
// Build 2026-07-2X — as 14 variantes agora são todas clicáveis/funcionais (antes, 5 tinham
// áudio e 9 mostravam aviso "não disponível"). Grade de 2 colunas com 14 itens fica mais alta;
// CSS (.lang-grid) já é grid fluido, sem ajuste necessário.
function buildLanguageGrid() {
  const grid = $("#lang-grid");
  grid.innerHTML = "";
  $("#lang-notice").textContent = "";
  LANGS.forEach((l) => {
    const card = document.createElement("div");
    card.className = "lang-card";
    card.innerHTML = `<span class="flag">${FLAG_SVG[l.code]}</span><span class="name">${l.name}</span>`;
    card.onclick = () => selectLanguage(l);
    grid.appendChild(card);
  });
}

async function selectLanguage(l) {
  state.lang = l;
  document.documentElement.setAttribute("dir", l.dir || "ltr"); // árabe (ar-ma) é a única variante RTL do roster
  document.documentElement.setAttribute("lang", l.code); // leitor de tela deve pronunciar no idioma certo, não travado em pt-BR
  await loadI18N();
  applyLanguage(l);
  $("#lang-current-flag").innerHTML = FLAG_SVG[l.code];
  $("#lang-current-name").textContent = l.name;
  await loadMapaLabels();
  renderMapaLabels();
  await loadCaptions();
  attachHoverVoice(); // cobre os elementos [data-voice] recém-traduzidos/renderizados
  navigateTo("screen-modo-narracao");
}

// ---------- Tela de escolha do tipo de narração (Narração Turística x Audiodescrição Detalhada/
// PCD Tipo 2) — build 2026-08-16, pedido do CEO. Decide state.pcdProfile, que controla o
// comportamento do áudio/legenda em toda vista com trilha de continuação da Íris (ver playTrack/
// tocarTrilhaIrisSeAplicavel). Build 2026-08-17: o toggle espelhado em Ajustes saiu do card — esta
// tela vira o único lugar que define a escolha.
function escolherModoTuristica() {
  state.pcdProfile = false;
  navigateTo("screen-plano");
}
function escolherModoPCD() {
  state.pcdProfile = true;
  navigateTo("screen-plano");
}

// ---------- Tela de escolha de plano (Básico com anúncios / Premium sem anúncios) ----------
function escolherPlanoBasico() {
  state.plano = "basico";
  iniciarSequenciaIntro();
}
function escolherPlanoPremium() {
  navigateTo("screen-pagamento");
}

// ---------- Pagamento simulado (Premium) ----------
function confirmarPagamento(metodo) {
  const status = $("#pagamento-status");
  status.style.display = "block";
  status.textContent = t("pagamento_processando");
  setTimeout(() => {
    state.plano = "premium";
    status.style.display = "none";
    iniciarSequenciaIntro();
  }, 900);
}

// ---------- Sequência de introdução obrigatória: vídeo de segurança → mapa do complexo → vídeo de história → roteiro de visitação ----------
// Roda uma única vez por sessão (Home reseta e faz repetir). Reaproveita a tela de vista (screen-vista)
// tanto para o vídeo de segurança (conteúdo próprio) quanto para o de história (reaproveita tipo2/
// "História do Bondinho", já produzido — não é conteúdo duplicado). Entre os dois, uma tela de
// transição fixa (screen-mapa) mostra o mapa do complexo; avança ao toque em qualquer ponto dela
// (pedido do CEO), sem áudio pausável — só a instrução de toque com hover-voice/i18n normal.
function iniciarSequenciaIntro() {
  if (state.introConcluida) {
    navigateTo("screen-main", () => doSwitchTab("percurso"));
    return;
  }
  state.introStep = "seguranca";
  abrirVista("video_seguranca");
}

function avancarIntro() {
  if (state.introStep === "seguranca") {
    state.introStep = "mapa";
    navigateTo("screen-mapa");
  } else if (state.introStep === "mapa") {
    state.introStep = "historia";
    abrirVista("tipo2");
  } else if (state.introStep === "historia") {
    // Build 2026-08-17 (pedido do CEO): a introdução vai direto de História pro Percurso — Ajustes
    // deixou de ser parada obrigatória (agora só se acessa tocando o ícone da aba, quando o
    // visitante quiser) e a tela "Roteiro de Visitação" foi excluída.
    state.introStep = null;
    state.introConcluida = true;
    navigateTo("screen-main", () => doSwitchTab("percurso"));
  }
}

// ---------- Rótulos traduzidos sobre o mapa (build 2026-08-17, pedido do CEO) ----------
// A imagem assets/img/mapa_mirantes.png tem 3 rótulos de marco (Praia Vermelha/Morro da Urca/
// Pão de Açúcar) e a legenda dos 14 mirantes gravados em pixel, só em português — sem isso,
// nenhum texto ali mudaria de idioma. Esta função cobre cada um com um card de fundo opaco e
// escreve a tradução do idioma ativo (assets/data/mapa_labels_i18n.json), chamada de novo a
// cada troca de idioma (selectLanguage). Hotspots clicáveis continuam em buildMapaHotspots(),
// que só roda uma vez — não precisam ser refeitos por idioma, só a posição (x/y) importa.
function renderMapaLabels() {
  if (!state.mapaLabels || !state.lang) return;
  const key = state.lang.i18nKey;
  const L = state.mapaLabels;
  const pega = (obj) => (obj && (obj[key] || obj.pt)) || "";

  $("#mapa-landmark-praia").textContent = pega(L.praia_vermelha);
  $("#mapa-landmark-urca").textContent = pega(L.morro_urca);
  $("#mapa-landmark-acucar").textContent = pega(L.pao_acucar);

  const cover = $("#mapa-legend-cover");
  if (cover) {
    cover.innerHTML = `<div class="mapa-legend-grid">${MIRANTES.map((m) => {
      const nome = pega(L.mirantes[String(m.num)]) || m.nome;
      const visitado = state.mirantesVisitados.has(m.num) ? " visitado" : "";
      return `<button type="button" class="mapa-legend-item${visitado}" data-num="${m.num}"><span class="legend-num">${m.num}</span><span class="legend-nome">${nome}</span></button>`;
    }).join("")}</div>`;
    $all(".mapa-legend-item").forEach((btn) => {
      const m = MIRANTES.find((x) => x.num === parseInt(btn.getAttribute("data-num"), 10));
      btn.onclick = () => mapaSelecionarMirante(m);
    });
  }
}

// Handler único de seleção de mirante — compartilhado pelo hotspot sobre o número no mapa e pelo
// item da legenda abaixo (mesmo comportamento nos dois: abre a vista e marca "visitado").
function mapaSelecionarMirante(m) {
  // m.langs restringe em quais idiomas o conteúdo real está disponível (ex.: Mirante 6
  // só tem roteiro revisado em português nesta fase — nunca abrir áudio não revisado
  // "de qualquer jeito" só porque existe tecnicamente um arquivo).
  const langOk = !m.langs || (state.lang && m.langs.includes(state.lang.code));
  if (m.funcional && langOk) {
    state.mirantesVisitados.add(m.num);
    abrirVista(m.tipo);
  } else if (m.funcional && !langOk) {
    showStub(
      "Ainda é um protótipo",
      `${m.nome} (nº ${m.num}): audiodescrição real disponível em português. Nos demais idiomas desta versão do protótipo, o roteiro ainda depende de adaptação revisada pelos agentes de locução por idioma antes de virar áudio — troque para português para ouvir este mirante.`
    );
  } else if (m.temFoto) {
    // Foto real + descrição da Íris já existem; só o áudio (síntese de voz) ainda não —
    // texto em revisão, pedido do CEO 2026-08-02 (ver relatorio-fotos.md).
    state.mirantesVisitados.add(m.num);
    abrirVista(`mirante_preview_${m.num}`);
  } else {
    showStub(
      "Ainda é um protótipo",
      `${m.nome} (nº ${m.num}): nesta versão, só o Mirante Pq. Bondinho do Pão de Açúcar (nº 11) e o Mirante Guardião da Pedra (nº 6, em português) têm audiodescrição funcional. Os demais mirantes dependem da vistoria de campo (pendência 1 do plano) e da captação por drone (seção 2.1) antes de virar conteúdo real.`
    );
  }
}

// ---------- Mapa dos 14 mirantes (aba Percurso) — hotspots clicáveis sobre a imagem ----------
function buildMapaHotspots() {
  const wrap = $("#mapa-hotspots");
  if (!wrap) return;
  // Build 2026-08-17 (pedido do CEO): ".visitado" (vermelho) sobrepõe a cor padrão (verde) assim
  // que o visitante já abriu aquele mirante nesta sessão. Selo de emoji (🟢/🔊/📷, build 2026-08-02)
  // removido — os 14 mirantes são todos funcional:true agora, o selo tinha virado o mesmo círculo
  // verde repetido 14x no mapa, sem diferenciar mais nada.
  wrap.innerHTML = MIRANTES.map((m) => {
    const visitado = state.mirantesVisitados.has(m.num) ? " visitado" : "";
    return `<button class="mapa-hotspot${m.funcional ? " funcional" : ""}${!m.funcional && m.temFoto ? " preview" : ""}${visitado}" style="left:${m.x}%; top:${m.y}%;" data-num="${m.num}" aria-label="${m.nome}">
        <span class="hotspot-dot"></span>
      </button>`;
  }).join("");
  $all(".mapa-hotspot").forEach((btn) => {
    const m = MIRANTES.find((x) => x.num === parseInt(btn.getAttribute("data-num"), 10));
    btn.onclick = () => mapaSelecionarMirante(m);
  });
}

// ---------- Shell principal: abas (troca de aba é ad-gated no plano Básico, mas nunca empilha no Voltar) ----------
function switchTab(tab) {
  if (state.plano === "basico") {
    showAdThen(() => doSwitchTab(tab));
  } else {
    doSwitchTab(tab);
  }
}

function doSwitchTab(tab) {
  state.activeTab = tab;
  // sempre reafirma screen-main (mesmo que o estado lógico já apontasse pra cá) — a tela
  // de Espaço Comercial pode ter ficado visualmente ativa sem atualizar state.currentScreen
  showScreen("screen-main");
  state.currentScreen = "screen-main";
  $all(".tab-panel").forEach((p) => p.classList.remove("active"));
  $("#tab-" + tab).classList.add("active");
  $all(".tabbar button").forEach((b) => b.classList.remove("active"));
  $("#tabbtn-" + tab).classList.add("active");
  if (tab === "percurso") { buildMapaHotspots(); renderMapaLabels(); }
}

// ---------- Áudio + legendas ----------
async function loadCaptions() {
  if (state.captions) return;
  const res = await fetch("assets/data/captions.json", { cache: "no-store" });
  state.captions = await res.json();
}

// Storyboard AR — sequência de zoom/crop sincronizada com o áudio real de cada mirante, gerada
// por prototipo/assets/data/gerar_storyboard_ar_mirante0X.py (ver agente @foco / skill
// /storyboard-ar). Cacheado por mirante_id em state.arStoryboards (não mais uma única variável —
// build 2026-08-16 expandiu de "só mirante06" para 13 mirantes com storyboard). Hoje só o idioma
// pt existe para os 12 mirantes novos (mirante06 já tem os 14, ver timing_nota de cada manifesto).
// mirante06 mantém o path legado (arquivo solto em assets/data/), os novos ficam em
// assets/data/ar_storyboards/{mirante_id}/ar_storyboard.json — ver AR_STORYBOARD_IMG_BASE_DIR.
const AR_STORYBOARD_PATH = {
  mirante06: "assets/data/ar_storyboard_mirante06.json",
};
const AR_STORYBOARD_IMG_BASE_DIR = {
  mirante06: "assets/img/mirante06",
};
// Os 12 mirantes preview que ganharam storyboard AR nesta leva (build 2026-08-16) — todos seguem
// o mesmo path padrão assets/data/ar_storyboards/{id}/, então entram automaticamente no fallback
// abaixo (loadArStoryboard/renderArStoryboardLoop) sem precisar de entrada própria nos mapas acima.
const MIRANTES_COM_STORYBOARD_AR = new Set([
  "mirante06", "mirante01", "mirante02", "mirante03", "mirante04", "mirante05",
  "mirante07", "mirante08", "mirante09", "mirante10", "mirante12", "mirante13", "mirante14",
]);

function arStoryboardPath(mirante_id) {
  return AR_STORYBOARD_PATH[mirante_id] || `assets/data/ar_storyboards/${mirante_id}/ar_storyboard.json`;
}
function arStoryboardImgBaseDir(mirante_id) {
  return AR_STORYBOARD_IMG_BASE_DIR[mirante_id] || `assets/data/ar_storyboards/${mirante_id}`;
}

async function loadArStoryboard(mirante_id) {
  state.arStoryboards = state.arStoryboards || {};
  if (state.arStoryboards[mirante_id]) return state.arStoryboards[mirante_id];
  try {
    const res = await fetch(arStoryboardPath(mirante_id), { cache: "no-store" });
    state.arStoryboards[mirante_id] = await res.json();
  } catch (e) {
    state.arStoryboards[mirante_id] = null; // sem storyboard, playTrack cai no fallback de foto única estática
  }
  return state.arStoryboards[mirante_id];
}

// Build 2026-08-16 (achado do CEO: a foto não trocava junto com o início do áudio) — a causa era
// o fetch() do manifesto JSON só começar QUANDO o visitante já tinha tocado no mirante, então o
// áudio (que dá play() logo de cara) sempre saía na frente da troca de imagem por uma rede/parse
// inteiros de atraso. Correção: buscar os 13 manifestos de storyboard AR em paralelo assim que o
// app carrega (DOMContentLoaded), preenchendo o mesmo cache state.arStoryboards que loadArStoryboard
// já usa — quando o visitante realmente abre uma vista, o JSON já está em memória e só falta
// carregar a imagem do primeiro shot (poucos KB, quase instantâneo). Não bloqueia nada: dispara e
// esquece, cada loadArStoryboard() posterior reaproveita o resultado (ou refaz o fetch se ainda
// não tiver chegado, sem quebrar o fluxo).
function prefetchArStoryboards() {
  MIRANTES_COM_STORYBOARD_AR.forEach((mirante_id) => { loadArStoryboard(mirante_id); });
}

function langForAudio() {
  // todas as 14 variantes agora têm áudio; fallback "pt" só se nenhum idioma foi selecionado ainda
  return state.lang ? state.lang.audioKey : "pt";
}

// Vistas com trilha de continuação da Íris disponível (build 2026-08-16) — chave = mesmo "tipo"
// usado em playTrack()/state.vistaTipoAtual; arquivo em assets/audio/{tipo}_iris_{audioKey}.mp3,
// legenda sincronizada por frase em captions.json[`${tipo}_iris`][audioKey]. Idiomas prontos ver
// AUDIO_IRIS_LANGS_PRONTOS (cresce um de cada vez, skill localizar-audioguia-mirante); mirante06 e
// tipo1 ficam de fora por ora — já têm estrutura de roteiro própria, sem uma descricaoIris simples
// equivalente às demais (pendência a decidir).
const AUDIO_IRIS_TIPOS = new Set([
  "mirante01", "mirante02", "mirante03", "mirante04", "mirante05",
  "mirante07", "mirante08", "mirante09", "mirante10", "mirante12", "mirante13", "mirante14",
  "video_seguranca", "tipo2",
]);

// Idiomas (audioKey) com os 12 mirantes + trilha da Íris já localizados (áudio+legenda+storyboard
// prontos) — cresce um idioma por vez conforme a skill localizar-audioguia-mirante roda (build
// 2026-08-16: só pt-pt além de pt). Controla tanto langForAudio() quanto o gate abaixo.
const AUDIO_IRIS_LANGS_PRONTOS = new Set(["pt", "pt-pt", "en", "en-gb", "es", "fr", "es-ar", "de-de", "it", "zh-cn", "zh-tw", "ar-ma", "ja-jp", "ru-ru"]);
// build 2026-08-17: os 14 idiomas do roster estao completos para os 12 mirantes + trilha da Iris —
// AUDIO_IRIS_LANGS_PRONTOS e langs de cada MIRANTES[i] agora cobrem o roster inteiro (ver skill
// localizar-audioguia-mirante para o pipeline usado).

// Build 2026-08-16 (pedido do CEO): quando state.pcdProfile === true (escolhido em
// screen-modo-narracao, ou no toggle de Ajustes — mesma variável), toda vista com trilha Íris
// disponível toca, ao final da narração turística, a descrição sensorial da Íris convertida em
// áudio ("trilha de continuação"). A legenda troca para a legenda sincronizada por frase dessa
// trilha; a foto volta para a imagem inteira (fotoOriginal/foto de referência, sem o crop do
// storyboard) e faz um único sweep esquerda→direita cuja duração é exatamente a duração real desse
// áudio extra — pedido explícito do CEO ("no tempo que durar a sua narração deverá ser o tempo que
// a foto chegue ao final da varredura"). Chamada pelo listener "ended" do player; devolve true se
// trocou para a trilha da Íris (o chamador não deve avançar de tela ainda, só quando ELA terminar).
function tocarTrilhaIrisSeAplicavel() {
  const tipo = state.vistaTipoAtual;
  if (!state.pcdProfile || state.tocandoTrilhaIris || !tipo || !AUDIO_IRIS_TIPOS.has(tipo)) return false;
  if (!AUDIO_IRIS_LANGS_PRONTOS.has(langForAudio())) return false; // idioma ainda não localizado (ver AUDIO_IRIS_LANGS_PRONTOS)
  state.tocandoTrilhaIris = true;
  const audioEl = $("#player-audio");
  const fotoEl = $("#vista-media-photo");
  const videoEl = $("#vista-media-video");
  const irisLang = langForAudio();
  audioEl.src = `assets/audio/${tipo}_iris_${irisLang}.mp3`;
  const playPromise = audioEl.play();
  if (playPromise && playPromise.catch) playPromise.catch(() => {});
  $("#vista-media-note").textContent = "Descrição sensorial (Íris) — trilha de continuação da Audiodescrição Detalhada (PCD Tipo 2).";
  renderCaptionLoop(`${tipo}_iris`, irisLang, audioEl);
  // video_seguranca mostra um <video> em vez de <img> normalmente — a varredura esquerda→direita só
  // funciona em imagem (object-position), então troca para a foto de referência durante a trilha Íris.
  if (tipo === "video_seguranca") {
    videoEl.pause();
    videoEl.style.display = "none";
    fotoEl.style.display = "block";
  }
  const m = MIRANTES.find((x) => x.tipo === tipo);
  // Build 2026-08-17 (pedido do CEO): só a trilha da Íris de video_seguranca vira slideshow de 4
  // fotos (10s cada) em vez do sweep de foto única — quem manda no ritmo é a duração real do áudio
  // do idioma selecionado (se ela só der pra passar 2 fotos, para em 2; nunca repete o ciclo). As
  // outras vistas (mirantes, tipo2) continuam com o sweep de sempre, sem mudança.
  if (tipo === "video_seguranca" && SEGURANCA_FOTO.slidesIris && SEGURANCA_FOTO.slidesIris.length) {
    iniciarSlideshowFotos(fotoEl, audioEl, SEGURANCA_FOTO.slidesIris, 10);
  } else {
    pararSlideshowFotos(); // tipo2 pode vir de um carrossel de 36 fotos ainda rodando (narração principal) — encerra antes do sweep de foto única
    const fotoOriginalSrc = tipo === "tipo2" ? HISTORIA_FOTO.foto : (m && m.fotoOriginal);
    if (fotoOriginalSrc) {
      const aplicarSweep = () => {
        fotoEl.onload = null;
        aplicarVarredura(fotoEl, "ltr", audioEl.duration || 30);
      };
      const trocarFoto = () => {
        fotoEl.removeAttribute("data-shot-file"); // some do storyboard, não confundir com um shot já visto
        fotoEl.onload = aplicarSweep;
        fotoEl.src = fotoOriginalSrc;
        if (fotoEl.complete) aplicarSweep();
      };
      if (audioEl.readyState >= 1 && audioEl.duration) trocarFoto();
      else audioEl.addEventListener("loadedmetadata", trocarFoto, { once: true });
    }
  }
  return true;
}

// ---------- Tela de vista individual (imagem/vídeo em cima, legenda embaixo) ----------
function abrirVista(tipo) {
  navigateTo("screen-vista", () => playTrack(tipo));
}

function tituloParaTipo(tipo) {
  if (tipo === "tipo1") return "Mirante Parque Bondinho do Pão de Açúcar"; // build 2026-08-16 (pedido do CEO): título desta tela deixa de citar "Tipo 1" e passa a nomear o mirante — card_tipo1_title continua existindo no i18n (não usado aqui), conteúdo só em PT nesta fase
  if (tipo === "tipo2") return t("card_tipo2_title");
  if (tipo === "video_seguranca") return t("video_seguranca_title");
  if (tipo === "pista_convite") return "Você não está lá. Ainda."; // Produto 4, peça promocional — conteúdo só em PT nesta fase, sem chave i18n
  if (MIRANTES_COM_STORYBOARD_AR.has(tipo)) {
    // conteúdo só em PT nesta fase — sem chave i18n; nome vem do próprio MIRANTES (tipo === chave)
    const m = MIRANTES.find((x) => x.tipo === tipo);
    return m ? m.nome : tipo;
  }
  if (tipo.indexOf("mirante_preview_") === 0) {
    const num = parseInt(tipo.slice("mirante_preview_".length), 10);
    const m = MIRANTES.find((x) => x.num === num);
    return m ? m.nome : tipo;
  }
  if (tipo.indexOf("view_preview_") === 0) {
    const idx = parseInt(tipo.slice("view_preview_".length), 10);
    return VIEWS_18[idx] || tipo;
  }
  return tipo;
}

// Mostra/esconde a descrição sensorial (Íris) abaixo da foto — por padrão texto fixo em
// português do Brasil, independente do idioma escolhido na interface (roteiro ainda não revisado
// para tradução nem para virar áudio, pedido do CEO 2026-08-02). Ver .vista-media-caption no CSS.
// Build 2026-08-15 — `multilang:true` sinaliza descricaoIris já adaptada para os 14 idiomas de
// LANGS (hoje só video_seguranca/SEGURANCA_FOTO); troca a etiqueta fixa "só em português" por uma
// que não mente sobre a cobertura real de idioma.
function setMediaCaption(texto, multilang) {
  const box = $("#vista-media-caption");
  if (!box) return;
  if (texto) {
    const tag = multilang ? "Descrição (Íris)" : "Descrição (Íris) — texto em revisão, só em português";
    box.innerHTML = `<span class="caption-tag">${tag}</span>${texto}`;
    box.style.display = "block";
  } else {
    box.style.display = "none";
    box.innerHTML = "";
  }
}

function playTrack(tipo) {
  state.vistaTipoAtual = tipo;
  state.tocandoTrilhaIris = false; // reset — cada vista nova começa do zero (ver tocarTrilhaIrisSeAplicavel)
  pararSlideshowFotos(); // reset defensivo — nunca herdar o timer de slideshow da vista anterior
  const lang = langForAudio();
  const audioEl = $("#player-audio");
  const fotoEl = $("#vista-media-photo");
  fotoEl.removeAttribute("data-shot-file"); // reset defensivo — nunca herdar o "já carregado" da vista anterior
  const videoEl = $("#vista-media-video");
  const iconEl = $("#vista-media-icon");
  const noteEl = $("#vista-media-note");
  if (arStoryboardTimer) { clearInterval(arStoryboardTimer); arStoryboardTimer = null; }
  if (pistaCarouselTimer) { clearInterval(pistaCarouselTimer); pistaCarouselTimer = null; }
  if (tipo1StoryboardTimer) { clearInterval(tipo1StoryboardTimer); tipo1StoryboardTimer = null; }
  setMediaCaption(null);
  // Build 2026-08-17 (pedido do CEO): número do mirante (mesmo do mapa) logo abaixo do título da
  // vista — só existe para tipos com entrada em MIRANTES (mirante01-14/tipo1); tipo2/video_seguranca/
  // pista_convite não têm número no mapa, ficam sem essa linha.
  const numeroEl = $("#vista-numero");
  const mirantesNum = MIRANTES.find((x) => x.tipo === tipo);
  if (numeroEl) {
    if (mirantesNum) { numeroEl.textContent = `№ ${mirantesNum.num}`; numeroEl.style.display = ""; }
    else { numeroEl.textContent = ""; numeroEl.style.display = "none"; }
  }
  // por padrão o vídeo fica pausado/escondido — só a tela video_seguranca liga ele de novo
  videoEl.pause();
  videoEl.style.display = "none";

  // ---- Previews sem áudio (mirante ainda não vistoriado / vista extra da lista) — só foto real
  // + descrição da Íris, sem player nem legenda de narração (não existe áudio pra sincronizar).
  const isMirantePreview = tipo.indexOf("mirante_preview_") === 0;
  const isViewPreview = tipo.indexOf("view_preview_") === 0;
  if (isMirantePreview || isViewPreview) {
    let dado, nome;
    if (isMirantePreview) {
      const num = parseInt(tipo.slice("mirante_preview_".length), 10);
      const m = MIRANTES.find((x) => x.num === num);
      dado = m; nome = m ? m.nome : tipo;
    } else {
      const idx = parseInt(tipo.slice("view_preview_".length), 10);
      dado = VIEW_PREVIEWS[idx]; nome = VIEWS_18[idx];
    }
    fotoEl.src = dado.foto;
    fotoEl.alt = `Foto de referência — ${nome}`;
    fotoEl.style.display = "block";
    iconEl.style.display = "none";
    $("#player-label").textContent = nome;
    // Build 2026-08-15 (pedido do CEO): nome do mirante não fica mais escrito sobre a foto — nada
    // de texto sobreposto à imagem. #player-label (abaixo, fora da área da foto) já identifica a
    // vista; #vista-media-label fica vazio de propósito.
    $("#vista-media-label").textContent = "";
    setMediaCaption(dado.descricaoIris);
    $("#vista-continuar-row").style.display = "none"; // preview nunca faz parte da sequência de introdução
    // Build 2026-08-15/16 — havia aqui um branch "audioProprio" para mirante com áudio autoral
    // mas sem storyboard AR ainda; removido em 16/08 porque os 12 mirantes que usariam isso
    // ganharam storyboard AR completo e viraram funcional:true (ver MIRANTES_COM_STORYBOARD_AR),
    // saindo deste bloco isMirantePreview/isViewPreview. Nenhum item de dados usa mais esse campo.
    if (dado.audioExterno) {
      // Build 2026-08-02 — áudio real já publicado no site atual do cliente (bondinho.audima.co),
      // achado por analogia de URL e confirmado via mirantes.txt. Conteúdo de terceiro: toca aqui
      // como referência/preview, não como o áudio "oficial" deste app (esse ainda depende de
      // roteiro @lente + revisão PCD, como o mirante06/tipo1) — por isso a nota explícita abaixo
      // em vez do disclaimer padrão de tradução automática, e sem legenda sincronizada (não há
      // transcrição por frase para esse áudio de terceiro).
      audioEl.style.display = "";
      audioEl.src = dado.audioExterno;
      const playPromise = audioEl.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => {});
      if (isMirantePreview) attachArPauseSync(audioEl);
      $("#caption-box").style.display = "none";
      noteEl.textContent = "Foto real tirada pelo CEO em visita de campo. Áudio já publicado hoje no site atual do Bondinho Pão de Açúcar (bondinho.audima.co) — conteúdo de terceiro, ainda não roteirizado nem revisado nos padrões de Audiodescrição Detalhada (PCD) deste app; tocado aqui como referência até a produção própria.";
    } else {
      audioEl.pause();
      audioEl.removeAttribute("src");
      audioEl.style.display = "none";
      $("#caption-box").style.display = "none";
      noteEl.textContent = "Foto real tirada pelo CEO em visita de campo — ainda sem roteiro de áudio (texto de audiodescrição em revisão antes da síntese de voz). Uso interno de protótipo, não é captura oficial do parque (seção 2.2 do plano).";
    }
    // Build 2026-08-15 (pedido do CEO): varredura automática esquerda→direita nas fotos reais dos
    // mirantes preview (panorâmicas/largas, não cabem inteiras na janela quadrada 1:1) — reaproveita
    // o mesmo mecanismo de auto-sweep do storyboard AR do mirante06 (aplicarVarredura), só que com
    // duração fixa: aqui não há timestamp de áudio próprio pra sincronizar por shot, é um pan único
    // e contínuo do início ao fim da faixa segura (ver AR_FAIXAS), sincronizado com pause/play do
    // áudio externo quando houver (attachArPauseSync, WCAG 2.2.2).
    if (isMirantePreview) aplicarVarredura(fotoEl, "ltr", MIRANTE_PREVIEW_SWEEP_DURACAO_S);
    return;
  }

  // ---- Fluxo normal (com áudio real) — garante que player/legenda de narração, escondidos
  // por um preview anterior, voltem a aparecer.
  audioEl.style.display = "";
  $("#caption-box").style.display = "";
  const src = `assets/audio/${tipo}_${lang}.mp3`;
  audioEl.src = src;
  // <audio controls> já dá ao visitante um botão de play manual visível se o autoplay for
  // bloqueado pelo navegador — diferente do loop da tela de entrada, aqui não é necessário
  // um fallback dedicado (o player nativo já cobre esse caso).
  const playPromise = audioEl.play();
  if (playPromise && playPromise.catch) playPromise.catch(() => {});
  const tituloTipo = tituloParaTipo(tipo);
  // Build 2026-08-17 (pedido do CEO): tipo2 mostra só o nome ("História do Bondinho"), sem o sufixo
  // " — idioma" que as demais vistas têm — card_tipo2_title também foi encurtado em i18n.json (não
  // dizia mais "Audiodescrição Detalhada / PCD (Tipo 2)" só o nome, nos 14 idiomas).
  $("#player-label").textContent = tipo === "tipo2" ? tituloTipo : `${tituloTipo} — ${state.lang ? state.lang.name : lang}`;
  $("#vista-media-label").textContent = tituloTipo;
  // Mirante 6 foi o primeiro com storyboard AR (foto de referência real + zoom sincronizado por
  // marco narrado). Build 2026-08-16: mais 12 mirantes (01-05,07-10,12-14, todos exceto 6/11)
  // ganharam o mesmo tratamento — roteiro autoral (@tour-content-historian + @lente) + áudio
  // próprio + storyboard AR (@foco), substituindo o áudio de referência de terceiro. Handler
  // generalizado: qualquer tipo em MIRANTES_COM_STORYBOARD_AR passa por aqui, hoje só com pt
  // (os outros 13 idiomas ainda não têm áudio/captions para os 12 novos — ver timing_nota de
  // cada manifesto).
  if (MIRANTES_COM_STORYBOARD_AR.has(tipo)) {
    fotoEl.alt = `Foto de referência — ${tituloTipo}`;
    fotoEl.style.display = "block";
    iconEl.style.display = "none";
    noteEl.textContent = tipo === "mirante06"
      ? "Foto de referência fornecida para produção deste roteiro — uso interno de protótipo, não é captura oficial do parque (seção 2.2 do plano). A imagem dá zoom para o marco sendo narrado; os recortes ainda são digitais (placeholder), a substituir por fotos reais de cada local."
      : "Foto real tirada pelo CEO em visita de campo. Roteiro histórico autoral (não é conteúdo de terceiro), com áudio próprio e imagem sincronizada por trecho narrado.";
    // storyboard AR: os crops são calibrados uma vez em pt; os demais idiomas (quando existirem)
    // recalculam só o tempo proporcionalmente à duração real do áudio (ver "timing_nota" em cada
    // manifesto e o agente @foco/skill storyboard-ar).
    loadArStoryboard(tipo).then((sb) => {
      const langEntry = sb && sb.langs ? sb.langs[lang] : null;
      if (langEntry && state.vistaTipoAtual === tipo) {
        renderArStoryboardLoop(langEntry, audioEl, fotoEl, arStoryboardImgBaseDir(tipo));
      } else if (tipo === "mirante06") {
        fotoEl.src = "assets/img/mirante06_referencia.png";
      } else {
        // fallback: sem storyboard nesse idioma ainda, mostra a foto real inteira parada.
        const m = MIRANTES.find((x) => x.tipo === tipo);
        if (m && m.fotoOriginal) fotoEl.src = m.fotoOriginal;
      }
    });
  } else if (tipo === "pista_convite") {
    // 8 fotos reais da Pista Cláudio Coutinho, tiradas pelo próprio CEO em visita de campo
    // (2026-07-27/2026-08-02) — sem qualquer problema de direitos autorais, diferente da foto
    // do mirante06 (fornecida por terceiro para produção do roteiro). Build 2026-08-02: era uma
    // única foto estática (pista_convite_referencia.jpeg); agora é um carrossel de 8 fotos em
    // loop de 4s cada (PISTA_FOTOS/renderPistaCarousel) — a legenda de narração sincronizada por
    // frase continua no caption-box de sempre, em paralelo, sem relação de tempo com o carrossel.
    fotoEl.style.display = "block";
    iconEl.style.display = "none";
    noteEl.textContent = "8 fotos reais da Pista Cláudio Coutinho, tiradas pelo CEO em visita de campo — em loop de 4 segundos cada, sem relação direta com o instante exato da narração (diferente do storyboard do Mirante Guardião da Pedra, que é sincronizado por timestamp).";
    renderPistaCarousel(fotoEl);
  } else if (tipo === "video_seguranca") {
    // Build 2026-08-15 — vídeo real filmado pelo CEO (saída da estação Praia Vermelha, lado da
    // cabine voltado para o mar, com vista do caminho aéreo até o Morro da Urca), substituindo a
    // foto estática anterior (b2.jpg). Vídeo mudo em loop — o áudio narrado (segurança) continua
    // vindo do <audio> normal, tocado em paralelo; por isso videoEl.muted no HTML.
    fotoEl.style.display = "none";
    videoEl.src = SEGURANCA_FOTO.video;
    videoEl.style.display = "block";
    const playPromiseVid = videoEl.play();
    if (playPromiseVid && playPromiseVid.catch) playPromiseVid.catch(() => {});
    iconEl.style.display = "none";
    noteEl.textContent = "Vídeo real filmado pelo CEO em visita de campo — saída da estação Praia Vermelha.";
    // Build 2026-08-16 (achado do CEO): a descricaoIris da Íris NÃO aparece mais aqui de forma fixa —
    // essa tela agora segue a mesma regra de Narração Turística x PCD Tipo 2 das vistas: em modo
    // turística, só a legenda do áudio principal (renderCaptionLoop, chamado no fim de playTrack); em
    // modo PCD, a descrição da Íris só entra como trilha de continuação, com áudio próprio e legenda
    // sincronizada (ver tocarTrilhaIrisSeAplicavel) — nunca como texto estático mostrado de imediato.
  } else if (tipo === "tipo2") {
    // Build 2026-08-17 (pedido do CEO) — a foto única parada (b1.jpg) virou um carrossel de 36 fotos
    // reais em sequência numérica, 5s cada, no ritmo do currentTime do áudio principal (mesma técnica
    // da trilha da Íris, ver iniciarSlideshowFotos) — vale para os 14 idiomas, sempre que a narração
    // principal tocar. Some junto com o áudio (troca de vista, "ended", ou início da trilha da Íris
    // em modo PCD — tocarTrilhaIrisSeAplicavel chama iniciarSlideshowFotos de novo e substitui).
    fotoEl.alt = "Sequência de fotos reais do trajeto do bondinho, tiradas pelo CEO em visita de campo";
    fotoEl.style.display = "block";
    iconEl.style.display = "none";
    noteEl.textContent = "Sequência de 36 fotos reais do trajeto do bondinho, tiradas pelo CEO em visita de campo.";
    iniciarSlideshowFotos(fotoEl, audioEl, HISTORIA_FOTO.slidesNarracao, 5);
    // Build 2026-08-16 — mesmo motivo do bloco video_seguranca acima: descricaoIris não é mais texto
    // estático fixo, só entra como trilha de continuação em modo PCD (tocarTrilhaIrisSeAplicavel).
  } else if (tipo === "tipo1") {
    // Build 2026-08-16 (pedido do CEO): sequência de 13 imagens sincronizada com as quebras de texto
    // do roteiro de origem (11 - Mirante Parque Bondinho do Pao de Acucar autoral 2.odt) — antes só
    // havia o placeholder genérico "vista_media_note"/ícone. Os links de "Imagem de Referência" do
    // roteiro (googleusercontent.com/image_collection/image_retrieval/<id>) eram IDs internos de uma
    // sessão do Gemini — nunca foram URLs públicas, retornam 404 pra qualquer um fora daquela sessão —
    // por isso as 13 imagens são referências reais com licença livre (Wikimedia Commons/Creative
    // Commons, não fotos exclusivas do parque), ver assets/img/tipo1_storyboard/CREDITOS.md.
    // fracaoInicio em tipo1_storyboard.json foi calibrado nos 85 segmentos de captions.json[tipo1].pt
    // (~472,85s) e aplicado proporcionalmente à duração real do áudio de qualquer idioma — não é
    // sincronia frase-exata fora do pt-BR, mas mantém a ordem/proporção certa da narrativa.
    fotoEl.style.display = "block";
    iconEl.style.display = "none";
    noteEl.textContent = "Sequência de imagens ilustrativas — imagens de referência não autorais, com licença livre (Wikimedia Commons/Creative Commons), não são fotos exclusivas do parque (direitos de captação ainda não liberados, seção 2.2 do plano). Créditos completos em assets/img/tipo1_storyboard/CREDITOS.md.";
    loadTipo1Storyboard().then((shots) => {
      if (shots && state.vistaTipoAtual === tipo) renderTipo1StoryboardLoop(shots, audioEl, fotoEl);
    });
  } else {
    fotoEl.style.display = "none";
    iconEl.style.display = "";
    noteEl.setAttribute("data-i18n", "vista_media_note");
    noteEl.textContent = t("vista_media_note");
  }
  // botão "Continuar" só aparece durante a sequência de introdução (vídeo seguído de vídeo) —
  // fora dela (vistas normais do Percurso/Ver Vista), o visitante navega pelas abas normalmente.
  $("#vista-continuar-row").style.display = state.introStep ? "block" : "none";
  renderCaptionLoop(tipo, lang, audioEl);
}

let captionTimer = null;
function renderCaptionLoop(tipo, lang, audioEl) {
  if (captionTimer) clearInterval(captionTimer);
  const segs = state.captions[tipo][lang].segments;
  const box = $("#caption-box");
  captionTimer = setInterval(() => {
    const tAtual = audioEl.currentTime;
    const seg = segs.find((s) => tAtual >= s.start && tAtual <= s.end);
    box.textContent = seg ? seg.text : "…";
  }, 200);
}

// ---------- Varredura automática (auto-sweep) do storyboard AR ----------
// Não é vídeo: é a própria foto se deslocando (object-position) dentro da janela quadrada de
// exibição, para revelar uma imagem/recorte mais largo (ou mais alto) do que a janela 1:1
// permite mostrar de uma vez. Parâmetros definidos em conjunto com @audiodescricao (Íris) em
// 2026-07-26 (consulta registrada na memória do projeto):
//   - velocidade CONSTANTE (não normalizada para "sempre completar 100% no tempo do shot") —
//     shots curtos simplesmente percorrem menos distância, nunca aceleram para caber no tempo;
//   - faixa segura 15%-85% (pan) ou 40%-60% (micro) — nunca os extremos 0%/100%;
//   - piso de duração: shots curtos (< AR_PISO_DURACAO) não varrem, ficam parados;
//   - "pan" por shot vem do manifesto (ltr/ttb/micro/none) — decisão editorial, não heurística
//     automática por aspect-ratio (elemento pontual nomeado no áudio fica parado; elemento
//     estruturalmente alongado — ponte, serra, litoral — varre);
//   - hold parado no início/fim de cada shot (evita somar o corte duro + o início do movimento);
//   - ease-in-out, nunca linear;
//   - nunca varre durante a transição de 3s (pan:"none" nas transições, ver gerar_storyboard_ar_*.py);
//   - respeita prefers-reduced-motion e fica em sincronia com play/pause do áudio (WCAG 2.2.2).
const AR_VELOCIDADE_PCT_S = 8; // %/s de object-position percorridos
const AR_HOLD_INICIO_S = 0.4;
const AR_HOLD_FIM_S = 0.25;
const AR_PISO_DURACAO_S = 3.5;
const AR_FAIXAS = { pan: [15, 85], micro: [40, 60] };
// Duração fixa do pan único e contínuo aplicado às fotos dos mirantes preview (ver playTrack) —
// não tem timestamp de áudio próprio pra derivar a duração, diferente do storyboard AR por shot.
const MIRANTE_PREVIEW_SWEEP_DURACAO_S = 16;

function arReducedMotionAtivo() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function calcularVarredura(pan, duracaoSegundos) {
  if (!pan || pan === "none" || duracaoSegundos < AR_PISO_DURACAO_S) return null;
  const faixa = pan === "micro" ? AR_FAIXAS.micro : AR_FAIXAS.pan;
  const eixo = pan === "ttb" ? "y" : "x";
  const tempoDisponivel = Math.max(duracaoSegundos - AR_HOLD_INICIO_S - AR_HOLD_FIM_S, 0);
  if (tempoDisponivel <= 0) return null;
  const distanciaMax = faixa[1] - faixa[0];
  const distancia = Math.min(AR_VELOCIDADE_PCT_S * tempoDisponivel, distanciaMax);
  const tempoPan = distancia / AR_VELOCIDADE_PCT_S;
  const fracaoIni = Math.min(AR_HOLD_INICIO_S / duracaoSegundos, 1);
  const fracaoFim = Math.min(fracaoIni + tempoPan / duracaoSegundos, 1);
  return { eixo, de: faixa[0], para: faixa[0] + distancia, fracaoIni, fracaoFim };
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

// ---------- Slideshow de fotos em sequência (trilha da Íris de video_seguranca, ver
// tocarTrilhaIrisSeAplicavel; narração principal de tipo2, ver playTrack) ----------
// Build 2026-08-17 (pedido do CEO): em vez do sweep de foto única, alterna entre N fotos (segundos
// por foto configurável por chamada), no ritmo do próprio currentTime do áudio (mesma técnica de
// polling de renderCaptionLoop) — pausar o áudio já pausa a troca de foto de graça (currentTime só
// avança com o áudio tocando), sem precisar de handler de pause dedicado. Quem manda no número de
// fotos mostradas é a duração real da faixa do idioma selecionado: se só der tempo pra passar
// algumas, para nelas; se passar da última, segura nela (nunca reinicia o ciclo). Timer único
// compartilhado — só uma vista tem slideshow ativo por vez, então parar/começar de novo já cobre a
// troca entre as duas.
let fotoSlideshowTimer = null;
function pararSlideshowFotos() {
  if (fotoSlideshowTimer) { clearInterval(fotoSlideshowTimer); fotoSlideshowTimer = null; }
}
function iniciarSlideshowFotos(fotoEl, audioEl, slides, segundosPorFoto) {
  pararSlideshowFotos();
  if (arCurrentAnimation) { arCurrentAnimation.cancel(); arCurrentAnimation = null; } // sem sweep durante o slideshow
  fotoEl.style.objectPosition = "50% 50%";
  fotoEl.removeAttribute("data-shot-file"); // some do storyboard, não confundir com um shot já visto
  let indiceAtual = -1;
  const atualizar = () => {
    const indice = Math.min(slides.length - 1, Math.floor(audioEl.currentTime / segundosPorFoto));
    if (indice !== indiceAtual) {
      indiceAtual = indice;
      fotoEl.src = slides[indice];
    }
  };
  atualizar();
  fotoSlideshowTimer = setInterval(atualizar, 250);
}

// Sincroniza a varredura com o play/pause do próprio áudio (WCAG 2.2.2 "de graça" — pausar a
// narração também pausa o movimento, sem precisar de um controle dedicado só pra isso).
let audioElAtivo = null;
function attachArPauseSync(audioEl) {
  audioElAtivo = audioEl;
  if (audioEl.dataset.arSyncAttached) return;
  audioEl.dataset.arSyncAttached = "1";
  audioEl.addEventListener("pause", () => { if (arCurrentAnimation) arCurrentAnimation.pause(); });
  audioEl.addEventListener("play", () => { if (arCurrentAnimation) arCurrentAnimation.play(); });
}

// Troca a foto para o recorte (crop) do marco sendo narrado no instante atual do áudio —
// mesma técnica de polling de renderCaptionLoop, aplicada à imagem em vez do texto — e aciona
// a varredura correspondente a cada shot (mesmo quando o arquivo é reaproveitado de um shot
// anterior, ex. plano geral reaparecendo numa transição: o shot muda, a varredura reinicia).
let arStoryboardTimer = null;
// Carrossel simples de 4s/foto da Pista Cláudio Coutinho — não confundir com o storyboard AR
// acima (que sincroniza recortes com o timestamp exato da narração já gravada). Aqui não há
// sincronia com o áudio: é só um loop de tempo fixo, pedido do CEO (ver PISTA_FOTOS/PISTA_CAROUSEL_MS).
let pistaCarouselTimer = null;
function renderPistaCarousel(fotoEl) {
  let idx = 0;
  const aplicarFoto = () => {
    const item = PISTA_FOTOS[idx];
    fotoEl.src = item.foto;
    fotoEl.alt = `Foto real da Pista Cláudio Coutinho — ${item.nome}`;
    setMediaCaption(item.descricaoIris);
    idx = (idx + 1) % PISTA_FOTOS.length;
  };
  aplicarFoto(); // mostra a primeira foto de imediato, sem esperar o primeiro ciclo do timer
  pistaCarouselTimer = setInterval(aplicarFoto, PISTA_CAROUSEL_MS);
}

// Sequência de 13 imagens de referência (não autorais) do Mirante Parque Bondinho do Pão de Açúcar
// (tipo1) — ver nota em playTrack(). Diferente do storyboard AR dos outros mirantes (que dá zoom em
// recortes de UMA foto real), aqui são 13 imagens distintas trocadas inteiras a cada ponto de corte;
// por isso um mecanismo dedicado, mais simples, em vez de reaproveitar renderArStoryboardLoop.
let tipo1StoryboardTimer = null;
let tipo1StoryboardCache = null;
function loadTipo1Storyboard() {
  if (tipo1StoryboardCache) return Promise.resolve(tipo1StoryboardCache);
  return fetch("assets/data/tipo1_storyboard.json", { cache: "no-store" })
    .then((r) => r.json())
    .then((shots) => { tipo1StoryboardCache = shots; return shots; })
    .catch(() => null);
}
function renderTipo1StoryboardLoop(shots, audioEl, fotoEl) {
  if (tipo1StoryboardTimer) clearInterval(tipo1StoryboardTimer);
  attachArPauseSync(audioEl);
  let idxAtual = -1;
  const aplicar = () => {
    const duracaoTotal = audioEl.duration || 0;
    if (!duracaoTotal) return; // metadata ainda não carregou — tenta de novo no próximo tick
    const tAtual = audioEl.currentTime;
    let idx = 0;
    for (let i = 0; i < shots.length; i++) {
      if (tAtual / duracaoTotal >= shots[i].fracaoInicio) idx = i;
    }
    if (idx === idxAtual) return;
    idxAtual = idx;
    const shot = shots[idx];
    const fracaoFim = idx + 1 < shots.length ? shots[idx + 1].fracaoInicio : 1;
    const duracaoShot = Math.max((fracaoFim - shot.fracaoInicio) * duracaoTotal, 1);
    fotoEl.removeAttribute("data-shot-file");
    fotoEl.src = `assets/img/tipo1_storyboard/${shot.file}`;
    fotoEl.alt = "Imagem de referência não autoral — Mirante Parque Bondinho do Pão de Açúcar";
    aplicarVarredura(fotoEl, "ltr", duracaoShot);
  };
  aplicar();
  tipo1StoryboardTimer = setInterval(aplicar, 400);
}

function renderArStoryboardLoop(storyboard, audioEl, fotoEl, imgBaseDir) {
  if (arStoryboardTimer) clearInterval(arStoryboardTimer);
  attachArPauseSync(audioEl);
  const shots = storyboard.shots;
  let currentIdx = null;
  const aplicarShot = (shot) => {
    const duracao = Math.max(shot.end - shot.start, 0.1);
    const novoSrc = `${imgBaseDir}/${shot.file}`;
    // Build 2026-08-16 (achado do CEO: a imagem ficava "presa" na vista anterior) — a chave de
    // comparação era só shot.file (ex.: "00_planogeral.jpg"), mas TODOS os storyboards reaproveitam
    // esse mesmo nome de arquivo dentro da própria pasta de cada mirante; ao trocar de vista, o
    // código achava que já estava mostrando "o mesmo arquivo" e nunca trocava fotoEl.src — a foto do
    // mirante anterior ficava na tela enquanto o áudio do mirante novo já tocava. Corrigido: comparar
    // pelo caminho completo (novoSrc), não só pelo nome.
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
  applyShot(); // aplica o shot inicial imediatamente, sem esperar o primeiro tick
  arStoryboardTimer = setInterval(applyShot, 200);
}

// ---------- Ver Qualquer Vista ----------
// Build 2026-08-02 — aba removida do shell (pedido do CEO: navegação só pelo mapa de mirantes,
// ver buildMapaHotspots()). Função e o HTML #view-list não existem mais; deixada aqui sem
// chamada (não deletada) porque VIEWS_18/FUNCTIONAL_VIEWS/VIEW_PREVIEWS/PISTA_FOTOS carregam
// conteúdo real testado nesta mesma leva (Pista Cláudio Coutinho, Niterói, Vista Pão de Açúcar)
// que ficou sem ponto de entrada na UI — pendente de decisão do CEO sobre onde reconectar
// (candidato natural: QR próprio da Pista Cláudio Coutinho/Produto 4, já citado na tela de
// entrada, distinto do QR do bilhete do teleférico).
function buildViewList() {
  const ul = $("#view-list");
  if (!ul) return;
  ul.innerHTML = "";
  VIEWS_18.forEach((name, i) => {
    const li = document.createElement("li");
    const cfg = FUNCTIONAL_VIEWS[i];
    const functional = !!cfg;
    const temFoto = !functional && !!VIEW_PREVIEWS[i];
    // Build 2026-08-02 — mesma lógica de badge do mapa: 🟢 áudio real, 📷 foto+descrição sem áudio.
    li.innerHTML = `<span>${name}</span><span class="dot">${functional ? "🟢" : (temFoto ? "📷" : "⚪")}</span>`;
    li.onclick = () => {
      const langOk = functional && (!cfg.langs || (state.lang && cfg.langs.includes(state.lang.code)));
      if (functional && langOk) {
        abrirVista(cfg.tipo);
      } else if (functional && !langOk) {
        showStub(
          "Ainda é um protótipo",
          `${name}: audiodescrição real disponível em português. Nos demais idiomas desta versão do protótipo, o roteiro ainda depende de adaptação revisada pelos agentes de locução por idioma antes de virar áudio — troque para português para ouvir esta vista.`
        );
      } else if (temFoto) {
        abrirVista(`view_preview_${i}`);
      } else {
        showStub(
          "Ainda é um protótipo",
          "Nesta versão, só a vista \"Topo Pão de Açúcar — Pôr do Sol\", o \"Mirante Guardião da Pedra\" e \"Pista Cláudio Coutinho — início\" (em português) têm áudio funcional. As demais vistas dependem da vistoria de campo (pendência 1 do plano) e da captação por drone (seção 2.1) antes de virar conteúdo real."
        );
      }
    };
    ul.appendChild(li);
  });
}

// ---------- Ajustes: itens funcionais ----------
// Build 2026-08-17 (pedido do CEO): a tela de Ajustes fica só com os 2 itens realmente úteis nesta
// fase — o toggle de PCD (togglePcdProfile) e os stubs de legenda/vista aumentada saíram do card
// (a escolha turística×PCD já acontece em screen-modo-narracao, state.pcdProfile continua sendo a
// mesma variável usada lá, só não tem mais um segundo controle redundante em Ajustes).
function toggleHoverVoice() {
  state.hoverVoiceEnabled = !state.hoverVoiceEnabled;
  $("#hover-voice-toggle").classList.toggle("on", state.hoverVoiceEnabled);
}

// ---------- Fluxo do brinde (Instagram) ----------
function togglePresenter() {
  state.presenterFollows = !state.presenterFollows;
  $("#presenter-toggle").textContent = state.presenterFollows
    ? "🛠 Controle do apresentador: SIMULANDO SEGUIDOR"
    : "🛠 Controle do apresentador: SIMULANDO NÃO-SEGUIDOR";
}

function abrirFluxoBrinde() {
  $("#brinde-result").innerHTML = "";
  navigateTo("screen-brinde");
}

function verificarSeguidor() {
  const box = $("#brinde-result");
  if (!state.presenterFollows) {
    box.innerHTML = `
      <div class="alert alert-warning">${t("brinde_nao_segue")}</div>
      <a class="btn block" href="https://www.instagram.com/parquebondinho/" target="_blank" rel="noopener">${t("brinde_seguir_link")}</a>
      <p style="font-size:.76rem;color:var(--text-muted);margin-top:10px;">${t("brinde_depois_de_seguir")}</p>
    `;
    return;
  }
  box.innerHTML = `<div class="spinner"></div><p style="text-align:center;color:var(--text-muted);font-size:.88rem;">${t("brinde_aguarde")}</p>`;
  setTimeout(() => {
    box.innerHTML = `
      <div class="alert alert-ok">${t("brinde_pronto")}</div>
      <img src="assets/brinde/brinde.png" alt="Aqui está seu brinde: a vista do Pão de Açúcar, em 14 idiomas">
      <a class="btn secondary block" href="assets/brinde/brinde.jpg" download="Pao-de-Acucar-para-Voce-brinde.jpg" target="_blank" rel="noopener">${t("brinde_baixar_imagem")}</a>
      <p style="font-size:.72rem;color:var(--text-muted);margin-top:10px;">${t("brinde_disclaimer")}</p>
    `;
  }, 1600);
}

window.addEventListener("DOMContentLoaded", () => {
  $("#btn-scan").onclick = simularEscaneamento;
  $("#tabbtn-percurso").onclick = () => switchTab("percurso");
  $("#tabbtn-ajustes").onclick = () => switchTab("ajustes");
  $("#hover-voice-toggle-row").onclick = toggleHoverVoice;
  $("#item-brinde").onclick = abrirFluxoBrinde;
  $("#btn-verificar-seguidor").onclick = verificarSeguidor;
  $("#presenter-toggle").onclick = togglePresenter;
  $("#stub-close").onclick = closeStub;

  // tela de escolha do tipo de narração (antes da tela de plano)
  $("#modo-turistica").onclick = escolherModoTuristica;
  $("#modo-pcd").onclick = escolherModoPCD;

  // tela de escolha de plano
  $("#plano-basico").onclick = escolherPlanoBasico;
  $("#plano-premium").onclick = escolherPlanoPremium;

  // tela de pagamento simulado — cada opção já confirma o pagamento ao ser clicada
  $all(".payment-option").forEach((el) => {
    el.onclick = () => confirmarPagamento(el.getAttribute("data-metodo"));
  });

  // sequência de introdução (vídeo segurança → mapa → vídeo história → Ajustes → roteiro de visitação)
  $("#btn-vista-continuar").onclick = avancarIntro;
  $("#mapa-clicavel").onclick = avancarIntro;

  // mapa dos 14 mirantes (aba Percurso) — posições fixas, monta uma única vez
  buildMapaHotspots();
  prefetchArStoryboards(); // ver comentário na função — evita o atraso entre áudio e troca de imagem
  $("#player-audio").addEventListener("ended", () => {
    if (tocarTrilhaIrisSeAplicavel()) return; // trocou para a trilha da Íris — ainda tocando
    state.tocandoTrilhaIris = false; // trilha da Íris (se havia) já terminou, ou nunca começou
    pararSlideshowFotos(); // encerra o slideshow de fotos (Íris ou tipo2), a tela já vai trocar
    if (state.introStep) {
      avancarIntro(); // avança sozinho ao fim do áudio, só durante a introdução
    } else if (MIRANTES.some((m) => m.tipo === state.vistaTipoAtual)) {
      // Build 2026-08-17 (pedido do CEO): ao terminar a narração turística — ou turística + trilha
      // de continuação da Íris, se PCD — de qualquer vista de mirante (01-14, incluindo tipo1/
      // mirante 11), volta pro mapa sozinho, como se o visitante tivesse tocado a aba Percurso.
      // NÃO vale para video_seguranca/tipo2 (Segurança/História do Bondinho) — essas duas não
      // estão em MIRANTES, então a condição já as exclui automaticamente; continuam como estão.
      doSwitchTab("percurso");
    }
  });

  // rodapé global — Voltar / Home / Sair, sempre visíveis em qualquer tela
  $("#btn-voltar").onclick = irParaTras;
  $("#btn-home").onclick = goHome;
  $("#btn-sair").onclick = abrirConfirmSair;
  $("#confirm-sair-sim").onclick = confirmarSair;
  $("#confirm-sair-nao").onclick = fecharConfirmSair;

  // locução de voz pré-gravada para elementos de decisão — dispara ao passar o cursor
  // (mouseenter), não ao clicar — pedido explícito do CEO
  attachHoverVoice();

  // anúncio multilíngue da tela de entrada — dispara ao carregar, para no escaneamento;
  // o botão de fallback (autoplay bloqueado) também dispara ao passar o cursor, além do clique
  $("#entry-audio").addEventListener("ended", () => {
    if (state.entryAudioActive) playNextEntryAnnouncement();
  });
  $("#entry-audio-enable").onclick = resetEntryScreen;
  $("#entry-audio-enable").addEventListener("mouseenter", () => {
    if (!state.entryAudioActive) resetEntryScreen();
  });

  showScreen("screen-entrada"); // garante barra de abas escondida no load
  startEntryAnnouncement();
});
