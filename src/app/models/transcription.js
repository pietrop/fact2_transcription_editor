'use strict';
const Backbone = require('backbone');
const config = require('../../config.js');
// const himalaya = require('himalaya');
// const toHTML = require('himalaya/translate').toHTML;

const parseEditedText = require("../../lib/parse_edited_text/index.js").parse;
const parseSpeakers = require("../../lib/parse_edited_text/index.js").parseSpeakers;

module.exports = Backbone.Model.extend({
		urlRoot: config.serverUrl,
		url: function() {
			this.api_key = config.key;
			// return this.urlRoot+ + '?name=' + this.id;
			return this.urlRoot + '?id=' + this.id +'&key=' + config.key;
		}, 
		  initialize: function (options) {
		  	console.info("version",this.attributes.meta.version);
		 },
		saveLocally: function(data){

			if (typeof(Storage) !== "undefined") {
			    // Code for localStorage/sessionStorage.
			    // var json = himalaya.parse(data);
			    // console.log('👉', json)
			     // console.info('SAVING LOCALLY',data);
			    saveLocally(this.id,data);
			} else {
			    // Sorry! No Web Storage support..
			    alert("seems like your browser does not support localStorage, it is reccomended switching to Google Chrome");
			}
		},
		retrieveFromLocalStorage: function(){
			var json = retrieFromLocal(this.id);
			// return toHTML(json);
			return json;
		},
		isInLocalStorage: function(key){
			var tmpRes = localStorage.getItem(key);
			if(tmpRes !== null){
				return true;
			}else{
				return false; 
			}
		},
		defaults: {
			"api_key" : config.key,
		    "meta": {"status":  "in progress"},
		    //'source' should be "Copy Desk"
		    "source":     "Copy Desk",
		    // 'editor' will be the copy editor. Need a place to pass that value when we add the auth. Can be blank for now
		    "editor": ""
		 },

		 finalSave: function (text){
		 	console.info("triggered final save");
		 	var tmpText = parseEditedText(text);
		 	this.set({paragraphs: tmpText});
		 
		 	this.set({ meta: 
		 		{
		 			api_call: "write",
		 			source: "Copy Desk",
		 			status: 'completed',
		 			media_file: this.attributes.meta.media_file,
		 			id: this.attributes.meta.id,
					date: this.attributes.meta.date,
					ticker: this.attributes.meta.ticker,
					call_type: "write",
					media_type: this.attributes.meta.media_type,
					version: this.attributes.meta.version,
					api_key: config.key
		 		}
		 	});



		 	this.save({
			    success: function (model, response) {
			        console.info("success, final save transcription model ", model, response);
			    	console.info(JSON.stringify(model, 2, null));
			    },
			    error: function (model, response) {
			        console.error("error, final save transcription model",model, response);
			   		console.error(JSON.stringify(model, 2, null));
			    }
			});

		 },

		 //converts plain text, with speakers contained as `~` on new lines.
		 //ad saves them in the `paragraphs` attributes
		 updateParagraphs: function(text){
		 	console.info("triggered intermediate save");
	 		var tmpText = parseEditedText(text);

		 	this.set({paragraphs: tmpText});
	 		
	 		this.set({meta: 
		 		{
		 			api_call: "write",
		 			status: "in progress",
		 			source: "Copy Desk",
		 			media_file: this.attributes.meta.media_file,
		 			id: this.attributes.meta.id,
					date: this.attributes.meta.date,
					ticker: this.attributes.meta.ticker,
					call_type: "write",
					media_type: this.attributes.meta.media_type,
					version: this.attributes.meta.version,
					api_key: config.key

		 		}
		 	});

	 		this.save({
			    success: function (model, response) {
			        console.log("in transcription model intermediate save - success", model, response);
			         console.info(JSON.stringify(model, 2, null));
			    },
			    error: function (model, response) {
			        console.error("in transcription model - error",model, response);
			        console.error(JSON.stringify(model, 2, null));
			    }
			});
		 
		 }
});


// TODO: move this in lib
/**
 * Helper functions to save to local storage 
 */

// Store
function saveLocally(key, data){
	//https://stackoverflow.com/questions/43116179/localstorage-detect-if-local-storage-is-already-full
	try {
		localStorage.setItem(key, JSON.stringify(data));
		console.log("saved locally");
  		// localStorage.setItem("name", "Hello World!"); //saves to the database, "key", "value"
	} catch (e) {
  		if (e.name == 'QUOTA_EXCEEDED_ERR') {
    		alert('was unable to save, your local storage seems to be full'); //data wasn't successfully saved due to quota exceed so throw an error
  		}
	}
}


// Retrieve from local storage as json
function retrieFromLocal(key){
	console.log("recovered");
	return JSON.parse(localStorage.getItem(key));	
}