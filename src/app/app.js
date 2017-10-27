'use strict';

// 	to activate mouse track key bindings on backbone. 
// 	TODO: perhaps this can be moved in webpack config? but not sure how. 
require('backbone.mousetrap');

//adding bootstrap js 
// import 'jquery';
import 'bootstrap/dist/js/bootstrap';

var TranscriptionRouter = require('./router.js');

window.appTranscription = new TranscriptionRouter();

Backbone.history.start();
