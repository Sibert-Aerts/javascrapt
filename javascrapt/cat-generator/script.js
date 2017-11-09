///////////////////////////////////////////
//                 Ready                 //
///////////////////////////////////////////

DEBUG_ALIAS = true;
DEBUG_OUTLINE = true;
DEBUG_SPLINES = false;
DEBUG_ANIM_MODE = "default";
DEBUG_FRONT = true;
DEBUG_BACK = true;

$(document).ready(function(){
    catGen = new CatManager($('#cat-container'), 100, 80);
    $('#reset-button').click(catGen.reset.bind(catGen));
    $('#kill-button').click(_=>catGen.cat.alive=false);
    // debug buttons
    $('#alias-button').click(_=>DEBUG_ALIAS=!DEBUG_ALIAS);
    $('#outline-button').click(_=>DEBUG_OUTLINE=!DEBUG_OUTLINE);
    $('#front-button').click(_=>DEBUG_FRONT=!DEBUG_FRONT);
    $('#back-button').click(_=>DEBUG_BACK=!DEBUG_BACK);
    $('#spline-button').click(_=>DEBUG_SPLINES=!DEBUG_SPLINES);
    $('button#anim-default').click(_=>DEBUG_ANIM_MODE='default');
    $('button#anim-spin').click(_=>DEBUG_ANIM_MODE='spin');
    $('button#anim-keke').click(_=>DEBUG_ANIM_MODE='keke');
});


//////////////////////////////////////////
//             CatManager             //
//////////////////////////////////////////

CatManager = function($cont, width=1, height=1){
    this.grid = new PixelGrid($cont, width, height);
    this.cats = [];
    this.newCat();
}

CatManager.prototype.kill = function(){
    this.cat.alive = false;
}

CatManager.prototype.reset = function(){
    this.grid.reset();
    this.cat.alive = false;
    this.initialize();
}

CatManager.prototype.newCat = async function(){
    var newCat = new Cat(this.grid);
    window.requestAnimationFrame(this.cat.animate.bind(this.cat));
    return;
}