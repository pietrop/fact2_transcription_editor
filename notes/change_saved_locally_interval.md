# Changing save client locally interval

In [`/src/app/views/transcription_view.js`](../src/app/views/transcription_view.js) at around line `196` where the interval is set.  


```js
//saves text locally every 15 seconds. 
setInterval(function(){
self.saveLocally();},
15000);
```