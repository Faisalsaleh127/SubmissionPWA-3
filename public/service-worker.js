importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
    console.log(`Workbox berhasil dimuat`);
else
    console.log(`Workbox gagal dimuat`);


// const CACHE_NAME = "premierleague-v3";
// var urlsToCache = [

workbox.precaching.precacheAndRoute([

    // Folder utama
    {url: "/", revision: "1"},
    {url: "/nav.html", revision: "1"},
    {url: "/index.html", revision: "1"},
    {url: "/team.html", revision: "1"},
    {url: "/icon.png", revision: "1"},
    {url: "/manifest.json", revision: "1"},
    {url: "https://fonts.googleapis.com/icon?family=Material+Icons", revision: "1"},
    {url: "https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js", revision: "1"},
    // Folder Pages
    {url: "/pages/fav.html", revision: "1"},
    {url: "/pages/home.html", revision: "1"},
    {url: "/pages/matches.html", revision: "1"},
    // Folder css
    {url: "/css/materialize.min.css", revision: "1"},
    // Folder js
    {url: "/js/materialize.min.js", revision: "1"},
    {url: "/js/nav.js", revision: "1"},
    {url: "/js/api.js", revision: "1"},
    {url: "/js/db.js", revision: "1"},
    {url: "/js/idb.js", revision: "1"},
    {url: "/js/main.js", revision: "1"},
    //favicon
    {url: "/favicon.ico", revision: "1"},
    //icon
    {url: "/images/icons/icon-72x72.png", revision: "1"},
    {url: "/images/icons/icon-96x96.png", revision: "1"},
    {url: "/images/icons/icon-128x128.png", revision: "1"},
    {url: "/images/icons/icon-144x144.png", revision: "1"},
    {url: "/images/icons/icon-152x152.png", revision: "1"},
    {url: "/images/icons/icon-192x192.png", revision: "1"},
    {url: "/images/icons/icon-384x384.png", revision: "1"},
    {url: "/images/icons/icon-512x512.png", revision: "1"}

],{
    ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
        }),
      ],
    }),
);


workbox.routing.registerRoute(
    new RegExp('/pages/'),
      workbox.strategies.staleWhileRevalidate({
          cacheName: 'pages'
      })
);


workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
);

// self.addEventListener("install", function (event) {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then(function (cache) {
//             return cache.addAll(urlsToCache);
//         })
//     );
// });

// self.addEventListener("fetch", function (event) {
//     var base_url = "https://api.football-data.org/v2/";
//     if (event.request.url.indexOf(base_url) > -1) {
//         event.respondWith(
//             caches.open(CACHE_NAME).then(function (cache) {
//                 return fetch(event.request).then(function (response) {
//                     cache.put(event.request.url, response.clone());
//                     return response;
//                 })
//             })
//         );
//     } else {
//         event.respondWith(
//             caches.match(event.request, {
//                 ignoreSearch: true
//             }).then(function (response) {
//                 return response || fetch(event.request);
//             })
//         )
//     }
// });
// self.addEventListener("activate", function (event) {
//     event.waitUntil(
//         caches.keys().then(function (cacheNames) {
//             return Promise.all(
//                 cacheNames.map(function (cacheName) {
//                     if (cacheName != CACHE_NAME) {
//                         console.log("ServiceWorker: cache " + cacheName + " dihapus");
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });


self.addEventListener("push", function (event) {
    var body;

    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }

    var options = {
        body: body,
        icon: "images/icons/icon-512x512.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});