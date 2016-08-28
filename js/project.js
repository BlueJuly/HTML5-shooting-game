
var canvas;
var ctx;
var backgroundImage;
var backgroundShift = 100; //the initial position of the backgound

var fighter;
var fighterImage
var fighterSpeed = 10; 
var fighterWidth = 131; //fighter sprite unit width
var fighterHeight = 131; //fighter sprite unit height
var fighterSpriteposition = 0;
var fighterSpritedirction = 2;

var bullets = [];
var bulletSpeed = 10;
var bulletWidth = 15;
var bulletHeight = 15;
var bulletImage;
var bulletStatus = 0; // to avoid press once key z, shoot more then one bullet

var enemies = [];
var enemySpeed = -5;
var enemyWidth = 117;
var enemyHeight = 117;
var enemyImage;
var enemySpriteposition = 0;
var enemySpritedirction = 1;
var enemyTimer = null;

var enemies2 = [];
var enemy2Speed = -8;
var enemy2Width = 80;
var enemy2Height = 78;
var enemy2Image;
var enemy2Spriteposition = 0;
var enemy2Spritedirction = 1;
var enemy2Timer = null;

var shotenemies= [];
var explosionImage;
var explodeSound; 

var button;
var buttonImage;

var keysDown = {}; //store the keyborad keycode


var BGM; //background music
var shootSound; //fighter shoot sound


var score = 0; //score for the amount of shot enemies
var level = 1;
var lives = 3;

var dialogStatus = true;
var dialogPage = 0;

//fighter object
function Fighter(x, y, width, height, speed, image){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.image = image;
	this.draggable = false;
}

//bullet object
function Bullet(x, y, width, height, speed, image, direction){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.image = image;
	this.direction = direction; //direction of the bullet
}

//enemy object
function Enemy(x, y, width, height, speed, image, hitstatus){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.image = image;
	this.hitstatus = hitstatus;
}

//button object
function Button(x, y, w, h, state, image) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = state;
    this.imageShift = 0;
    this.image = image;
}

//clear the canvas
function clearScreen(){
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

//draw all the object on the canvas
function drawScreen(){
	//clear the screen before the new drawing
	clearScreen();
	
	update(level);
	
	
	//backgound setting
	backgroundShift += 4;
	if(backgroundShift >= 1319){
		backgroundShift = 0;
	}
	ctx.drawImage(backgroundImage, 0 + backgroundShift, 0, 1319, 480, 0, 0, 1000, 600);
	
	//fighter and enemy setting 
	drawCharacter();
	
	//bullet setting
	if(bullets.length > 0){
		for(var i in bullets){
			if(bullets[i] != undefined){ 
				ctx.drawImage(bullets[i].image, bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
				if(bullets[i].direction == 0){
					bullets[i].y += bullets[i].speed;
				}
				if(bullets[i].direction == 1){
					bullets[i].x += bullets[i].speed;
				}
				if(bullets[i].direction == 2){
					bullets[i].x += bullets[i].speed;
				}
				if(bullets[i].direction == 3){
					bullets[i].y -= bullets[i].speed;
				}
			}
			
			if(bullets[i].x > canvas.width || bullets[i].x < 0 || bullets[i].y >canvas.height || bullets[i].y < 0){
				delete bullets[i];
			}
		}
	}
	
	

	if (bullets.length > 0) {
        for (var i in bullets) {
            if (bullets[i] != undefined) {
                if (enemies.length > 0) {
                    for (var j in enemies) {
                        if (enemies[j] != undefined){
                            if (bullets[i].x + bullets[i].width > enemies[j].x && bullets[i].y + bullets[i].height > enemies[j].y && bullets[i].y < enemies[j].y + enemies[j].height && enemies[j].x > fighter.x) {

                                
                                shotenemies.push(enemies[j]);
                                
                                delete enemies[j];
                                delete bullets[i];
                                score++;

                       
                            }
                        }
                    }
                }
                // enemy 2
                if (enemies2.length > 0) {
                    for (var j in enemies2) {
                        if (enemies2[j] != undefined){
                            if (bullets[i].x + bullets[i].width > enemies2[j].x && bullets[i].y + bullets[i].height > enemies2[j].y && bullets[i].y < enemies2[j].y + enemies2[j].height && enemies2[j].x > fighter.x) {
                                
                                
                                shotenemies.push(enemies2[j]);
                                
                                delete enemies2[j];
                                delete bullets[i];
                                score++;
                            }
                        }
                    }
                }
                
            }
        }
    }
    
    //explosion
    if(shotenemies.length > 0){
    	for(var i in shotenemies){
    		if(shotenemies[i] != undefined){
    			if(shotenemies[i].hitstatus <= 9){
    			
    				ctx.drawImage(explosionImage, 120*shotenemies[i].hitstatus, 0, 120, 120, shotenemies[i].x, shotenemies[i].y, 120, 120);
    				shotenemies[i].hitstatus++;
    			}
    			else{
    			
    				delete shotenemies[i];
    			}
    		}
    	}
    }
    
    //dialog area
    if(dialogStatus){
        drawDialog();	
    }
    
    //button
    if(lives == 0 || level == 5){
	    // draw button
	    ctx.drawImage(button.image, 0, button.imageShift, button.w, button.h, button.x, button.y, button.w, button.h);
		// draw button's text
	    ctx.font = '18px Arial';
	    ctx.fillStyle = '#000000';
	    ctx.fillText('Restart?', 430, 410);
	    ctx.font = '25px Arial';
	    ctx.fillText('Click', 470, 445);
    }
    
    

    drawText();
    
}

function drawDialog(){
	var bg_gradient = ctx.createLinearGradient(0, 200, 0, 400);
    bg_gradient.addColorStop(0.0, 'rgba(160, 160, 160, 0.8)');
   	bg_gradient.addColorStop(1.0, 'rgba(250, 250, 250, 0.8)');
   	
   	ctx.beginPath(); // custom shape begin
    ctx.fillStyle = bg_gradient;
	ctx.moveTo(200, 100);
	ctx.lineTo(800, 100);
	ctx.lineTo(800, 500);
	ctx.lineTo(200, 500);
	ctx.lineTo(200, 100);
	ctx.closePath(); // custom shape end
	ctx.fill(); // fill custom shape
	
	
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
	ctx.stroke(); // draw border
	
	//draw button
	ctx.beginPath(); // custom shape begin
    ctx.fillStyle = 'gray';
	ctx.moveTo(450, 400);
	ctx.lineTo(550, 400);
	ctx.lineTo(550, 450);
	ctx.lineTo(450, 450);
	ctx.lineTo(450, 400);
	ctx.closePath(); // custom shape end
	ctx.fill(); // fill custom shape
	
	// draw the title text
    ctx.font = '35px Arial';
    ctx.fillStyle = '#006699';
	
	if(dialogPage == 0){
		//title
		ctx.fillText('Defender Game!', 250, 150);
		
		//dialog text
		ctx.font = '20px Arial';
		ctx.fillStyle = '#000000';
		ctx.fillText('Use the key left, right, up and down to move', 230, 200);
		ctx.fillText('Press Space key to shoot.', 230, 230);
		ctx.fillText('Good Luck!', 230, 260);
		
		//button text
		ctx.fillText('Start!', 460, 430);
	}
	
	
	
	
}

function drawCharacter(){
	//fighter setting
	fighterSpriteposition++;
	if(fighterSpriteposition >=4){
		fighterSpriteposition = 0;
	}
	ctx.drawImage(fighter.image, fighterSpriteposition*fighter.width, fighterSpritedirction*fighter.height, fighter.width, fighter.height, fighter.x-fighter.width/2, fighter.y-fighter.height/2, fighter.width, fighter.height);

	//enemy setting
	enemySpriteposition++;
	if(enemySpriteposition >=4){
		enemySpriteposition = 0;
	}
	
	if(enemies.length > 0){
		for(var i in enemies){
			if(enemies[i] != undefined){
				ctx.drawImage(enemies[i].image, enemySpriteposition*enemies[i].width, enemySpritedirction*enemies[i].height, enemies[i].width, enemies[i].height, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
				enemies[i].x += enemies[i].speed*level;
			}
			
			if(enemies[i].x < 0){
				delete enemies[i];
				lives--;
			}
			
		}
	}
	
	//enemy2 setting
	enemy2Spriteposition++;
	if(enemy2Spriteposition >=4){
		enemy2Spriteposition = 0;
	}
	
	if(enemies2.length > 0){
		for(var i in enemies2){
			if(enemies2[i] != undefined){
				ctx.drawImage(enemies2[i].image, enemy2Spriteposition*enemies2[i].width, enemy2Spritedirction*enemies2[i].height, enemies2[i].width, enemies2[i].height, enemies2[i].x, enemies2[i].y, enemies2[i].width, enemies2[i].height);
				enemies2[i].x += enemies2[i].speed*level;
			}
			
			if(enemies2[i].x < 0){
				delete enemies2[i];
				lives--;
			}
			
		}
	}
}

function drawText(){
	// text on the screen
    ctx.font = '20px Verdana';
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + score * 10, 900, 580);
    ctx.fillText('Level: '+level, 20, 20);
    ctx.fillText('lives: '+lives, 920, 20);
    
    if(lives == 0){
    	removeEnemy();
    	ctx.font = '25px Verdana';
    	ctx.fillStyle = '#000';
    	ctx.fillText('Game Over', 425, 300);
    }
    
    if(level == 5){
    	removeEnemy();
    	ctx.font = '25px Verdana';
    	ctx.fillStyle = '#000';
    	ctx.fillText('You Win!',445, 300);
    }
}


//update the fighter position
function update(modifier){
	// Player holding up
	if(38 in keysDown){ 
		fighter.y -= fighter.speed * modifier;
		fighterSpritedirction = 3;
	}
	// Player holding down
	if(40 in keysDown){ 
		fighter.y += fighter.speed * modifier;
		fighterSpritedirction = 0;
	}
	// Player holding left
	if(37 in keysDown){ 
		fighter.x -= fighter.speed * modifier;
		fighterSpritedirction = 1;
	}
	// Player holding right
	if(39 in keysDown){ 
		fighter.x += fighter.speed * modifier;
		fighterSpritedirction = 2;
	}
	// Player holding z
	if(32 in keysDown){
		if(!bulletStatus){
			var bulletDirection = fighterSpritedirction;
			//if z is pressed, create a bullet with its direction
			bullets.push(new Bullet(fighter.x, fighter.y, bulletWidth, bulletHeight, bulletSpeed, bulletImage, bulletDirection));
			// play the bullet shoot sound once time
            shootSound.currentTime = 0;
            shootSound.play();
            // set the bullet status to have already been shot	
			bulletStatus = 1;
		}
	}
	
	boundaryJudgement();
	
	levelUp();
}

function levelUp(){
	var levelstatus = 0;
	switch(score){
		case 3:
		level = 2;
		break;
		case 9:
		level = 3;
		break;
		case 15:
		level = 4;
		break;
		case 17:
		level = 5;
		break;
	}
}

//judge whether the fighter over the screen
function boundaryJudgement(){
	if(fighter.y <= (0 + fighter.height/2)){
		fighter.y = (0 + fighter.height/2);
	}
	if(fighter.y >= (600 - fighter.height/2)){
		fighter.y = (600 - fighter.height/2);
	}
	if(fighter.x <= (0 + fighter.width/2)){
		fighter.x = (0 + fighter.width/2);
	}
	if(fighter.x >= (1000 - fighter.width/2)){
		fighter.x = (1000 - fighter.width/2);
	}		
	
}


$(document).ready(function(){
	init();
})

function init(){
	//set canvas and context
	canvas = document.getElementById('screen');
	ctx = canvas.getContext('2d');
	
	addEventlistener();
	
	var width = canvas.width;
	var height = canvas.height;
	
	//set sound effect
	soundInit();
	
	//set object image
	imageInit();
	
	checkLocalstorage();
	setInterval(drawScreen, 50);
	
	//startGame()
}

function startGame(){

	addEnemy();
	addEnemy2();
}


//add event listener
function addEventlistener(){

	
	
	$(document).keydown(function(e){
		
		
		keysDown[e.keyCode] = true;  	 
        
        switch(e.keyCode)    
        {    
            // user presses the "left"    
            case 37:    
            console.log('left'); 
            break;      
            // user presses the "up" key    
            case 38:
			console.log('up'); 
            break;       
            // user presses the "right" key    
            case 39:
            console.log('right'); 
            break;           
            // user presses the "down" key    
            case 40:
            console.log('down'); 
            break;
            // user presses the "space" key
            case 32:
            console.log('space');
            break;
		}
	});
	
	$(document).keyup(function(e){
		bulletStatus = 0;
		delete keysDown[e.keyCode];
	});

	
	$('#screen').mousedown(function(e){
		// button behavior
		console.log(e);
		var mouseX = e.offsetX || 0;
        var mouseY = e.offsetY || 0;
        console.log('mouse position:' + mouseX +'&'+ mouseY);
        
        if((!dialogStatus && level == 5) || (!dialogStatus && lives == 0)){
        	if (mouseX > button.x && mouseX < button.x+button.w && mouseY > button.y && mouseY < button.y+button.h) {
	            restartGame();
        	}
        }
        
        if(dialogStatus){
        	if (mouseX > 450 && mouseX < 550 && mouseY > 400 && mouseY < 450) {
				if(dialogPage == 0){
					dialogStatus=false;
					startGame();
				}
        	}
        }
        
	});

}

function restartGame(){
	level = 1;
	lives = 3;
	bullets = [];
	addEnemy();
	addEnemy2();
	score = 0;
	fighter.x = 200;
	fighter.y = 300;
	fighterSpritedirction = 2;
}

function imageInit(){
	console.log('image initiation');
	//set backgound image 
	backgroundImage = new Image();
	backgroundImage.src = 'images/bg_3.jpg';
	backgroundImage.onload = function(){}
	backgroundImage.onerror = function(){
		console.log('error happended when backgound image was loading.');
	}
	
	//set fighter image and create a fighter when the image is loaded 
	fighterImage = new Image();
	fighterImage.src = 'images/fighter.png';
	fighterImage.onload = function(){
		fighter = new Fighter(200, 300, fighterWidth, fighterHeight, fighterSpeed, fighterImage);
	}
	
	//set bullet image
	bulletImage = new Image();
	bulletImage.src = 'images/bullet.png';
	bulletImage.onload = function(){};
	
	//set enemy image
	enemyImage = new Image();
	enemyImage.src = 'images/enemy_1.png';
	enemyImage.onload = function(){};
	
	//set enemy2 image
	enemy2Image = new Image();
	enemy2Image.src = 'images/enemy_2.png';
	enemy2Image.onload = function(){};
	
	//set explosion image
	explosionImage = new Image();
	explosionImage.src = 'images/explosion.png';
	enemyImage.onload = function(){};
	
	// set button image
    buttonImage = new Image();
    buttonImage.src = 'images/button.png';
    buttonImage.onload = function() {
    	//set button
		button = new Button(410, 380, 180, 120, 'normal', buttonImage);
    }
}

function soundInit(){
	
	//background music
	BGM = new Audio('sounds/m2music.wav');
	BGM.volum = 0.2;
	//loop the BGM
	BGM.addEventListener('ended', function(){
		this.cuttrentTime = 0;
		this.play();
	},false);
	BGM.play();
	
	//bullet shoot sound
	shootSound = new Audio('sounds/shoot.ogg');
    shootSound.volume = 0.9;
	
	
}

function getRandom(x, y) {
    return Math.floor(Math.random()*y)+x;
}

function addEnemy(){
	clearInterval(enemyTimer);
	
	var randY = getRandom(0, canvas.height - enemyHeight);
	enemies.push(new Enemy(canvas.width, randY, enemyWidth, enemyHeight, enemySpeed, enemyImage, 0));
	
	var interval = getRandom(2000, 5000);
	enemyTimer = setInterval(addEnemy, interval);
}

function addEnemy2(){
	clearInterval(enemy2Timer);
	
	var randY = getRandom(0, canvas.height - enemyHeight);
	enemies2.push(new Enemy(canvas.width, randY, enemy2Width, enemy2Height, enemy2Speed, enemy2Image, 0));
	
	var interval = getRandom(4000, 5000);
	enemy2Timer = setInterval(addEnemy2, interval);
}

function removeEnemy(){
	clearInterval(enemyTimer);
	clearInterval(enemy2Timer);
	
	enemies = [];
	enemies2 = [];

}


function checkLocalstorage(){
	if(window.localStorage){
		console.log('This browser supports local storage.');
		if(localStorage.times){
			console.log('The game has been played '+localStorage.times+' times.');
			dialogStatus = false;
			localStorage.times++;
			startGame();
		}
		else{
			localStorage.times = 1
			console.log('First time to play the game');
		}
	}
	else{
		console.log('This browser not supports local storage.');
	}

}

