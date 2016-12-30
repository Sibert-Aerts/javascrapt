function chance(x, outof = 1){
	return (Math.random()*outof <= x);
}

function choose(list){
	i = Math.floor( Math.random() * list.length);
	return list[i];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function refreshTooltips(){
	$('[data-toggle="tooltip"]').tooltip(); 
}

// Functions shamelessly ripped from StackOverflow, thanks!
String.prototype.toProperCase = function () {
	return this.replace(/\w[^-\s]*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// WORD RESOURCES

// PLANET NAMES:

	planetStarts = ["Grand", "Ye Olde", "Unknowable","Dangerous", "Forbidden","Impossible","Smelly","Stinky", "New", "Great", "Unreachable", "Mysterious", "Lost",
		"Undiscovered", "Old", "Forgotten", "Modern", "Distant"
	];
	
	planetPrefixes = ["Jingo", "Jango", "Bramblo", "Fringo", "Zyka", "Bumbo", "Stinko", "Dave-o-", "Barfo", "Funko", "Jibbedy","Jekkedy", "Jorba", "bed", "ear", "mar", "sol",
		"Alpha ", "Ferto ", "Bingi ", "Beta ", "Gamma ", "Delta ", "Stenta ", "Jjetta ", "Buffo ", "Theta ", "Epsilon ", "Frep ", "Zeta ", "Eta ", "ur", "plut", "ven", "jup",
		"Iota ", "kappa ", "lambda ", "mu ", "nu ", "xi ", "omicron ", "pi ", "rho ", "sigma ", "tau ", "upsilon ", "phi ", "chi ", "psi ", "omega ", "dad", "ter", "ver", "bok",
	];
	
	planetBodies = ["zoko", "frinka", "funko", "bingo", "bringo", "beno","bendo", "stinko", "whompo", "stando", "fringus", "jongo", "bebbedy", "stototo", "bibbibo", "buuuuuu",
		"alba", "stokko", "furgu", "bubbel", "bento", "stikkxy", "Centauri", "Astinex", "Cortinex", "Artifex", "Bingonex", "Benbabex", "asty" , "anax", "drak" ,"khen", "hokku", "bunbi",
		"freddii", "swompliq", "terra", "ferra", "berra", "earth", "sjeart", "mars", "jupiter", "piter", "venus", "pluto", "uranus", "rock", "stone", "litho", "bongo"
	];
	
	planetSuffixes = ["padus", "-concistan","stan","-stan","planet", "-planet", "woobledoop", "oid", "-oid", "stoid", "broid", "noid", "void", "place",
		"star", "planet", "planetoid", "planetite", "planetut", "plane", "sphere", "ball", "orb", "cube", "otch", "dimension", "dim", "shun", "bok", "beff", "stit",
		"fonk", "bub", "hop", "hepp", "zjott-lot", "luto", "piter", "anus", "lith", "rock", "zoid", "zor"
	];

// ANIMAL NAMES:

	animalAdjectives = ["happy", "smelly", "stinky", "angry", "hungry", "fat", "skinny", "dead", "deceased", "decaying", "unwitting", "stupid", "dumb", "clever", "hostile",
		"dangerous", "muscular"
	];
	
	animalAdjectiveColourSuffixes = ["-bellied", "-eyed", "-pelted", "-feathered", "-necked", "-brimmed", "-pawed", "-nosed"]
	
	animalPrefixes = ["stinker", "stinko", "turt", "burt", "bort", "work", "hark", "verk", "vorp", "jinka", "jorbo", "gorbo", "flimmy", "stanka", "stinko", "frinko", "fuggo", "an",
		"bendo", "blobbo", "melto", "melti", "jigba", "jerma", "sterma", "haram", "snuf", "puf", "wub", "wup", "hok", "jok", "vul", "volp", "welp", "wem", "wop", "bub", "wilde"
	];
	
	animalBodies = ["bear", "possum", "turtle", "frurtle", "bortle", "boar", "shark", "camel", "framel", "bird", "flurt", "gob", "bob", "bub", "dav", "bok", "buck", "duck",
		"bug", "beetle", "freetle", "cheatle", "cheeta", "tiger", "lion", "giraffe", "bifaffe", "stitats", "tunko", "floppo", "farto", "qoqa", "qarko", "kwark", "kanko", "puppo",
		"doggi", "doggo", "pupper", "stuffle", "snippgug", "gut", "beet", "crawl", "fronk", "step", "woof", "bob", "flop", "flap", "harambe", "haram", "dog", "wolf", "cat", "fox",
		"deer", "beest", "munch", "chomp", "bite", "claw", "paw", "leg", "arm", "mouth", "eye", "foot", "toe", "tooth", "teeth", "beak", "maw", "step", "run", "walk", "crawl",
		"kip", "hond", "hound", "kat", "thony", "fan"
	];
	
	animalSuffixes = ["flapper", "eater", "walker", "flier", "badunk", "stadop", "quadrak", "bobbob", "thingie", "creature", "beast", "animal", "thing", "monster", "mess", "critter",
		"stot", "stunk", "bjit", "floff", "molky", "bibbo", "pupper", "per", "ster", "fer", "ger", "bjer", "bjor", "snorer", "stinker", "farter", "muncher", "cruncher", "stuncher", "be",
		"crawler", "runner", "sprinter", "er", "le", "ler", "thano"
	];
	
// ETC.

	smells = ["doo-doo", "roses", "leaves", "grass", "bark", "wood", "crap", "George Lucas", "soil", "hard work", "disappointment", "iron", "rust", "copper", "ore", "opportunity",
		"ethanol", "methane", "methanol", "dirt", "mud", "water", "ocean", "salt", "vinegar", "pancakes", "car exhaust", "carbon monoxide", "carbon dioxide", "carbon trioxide", "barium",
		"helium", "fartium", "stinkium", "home", "work", "napalm", "coffee", "pain", "flower pollen", "mustard seed", "frogs", "lavender", "mothballs", "harvest", "decay", "lime gelatin",
		"steamed carrots", "peas", "eyedrops", "wet pillow", "scented body-spray", "new clothes", "frozen despair", "dog chow", "yourself", "blue", "fresh pine needles",
		"bones", "detergent", "a barnyard", "a clothing store", "music", "a bait shop", "sushi", "rope burn", "flowers", "cobwebs", "magic", "stardust", "ozone", "glasses", "bleach",
		"nightshade", "Mettaton", "batteries", "sweet lemons", "aliens", "space", "adventure", "charred soil", "a summer afternoon", "blood", "coal", "fire", "burning", "acid", "salt"
	];
	
	adjectives = ["blue", "red", "green", "orange", "rufous", "black", "white", "pale", "dark", "brown", "yellow", "pink", "purple", "puke-coloured", "ugly", "pretty", "cute", "beautiful",
		"horrifying", "creepy", "scary", "spooky", "large", "gigantic", "huge", "big", "small", "tiny", "miniscule", "overgrown", "frozen", "burning", "snow-covered", "rotten", "stinky",
		"smelly"	
	];
	
	colours = ["red", "green", "blue", "yellow", "orange", "purple", "violet", "pink", "white", "black", "gray", "mauve", "pale", "lime", "cyan", "maroon", "khaki"];
	
	identChars = "000111222333444555666777888999ABCDEFGHIJKLMNOPQRSTUVWXYZXXYYZZRRQQVV---------///";
	
function generateIdent(){
	var count = 0;
	ident = "";
	while(chance(15-count,15)){
		ident += choose(identChars);
		count++;
	}
	return ident;
}
	
function fixProperName(name){
	name = name.toProperCase();
	name = name.replace(/[\s-]*/g, function(txt){return txt.charAt(0);});
	return name;
}
	
function generatePlanetName(){
	name = "";
	if(chance(0.1))
		name += choose(planetStarts) + " ";
	
	if(chance(0.8))	
		name += choose(planetPrefixes);
	if(chance(0.1))	
		name += choose(planetPrefixes);
	
	name += choose(planetBodies);
	if(chance(0.1))
		name += choose(planetBodies);
	
	if(chance(0.8)){
		if(chance(0.5))	
			name += "-";
		name += choose(planetSuffixes);
	}
	
	name = fixProperName(name);
	
	if(chance(0.3)){
		if(chance(0.8))
			name += choose(["-", " ", ": "]);
		name += generateIdent();
	}	
	
	return name;
}

function generateAnimalName(){
	name = "";
	
	if(chance(0.3))
		name += choose(animalAdjectives) + " ";
	
	if(chance(0.3))
		name += choose(colours) + choose(animalAdjectiveColourSuffixes) + " ";;
	
	if(chance(0.6))
		name += choose(animalPrefixes) 
	name += choose(animalBodies);	
	if(chance(0.6))
		name += choose(animalSuffixes) 
	
	return name.toProperCase();
}

explorePhrases = [
"You [10%*carefully* |][land|set down|crash] on [the surface of|] [a|the] _[distant|far-away|hidden|mysterious] [planet[oid|]|asteroid]_ [called |known as |30%identified as |]**$planet.name$**."
,	
"[After [wandering|exploring|travelling|50%navigating][ the _[desolate|frozen|endless|10%] [vacuum|emptiness|outskirts][50% of space|30%]_|] for [days|30%weeks|50%ages], you|30%You] \
[finally |eventually |200%][discover|find|arrive at] the [elusive|mysterious|distant|far-away] [planet[50%oid|]|asteroid] [called |known as |30%identified as |]**$planet.name$**\
[|, it [smells [like|30%of]|50%[stinks|reeks] of] *$planet.smell$*]."
,
];

animalPhrases = [
"As you [explore|roam] the [surface|environment], you [discover|find|notice] a/an **$animal.name$**\
[30%|, it [smells [like|30%of]|50%[stinks|reeks] of] *$animal.smell$*[| [and|50%with a hint of] *$rand.smell$*]]."
,"£££A/An [angry|happy|deceitful] **$animal.name$** approaches you, the smell of *$animal.smell$* fills [your nostrils|the air].£££"

]

/* 		CLASS: NMSGen		*/
var NMSGen = function(){
	
	// context, used by the processor to fill in labels
	// TODO: bind /this/ to all of these
	this.context = {
		"rand" : {
			"planet" : {
				"name" : generatePlanetName
			},
			"animal" : {
				"name" : generateAnimalName
			},
			"smell" : function(){return choose(smells);}
		},
		"planet" : {
			"name" : this.getPlanetName.bind(this),
			"smell" : this.getPlanetSmell.bind(this)
		},
		"animal" : {
			"name" : this.getAnimalName.bind(this),
			"smell" : this.getAnimalSmell.bind(this)
		}
	};
	
	this.processor = new textProcessor(this.context);
	
	// parseDict defines how styles are parsed, and to what
	var parseDict = [
		{open: "**", 	close: "**",	node: makeClassNode("red")},
		{open: "*", 	close: "*",		node: makeClassNode("green")},
		{open: "_", 	close: "_",		node: makeClassNode("blue")},
		{open: "((", 	close: "))",	node: makeClassNode("transparent")},
		{open: "£££", 	close: "£££",	node: makeClassNode("comic")},
	];
	
	this.parse = new parsedTextBuffer("#toetpoet", 10, parseDict);
	
	var sounds = ["https://my.mixtape.moe/hndfkp.mp3", "https://my.mixtape.moe/wlxbpb.mp3", "https://my.mixtape.moe/vxrgkf.mp3", 
		"https://my.mixtape.moe/eieanp.mp3", "https://my.mixtape.moe/hjgyck.mp3"];
	
	this.parse.sounds = new soundShuffler(sounds, 3);
	this.parse.sounds.setVolume(0.15);
	this.parse.onCharacterWrite = function(){
		this.sounds.playSound();
	}
	
}

NMSGen.prototype.getPlanetName = function(){
	return this.currentPlanetName;
}

NMSGen.prototype.getPlanetSmell = function(){
	return this.currentPlanetSmell;
}

NMSGen.prototype.getAnimalName = function(){
	return this.currentAnimalName;
}

NMSGen.prototype.getAnimalSmell = function(){
	return this.currentAnimalSmell;
}

// Parses style and appends the given text to the log
NMSGen.prototype.appendLog = function(text){
	this.parse.hurryAndDo( 
		function(){
			$("#log").append($("#toetpoet").html());
			this.parse.bufferText(text);
			$("#main-output").scrollTop($("#main-output")[0].scrollHeight);
		}.bind(this), true);
}

NMSGen.prototype.generate = function(){
	this.currentPlanetName = generatePlanetName();
	this.currentPlanetSmell = choose(smells);
	this.currentAnimalName = generateAnimalName();
	this.currentAnimalSmell = choose(smells);
	
	// make this into a text writer
	$(".planet-name").html(this.currentPlanetName); 
	
	var exploreText = this.processor.process(choose(explorePhrases));
	var animalText = this.processor.process(choose(animalPhrases));

	var text = exploreText + "\n" + animalText;
	this.appendLog(text);
}

// on page load: create the generator and generate a planet
$(function(){	
	generator = new NMSGen();	
	generator.generate();
}) 




















