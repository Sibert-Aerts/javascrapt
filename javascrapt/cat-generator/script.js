///////////////////////////////////////////
//                 Ready                 //
///////////////////////////////////////////

DEBUG_ALIAS = true;
DEBUG_OUTLINE = true;
DEBUG_FRONT = true;
DEBUG_BACK = true;

$(document).ready(function(){
    catGen = new CatGenerator($('#cat-container'), 100, 80);
    $('#reset-button').click(catGen.reset.bind(catGen));
    $('#kill-button').click(_=>catGen.cat.alive=false);
    // debug buttons
    $('#alias-button').click(_=>DEBUG_ALIAS=!DEBUG_ALIAS);
    $('#outline-button').click(_=>DEBUG_OUTLINE=!DEBUG_OUTLINE);
    $('#front-button').click(_=>DEBUG_FRONT=!DEBUG_FRONT);
    $('#back-button').click(_=>DEBUG_BACK=!DEBUG_BACK);
});


/////////////////////////////////////////
//              PixelGrid              //
/////////////////////////////////////////

// Width and height are the number of tiles
PixelGrid = function($canvas, width=1, height=1){
    this.canvas = $canvas.get()[0];
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.width = width;
    this.height = height;
}

PixelGrid.prototype.reset = function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
}

PixelGrid.prototype.outline = async function(outlinecolor){
    var imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    var outlineData = this.ctx.createImageData(imageData);

    var w = this.width * 4;

    var isTransparent = (x, y) => imageData.data[y*w + x*4 + 3] == 0

    var setColor = (x, y, c) =>
        {outlineData.data[y*w + x*4 + 3] = 255; outlineData.data[y*w + x*4] = c.r; outlineData.data[y*w + x*4 + 1] = c.g; outlineData.data[y*w + x*4 + 2] = c.b}

    var getNeighbours = (x, y) => {
        out = [];
        for(var dx = -1; dx <= 1; dx += 2)
            if(bounded(x+dx, 0, this.width-1))
                out.push({x: x+dx, y: y});
        for(var dy = -1; dy <= 1; dy += 2)
            if(bounded(y+dy, 0, this.height-1))
                out.push({x: x, y: y+dy});
        return out;
    }

    for(var x=0; x < this.width; x++)
        for(var y=0; y < this.height; y++)
            if(!isTransparent(x, y))
                getNeighbours(x, y).forEach(o=>{if(isTransparent(o.x, o.y)) setColor(o.x, o.y, outlinecolor)});

    var outline = await createImageBitmap(outlineData);
    this.ctx.drawImage(outline, 0, 0);
}

PixelGrid.prototype.alias = async function(p=0){
    var imageData = this.ctx.getImageData(0, 0, this.width, this.height);

    var w = this.width * 4;
    var isTransparent = (x, y) => imageData.data[y*w + x*4 + 3] <= p;

    for(var x=0; x < this.width; x++)
        for(var y=0; y < this.height; y++)
            if(!isTransparent(x, y))
                imageData.data[y*w + x*4 + 3] = 255;
            else
                imageData.data[y*w + x*4 + 3] = 0;

    this.ctx.putImageData(imageData, 0, 0);
}

PixelGrid.prototype.drawRectangle = function(x, y, w, h, color){
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
}

PixelGrid.prototype.drawCircle = async function(x, y, d, color){
    var temp = new PixelGrid($('<canvas>'), this.width, this.height);
    temp.ctx.fillStyle = color;
    temp.ctx.beginPath();
    temp.ctx.arc(x, y, d, 0, Math.PI * 2, true);
    temp.ctx.closePath();
    temp.ctx.fill();
    temp.alias();
    var img = await createImageBitmap(temp.ctx.getImageData(0, 0, this.width, this.height));
    this.ctx.drawImage(img, 0, 0);
}

PixelGrid.prototype.drawEllipse = async function(x, y, w, h, color){
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
}

PixelGrid.prototype.drawLine = function(x1, y1, x2, y2, width, color){
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
}

PixelGrid.prototype.drawSpline = function(coords, width, color){
    if(coords.length%2){console.log('ATTEMPTED DRAWSPLINE WITH ODD COORDS!!!!!!');return}
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    
    this.ctx.beginPath();
    this.ctx.moveTo(coords[0], coords[1]);
    for(var i = 2; i < coords.length-2; i+=2){
        this.ctx.quadraticCurveTo(coords[i], coords[i+1], (coords[i] + coords[i+2])/2, (coords[i+1] + coords[i+3])/2)
    }
    var i = coords.length-2;
    this.ctx.quadraticCurveTo(coords[i], coords[i+1], coords[i], coords[i+1])
    this.ctx.stroke();
}

PixelGrid.prototype.drawPath = function(path, color){
    this.ctx.fillStyle = color;
    this.ctx.fill(path);
}

PixelGrid.prototype.drawGrid = async function(grid, x=0, y=0){
    var img = await createImageBitmap(grid.ctx.getImageData(0, 0, grid.width, grid.height));
    this.ctx.drawImage(img, x, y);
}

//////////////////////////////////////////
//                 Cat                  //
//////////////////////////////////////////

Cat = function(grid){
    this.grid = grid;
    this.frame = 0;
    this.alive = true;

    // Legs
    this.legLength = randInt(15,25);
    this.backThick = randInt(1, 6);
    this.frontThick = randInt(1, 6);

    this.backLeg = [30,50];
    for(var i=0;i<2;i++){
        this.backLeg.push(randInt(20, 40));
        this.backLeg.push(randInt(60, 40 + this.legLength))
    }
    this.backLeg.push(randInt(20, 40));
    this.backLeg.push(50 + this.legLength - this.backThick);

    this.frontLeg = [50,50];
    for(var i=0;i<1;i++){
        this.frontLeg.push(randInt(42, 52));
        this.frontLeg.push(randInt(60, 40 + this.legLength))
    }
    this.frontLeg.push(randInt(46, 60));
    this.frontLeg.push(50 + this.legLength - this.frontThick);

    // Head
    this.headSize = randInt(6, 10);
    this.headX = randInt(45, 55);
    this.headY = randInt(30, 40);

    // Neck
    this.neck = [42, 45];
    for(var i=0;i<1;i++){
        this.neck.push(randInt(45, this.headX)); this.neck.push(randInt(50, this.headY))
    }
    this.neck.push(this.headX); this.neck.push(this.headY);

    // Ears
    var makeEar = (x, y, w, h) => {
        var ear = new Path2D();
        var dx = Math.ceil(w/2);
        var i = w/2==dx?0:1;
        ear.moveTo(x-dx, y);
        ear.lineTo(x, y-h);
        ear.lineTo(x, y);
        ear.closePath()
        ear.moveTo(x-i, y-h);
        ear.lineTo(x+dx-i, y);
        ear.lineTo(x-i, y);
        return ear;
    }
    var w = randInt(6, this.headSize-3);
    var h = randInt(5, 12);
    this.rightEar = makeEar(this.headX - 3, this.headY + 2 - this.headSize, w, h);
    this.leftEar = makeEar(this.headX + 3, this.headY + 2 - this.headSize, w, h);

    // Tail
    this.tails = [];
    this.tails2 = [];
    this.tailFreq = [];

    for(var _ = 0; _ < randInt(1,2); _++){
        var tail = [22,42];
        for(var i=0;i<2;i++){
            tail.push(randInt(5,40)); tail.push(randInt(20,50))
        }
        var tail2 = [22,42];
        for(var i=0;i<2;i++){
            tail2.push(randInt(5,40)); tail2.push(randInt(20,50))
        }
        this.tails.push(tail);
        this.tails2.push(tail2);
        this.tailFreq.push(randInt(5, 30));
    }    
    
}

Cat.prototype.animate = async function(){
    // I don't think $('<canvas>') is what should be used here?
    var front = new PixelGrid($('<canvas>'), this.grid.width, this.grid.height);
    var back = new PixelGrid($('<canvas>'), this.grid.width, this.grid.height);
    var i = this.frame;

    // Legs
    back.drawSpline(this.backLeg, this.backThick, 'gray');
    back.drawSpline(this.frontLeg, this.frontThick, 'gray');
    front.ctx.translate(-8, 0);
    front.drawSpline(this.backLeg, this.backThick, 'white');
    front.drawSpline(this.frontLeg, this.frontThick, 'white');
    front.ctx.resetTransform();
    // back.drawSpline(this.backLeg, this.backThick, 'gray');
    // back.drawSpline(this.frontLeg, this.frontThick, 'gray');

    // Body
    front.drawEllipse(35, 47.5, 17, 8, 'white');
    
    // neck
    front.drawSpline(this.neck, this.headSize*2-5, 'white');

    // head
    await front.drawCircle(this.headX, this.headY, this.headSize, 'white');
    
    // Face
    //   Eyes
    if(i%150 > 4){
        await front.drawCircle(this.headX - 3, this.headY, 1, 'black');
        await front.drawCircle(this.headX + 3, this.headY, 1, 'black');
    } else {
        front.drawLine(this.headX - 5, this.headY + 0.5, this.headX - 1, this.headY + 0.5, 1, 'black');
        front.drawLine(this.headX + 1, this.headY + 0.5, this.headX + 5, this.headY + 0.5, 1, 'black');
    }
    //   Mouth
    front.drawLine(this.headX, this.headY + 3, this.headX - 2, this.headY + 5, 1, 'black');
    front.drawLine(this.headX, this.headY + 3, this.headX + 2, this.headY + 5, 1, 'black');

    // ears
    var p = roundNearest(Math.sin(i/30)*1+0.5, 1);
    front.ctx.translate(0, p);
    front.drawPath(this.leftEar, 'white');
    front.drawPath(this.rightEar, 'white');
    front.ctx.resetTransform();

    // Tail

    this.tails.forEach((tail, j) => {
        var p = roundNearest(Math.sin(i/this.tailFreq[j])*0.5+0.5, 0.2);
        if(j==0)
            front.drawSpline(arrInterp(tail, this.tails2[j], p), 2, 'white');
        else
            back.drawSpline(arrInterp(tail, this.tails2[j], p), 2, 'gray');
    })
    
    if(DEBUG_ALIAS){
        front.alias();
        back.alias();
    }

    var black = {r:0,g:0,b:0};

    if(DEBUG_OUTLINE){
        await front.outline(black);
        await back.outline(black);
    }

    await this.grid.reset();
    if(DEBUG_BACK)
        await this.grid.drawGrid(back);
    if(DEBUG_FRONT)
        await this.grid.drawGrid(front);

    this.frame++;
    if(this.alive)
        window.requestAnimationFrame(this.animate.bind(this));
}

//////////////////////////////////////////
//             CatGenerator             //
//////////////////////////////////////////

CatGenerator = function($cont, width=1, height=1){
    this.grid = new PixelGrid($cont, width, height);
    this.initialize();
}

CatGenerator.prototype.kill = function(){
    this.cat.alive = false;
}

CatGenerator.prototype.reset = function(){
    this.grid.reset();
    this.cat.alive = false;
    this.initialize();
}

CatGenerator.prototype.initialize = async function(){
    this.cat = new Cat(this.grid);
    window.requestAnimationFrame(this.cat.animate.bind(this.cat));
    return;
}