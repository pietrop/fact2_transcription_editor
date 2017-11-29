'use strict';

 var words = /\w/;

function parse(text){
	var results = [];
	var sequence = {};
	//using a separate objects to add headers 
	var header = {};
	//split on single lin ebreak 
	// using trim to remove trailing spaces/empty lines at the end. 
	var lines = text.trim().split("\n");

	// iterate over lines. 
	for(var i=0; i< lines.length ; i++){
		var line = lines[i];
		//if it's not an empty line 
		if(line !==""){
			// handing case of subheading, marked in text inside `{` `}` on their own line. 
			if(line.includes("{")){
				// console.log(line, sequence);
				header.text = line.replace("{","").replace("}","").trim(); 
				header.type = "subheading";
				//
				// results.push(header);
				// header = {};
			// `~` used to identify lines with speakers 
			}else if(line.includes("~")){

				// skip if first line to add to results the sequence. 
				if(i!== 0){
					// saves new sequence, when identified next speaker
					results.push(sequence);
					sequence = {};

					if(header.text){
						results.push(header);
						header = {};
					}
				}
				//add speakers line to 
				sequence.speaker = line.replace(/~/g, "");
				//initialises text for sequence
				sequence.type = "paragraph";
				sequence.text = "";
			}else if(words.test(line)){
				//adds text, to cover edge case where multiple lines of text in between speakers
				sequence.text += line


				if(header.text){
						results.push(header);
						header = {};
					}

				//identify the last element.
				//because we add the sequence when identify a new speaker, we risk missing out the last "paragraph" if we don't add this last part to include it to the results
				if(i == (lines.length -1)){
					// console.log(sequence)
					// add last element to sequence 
					results.push(sequence);
				}	
			}
		}
	}


	//adding an `seq` attribute to number the new lines. 
	results.forEach(function(s, index){
		s.seq = index; 
	});

	// break paragraphs in 3 parts if they contain a section header?
	// results.forEach(function(s, index){
	// 	if(s.text.includes("{")){
	// 	var tmpSegment=	s.text.split("{");
	// 	var textPart1 = tmpSegment[0];
	// 	var header = tmpSegment[1].split("}")[0];
	// 	var textPart2 = tmpSegment[1].split("}")[1];
	// 	console.log(textPart1, header, textPart2);

	// 	console.log(s.speaker);

	// 	} 
	// });

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