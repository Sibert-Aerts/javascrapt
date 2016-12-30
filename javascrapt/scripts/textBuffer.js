/* 	ABSTRACT CLASS: TEXTBUFFER	*/
var textBuffer = function(s, delay = 100){
	this.subjectWrapper = s;
	this.$textfield = $(this.subjectWrapper);
	this.id = 0;
	this.delay = delay;
	this.onFinishOnce = false;
	this.clear();
};

// Reset the buffer's state, stop all text writing and clear the text box
textBuffer.prototype.clear = function(){
	this.id++;
	this.bufferedText = "";
	this.writeIndex = 0;	
	this.hurried = false;
	this.$textfield.addClass("writing");
	
	this.clearText();
};

// Clear the text box and type out the given text inside of it
textBuffer.prototype.bufferText = function(text){
	this.clearText();
	this.clear();
	
	this.bufferedText = text;
	
	this.nibbleText(this.id);
};

// Clears the written text, internally and externally
textBuffer.prototype.clearText = function(){
	$(this.$textfield).html("");
};

// Prototype function that calculates the time between nibbles
textBuffer.prototype.timeFunc = function(){
	return this.delay;
};

// Tell the buffer to hurry up printing its current text
textBuffer.prototype.hurry = function(){
	this.hurried = true;
}

textBuffer.prototype.hurryAndDo = function(func, onlyOnce = true){
	if(!this.isFinished() || !onlyOnce)
		this.onFinish = func;
	else if (this.isFinished())
		return func();
	this.onFinishOnce = onlyOnce;
	this.hurry();
}

textBuffer.prototype.writeNextCharacter = function(){
	var nextChar = this.bufferedText[this.writeIndex];
	this.putCharacter(nextChar, true);
	this.writeIndex++;
}

textBuffer.prototype.isFinished = function(){
	var len = this.bufferedText.length - this.writeIndex;
	return len === 0;
}

// Recursively calls itself until the text is nibbled up.
// 		id is used to halt the recursion in case new text is input.
textBuffer.prototype.nibbleText = function( id ){
	
	// All characters got nibbled
	if(this.isFinished()){
		this.finish();
		this.onFinish();
		if (this.onFinishOnce)
			this.onFinish = function(){};
		return;
	}
	
	// text got changed: break up this nibbling thread!
	if(id !== this.id) return;
	
	this.writeNextCharacter();
	this.onCharacterWrite();
	
	// If we're in a hurry, just write all of them with no delay, get it over with!
	if(this.hurried){
		while(!this.isFinished())
			this.writeNextCharacter();
	}
	
	setTimeout( function(){this.nibbleText(id)}.bind(this), this.timeFunc());
};

// Is called once the buffer finishes nibbling
textBuffer.prototype.finish = function(){
	this.$textfield.removeClass("writing");
};

// Event called once the buffer finishes buffering
textBuffer.prototype.onFinish = function(){}

textBuffer.prototype.onCharacterWrite = function(){}

// Writes the given character
textBuffer.prototype.putCharacter = function(c){
	$(this.$textfield.html(this.$textfield.html() + c));
};
