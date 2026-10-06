const CACHE = 'sicklefix-v2';
const FILES = [
  '/', '/index.html', '/card.html', '/clinics.html', '/quiz.html',
  '/style.css', '/nav.js', '/icon.svg', '/manifest.json'
];

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