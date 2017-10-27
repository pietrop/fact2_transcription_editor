'use strict';

function parse(text){
	var results = [];
	var sequence = {};
	//split on single lin ebreak 
	var lines = text.split("\n");
	// iterate over lines. 
	for(var i=0; i< lines.length ; i++){
		var line = lines[i];
		//if it's not an empty line 
		if(line !==""){
			// `~` used to identify lines with speakers 
			if(line.includes("~")){
				// skip if first line to add to results the sequence. 
				if(i!== 0){
					// saves new sequence, when identified next speaker
					results.push(sequence);
					sequence = {};
				}
				//add speakers line to 
				sequence.speaker = line.replace(/~/g, "");
				//initialises text for sequence
				sequence.text = "";
			}else{
				//adds text, to cover edge case where multiple lines of text in between speakers
				sequence.text += line;
				// console.log(line);
			}
		}
	}



	results.forEach(function(s, index){
		s.seq = index; 
	});

	return results;
};


//Making a list of peakers without timecodes, and text, but with sequence number
function parseSpeakers(text){
	var intermediateResult = parse(text);

	intermediateResult.forEach(function(s, index){
		delete s.text;
	}) 
	return intermediateResult;
}


module.exports.parse= parse;


module.exports.parseSpeakers= parseSpeakers;