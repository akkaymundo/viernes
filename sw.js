/* Akkay Mundo - service worker: mabilis na pagbukas at gumagana kahit mahina ang signal */
var CACHE='amv-v1';
var SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
 var req=e.request;if(req.method!=='GET')return;var url=new URL(req.url);
 /* Firebase scripts: may bersyon ang link kaya pwedeng i-cache */
 if(url.hostname==='www.gstatic.com'){e.respondWith(caches.match(req).then(function(r){return r||fetch(req).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(req,cp)});return res})}));return}
 /* Ang mismong site: kunin muna ang pinakabago, at kung walang signal ay gamitin ang naka-save */
 if(url.origin===self.location.origin){e.respondWith(fetch(req).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(req,cp)});return res}).catch(function(){return caches.match(req).then(function(r){return r||caches.match('./index.html')})}))}
});
