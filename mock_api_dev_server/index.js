/**
 * Note this API end point, ignores credentials and ID, only returns one transcription end point 
 */
'use strict';
const express = require('express');
const app = express();
const path = require('path');

//load sample data
var sampleJsonTranscription = require('./sample3.json');

//enable cross origin request  - https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// mock api end point by returning json 
// 127.0.0.1:3000/api/read.php
app.get('/api/proofreader.php', function (req, res) {
    res.json(sampleJsonTranscription);
});


app.post('/', function(request, response){
  console.log(request.body);      // your JSON
  response.send(request.body);    // echo the result back
});



//return media associated with mock json transcriptions
app.use('/public', express.static(path.join(__dirname, 'public')));


app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
});

