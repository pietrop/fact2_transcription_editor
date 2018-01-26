/**
 * Note this API end point, ignores credentials and ID, only returns one transcription end point 
 */
'use strict';
const express = require('express');
const app = express();
const path = require('path');

// to handle post requests 
//https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// to allow Allow CORS for PUT
//https://stackoverflow.com/questions/42463499/node-allow-cors-for-put/42463858
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // allow preflight
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

//to test put requests 
app.put('/api/proofreader.php', function(req, res) {
   	console.log("PUT REQEST: ",req.body);
    // var user_id = req.body.id;
    // var token = req.body.token;
    // var geo = req.body.geo;

    res.send(req.body);
});

//load sample data
var sampleJsonTranscription = require('./sample3.json');

//enable cross origin request  - https://enable-cors.org/server_expressjs.html
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// mock api end point by returning json 
// 127.0.0.1:3000/api/read.php
app.get('/api/proofreader.php', function (req, res) {
    res.json(sampleJsonTranscription);
});


// app.post('/', function(request, response){
//   console.log(request.body);      // your JSON
//   response.send(request.body);    // echo the result back
// });



//return media associated with mock json transcriptions
app.use('/public', express.static(path.join(__dirname, 'public')));


app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
});

