const CACHE = 'sicklefix-v5';
const FILES = [
  '/', '/index.html', '/card.html', '/clinics.html', '/quiz.html',
  '/style.css', '/nav.js', '/icon.svg', '/manifest.json',
  '/painlog.html',
  '/learn.html'
];
async function serveAudio(request) {
  const cache = await caches.open(CACHE);
  const key = new Request(new URL(request.url).pathname);
  let saved = await cache.match(key);

  if (!saved) {
    try {
      const net = await fetch(key.url);
      if (!net.ok) return net;
      await cache.put(key, net.clone());
      saved = net;
    } catch (e) {
      return new Response('Audio not available offline', { status: 503 });
    }
  }

  const range = request.headers.get('range');
  if (!range) return saved;

  const buf = await saved.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const start = m && m[1] ? parseInt(m[1], 10) : 0;
  const end = m && m[2] ? Math.min(parseInt(m[2], 10), buf.byteLength - 1) : buf.byteLength - 1;
  const part = buf.slice(start, end + 1);

  return new Response(part, {
    status: 206,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Range': 'bytes ' + start + '-' + end + '/' + buf.byteLength,
      'Content-Length': part.byteLength,
      'Accept-Ranges': 'bytes'
    }
  });
}
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(serveAudio(event.request));
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(c => c.put(event.request, copy));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(saved => saved || caches.match('/index.html'))
      )
  );
});