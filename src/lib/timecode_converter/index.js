'use strict';
/**
 * timecode conversion utility module
 */
module.exports.convertTimeCodeToSeconds =  function (timeString){
	  console.log("timeString",timeString);
	  var timeArray = timeString.split(":");
	  console.log("timeString",timeString,timeArray);

	  var hours   = parseFloat(timeArray[0]) * 60 * 60;
	  var minutes = parseFloat(timeArray[1]) * 60;
	  var seconds = parseFloat(timeArray[2].replace(",","."));
	  // var frames  = parseInt(timeArray[3].split(",")[1])*(1/framerate);
	  // var str = "h:" + hours + "\nm:" + minutes + "\ns:" + seconds + "\nf:" + frames;
	  // console.log(str);
	  var totalTime = hours + minutes + seconds;// + frames;
	  return totalTime;
	}

/**
 * Helper/utility function
 */
module.exports.convertSecondsToTimeCodes = function(seconds){

	  var sec_num = parseInt(seconds, 10); // don't forget the second param
	  var hours   = Math.floor(sec_num / 3600);
	  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	  var seconds = sec_num - (hours * 3600) - (minutes * 60);

	  if (hours   < 10) {hours   = "0"+hours;}
	  if (minutes < 10) {minutes = "0"+minutes;}
	  if (seconds < 10) {seconds = "0"+seconds;}
	  return hours+':'+minutes+':'+seconds;
	}
