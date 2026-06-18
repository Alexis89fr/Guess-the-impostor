const CACHE_NAME = "imposteur-cache-v6";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/audio.js",
  "./js/app.js",
  "./js/words.js",
  "./js/components/home.js",
  "./js/components/settings.js",
  "./js/components/setup.js",
  "./js/components/distribution.js",
  "./js/components/game.js",
  "./js/components/result.js",
  "./assets/icon.png"
];

// Installation du Service Worker et mise en cache des ressources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Mise en cache des ressources globales");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Forcer le Service Worker installé à s'activer immédiatement
  self.skipWaiting();
});

// Activation et nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Suppression de l'ancien cache", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Prendre le contrôle immédiat des clients ouverts
  self.clients.claim();
});

// Interception des requêtes réseaux
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retourne la ressource du cache si elle existe, sinon fait une requête réseau
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Optionnel : Gestion des erreurs offline
        console.log("[Service Worker] Ressource non trouvée hors-ligne :", event.request.url);
      });
    })
  );
});
