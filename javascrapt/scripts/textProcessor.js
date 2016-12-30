
var filterFloat = function (value) {
    if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      .test(value))
      return Number(value);
  return NaN;
}

var getRandomWeightedIndex = function(weights){
	var total = 0;
	
	for(var i = 0; i < weights.length; i++)
		total += weights[i];
	
	var value = Math.random() * total;
	
	for(var i = 0; i < weights.length; i++){
		value -= weights[i];
		if(value <= 0)
			return i;
	}
}

var callIfFunction = function(obj){
	if (typeof obj == 'function') 
		return obj();
	return obj;
}

/*	Abstract Class: stochastNode				*/
var stochastNode = function(){
	this.parent = {};
	this.children = [];
}

stochastNode.prototype.appendChild = function(c){
	this.children.push(c);
	c.parent = this;
}

stochastNode.prototype.getLastChild = function(){
	return this.children[this.children.length-1];
}

stochastNode.prototype.evaluate = {};

/*	Class: stochastFactNode from stochastNode		*/
var stochastFactNode = function(){
	stochastNode.call(this);
}
stochastFactNode.prototype = Object.create(stochastNode.prototype);

stochastFactNode.prototype.evaluate = function(){
	var output = "";
	for(var i=0; i < this.children.length; i++)
		output += this.children[i].evaluate();
	return output;
}

/*	Class: stochastTextNode from stochastFactNode	*/
var stochastTextNode = function(text = ""){
	this.text = text;
	stochastFactNode.call(this);
}
stochastTextNode.prototype = Object.create(stochastFactNode.prototype);

stochastTextNode.prototype.evaluate = function(){
	return this.text;
}

/*	Class: stochastRandNode from stochastNode	*/
var stochastRandNode = function(){
	stochastNode.call(this);
}
stochastRandNode.prototype = Object.create(stochastNode.prototype);

stochastRandNode.prototype.evaluate = function(){
	var weights = [];
	for(c in this.children) 
		weights.push(this.children[c].chance);
	
	return this.children.length == 0 ? "" : this.children[getRandomWeightedIndex(weights)].evaluate();
}

/*	Class: stochastOutcomeNode from stochastFactNode	*/
var stochastOutcomeNode = function(){
	stochastFactNode.call(this);
	this.chance = 100;
}
stochastOutcomeNode.prototype = Object.create(stochastFactNode.prototype);


/*	Class: stochasticsTree		*/
var stochasticsTree = function(){
	this.root = new stochastFactNode();
}

stochasticsTree.prototype.parse = function(input){
	this.root = new stochastFactNode();
	var currentNode = this.root;
	var escapeChar = [];
	for(var i = 0; i < input.length; i++)
	{
		var foundChar = false;
		
		var c = input[i];
		
		var escapeThisChar = (i > 0 && escapeChar[i-1]);
		
		escapeChar[i] = foundChar = (c === "\\" && !escapeThisChar);
		
		if(!escapeThisChar){
			if(c === '[')	// new stochastics node
			{
				if(currentNode instanceof stochastTextNode)
					currentNode = currentNode.parent;
				currentNode.appendChild(new stochastRandNode());
				currentNode.getLastChild().appendChild(new stochastOutcomeNode());
				currentNode = currentNode.getLastChild().getLastChild();
				foundChar = true;
			}
			else if(c === ']')	// close stochastics node
			{
				while(!(currentNode instanceof stochastRandNode) && currentNode !== this.root)
					currentNode = currentNode.parent;
					
				if( currentNode !== this.root)
				{
					currentNode = currentNode.parent;
					foundChar = true;
				}
			}
			else if(c === '|')	// new child to stochastics node
			{
				while(!(currentNode instanceof stochastRandNode) && currentNode !== this.root)
					currentNode = currentNode.parent;
				
				if( currentNode !== this.root)
				{
					currentNode.appendChild(new stochastOutcomeNode());
					currentNode = currentNode.getLastChild();
					foundChar = true;
				}
			}
			else if(c === '%')	// defines the relative chance of the current outcome node
			{
				var j = i;
				
				while(input[j] !== '[' && input[j] !== '|' && j >= 0)
					j--;
				
				if(j != -1 && j < i-1)
				{
					var value = filterFloat(input.slice(j+1, i));
					if( !isNaN(value))
					{
						while(!(currentNode instanceof stochastOutcomeNode) && currentNode !== this.root)
							currentNode = currentNode.parent;
						
						if(currentNode !== this.root)
						{
							currentNode.chance = value;
							currentNode.children = [];
							foundChar = true;
						}
					}
				}
			}
		}
		
		if(!foundChar) // it's just a regular character
		{ 
			if(!(currentNode instanceof stochastTextNode)){
				currentNode.appendChild(new stochastTextNode());
				currentNode = currentNode.getLastChild();
			}
				
			currentNode.text += c;
		}
	}
}

stochasticsTree.prototype.collapse = function(){
	return this.root.evaluate();
}

/*	Class: textProcessor		*/

var textProcessor = function(context){
	this.context = context;
}

textProcessor.prototype.collapseStochastics = function(input){
	var tree = new stochasticsTree();
	tree.parse(input);
	return tree.collapse();
}

textProcessor.prototype.replaceLabel = function(input){
	
	// slice off the opening and closing marks
	var label = input.slice(1,-1);
	
	// split the label
	var path = label.split(".");
	
	// run down the path to find the object we need
	var obj = this.context;
	for(var i = 0; i < path.length; i++){
		obj = obj[path[i]];
		
		// if the path runs dead, or ends with an undefined object, don't replace
		if(typeof obj == "undefined")
			return input;
	}
	
	// retrieve the appropriate replacement
	var out = callIfFunction(obj);
	// console.log("Replacing label \"" + label + "\" with \"" + out + '\"');
	return out;
}

textProcessor.prototype.contextualise = function(input){
	var output = input.replace(/\$[^\$\s]*\$/g, this.replaceLabel.bind(this));
	return output;
}

// credit to https://github.com/rossmeissl/indefinite_article
var AN_REQUIRING_PATTERNS = /^([aefhilmnorsx]$|hono|honest|hour|heir|[aeiou]|8|11)/i
var A_REQUIRING_PATTERNS = /^(([bcdgjkpqtuvwyz]|onc?e|onearmed|onetime|ouija)$|e[uw]|uk|ubi|ubo|oaxaca|ufo|ur[aeiou]|use|ut([^t])|unani|uni(l[^l]|[a-ko-z]))/i

textProcessor.prototype.evaluateArticle = function(input){
	
	var a = input[0];
	var an = input.slice(2,4);
	
	// find the following word, ignoring style symbols
	var tail = input.slice(4).match(/[a-z0-9]+/i);
	
	if( typeof tail == "undefined" )
		return input;
	
	if( AN_REQUIRING_PATTERNS.test(tail) && !A_REQUIRING_PATTERNS.test(tail))
		return an + input.slice(4);
	else
		return a  + input.slice(4);
}

textProcessor.prototype.evaluateArticles = function(input){
	var output = input.replace(/a\/an\s*[^\s,.]*/ig, this.evaluateArticle.bind(this));
	return output;
}

// Polish up the text after all the variable elements have been put in place
textProcessor.prototype.polish = function(input){
	input = this.evaluateArticles(input);
	return input;
}

textProcessor.prototype.process = function(input){
	input = this.collapseStochastics(input);
	input = this.contextualise(input);
	input = this.polish(input);
	return input;
}




/* test code here 

var testPhrase = "ik ben een [grote oen|stommerik|stinkend[e ezel| varken]] en mijn naam is $name$";

var testContext = [
	{ label : "naam", 	value : "bjorn"},
	{ label : "toet", 	value : "TOET"},
];

var proc = new textProcessor(testContext);

var output = proc.process(testPhrase);

console.log(output);
*/







