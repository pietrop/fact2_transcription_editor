'use strict';
const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone');

const stopwatch = require('simple-stopwatch');

const convertSecondsToTimeCodes = require('../../lib/timecode_converter/index.js').convertSecondsToTimeCodes;
const convertTimeCodeToSeconds = require('../../lib/timecode_converter/index.js').convertTimeCodeToSeconds;

const  cleanHTML = require('../../lib/clean_html/index.js').cleanHTML;
/**
* Backbone view for transcription view for individual transcriptions 
* @class TranscriptionView
* @constructor
* @extends Backbone.View
*/
module.exports = Backbone.View.extend({
  tagName: 'div',
  template: require("../templates/transcription_show.html.ejs"),
  initialize: function() {
    this.render();
   
    //turned of auto render update, so that it keeps the localstorage version with timecodes references, and it just updates one way to the server.
    // this.listenTo(this.model, "change", this.render);
    
    var self = this;
    //This is how to deal with media element in backbone views, as they don't buble up events
    // as explained here https://stackoverflow.com/questions/25736735/backbone-how-can-i-add-event-for-html5-video
    // when loaded
    this.mediaEl = self.el.querySelector("#mediaPreview");

    // video.load();
     // this.maxduration = 
    // TODO loadeddata vs loadedmetadata
    this.mediaEl.addEventListener('loadedmetadata', function(e){
      console.log("loadedmetadata");
        $(self.el).trigger('loadedMedia');
    });


    this.typingTimer;
    this.playPauseControl =false;
    this.playBtnIconEl =  this.el.querySelector("#playBtnIcon");
    // 
    this.durationTimeEl = document.querySelector(".duration");
    this.currentTimeEl = document.querySelector(".current");
    // Drag status, for progress bar 
    this.timeDrag = false;   

    //To set the interval 
    // var fiveMinutesInMilliseconds = 300000;
	var saveIntervalMinutes = 5;
	function saveInterval(intervalInMinutes){
	    var oneMinuteInMilliseconds = 60000;
    	var minuteMultiplier = intervalInMinutes;
		  var saveIntervalInMilliseconds = oneMinuteInMilliseconds * minuteMultiplier;
      return saveIntervalInMilliseconds;
	}
	  
////TROUBLESHOOTING_PERFORMANCE
	setInterval(serverSideSaveTimer, saveInterval(saveIntervalMinutes));

    function serverSideSaveTimer() {
      var tmpText = self.getPlainText(); 
      self.model.updateParagraphs(tmpText);
    }



    // window.setInterval(function(t){
    //   if (self.mediaEl.readyState > 0) {
    //     // var duration = $('#duration').get(0);
    //     // var vid_duration = Math.round(video.duration);
    //     // duration.firstChild.nodeValue = vid_duration;
    //     clearInterval(t);
    //   }
    // },500);
    // 
    

 

  },

  events:{
    "loadedMedia": "setupMedia",
    //playback keyboard shortcuts
    "click .playBtn": "play",
    "click #mediaPreview": "play",
    "click .stopBtn": "stop",
    // "click .rewindBtn": "rewind",
    // "click .forwardBtn": "forward",
    "click .goBackBtn": "rollBack",
    // "click .volumeOff": "volumeOff",
    // "click .volumeDown": "volumeDown",
    // "click .volumeUp":"volumeUp",
    "click #pauseWhileTypingCheckBox": "togglePlayPauseControl",
    "keydown #pauseWhileTypingCheckBox": "togglePlayPauseControl",
	  
     ////TROUBLESHOOTING_PERFORMANCE
    "keyup .textBox": "typing",
    "keydown .textBox": "typingActions",
	  
    // "click #goFullScreen": "goFullScreen",
    // for accessibility being able to click enter when moving with tabs 
    "keydown .playBtn": "play",
    "keydown #mediaPreview": "play",
    "keydown .stopBtn": "stop",
    "keydown .rewindBtn": "rewind",
    "keydown .forwardBtn": "forward",
    "keydown .goBackBtn": "rollBack",
    // "keydown .volumeOff": "volumeOff",
    // "keydown .volumeDown": "volumeDown",
    // "keydown .volumeUp":"volumeUp",
    // "keydown #goFullScreen": "goFullScreen",
    // 
    "mousedown .rewindBtn": "rewind",
    "mousedown .forwardBtn": "forward",
  
    // "mouseup .rewindBtn": "rewind",
    // "mouseup .forwardBtn": "forward",
  
    "click .speedControl": "speedControl",
    "keydown .speedControl": "speedControl",

    "mousedown .progressBar": "initDragbar",

    "click .changeTime": "changeCurrentTime",
    "keydown .changeTime": "changeCurrentTime",
    "click #exportCaptionsBtn": "exportCaptions",

    "keypress [contenteditable]": "removeConfidenceScore",

    "click .addSpeakerBtn":"addSpeaker",
    "click .addDescriptionBtn": "addDescription",

    "click .addSectionHeaderBtn": 'addSectionHeader',

    "click .restoreLastSaved": "restoreLastSavedLocally",

    "click #showHideMediaPreviewCheckBox" :"hideShowMediaPreview",

    "click .intermediateSaveBtn": "intermediateSaveLocally",

    "click .finalSaveBtn": "finalSave",

    "click .fetchFromServerBtn": "fetchFromServer",


    //implementing backbone double click as described here 
    // https://gist.github.com/iliyat/dbe3d4c435d26e87b164
    // explained here
    // https://stackoverflow.com/questions/15566597/mouseup-and-doubleclick-both-attached-to-seperate-event-handling-functions-using
    'touchstart .textBox': _.debounce(function(e) {
            if (this.doucleckicked) {
                this.doucleckicked = false;
            } else {
                this.onmouseup.call(this, e);
            }
        }, 300),
        'dblclick .textBox': function(e) {
            this.doucleckicked = true;
            this.ondblclick.call(this, e);
        }

  },
  onmouseup: function() {
    //when clicking on a word do nothing
    // console.log('mouseup');
  },

  ondblclick: function(e) {
    console.log('ondblclick ', e);
      // console.log('dblclick in a word ');
      //start playing from that point onwards 
      this.playFromWord(e);
  },

  //keyboard event using Mousetrap.backbone version 
  keyboardEvents: {
    'esc'        : 'play',
    'ctrl+1'     : 'rewind',
    'f1'         : 'rewind',
    'ctrl+2'     : 'forward',
    'f2'         : 'forward',
    'ctrl+0'     : 'stop',
    'ctrl+3'     : 'descreaseSpeed',
    'f3'         : 'descreaseSpeed',
    'ctrl+4'     : 'increaseSpeed',
    'f4'         : 'increaseSpeed',
    'ctrl+k'     : 'changeCurrentTime',
    'f5'         : 'rollBack',
    'ctrl+5'     : 'rollBack',
    "ctrl+/"     : 'showKeyboardShortcuts',
    'ctrl+6'     : 'addSpeaker',
    'ctrl+7'     : 'addDescription',
    'ctrl+8'     : 'addSectionHeader',
    'ctrl+s'     : 'intermediateSaveLocally'
  },

    setupMedia: function(){
      var self = this;
      //once loaded need to replace reference of backbone to the one in the document and not the one in the video 
      //otherwise it does not show progress in the image, just plays audio
      //something to do with propagation of events that in html5 video don't bubble up.
      this.mediaEl = document.querySelector("#mediaPreview");
      this.maxduration = document.querySelector("#mediaPreview").duration;
      console.info('playing');
      // this.setupConfidenceScore();
      // this.setupCliccableHypertranscript();
      this.setupHyperTranscriptColorProgressIndication();
      this.setupProgressBarListner();

      this.ifExistLocalVersionLoadThat();

      ////TROUBLESHOOTING_PERFORMANCE
      ////saves text locally every 15 seconds. 
      //setInterval(function(){
      //self.saveLocally();},
      //15000);
      this.initializeTimer();
    },

    initializeTimer: function(){
        //stop watch 
        stopwatch(0, '%h hours %m min %s sec').on('tick', function (time) {
          document.querySelector("#stopWatch").value = time;
            // console.log(time);
        }).start();
    },

    // setupConfidenceScore: function(){
    //   var self = this;
     
    //   this.words = document.querySelectorAll('.words');
    //   this.words.forEach(function(w){
    //   //// add confidence score if it has been defined  
     
    //   if(w.dataset.confidence !== null){
    //     if(w.dataset.confidence < 0.60 && w.dataset.confidence > 0){
    //         w.classList.add('confidenceScore4');
    //         // console.log("here?",w.dataset.confidence );
    //       }else if(w.dataset.confidence < 0.80 && w.dataset.confidence >0.70 ){
    //         w.classList.add('confidenceScore3');
    //       }else if(w.dataset.confidence < 0.95 && w.dataset.confidence >0.80 ){
    //         w.classList.add('confidenceScore2');
    //       }
    //    }
    //   // }

    //   // w.addEventListener("keyup", self.removeConfidenceScore, false);
    //  });
    // },

    // helper to remove confidence score where user starts typing on a word. 
    // Explained here
    // >So basically the contenteditable is the one that will respond to events dispatched from the inner HTMLElements. If we get the caret position and target the range's parentNode we can than retrieve the desired element
    // https://stackoverflow.com/questions/26353478/attaching-keypress-and-focusout-event-to-elements-inside-contenteditable-div
    removeConfidenceScore: function(e){
      var sr = window.getSelection().getRangeAt(0).commonAncestorContainer;
      var el = sr.parentNode;
      // console.log(el);
      el.classList.remove('confidenceScore4');
      el.classList.remove('confidenceScore3');
      el.classList.remove('confidenceScore2');
    }, 

    playFromWord: function(e){

      this.playBtnIconEl =  document.querySelector("#playBtnIcon");
      this.inputTimeOnWordClickPlayEl = document.querySelector("#inputTimeOnWordClickPlay");
      var delayTime =parseInt(this.inputTimeOnWordClickPlayEl.value);

      //for words that have lost accuracy
      if(e.target.dataset.startTime ){
        this.mediaEl.currentTime = e.target.dataset.startTime - delayTime;
        this.mediaEl.play();
        this.playBtnIconEl.classList.remove("glyphicon-play");  
        this.playBtnIconEl.classList.add("glyphicon-pause","active");
      }else{
        console.log("word has no timecode");
      }
      


    },

    setupCliccableHypertranscript: function(){
      var self = this; 
      //TODO: figure out why ref to document is needed here. 
      this.playBtnIconEl =  document.querySelector("#playBtnIcon");
      this.words = this.el.querySelectorAll('.words');
      this.words.forEach(function(w){
        w.onclick = function(e){
          // console.log(e.target.dataset.startTime);
          // self.mediaEl = document.querySelector("#mediaPreview");
          self.mediaEl.currentTime = e.target.dataset.startTime;
          // console.log(self.playBtnIconEl);
          // console.log("---");
         
          self.mediaEl.play();
           //change icon 
           //TODO figure out why  `self.changePlayPauseIcon();` does not work here, temporary patch calling icon element directly
          self.playBtnIconEl.classList.remove("glyphicon-play");  
          self.playBtnIconEl.classList.add("glyphicon-pause","active");
         
        };
      });
    },

    setupHyperTranscriptColorProgressIndication: function(){
      var self = this;
      this.words = this.el.querySelectorAll('.words');
      this.mediaEl.ontimeupdate = function(e){
        //updating duration and current time 
        self.updateTimecodeDisplay(e.target.currentTime, e.target.duration );

        // console.log("TIME UPDATE ", e);
        var currentTime = self.mediaEl.currentTime;
        // console.log("media timeupdate", e.target.currentTime,e.target.duration  );
        self.words.forEach(function(w){
        // console.log(w);
        //covering edge case where words timings are not defined.
        if(w.dataset.startTime){
          if(w.dataset.startTime > currentTime){
            w.classList.add('afterPlayHead');
            w.classList.remove('beforePlayHead');

          }else{
            w.classList.add('beforePlayHead');
            w.classList.remove('afterPlayHead');
          }
        }
          ////TODO: look into this if needed. 
          ////hilighting current word,make it easier to follow text. 
          // if((parseFloat(w.dataset.startTime).toFixed(2) > parseFloat(currentTime).toFixed(2)) && (parseFloat(w.dataset.endTime).toFixed(2) < parseFloat(currentTime).toFixed(2))){
          //   w.classList.add('currentWord');
          // }else{
          //   w.classList.remove('currentWord');
          // }
        });
      };

    },

    setupProgressBarListner: function(){
      var self = this;
      this.maxduration = document.querySelector("#mediaPreview").duration;//this.mediaEl.duration;
      console.info("1-this.maxduration ", this.maxduration );
      this.mediaEl.addEventListener("timeupdate", function () {
        //TODO: currentPosition needs to be a funciton to get current one or ok as is?
        var percentage = 100 * self.getCurrentPos() / self.maxduration;
        self.updateProgressBarEl(percentage);
        self.updateCurrentPositionEl(self.getCurrentPos());
      });

      this.progressBarEl =  this.el.querySelector('.progressBar');
      this.progressBarEl.onmousedown =function(e) {
        self.timeDrag = true;
        self.updatebar(e.pageX);
      };
      document.onmouseup = function(e) {
        if(self.timeDrag) {
          self.timeDrag = false;
          // console.log("e ",e.pageX,e);
          self.updatebar(e.pageX);
        }
      };
      document.onmousemove=function(e) {
        if(self.timeDrag) {
          self.updatebar(e.pageX);
        }
      };

    },

    changePlayPauseIcon: function(){
      var self = this;
      if(this.mediaEl.paused){
        self.playBtnIconEl.classList.remove("glyphicon-play");  
        self.playBtnIconEl.classList.add("glyphicon-pause","active");
        // this.mediaEl.play();
        // console.log("!playing")
      }else{
        self.playBtnIconEl.classList.remove("glyphicon-pause","active");
        self.playBtnIconEl.classList.add("glyphicon-play");
         // console.log("!paused")
        // this.mediaEl.pause();
      }
    },
  //TODO: clean up play function 
  //move all elements grabbed from dom ininitialize, 
  //maybe use playing event to update position of bar?
  play: function(e){
    var self = this;
    // TODO: figure out why without this, the refactoring of this does not work
    self.playBtnIconEl =  self.el.querySelector("#playBtnIcon");  
    //TABKEY = 9 / if it is being triggered by keydown using tab and if it's not the tab key so it doesn't trigger when moving on to next
    if(!(e.keyCode == 9) && !(e.shiftKey)) {  
      if(this.mediaEl.paused){
        self.changePlayPauseIcon();
        this.mediaEl.play();
      }else{
        self.changePlayPauseIcon();
        this.mediaEl.pause();
      }
    }//if  keys 
  },

  getCurrentPos: function(){
   return this.mediaEl.currentTime;
 },

 updateProgressBarEl: function(percentage){
  console.info("updateProgressBarEl-percentage", percentage);
     // this.timeBarEl.style.width = percentage+'%';
     document.querySelector(".timeBar").style.width = percentage+'%';
     // this.render();
   },

   updateTimecodeDisplay: function(time, duration){

    // TODO: figure out how to add this as state in initialize
    document.querySelector(".current").innerText = convertSecondsToTimeCodes(time);
    // TODO: figure out how to add this as state in initialize
    document.querySelector(".duration").innerText = convertSecondsToTimeCodes(duration);
  },


  updateCurrentPositionEl: function(pos){
    var currentPositionFormatted = convertSecondsToTimeCodes(parseFloat(pos));
     // TODO: figure out how to add this as state in initialize
     document.querySelector(".current").innerText = currentPositionFormatted;
   },

   updatebar: function(x){
    //gets coordinates everytime, to account for user changing window screen size. 
    // this.getPositionsCoordinates();
        this.positionInfo = document.querySelector('.progressBar').getBoundingClientRect();
        //left corner position of progress bar element
        this.positionInfoLet = this.positionInfo.left;
        //width of progress bar element 
        this.width = this.positionInfo.width;
    // console.info("this",this.positionInfo, this.positionInfoLet,this.width);
    var cursorPosition = x - this.positionInfoLet;
    var percentage =  parseInt(cursorPosition / this.width *100);
     //avoids user dragging of progress bar to go out of bound.
     if(percentage > 100) {
      percentage = 100;
    }
    if(percentage < 0) {
      percentage = 0;
    }
    console.info('updatebar-percentage:',percentage);

    this.updateProgressBarEl(percentage);

    this.updateMediaEl(percentage);
  },

  // getPositionsCoordinates: function(){
  //   // TODO: figure out how to add this as state in initialize
  //   this.positionInfo = document.querySelector('.progressBar').getBoundingClientRect();
  //   //left corner position of progress bar element
  //   this.positionInfoLet = this.positionInfo.left;
  //   //width of progress bar element 
  //   this.width = this.positionInfo.width;
  // },

  updateMediaEl: function(percentage){
    this.maxduration = document.querySelector("#mediaPreview").duration;
    console.log('updateMediaEl-percentage',percentage,'updateMediaEl-this.maxduration',this.maxduration, 'this.maxduration * percentage/100',this.maxduration * percentage/100, 'parseInt(parseInt(this.maxduration) * parseInt(parseInt(percentage)/100))',parseInt(parseInt(this.maxduration) * parseInt(parseInt(percentage)/100)));
    this.mediaEl.currentTime = parseInt(this.maxduration * percentage/100);
  },

  showKeyboardShortcuts: function(){
    document.querySelector("#showKeyboardShortcuts").click();
  },

  stop: function(e){
    if(!(e.keyCode == 9) && !(e.shiftKey)) {
      this.mediaEl.pause();
      this.mediaEl.currentTime = 0;
      this.playBtnIconEl.classList.remove("glyphicon-pause","active");
      this.playBtnIconEl.classList.add("glyphicon-play");  
    }
  },

  forward: function(e){
    // e.type == mousedown
    // e.type == mouseup
    // 
    if(!(e.keyCode == 9) && !(e.shiftKey)) {
      if(this.mediaEl.paused){
        this.mediaEl.pause();
        var currenTc = this.mediaEl.currentTime;
        //TODO: move this into settings.
        this.mediaEl.currentTime = currenTc +3;
      }else{
        this.mediaEl.pause();
        var currenTc = this.mediaEl.currentTime;
        //TODO: move this into settings.
        this.mediaEl.currentTime = currenTc +3;
        this.mediaEl.play()
      }
    }
  },

  rewind: function(e){
    if(!(e.keyCode == 9) && !(e.shiftKey)) {
      if(this.mediaEl.paused){
        this.mediaEl.pause();
        var currenTc =  this.mediaEl.currentTime;
        //TODO: move this into settings.
        this.mediaEl.currentTime = currenTc -3;
      }else{
        this.mediaEl.pause();
        var currenTc =  this.mediaEl.currentTime;
        //TODO: move this into settings.
        this.mediaEl.currentTime = currenTc -3;
        this.mediaEl.play();
      }
    }
  },


  rollBack: function(e){
    if( !(e.keyCode == 9) && !(e.shiftKey)) {
     var rollBackIntervarl = parseInt($("#rollbackInput").val());
     var currenTc = this.mediaEl.currentTime;
     if(this.mediaEl.paused){
        //TODO: move this into settings.
        this.mediaEl.currentTime = currenTc - rollBackIntervarl;
      }else{
        this.mediaEl.pause();
        //TODO: move this into settings.
        this.mediaEl.currentTime = currenTc - rollBackIntervarl;
        this.mediaEl.play();
      }
    }
  },

  speedControl: function(e){
    if(!(e.keyCode == 9) && !(e.which === 38) && !(e.which === 40) && !(e.shiftKey)) {
      var targetSpeed = e.currentTarget.dataset.speed;
      this.setSpeed(targetSpeed);
      
    }
    // $("video").prop("volume", 0.5);
  },

  setSpeed: function(targetSpeed){
    this.mediaEl.playbackRate = targetSpeed;
    this.updateSpeedDisplay(targetSpeed);
  },

  updateSpeedDisplay: function(targetSpeed){
    document.querySelector('#displayPlaybackSpeed').innerText = parseFloat(targetSpeed).toFixed(2);
  },

  //for keyboard shortcut
  increaseSpeed: function(e){
    if( !(e.keyCode == 9) && !(e.shiftKey)) {
      var currentspeed =  this.mediaEl.playbackRate
      if(currentspeed < 3.5){
        this.setSpeed( currentspeed + 0.1);
      }
    }
  },
  //for keyboard shortcut
  descreaseSpeed: function(e){
    if( !(e.keyCode == 9) && !(e.shiftKey)) {
      var currentspeed =  this.mediaEl.playbackRate;
      if(currentspeed > 0.5){
        this.setSpeed( currentspeed - 0.1);
      }
    }
  },


  changeCurrentTime: function(e){
   if( !(e.keyCode == 9) && !(e.shiftKey)) {
        // var video = document.querySelector('video');
        var value = prompt("Type the timecode you would like to jump to using this format", convertSecondsToTimeCodes(this.mediaEl.currentTime));
        if (value != null) {
          this.mediaEl.currentTime = convertTimeCodeToSeconds(value);
        }
      }
    },

    togglePlayPauseControl: function(e){
      if( !(e.keyCode == 9) && !(e.shiftKey)) {
        // console.log("toggled play pause");
        if(this.playPauseControl){
          this.playPauseControl = false;
          //in case we are getting to this from accessibility tab and keyboard
          $("#pauseWhileTypingCheckBox").prop( "checked", false );
        }else{
          this.playPauseControl = true;
          $("#pauseWhileTypingCheckBox").prop( "checked", true );
        }
      }
    },

    initDragbar: function(e){
      this.timeDrag = true;
      this.updatebar(e.pageX);
    },

    typing: function(e){ 
      //TODO: check for speaker labels 
      var self = this;
      var typingDelaySeconds= parseInt($('#inputTypingDelaySeconds').val());
      //cannot allow zero value or negative numbers, coz it does not do anything, so this is a catch for that 
      if(typingDelaySeconds <= 0){
        typingDelaySeconds = 1;
      }
      var doneTypingInterval = typingDelaySeconds *1000;
      if(this.playPauseControl){
      //if it is not the escape key 
        if(!(e.keyCode === 27) ){
          this.mediaEl.pause();
          clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(function(){
            self.mediaEl.play();
          },doneTypingInterval);
        }
      }

      //saving text locally for backup, if doen very keystroke slows down typing experience. 
      // this.saveLocally();
  },

  typingActions: function(e){
    var spacebarCode = 32;
    var deleteKey = 8;
    var enterKey = 13;
    if(e.keyCode == spacebarCode){
        // console.log("spacebar");
    }else{
      // console.log(e.keyCode);
    }
    var tmpBaseNode = window.getSelection().baseNode;
    var tmpParentNode  = window.getSelection().baseNode.parentNode;
    //key not an arrow, left, right, up and down, delete, remove, space bar etc..on space bar + next split word
    if(window.getSelection().type == ("Caret")){
       // console.log(e, tmpParentNode,tmpBaseNode );
       // console.log( tmpParentNode.dataset.endTime, tmpParentNode.dataset.startTime );
    }
   
  },

  // add speaker to text with styling and convention 
  addSpeaker: function(){
    // e.preventDefault();
    // console.log("addSpeaker", window.getSelection().baseNode.parentNode.nodeName ,window.getSelection().baseNode.parentNode, window.getSelection().baseNode.parentNode.classList, window.getSelection().baseNode.parentNode.classList.contains("textBox") , window.getSelection().baseNode.parentNode.classList.contains("textBox"));
    var speakerName = prompt("What's the speaker name?");
    if( speakerName == ""){
      alert("add a valid speaker name");
    }else{
      //a bit messy, but covering edge cases when adding a new speaker, to make sure it is inside the text box. 
      if( 
        (window.getSelection().type == ("Caret")) && 
        (window.getSelection().baseNode.parentNode.classList.contains("words") 
          ||  window.getSelection().baseNode.parentNode.classList.contains("textBox") 
          ||  window.getSelection().baseNode.parentNode.classList.contains("speakerLabel") 
          ||  window.getSelection().baseNode.parentNode.nodeName == "P" )
         ){
        this.pasteHtmlAtCaret("</span></p><p><span class='speakerLabel'>~"+speakerName+"~</span></p><p>");
      }else{
        alert("Your cursor needs to be inside the text editor, at the point where you'd like to add a new speaker label.");
      }
    }
    // add speaker name at caret
   
  },


  addDescription: function(){

    // console.log("addSpeaker", window.getSelection().baseNode.parentNode.nodeName ,window.getSelection().baseNode.parentNode, window.getSelection().baseNode.parentNode.classList, window.getSelection().baseNode.parentNode.classList.contains("textBox") , window.getSelection().baseNode.parentNode.classList.contains("textBox"));
    var descriptionText = prompt("What's the speaker name?", "Inaudible");
    if( descriptionText == ""){
      alert("add a valid speaker name");
    }else{
      //a bit messy, but covering edge cases when adding a new speaker, to make sure it is inside the text box. 
      if( 
        (window.getSelection().type == ("Caret")) && 
        (window.getSelection().baseNode.parentNode.classList.contains("words") 
          ||  window.getSelection().baseNode.parentNode.classList.contains("textBox") 
          ||  window.getSelection().baseNode.parentNode.classList.contains("speakerLabel") 
          ||  window.getSelection().baseNode.parentNode.nodeName == "P" )
         ){
        this.pasteHtmlAtCaret("<span class='descriptionLabel'>["+descriptionText+"]</span>");
      }else{
        alert("Your cursor needs to be inside the text editor, at the point where you'd like to add a new speaker label.");
      }
    }
  },


  addSectionHeader: function(){
    var descriptionText = prompt("What's the text you'd like to add in the section header subhead?", "some section header text");
    if( descriptionText == ""){
      alert("Section headers cannot be empty, type some text");
    }else{
      //a bit messy, but covering edge cases when adding a new speaker, to make sure it is inside the text box. 
      if( 
        (window.getSelection().type == ("Caret")) && 
        (window.getSelection().baseNode.parentNode.classList.contains("words") 
          ||  window.getSelection().baseNode.parentNode.classList.contains("textBox") 
          ||  window.getSelection().baseNode.parentNode.classList.contains("speakerLabel") 
          ||  window.getSelection().baseNode.parentNode.nodeName == "P" )
         ){
        this.pasteHtmlAtCaret("<h1 class='sectionHeader'>"+descriptionText+"</h1>");
      }else{
        alert("Your cursor needs to be inside the text editor, at the point where you'd like to add a new speaker label.");
      }
    }
  },

// Helper function 
// https://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
pasteHtmlAtCaret: function (html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
             // console.log("parent node",range.parentNode.nodeName);
            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
           
            
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } 
    else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
  },
  //work as a toggle, if media is sown show, if it is not hide 
  hideShowMediaPreview: function(){
    if(isHidden(this.mediaEl)){
      // console.log(isHidden(this.mediaEl), "visible");
      this.mediaEl .style.visibility= "visible";
    }else{
      // console.log(isHidden(this.mediaEl), "hidden");
      this.mediaEl.style.visibility= "hidden";
    }
    //helper to check if element is hidden or not
    //https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
    function isHidden(el) {
      var style = window.getComputedStyle(el);
      return (style.visibility === 'hidden');
    }
  },

  saveLocally: function(data){
     var tmpData = cleanHTML(document.querySelector('.textBox').innerHTML);
     this.model.saveLocally(tmpData);
  },

  //used when coming back to transcription, we assume most accurate version is the one we have locally. 
  ifExistLocalVersionLoadThat: function(){
    if(this.model.isInLocalStorage(this.model.id)){
      this.restoreLastSavedLocally();
    }else{
      //do nothing,we just keep version we got from server
    }
  },

  restoreLastSavedLocally: function(){
    // console.log("restoreLastSaved");
    var tmpHtml = this.model.retrieveFromLocalStorage();
    document.querySelector('.textBox').innerHTML = cleanHTML(tmpHtml);
    //need to reactivate the hypertranscript. 
    this.setupHyperTranscriptColorProgressIndication();
  },

  intermediateSaveLocally: function(){
    alert("Saved to Server. Thank you!");
    this.saveLocally();
  },

  getPlainText: function(){
    return document.querySelector('.textBox').innerText;
  }, 

  finalSave: function(){
    var tmpText = this.getPlainText(); 
    this.model.finalSave(tmpText);
    alert("Final Save Complete. You May Close the Editor");
  },
  fetchFromServer: function() {
		var redButtonConfirm = confirm("If you continue, we will fetch the last known good copy from the server. This is only if your local copy is corrupted. You could lose some of your work. Use carefully");
		if(redButtonConfirm == true )	{
			localStorage.clear();
			this.model.fetch(tmpText);
		} else {
    	}
	},

  /**
  * @function render
  */
  render: function(){    
    var compiled  = this.template(this.model.attributes);
    this.$el.html(compiled);

    return this;
  }
  
});
