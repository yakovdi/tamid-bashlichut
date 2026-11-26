// Service worker: מאפשר התקנה והתראות. רשת קודם, כדי שעדכוני גרסה יגיעו מיד.
self.addEventListener("install",function(e){self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(self.clients.claim())});
self.addEventListener("fetch",function(e){
  var r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(function(res){
    if(res.ok&&!res.redirected&&res.type==="basic"){var cp=res.clone();caches.open("shipments").then(function(c){c.put(r,cp)})}
    return res;
  }).catch(function(){return caches.match(r).then(function(m){return m||caches.match("./")})}));
});
self.addEventListener("push",function(e){
  var d={};try{d=e.data?e.data.json():{}}catch(x){}
  e.waitUntil(self.registration.showNotification(d.title||"משלוח חדש",{body:d.body||"",icon:"icon-192.png",badge:"icon-192.png",tag:d.tag||"push",vibrate:[200,100,200],dir:"rtl",lang:"he"}));
});
self.addEventListener("notificationclick",function(e){
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(cs){
    for(var i=0;i<cs.length;i++){if("focus" in cs[i])return cs[i].focus()}
    return self.clients.openWindow("./");
  }));
});
