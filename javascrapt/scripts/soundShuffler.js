// function courtesy of StackOverflow user Jeff
/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

/* 	CLASS: SOUNDSHUFFLER */
var soundShuffler = function(urls, arrayCount = 1){
	this.muted = false;
	this.soundArrays = [];
	this.soundCount = urls.length;
	this.arrayCount = arrayCount;
	this.index = 0;
	this.aIndex = 0;
	
	// Set up a collection of soundArrays
	for(var _ = 0; _ < arrayCount; _++){
		var soundArray = []
		
		for(var i = 0 ; i < urls.length ; i++)
			soundArray.push(new Audio(urls[i]));
		
		shuffle(soundArray);
		this.soundArrays.push(soundArray)
	}
}

soundShuffler.prototype.setVolume = function(val){	
	for(var i = 0; i < this.arrayCount; i++)
		for(var j = 0 ; j < this.soundCount ; j++)
			this.soundArrays[i][j].volume = val;
}

// pause all sounds
soundShuffler.prototype.pauseAll = function(){
	for(var i = 0; i < this.arrayCount; i++)
		for(var j = 0 ; j < this.soundCount ; j++)
			this.soundArrays[i][j].pause();
}

// mute
soundShuffler.prototype.mute = function(){
	this.muted = true;
	this.pauseAll();
}

// unmute
soundShuffler.prototype.unMute = function(){
	this.muted = false;
}

// plays a shuffled sound
soundShuffler.prototype.playSound = function(){
	if(this.muted) return;
	
	this.soundArrays[this.aIndex][this.index].currentTime = 0;
	this.soundArrays[this.aIndex][this.index].play();
	this.index = (this.index + 1)%this.soundCount;
	if(!this.index){	// end of current array reached
		shuffle(this.soundArrays[this.aIndex]);
		this.aIndex = (this.aIndex + 1)%this.arrayCount;
	}
}