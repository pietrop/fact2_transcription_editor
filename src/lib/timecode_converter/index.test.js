'use strict';
const timecodeConverter = require('./index.js');

var sampleSeconds = 600;  
var sampleTimecods = "00:10:00";
test('convert Seconds To Timecodes', () => {
  expect(timecodeConverter.convertSecondsToTimeCodes(sampleSeconds)).toBe(sampleTimecods);
});



test('convert Seconds To Timecodes', () => {
  expect(timecodeConverter.convertTimeCodeToSeconds(sampleTimecods)).toBe(sampleSeconds);
});


