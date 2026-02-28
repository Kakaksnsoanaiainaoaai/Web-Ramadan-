const CACHE_NAME = "ramadan-app-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/dashboard.html",
  "/style.css",
  "/script.js",
  "/login.css",
  "/login.js",
  "/minigame.html",
  "/minigame.css",
  "/minigame.js"
];

// install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});