const CACHE_NAME = 'compras-v3';
const ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'image/Carrito-transformed.png'
];

// Instalar y forzar el guardado de archivos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); 
});

// Tomar el control de la aplicación de inmediato
self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

// Responder con los archivos guardados o buscarlos en internet
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
