// Service worker mínimo — Auditoria 05, achado crítico C-05.
// Uso real do produto: a pé, numa trilha física (Pista Cláudio Coutinho), com sinal celular
// instável por definição do próprio caso de uso. Sem nenhuma camada de cache local, qualquer
// queda de sinal entre uma parada e outra derrubava o visitante sem áudio/foto, mesmo que a
// mesma tela já tivesse sido carregada minutos antes. Este arquivo faz cache oportunista (só do
// que já foi de fato pedido, sem pré-carregar nada) — não é offline-first completo, é resiliência
// pro caso comum "sinal caiu bem na hora que eu ia ouvir a próxima parada".
//
// Versionar CACHE_NAME junto com DATA_VERSION (app.js/pista.js) sempre que um deploy mudar
// conteúdo de forma que o cache antigo devesse ser descartado — caches com nome antigo são
// apagados automaticamente no "activate".
const CACHE_NAME = "guide-for-me-v2026-08-29.16";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // só same-origin — nada de terceiros pra cachear

  // Navegação (abrir/recarregar index.html ou pista.html): network-first, com fallback pro cache
  // se estiver offline — prioriza sempre a versão mais nova quando há sinal.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copia));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // assets/* (áudio, foto, storyboard, css/js, captions/i18n já versionados por query string):
  // cache-first — se já foi buscado uma vez nesta trilha, uma queda de sinal na parada seguinte
  // não impede reabrir uma tela já visitada.
  if (url.pathname.includes("/assets/")) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            if (res.ok) {
              const copia = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(req, copia));
            }
            return res;
          })
          .catch(() => cached);
      })
    );
  }
});
