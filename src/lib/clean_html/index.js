//module originally from otranscribe 
// https://github.com/oTranscribe/oTranscribe/blob/master/src/js/app/clean-html.js
// used in 
// https://github.com/oTranscribe/oTranscribe/blob/master/src/js/app/texteditor.js
// 
const sanitizeHtml = require('sanitize-html');


function cleanHTML(dirty) {
    return sanitizeHtml(dirty, {
        allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'p', 'span', 'br' ],
        transformTags: {
            'div': sanitizeHtml.simpleTransform('p'),
        },
        allowedAttributes: {
            'span': [ 'class', 'speakerLabel', 'confidenceScore4','confidenceScore3','confidenceScore2','wordnoTimeCode','contentEditable','data-*' ]
        }
    });
};


module.exports.cleanHTML= cleanHTML;