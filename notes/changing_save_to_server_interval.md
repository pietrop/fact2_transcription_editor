# Changing save to server interval

- in `/src/app/views/transcription_view.js` at around line `48` where the interval is set.  

```js
var fiveMinutesInMilliseconds = 300000;
// var oneMinuteInMilliseconds = 60000;
setInterval(serverSideSaveTimer, fiveMinutesInMilliseconds );
```