
// path of keys across your keyboard so that hopefully all adjacent keys appear next to each other at least once in the string
var regChars = "1234567890)(*&^%$#@!1!2@3#4$5%6^7&8*9(0)-_[p-0o9i8u7y6t5r4e3w21qawsedrftgyhujikolp;['/?;.l,kmjnhbgvfcdxszax cv bn ,;          ";
var strangeChars = "☺☻♥♦♣♠•◘○♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"\\'<>µ$*^"

// picks a random element from the array
function choose(array){
	index = Math.floor(Math.random() * array.length);
	return array.length == 0 ? "" : array[index];
}	

// x chances in y to return true, y is 1 by default
function chance( x, y = 1 ){
	return ( Math.random() * y <= x );
}

// function courtesy of StackOverflow user Tim Down
function getIndicesOf(searchStr, str) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
	str = str.toLowerCase();
	searchStr = searchStr.toLowerCase();
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

// function courtesy of StackOverflow user dweeves
function clamp(num, min, max) {
  return num < min ? min : num > max ? max : num;
}

// returns a character which could realistically accidentally have been typed instead of the given character
function getRandomNearbyChar(c){
	// find c in chars
	indices = getIndicesOf(c, regChars);
	
	// if c doesn't appear in chars, return something special
	if(indices.length === 0)
		return choose(strangeChars);
	
	// else: find a 'nearby' character
	index = choose(indices);
	index += Math.round((2 - Math.pow(Math.random(),1.5)) * 1.8)	// 0, 1, 2 roughly divided as respectively 20%, 50%, 30%
	index = clamp(index, 0,regChars.length - 1);
	
	upper = !(c === c.toLowerCase());
		// 1 in 16 chance of flipping case
	return chance(1,16)^upper ? regChars[index].toUpperCase() : regChars[index];
}

// UNUSED variation of the repetition map, too good to throw away
function deflateString(string, maxLength = 10){
	var out = [];
	
	var len = string.length;
	var oneStr = "";
	for (var i = 0; i < len;)	// manually increase i
	{
		var biggest = ["", 0];
		for(var length = Math.min(maxLength, len-i); length > 0; length--)
		{
			var str = string.slice(i, i+length);
			var count = 1;
			while(str === string.slice(i + count*length, i + length + count*length) && (i + length + count*length < len+1))
				count++;
			
			// If the length of the string inferred from multiplying this one is larger than before: New 'biggest' found!
			if(length * (count-1) >= biggest[0].length * (biggest[1]-1))	
				biggest = [str, count];
		}
		
		if(biggest[1] > 1)
		{
			if(oneStr){ out.push([oneStr, 1]); oneStr = "";}	// dump the sequence of strings (characters) that don't repeat
			out.push(biggest);
			i += biggest[0].length * biggest[1];
		}
		else	// special case, because we don't want one hundred single characters x 1
		{
			oneStr += string[i];	// add a single character to oneStr
			i += 1;
		}
	}
	if(oneStr){ out.push([oneStr, 1]); oneStr = "";}
	
	return out;
}

// Gets an array which maps indices in the given string to how often a string of specific lenght is repeated within
function getRepetitionMap(string, maxLength = 10){
	var out = [];
	
	var len = string.length;
	var oneLength = 0;
	for (var i = 0; i < len;)	// manually increase i
	{
		var biggest = [0, 0];
		for(var length = Math.min(maxLength, len-i); length > 0; length--)
		{
			var str = string.slice(i, i+length);
			var count = 1;
			while(str === string.slice(i + count*length, i + length + count*length) && (i + length + count*length < len+1))
				count++;
			
			// If the length of the string inferred from multiplying this one is larger than before: New 'biggest' found!
			if(length * (count-1) >= biggest[0] * (biggest[1] - 1))
				biggest = [length, count];
		}
		
		if(biggest[1] > 1)
		{
			if(oneLength){ out[i-oneLength] = [oneLength, 1]; oneLength = 0;}	// dump the sequence of strings (characters) that don't repeat
			out[i] = biggest;
			i += biggest[0] * biggest[1];
		}
		else	// special case, because we don't want one hundred single [i, 1, 1]
		{
			oneLength++;
			i++;
		}
	}
	if(oneLength){ out[i-oneLength] = [oneLength, 1]; oneLength = 0;}
	
	out[len] = [0,1];	// wrap it up
	
	return out;
}

var keySoundUrls = ["https://my.mixtape.moe/zsnxdw.mp3", "https://my.mixtape.moe/xgefac.mp3", "https://my.mixtape.moe/leuqjo.mp3", 
"https://my.mixtape.moe/fciatc.mp3", "https://my.mixtape.moe/qhfiav.mp3", "https://my.mixtape.moe/lxamft.mp3", "https://my.mixtape.moe/iaqdrg.mp3", 
"https://my.mixtape.moe/puvocs.mp3", "https://my.mixtape.moe/ektflj.mp3", "https://my.mixtape.moe/chbswv.mp3"];

var bigKeySoundUrls = ["https://my.mixtape.moe/doxhwm.mp3", "https://my.mixtape.moe/dsxmgk.mp3", "https://my.mixtape.moe/vybcae.mp3"];

// lol how do I include stuff in javascript
if(typeof soundShuffler == 'undefined')
	console.log("ERROR: textSpeaker.js requires soundShuffler.js if you want typing sounds to work!");

if(typeof textBuffer == 'undefined')
	console.log("ERROR: textSpeaker.js requires textBuffer.js if you want styled buffering to work!");

/* 	CLASS: TEXTTYPER from TEXTBUFFER	*/
var textTyper = function(s){
	this.subjectWrapper = s;
	this.textField = $(this.subjectWrapper).find(".text");
	this.cursor = $(this.subjectWrapper).find(".cursor");
	this.id = 0;
	this.clear();
	this.sounds = new soundShuffler(keySoundUrls, 5);
	this.bigSounds = new soundShuffler(bigKeySoundUrls, 5);
};

// Reset the buffer's state, stop all text writing and clear the text box
textTyper.prototype.clear = function(){
	this.id++;
	this.bufferedText = "";
	this.writeIndex = 0;	
	
	this.repetitionMap = [];
	
	this.errorCount = 0;
	this.erronousIncrements = 0;
	this.skippedChars = 0;
	this.eraseState = false;
	this.clearText();
};

// Clear the text box and type out the given text inside of it
textTyper.prototype.bufferText = function(text){
	this.clearText();
	this.clear();
	
	this.bufferedText = text;
	this.repetitionMap = getRepetitionMap(text);
	
	$(this.cursor).removeClass("blink");
	this.nibbleText(this.id);
};

// Clears the written text, internally and externally
textTyper.prototype.clearText = function(){
	$(this.subject).html("");
	this.writtenText = "";
};

// Returns a magical number that might slightly represent how the human brain possibly deals with repeated strings in text
textTyper.prototype.getRepetitionIndex = function(){
	var i = this.writeIndex;
	while(!this.repetitionMap[i])
		--i;
	
	if (this.repetitionMap[i][0] === 1)
		return 10;	// completely decimate any chance of error
	
	return Math.max(1, this.repetitionMap[i][1] / Math.sqrt(this.repetitionMap[i][0]));	// the bigger this number is, the lower chance of error
}

// returns a magical number which also accounts for keyboard working, and the person having to slow down typing at the end
textTyper.prototype.getRepetitionTiming = function(){
	var i = this.writeIndex;
	while(!this.repetitionMap[i])
		--i;
	var j = this.writeIndex;
	while(!this.repetitionMap[j])
		++j;
	var n = this.writeIndex - i;
	var m = j - this.writeIndex;
	
	// if you're close to the end, speed up no longer happens
	if( m < 3 && this.repetitionMap[i][0] == 1 && this.repetitionMap[i][1] > 8)
		return 1;
	
	// holding a key to repeat it follows this logic:
	var secondSingleKeyFactor = (n == 1 && this.repetitionMap[i][0] == 1 && this.repetitionMap[i][1] > 8 ? 0.001 : 1)
	
	// The bigger this is, the inversely logarithmically smaller the delay
	return Math.max(1, this.repetitionMap[i][1] / Math.sqrt(this.repetitionMap[i][0])) * secondSingleKeyFactor;	
}

// Function that calculates the time between nibbles
textTyper.prototype.timeFunc = function(){
	
	var length = this.bufferedText.length - this.writeIndex;
	
	// crude, manual slowness variable
	var slowness = 0.5;
	
	// Scales inversely with length, smoothly thanks to Magic Numbers™ 
	// ex: len = 0 : baseDelay = 33; len = 100 : baseDelay = 12;
	var baseDelay = 900/(Math.pow(length + 80, 0.8));	
	
	if(this.eraseState){
		// slow down as there's less characters to delete
		var eraseDelay = 20*(1/(1 + Math.sqrt(this.errorCount)));		
		return ( baseDelay + eraseDelay ) * slowness;
	}
		
	// Determines how grotesquely unlikely the longest possible added delay is
	var randExponent = 10; 	
	
	// Max added delay, scales inversely with log of length, so that the variation in delay will still be significant even for large len
	// ex: len = 0: maxAddedDelay = 500, len = 100: maxAddedDelay =~ 250
	var maxAddedDelay = 500/Math.log(length + 10);	
	
	// Two delays that happen depending if a space got typed, or if one is about to be typed
	var postSpaceDelay = this.writtenText[this.writtenText.length - 1] === ' ' ? 80.0 : 0;
	var preSpaceDelay = this.bufferedText[this.writeIndex] === ' ' ? 40.0 : 0;	
	var spaceDelay = (preSpaceDelay + postSpaceDelay) / Math.log(length + 10);

	// If lots of the same character or lots of little bits, speed up a bit
	var repetition = this.getRepetitionTiming();
	var rF = Math.max(1/Math.pow(repetition,0.3), 0.3); // repetitionFactor, at least 0.3
	
	// ASSEMBLE THE VARIABLES
	var base = (baseDelay + spaceDelay) * rF * slowness;
	var rand = Math.max(0, 1 - 3*Math.abs(1-rF)) * Math.pow(Math.random(), randExponent) * maxAddedDelay;
	
	return (base + rand) * slowness ;
};

// Recursively calls itself until the text is nibbled up.
// 		id is used to halt the recursion in case new text is input.
textTyper.prototype.nibbleText = function( id ){
	
	var len = this.bufferedText.length - this.writeIndex;
	var makeNoise = true;
	
	// All characters got nibbled and there's no errors left to fix, we're done here
	if(len === 0 && this.errorCount === 0){
		this.finish();
		return;
	}
	
	// text got changed, cease all nibbling operations
	if(id !== this.id) return;
		
	// If there's typos registered, erase them, before you begin erasing there's a chance of going on a typo spree
	if(this.errorCount && chance(0.05) || this.eraseState)	
	{
		this.eraseState = true;	// Start erasing, ensuring this block will be reached for as long as typos are stored
		
		this.errorCount -= this.skippedChars;	// total number of characters to be erased
		this.writeIndex -= (this.erronousIncrements + this.skippedChars);	// Reset the write index to its last 'correct' state
		this.erronousIncrements = 0;
		this.skippedChars = 0;
		
		if((--this.errorCount) < 0){	// disable erase state once all errors are consumed
			this.eraseState = false;
			this.errorCount = 0;
		} else {
			this.eraseCharacter(true);
		}
	}
	else if( len != 0 )	// no typos detected
	{
		var nextChar = this.bufferedText[this.writeIndex];
		
		/*	Behaviour Variables	*/
		var errorRate = 60;			// (1/errorRate) chance of adding an error per character
		var detectionChance = 0.5;	// chance of detecting and fixing an error per error
		var chainErrorRate = 10		// compounded error rate during an error chain (does not affect overall errors in final text!)
		
		// dictated by number of errors programmed in
		var errorTypeCount = 4;
		var repetition = this.getRepetitionIndex();
		var p = errorRate * errorTypeCount * repetition;
		var pc = errorRate * errorTypeCount;
		
		if(chance(1,p) || this.errorCount && chance(1,pc))	// Typo (= press similar key instead of correct key)
		{		
			this.writeIndex++;	// continue to the next character
			this.putCharacter(getRandomNearbyChar(nextChar), true);
			if(chance(detectionChance) || this.errorCount){
				this.errorCount++;
				this.erronousIncrements++;	// Remember that you wrongly typed
			}
		} 
		else if (chance(1, p-1) || this.errorCount && chance(1,pc-1)) // Accidentally double press key
		{	
			this.putCharacter(nextChar, true);
			if(chance(detectionChance) || this.errorCount)
				this.errorCount++;
		}
		else if (chance(1, p-2) || this.errorCount && chance(1,pc-2)) // Press similar key on top of correct key
		{	
			this.putCharacter(getRandomNearbyChar(nextChar), true);
			if(chance(detectionChance) || this.errorCount)
				this.errorCount++;
		}
		else if (chance(1, p-3)|| this.errorCount && chance(1,pc-3))	// Skip key
		{	
			this.writeIndex++;
			
			if(chance(detectionChance) || this.errorCount){
				this.errorCount++;
				this.skippedChars++;	// remember that you missed characters
			}
		}
		else	// Actually press the correct key, chance (1-1/errorRate)
		{
			this.putCharacter(nextChar, true);
			this.writeIndex++;
			
			if(this.errorCount){	// if there's a chain of errors happening, add to it
				this.errorCount++;
				this.erronousIncrements++;
			}
		}
	}
	
	setTimeout( function(){this.nibbleText(id)}.bind(this), this.timeFunc());
};

// Is called once the buffer finishes nibbling
textTyper.prototype.finish = function(){
	$(this.cursor).addClass("blink");
};

// Writes the given character, plays a matching sound if necessary
textTyper.prototype.putCharacter = function(c, makeSound = false){
	
	if(makeSound){
		if(c === ' ')
			this.bigSounds.playSound();
		else
			this.sounds.playSound();
	}
	
	this.writtenText += c;
	this.updateText();	
};

// Erases the last written character
textTyper.prototype.eraseCharacter = function(makeSound = false){
	
	if(makeSound)
		this.sounds.playSound();
			
	this.writtenText = this.writtenText.slice(0, this.writtenText.length-1)
	this.updateText();
};

// Updates the subject's text field(s) with the current writtenText value, at a delay
textTyper.prototype.updateText = function(delay =  50){
	setTimeout(function(){$(this.textField).html(this.writtenText);}.bind(this,this.textField,this.writtenText), delay);
};
