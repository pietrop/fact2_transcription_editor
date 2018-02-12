'use strict';
const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone');

var TranscriptionView = require('./views/transcription_view.js');
var Transcription = require('./models/transcription.js');
// var SettingsView = require('./views/settings_view');


//TODO: move display main in helpers?
/*
 * Render a string or view to the main container on the page
 * @param {(Object|String)} string_or_view A string or backbone view
 **/
function displayMain(string_or_view) {
  // var content;
  if (typeof string_or_view === 'string') {
    var content = string_or_view;
     document.querySelector("#main").innerHTML = content;
  } else {
    //TODO: window is for troubleshooting, remove when done.
    window.string_or_view =  string_or_view; 
    var content = string_or_view.render().el;
    // string_or_view.render();
    $("#main").html(content);  
    // document.querySelector("#main").innerHTML = content;
  }
}

/**
* Transcriptions application router
*/
module.exports = Backbone.Router.extend({
  routes: {
    'transcription?*queryString': 'showTranscription',
    'done': 'doneView',
    // 'settings':'settingsPanel',
    '*path': 'notFound'
  },

  initialize: function() {

  },

  doneView: function(){
     displayMain("<h1>Thank you, You are done with this transcription.<h1>");
  },

  showTranscription: function(queryString) {

    var  params = parseQueryString(queryString);
    console.log('params',params);
    if( params.id == undefined){
      alert("not a valid request, missing id paramter");
    }else if(params.user == undefined){
       alert("not a valid request, missing user parameter");
      
    }else{
      if(params.editor_mode == "true" ){
        //if true then content editable is set to false.
        params.editor_mode == true;
      }else if(params.editor_mode == "false"){
        params.editor_mode == false;
        console.log("False editor_mode")
      //if param not passed or invalid then go into editor mode. 
      }else if (params.editor_mode == undefined){
        params.editor_mode == true;
      }else{
        params.editor_mode == true;
      }

       if(params.grammarly == "true" ){
        //if true then content editable is set to false.
        params.grammarly == true;
      }else if(params.grammarly == "false"){
        params.grammarly == false;
      //if param not passed or invalid then go into editor mode. 
      }else if (params.grammarly == undefined){
        params.grammarly == false;
      }else{
        params.grammarly == false;
      }

      // console.log(" params.editor_mode", params.editor_mode, typeof  params.editor_mode);
      
      var tmpTranscription = new Transcription({ id: params.id,  user: params.user, editor_mode:  params.editor_mode , grammarly: params.grammarly});
      // tmpTranscription.set({ meta: { user: params.user}});
      window.tmpTranscription = tmpTranscription;
      console.info("version in router", tmpTranscription.attributes.meta.version);
      //TODO: add loading message / view 
      // displayMain('Loading transcription ...');
    
      tmpTranscription.fetch({
              // reset: true,
              success: function (model, response, options) {
                 window.tmpTranscriptionFromServer = model;
                  // you can pass additional options to the event you trigger here as well
                  // self.trigger('successOnFetch');
                  // console.log(JSON.stringify(model,null,2));
                  // console.log("model",model);
                  var tmpTranscriptionView = new TranscriptionView({
                              model: model
                  });
      
                  displayMain(tmpTranscriptionView);
                  console.log("model", model,"response", response, "options", options);
              },
              error: function (model, response, options) {
                window.tmpTranscriptionFromServerError = model;
                //TODO : some sort of error handling if server response is down 
                  // you can pass additional options to the event you trigger here as well
                  // self.trigger('errorOnFetch');
                   console.log(model,response, options);
              }
          });

    }
  },


  notFound: function() {
    console.error('Not found');
    //TODO: add loading 404 view,eg something funny... 
    displayMain('<h1>404</h1>');
    // alert('Not found');
  }
});


//TODO: move in helpers 
function parseQueryString (queryString){

    var params = {};
    if(queryString){
        _.each(
            _.map(decodeURI(queryString).split(/&/g),function(el,i){
                var aux = el.split('='), o = {};
                if(aux.length >= 1){
                    var val = undefined;
                    if(aux.length == 2)
                        val = aux[1];
                    o[aux[0]] = val;
                }
                return o;
            }),
            function(o){
                _.extend(params,o);
            }
        );
    }
    return params;
}