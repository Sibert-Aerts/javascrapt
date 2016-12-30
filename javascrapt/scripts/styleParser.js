/* A simple parser type thing in javascript by Rezuaq */

/* 	Class: parseTree */

var defaultParseDict = [];

var parseTree = function($subject, parseDict, symbolDict){
	this.root = new textNode("");
	this.currentNode = this.root;
	this.$subjectElement = $subject;
	this.$currentElement = $subject;
	this.parseDict = parseDict;
	this.symbolDict = symbolDict;
	this.debug = false;
}

// Build a tree out of the given text input
parseTree.prototype.parse = function(input){
	this.root = new parseNode();
	this.currentNode = this.root;
	this.$currentElement = this.$subjectElement;
	
	var current = this.root;
	
	for(var i = 0; i < input.length; i++)
	{
		var tokenFound = false;
		
		// Check if we're reading a closing token
		for( t in this.parseDict )
		{
			var token = this.parseDict[t];
			if(input.slice(i, i + token.close.length) === token.close)
			{
				// in a text node inside of a node that's being closed by the given operator
				if( current instanceof textNode && current.parent instanceof token.node)	
				{
					if(this.debug)
						current.string+=input.slice(i, i + token.open.length);
					current = current.parent.parent;
					
					i += (token.close.length - 1);
					tokenFound = true;
					break;
				}
				else if(current instanceof token.node)		// in a node that's being closed by the given operator
				{
					if(this.debug){
						current.appendChild(new textNode());
						current.getLastChild().string+=input.slice(i, i + token.open.length);
					}
					current = current.parent;

					i += (token.close.length - 1);
					tokenFound = true;
					break;				
				}
				else
				{					
					// The token failed to close anything, so we assume it's not a closing token instead.
				}
			}
		}
		
		// Check if it could be an opening token instead
		if(!tokenFound)
		{
			for( t in this.parseDict )
			{			
				var token = this.parseDict[t];
				if( input.slice(i, i + token.open.length) === token.open)
				{				
					// in a text node, but a new node is being made, so add it to the parent
					if(current instanceof textNode){
						if(this.debug)
							current.string += input.slice(i, i + token.open.length);
						current = current.parent
					} else if (this.debug){
						current.appendChild(new textNode());
						current.getLastChild().string += input.slice(i, i + token.open.length);
					}
					
					// in a node that's getting a new child
					current.appendChild(new token.node());
					current = current.getLastChild();
					
					i += (token.open.length - 1);
					tokenFound = true;
					break;
				}
			}
		}
		
		if(!tokenFound)
		{
			for( s in this.symbolDict )
			{
				var symbol = this.symbolDict[s];
				if( input.slice(i, i + symbol.identifier.length) === symbol.identifier)
				{
					if(current instanceof textNode)
						current = current.parent
					
					current.appendChild(new symbol.node());
					i += (symbol.identifier.length - 1);
					tokenFound = true;
				}
			}			
		}
		
		if(!tokenFound && !(current instanceof textNode))
		{
			current.appendChild(new textNode());
			current = current.getLastChild();
		}
		current.string += input[i];		
	}
}

// Write the next character, creating new HTML elements according to the structure of the tree
parseTree.prototype.writeChar = function(){
		
	while(true){
		// If the tree's root is consumed, there's nothing left to be done
		if( this.isConsumed())
			return;	
		
		// Search deeper, creating new DOM elements on the way
		while(!(this.currentNode instanceof textNode || this.currentNode instanceof symbolNode) && this.currentNode.children.length > 0)
		{
			if(this.currentNode.index === 0)
				this.$currentElement.append(this.currentNode.createElement());
			this.$currentElement.removeClass("writing");
			this.$currentElement = this.$currentElement.children().last();
			this.$currentElement.addClass("writing");
			this.currentNode = this.currentNode.getNextChild();
		}
		
		// We actually found a text node, grab its next character and write it, then stop doing what you were doing
		if(this.currentNode instanceof textNode && !this.currentNode.isConsumed())
		{
			$(this.$currentElement.html(this.$currentElement.html() + this.currentNode.getNextChar()));
			return;
		}
		else if(this.currentNode instanceof symbolNode)
		{
			this.$currentElement.append(this.currentNode.createElement());
		}
		
		// Dead end! Go up until we hit an unconsumed node or the tree's root
		while( this.currentNode.isConsumed() && this.currentNode != this.root)
		{			
			this.$currentElement.removeClass("writing");
			this.$currentElement = this.$currentElement.parent();
			this.currentNode = this.currentNode.parent;
		}
	}
	
}

parseTree.prototype.isConsumed = function(){
	return (this.root == this.currentNode && this.currentNode.isConsumed());
}


/* 	Class: parseNode	*/
var parseNode = function(){
	this.parent = {};
	this.children = [];
	this.index = 0;
}

parseNode.prototype.isConsumed = function(){
	return (this.children.length === this.index);
}

parseNode.prototype.getNextChild = function(){
	var c = this.children[this.index];
	this.index++;	
	return c;
}

parseNode.prototype.getLastChild = function(){
	return this.children[this.children.length-1];
}

parseNode.prototype.appendChild = function( child ){
	this.children.push(child);
	child.parent = this;
}

parseNode.prototype.createElement = function(){
	return jQuery('<p/>');
}


/* 	Class: textNode : parseNode			*/
var textNode = function(str = ""){
	parseNode.call(this);
	this.string = str;
}

textNode.prototype = Object.create(parseNode.prototype);

textNode.prototype.isConsumed = function(){
	return (this.string.length === this.index);
}

textNode.prototype.getNextChar = function(){
	var c = this.string[this.index];
	this.index++;
	return c;
}

textNode.prototype.appendChild = {};
textNode.prototype.createElement = {};


/* 	Class: classNode : parseNode		*/
var classNode = function(c){
	parseNode.call(this);
	this.className = c;
}

classNode.prototype = Object.create(parseNode.prototype);

classNode.prototype.createElement = function(){
	return jQuery('<span/>', {
		"class" : this.className
	});
}


/* 	Class: boldNode : classNode			*/
var boldNode = function(){
	classNode.call(this, "bold");
}
boldNode.prototype = Object.create(classNode.prototype);


/* 	Class: italicsNode : classNode		*/
var italicsNode = function(){
	classNode.call(this, "italics");
}
italicsNode.prototype = Object.create(classNode.prototype);


/* 	Class: underlineNode : classNode	*/
var underlineNode = function(){
	classNode.call(this, "underline");
}
underlineNode.prototype = Object.create(classNode.prototype);


// Terrible class-making, constructor-function-returning metafunction
// Give it a classname and it returns the prototype of the node capable of making such classes
var makeClassNode = function(className){
	var nod = function(){
		classNode.call(this, className)
	}
	
	nod.prototype = Object.create(classNode.prototype);
	
	return nod;
}


/*	Class: symbolNode : parseNode		*/

var symbolNode = function(obj){
	parseNode.call(this);
	this.object = obj;
}

symbolNode.prototype = Object.create(parseNode.prototype);

symbolNode.prototype.appendChild = {};

symbolNode.prototype.createElement = function(){
	return this.object;
}

// Makes a new class of symbolNode which represents the specified DOM object
var makeSymbolNode = function(obj){
	var nod = function(){
		symbolNode.call(this, obj)
	}
	
	nod.prototype = Object.create(symbolNode.prototype);
	return nod;
}


defaultParseDict = [
	{open: "**", 	close: "**",		node: boldNode},
	{open: "*", 	close: "*", 		node: italicsNode},
	{open: "_", 	close: "_", 		node: underlineNode},
	{open: "((", 	close: "))", 		node: makeClassNode("transparent")},
];

defaultSymbolDict = [
	{identifier: "!!",		node: makeSymbolNode(jQuery('<span/>', {"class" : "exclamation" , "text" : "!"})) },
	{identifier: "@@",		node: makeSymbolNode(jQuery('<div/>', {"class" : "danger-sign"})) },
]


if(typeof textBuffer == 'undefined')
	console.log("styleParser.js requires textBuffer.js if you want styled buffering to work!");
	
/*	CLASS: parsedTextBuffer : textBuffer 	*/
var parsedTextBuffer = function($subject, delay = 100, parseDict = defaultParseDict, symbolDict = defaultSymbolDict){
	textBuffer.call(this, $subject, delay);
	this.tree = new parseTree(this.$textfield, parseDict, symbolDict);
}

parsedTextBuffer.prototype = Object.create(textBuffer.prototype);

parsedTextBuffer.prototype.isFinished = function(){
	return this.tree.isConsumed();
}

parsedTextBuffer.prototype.bufferText = function(text){
	this.clearText();
	this.clear();
	
	this.tree.parse(text);
	
	this.nibbleText(this.id);
}

parsedTextBuffer.prototype.writeNextCharacter = function(){
	this.tree.writeChar();
}

parsedTextBuffer.prototype.enableDebug = function(){
	this.tree.debug = true;
}
parsedTextBuffer.prototype.disableDebug = function(){
	this.tree.debug = false;	
}


/* DON'T DEBUG CODE OPEN INSIDE
$(function(){
	
	var boom = new parseTree($('#parseTester .text'));
	
	//
	//						tree
	//						  
	//						root
	//						  |
	//						node4
	//						/	\
	//					node2	node3
	//					/	|	   |
	//			    node1  "ni" "toet!"
	//			   /  |  \
	//			"T" node5 "ter"
	//				  |
	//				"oe"
	//
	
	var text10 = new textNode("T");
	var text11 = new textNode("oe");
	var text12 = new textNode("ter");
	var text2 = new textNode("ni");
	var text3 = new textNode("toet!");
	
	var node1 = new parseNode();
	var node2 = new parseNode();
	var node3 = new italicsNode();
	var node4 = new parseNode();
	var node5 = new boldNode();

	node1.appendChild(text10);
	node1.appendChild(node5);
	node5.appendChild(text11);
	node1.appendChild(text12);
	node2.appendChild(node1);
	node2.appendChild(text2);
	node3.appendChild(text3);
	node4.appendChild(node2);
	node4.appendChild(node3);
	boom.root = node4;
	
	var troet = new parseTree($('#parseTester .text'));
	troet.parse("floef *florf* flof, flaff, *floeft*");
	
	
});*/
















