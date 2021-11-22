/*
Extension 1: Creating platforms
I created some platforms using factory pattern. You can add more platforms if you want to by using the push to the platforms array. While creating the platforms and implementing its functionality, I faced some difficulties. When the game-character jumps over it, the character animation was showing jumping front facing. I fixed that by updating tweaking isFalling and isPlummeting Boolean values. Next when the character was returning on the ground from the platform, it was registering ‘jump’ command before reaching the ground since I used my own codes of character jumping and falling previously. So, I had to update all the values accordingly. 
I learned how falling, jumping works and evolves in situation like if we add platforms and other object that directly interacts with the character. I also learned the necessity of updating Boolean values that controls fall/rise. 

Extension 2: Creating enemies
I created some enemies also using constructor function. You can add as more enemies as you want using the ‘new Enemy’ function and add it to the enemy array by using push. I faced some minor problems while creating the enemies and implementing their functionalities. I used an image file (.png format) to draw enemies. I messed up the coordinates initially and my character was dying unusually due to the error in dist function. I modified the coordinated which were being used by the dist function inside the checkContact function of the constructor ‘Enemy’. This solved my problem and the whole thing is now working as intended. 
I learned how coordinates and dist function should be managed to work along with this kind of situation. Also, I learned how to change other variables like ‘lives’, ‘deadSound’ etc when the enemy is in contact. It was relatively simpler than creating platforms in my opinion. But I’m happy to know how it works now. 

Extension 3: Adding Sound
I added p5.sound to add sound effects to my game. I faced a weird problem while adding the background music. I knew how the loop works. But the problem was, the background music wasn’t starting until the user is providing any gesture. This is because of the autoplay policy. So, I had to create a boolean variable ‘isStart’ to take input for starting the game and then the background music starts playing. 
I learned how game sound works in different situation and how sounds should be turned on and off (play/stop) in different game situation. I also learned about the autoplay policy and why user input and agreement should be the main priority to run anything. Thanks for all these lessons 😊
*/


var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var clouds;
var mountains;
var collectables;
var canyons;

var game_score;
var flagpole;
var lives;
var lifeline;

var jumpSound;
var backgroundmusicSound;
var collectablesSound;
var deadSound;
var levelupSound;
var failedSound;

var platforms;

var enemies;
var enemySprite;

var isStart = false;
var backgroundmusicPlayingVariable=0; //only works when it is 1

function preload()
{
    soundFormats('mp3','wav');
    
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.5);
    backgroundmusicSound = loadSound('assets/bm.wav');
    backgroundmusicSound.setVolume(0.3);
    collectablesSound = loadSound('assets/collectables.wav');
    collectablesSound.setVolume(0.5);
    deadSound = loadSound('assets/dead.wav');
    deadSound.setVolume(0.5);
    levelupSound = loadSound('assets/levelup.wav');
    levelupSound.setVolume(0.5);
    failedSound = loadSound('assets/failed.wav')
    failedSound.setVolume(0.5);
    
    lifeline = loadImage('assets/heart.png');
    enemySprite = loadImage('assets/enemy.png');
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;

    lives = 3;
    startGame();
    
}

function startGame()
{  
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    //Tree:
    trees_x=[70,340,500,700,850,1200,1600,1700];
    clouds=[
        {
        x_pos: 200,
        y_pos: 50, 
        size_multiplier: 1.0 // you can change the overall size of the clouds
        },
        {
        x_pos: 500,
        y_pos: 90, 
        size_multiplier: 1.0 // you can change the overall size of the clouds
        },
        {
        x_pos: 850,
        y_pos: 80, 
        size_multiplier: 1.0 // you can change the overall size of the clouds
        },
        {
        x_pos: 1250,
        y_pos: 80, 
        size_multiplier: 1.5 // you can change the overall size of the clouds
        }];
    mountains = [
        {
        x_pos: 50, 
        y_pos: 432, 
        height_change: 0 // you can change the overall height of the mountain
        },
        {
        x_pos: 450, 
        y_pos: 432, 
        height_change: 30  // you can change the overall height of the mountain
        },
        {
        x_pos: 1400, 
        y_pos: 432, 
        height_change: -30  // you can change the overall height of the mountain
        },
        {
        x_pos: 1700, 
        y_pos: 432, 
        height_change: -30  // you can change the overall height of the mountain
        }];
    collectables = [
        {
        x_pos: 100, 
        y_pos: floorPos_y-60,  // floorPos_y-10 worked very well
        size: 20,
        isFound: false// you can change size of the collectable
        },
        {
        x_pos: 1400, 
        y_pos: floorPos_y-100,
        size: 50,
        isFound: false                    // you can change size of the collectable
        },
        {
        x_pos: 800, 
        y_pos: floorPos_y-200,
        size: 35,
        isFound: false                    // you can change size of the collectable
        },
        {
        x_pos: 1200, 
        y_pos: floorPos_y-70,
        size: 35,
        isFound: false                    // you can change size of the collectable
        },
        {
        x_pos: 1000, 
        y_pos: floorPos_y-100,
        size: 35,
        isFound: false                    // you can change size of the collectable
        },
        {
        x_pos: 1640, 
        y_pos: floorPos_y-130,
        size: 35,
        isFound: false                    // you can change size of the collectable
        },
        {
        x_pos: 1800, 
        y_pos: floorPos_y-190,
        size: 30,
        isFound: false                    // you can change size of the collectable
        },
        {
        x_pos: 1900, 
        y_pos: floorPos_y-17.5,
        size: 35,
        isFound: false                    // you can change size of the collectable
        }];
    canyons = [
        {
        x_pos: 30,
        width: 100      // you can change weidth of the canyon
        },
        {
        x_pos: 400,
        width: 70       // you can change weidth of the canyon
        },
        {
        x_pos: 700,
        width: 124      // you can change weidth of the canyon
        },
        {
        x_pos: 1100,
        width: 124      // you can change weidth of the canyon
        }];
    game_score = 0;
    
    flagpole =
        {
        isReached: false, 
        x_pos: 2000
        };
    
    platforms = [];
    platforms.push(createPlatforms(350,floorPos_y - 70,70));
    platforms.push(createPlatforms(450,floorPos_y - 120,70));
    platforms.push(createPlatforms(520,floorPos_y - 160,70));
    platforms.push(createPlatforms(600,floorPos_y - 100,100));
    platforms.push(createPlatforms(800,floorPos_y - 150,100));
    platforms.push(createPlatforms(1070,floorPos_y - 50,70));
    platforms.push(createPlatforms(1400,floorPos_y - 50,70));
    platforms.push(createPlatforms(1580,floorPos_y - 90,100));
    platforms.push(createPlatforms(1760,floorPos_y - 150,100));
    
    enemies = [];
    enemies.push(new Enemy(100,floorPos_y-15,100));
    enemies.push(new Enemy(600-25,floorPos_y-115,100));
    enemies.push(new Enemy(900,floorPos_y-15,100));
    enemies.push(new Enemy(1500,floorPos_y-15,130));
}

function draw()
{
	background(35); // Sky (Night)

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos,0);

	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTrees();
    
    //Draw Platforms
    for (var i=0; i< platforms.length;i++)
    {
        platforms[i].draw();
    }

	// Draw canyons.
    for (var i = 0; i < canyons.length; i ++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }

	// Draw collectable items.
    for (var i=0; i< collectables.length; i++)
        {
           if(collectables[i].isFound == false)
            {
               drawCollectable(collectables[i]);
                checkCollectable(collectables[i]);
            }
        }

    
    // Draw Falgpoles
    renderFlagpole();
    
    // Draw Enemies
    for (var i=0; i<enemies.length; i++)
        {
            enemies[i].draw();
            var isContact = enemies[i].checkContact(gameChar_world_x,gameChar_y);
            if (isContact)
                {
                    if (lives > 1)
                        {
                            lives --;
                            startGame();
                            deadSound.play();
                        }
                    else if (lives > 0)
                        {
                            lives --;
                            startGame();
                            deadSound.play();
                            failedSound.play();
                            isStart = false;
                        }
                }
        }
    
    pop();	
    
    // Draw game character.
	drawGameChar();
    
    fill (255);
    stroke(0);
    textSize(20);
    text("score: "+ game_score + " / " + collectables.length, 20,20);
    for (var i=0; i<lives; i++)
        {
            image(lifeline,20+i*30,30,30,30);
        }
    if (lives < 1)
        {
            strokeWeight(3);
            stroke(0);
            fill(255,0,0);
            textSize(30);
            text("Game Over. Press Enter to retry",width/4,height/2);
            backgroundmusicSound.stop();
            return;
    
        }
    if (flagpole.isReached == true)
        {
            strokeWeight(3);
            stroke(0);
            fill(123,231,111);
            textSize(30);
            text("Level complete. Your Score: " +game_score,width/4+100,height/2);
            text("Press Enter to play again",width/4+150,height/2+50);
            backgroundmusicSound.stop();
            return;
        }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 3;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 3;
		}
		else
		{
			scrollPos -= 3; // negative for moving against the background
		}
	}
    
    // Jump, Rise and fall code
    if (isPlummeting == true && gameChar_y == floorPos_y )
        {
            gameChar_y = gameChar_y - 100;
            isFalling = true;
            isPlummeting = false;
        }

	
    if (gameChar_y < floorPos_y)
        {
            var isContact = false;
            for (var i=0; i<platforms.length;i++)
                {
                    if(platforms[i].checkContact(gameChar_world_x,gameChar_y))
                    {
                        isContact = true;
                        if(abs(platforms[i].y - gameChar_y) <= 5)
                            {
                                isFalling = false;
                                gameChar_y=platforms[i].y;
                            }
                        if (isPlummeting)
                            {
                                gameChar_y = gameChar_y - 100;
                                isFalling = true;
                                isPlummeting = false;
                            }
                        break;  
                    }
                }
            if(isContact == false)
                { 
                    gameChar_y += 1;
                    isFalling  = true;
                }
        }
    if (gameChar_y == floorPos_y)
        {
            isFalling = false;
            isPlummeting = false;
        }

    if (flagpole.isReached == false)
        {
            checkFlagpole();
        }
    checkPlayerDie();
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    if (isStart == false)
    {   
        strokeWeight(3);
        stroke(0);
        fill(255);
        textSize(30);
        text("press space to start",400,288);
        textSize(15);
        text("press upArrow to jump, leftArrow to move left, rightArrow to move right",290,328);
        text("press Enter to restart the game from beginning",380,348);
    }
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    if (keyCode == 32)
        {
            isStart = true;
            backgroundmusicPlayingVariable += 1;
            if (backgroundmusicPlayingVariable == 1)
            {
                backgroundmusicSound.loop();
            }
        }
    if (isStart)
    {
       if (keyCode == 37)
        {
            isLeft = true;
        }
    if (keyCode == 39)
        {
            isRight = true;
        }
    if (keyCode == 38)
        {
            if (isFalling == false)
            {
                isPlummeting = true;
                jumpSound.play();
            }
            
        } 
    }
    if (keyCode == 13)
        {
            backgroundmusicSound.stop();
            lives = 3;
            isStart = true;
            backgroundmusicPlayingVariable = 1;
            if (backgroundmusicPlayingVariable == 1)
            {
                backgroundmusicSound.loop();
            }
            startGame();
        }
}

function keyReleased()
{

    if (keyCode == 37)
        {
            isLeft = false;
        }
    else if (keyCode == 39)
        {
            isRight = false;
        }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(18,106,118);
        ellipse(gameChar_x,gameChar_y-60,15,20); //head
        fill(25,90,90);
        rect(gameChar_x-10,gameChar_y-50,20,25); //body
        fill(162,230,225);
        rect(gameChar_x-17,gameChar_y-25,7,24); //lf
        rect(gameChar_x+9-2-2,gameChar_y-25,7,24); //rf
        rect(gameChar_x-15-2,gameChar_y-35,7,5); //lh
        rect(gameChar_x+9-4,gameChar_y-35,7,5); //rh

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(18,106,118);
        ellipse(gameChar_x,gameChar_y-60,15,20); //head
        fill(25,90,90);
        rect(gameChar_x-10,gameChar_y-50,20,25); //body
        fill(162,230,225);
        rect(gameChar_x-17+6,gameChar_y-25,7,24); //lf
        rect(gameChar_x+9-2-2+5,gameChar_y-25,7,24); //rf
        rect(gameChar_x-15-2+6,gameChar_y-35,7,5); //lh
        rect(gameChar_x+9-4+5,gameChar_y-35,7,5); //rh

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(18,106,118);
        ellipse(gameChar_x,gameChar_y-60,15,25); //head
        fill(25,90,90);
        rect(gameChar_x-10,gameChar_y-48,20,40); //body
        fill(162,230,225);
        rect(gameChar_x-17,gameChar_y-8,7,5); //lf
        rect(gameChar_x+9-2-2,gameChar_y-8,7,5); //rf
        rect(gameChar_x-15-2,gameChar_y-35,7,5); //lh
        rect(gameChar_x+9-4,gameChar_y-35,7,5); //rh

	}
	else if(isRight)
	{
		// add your walking right code
        fill(18,106,118);
        ellipse(gameChar_x,gameChar_y-60,15,25); //head
        fill(25,90,90);
        rect(gameChar_x-10,gameChar_y-48,20,40); //body
        fill(162,230,225);
        rect(gameChar_x-17+6,gameChar_y-8,7,5); //lf
        rect(gameChar_x+9-2-2+5,gameChar_y-8,7,5); //rf
        rect(gameChar_x-15-2+6,gameChar_y-35,7,5); //lh
        rect(gameChar_x+9-4+5,gameChar_y-35,7,5); //rh

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill(18,106,118);
        ellipse(gameChar_x,gameChar_y-60,20,20); //head
        fill(25,90,90);
        rect(gameChar_x-10,gameChar_y-50,20,25); //body
        fill(162,230,225);
        rect(gameChar_x-15,gameChar_y-25,5,25); //lf
        rect(gameChar_x+10,gameChar_y-25,5,25); //rf
        rect(gameChar_x-15,gameChar_y-35,5,5); //lh
        rect(gameChar_x+10,gameChar_y-35,5,5); //rh

	}
	else
	{
		// add your standing front facing code
        fill(18,106,118);
        ellipse(gameChar_x,gameChar_y-60,25,25); //head
        fill(25,90,90);
        rect(gameChar_x-12,gameChar_y-48,24,40); //body
        fill(162,230,225);
        rect(gameChar_x-17,gameChar_y-8,5,5); //lf
        rect(gameChar_x+11,gameChar_y-8,5,5); //rf
        rect(gameChar_x-17,gameChar_y-35,5,5); //lh
        rect(gameChar_x+11,gameChar_y-35,5,5); //rh

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for (var i=0; i<clouds.length; i++)
        {
            fill(250);
            ellipse(clouds[i].x_pos,
                    clouds[i].y_pos,
                    50*clouds[i].size_multiplier,
                    50*clouds[i].size_multiplier);
            ellipse(clouds[i].x_pos-30*clouds[i].size_multiplier,
                    clouds[i].y_pos,30*clouds[i].size_multiplier,
                    30*clouds[i].size_multiplier);
            ellipse(clouds[i].x_pos+30*clouds[i].size_multiplier,
                    clouds[i].y_pos,30*clouds[i].size_multiplier,
                    30*clouds[i].size_multiplier);
        }
}

// Function to draw mountains objects.
function drawMountains()
{
    for (var i=0; i<mountains.length;i++)
        {
            fill(255);
            triangle(mountains[i].x_pos+25,
                     mountains[i].y_pos,
                     mountains[i].x_pos+200,
                     mountains[i].y_pos-276-(mountains[i].height_change),
                     mountains[i].x_pos+300,
                     mountains[i].y_pos);
            fill(150,150,150);
            triangle(mountains[i].x_pos,
                     mountains[i].y_pos,
                     mountains[i].x_pos+100,
                     mountains[i].y_pos-176-(mountains[i].height_change),
                     mountains[i].x_pos+200,
                     mountains[i].y_pos);
            triangle(mountains[i].x_pos+40,
                     mountains[i].y_pos,
                     mountains[i].x_pos+206,
                     mountains[i].y_pos-261-(mountains[i].height_change),
                     mountains[i].x_pos+300,
                     mountains[i].y_pos);
        }
}

// Function to draw trees objects.
function drawTrees()
{
    for (var i=0; i<trees_x.length; i++)
    {
        //trunk
        fill(120,100,40);
        rect(trees_x[i]+50,(height/2)+64,40,80);
        //branches
        fill(0,155,0);
        triangle(trees_x[i],
                 (height/2)+64,
                 trees_x[i]+70,
                 (height/2)+14,
                 trees_x[i]+140,
                 (height/2)+64);
        triangle(trees_x[i],
                 (height/2)+44,
                 trees_x[i]+70,
                 (height/2)-6,
                 trees_x[i]+140,
                 (height/2)+44);
        triangle(trees_x[i],
                 (height/2)+24,
                 trees_x[i]+70,
                 (height/2)-26,
                 trees_x[i]+140,
                 (height/2)+24);
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    for (var i=0; i<canyons.length; i++)
        {
            noStroke();
            fill (33,207,194);
            beginShape();
            vertex(t_canyon.x_pos,432);
            vertex(t_canyon.x_pos+t_canyon.width,432);
            vertex(t_canyon.x_pos+t_canyon.width,576);
            vertex(t_canyon.x_pos,576);
            endShape();

        }
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
        if (gameChar_world_x<t_canyon.x_pos+t_canyon.width && gameChar_world_x > t_canyon.x_pos && gameChar_y == floorPos_y)
        {
            isFalling=true;
        }
        if (isFalling && gameChar_y >= floorPos_y)
        {
            gameChar_y += 3;
        }
}

function renderFlagpole()
{
    push();
    
    strokeWeight(5);
    stroke (154,234,72);
    line (flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y-250);
    fill(234,71,130);
    noStroke();
    if (flagpole.isReached)
    {
        triangle(flagpole.x_pos,
                 floorPos_y-250,
                 flagpole.x_pos,
                 floorPos_y-190,
                 flagpole.x_pos+80,
                 floorPos_y-190);
    }
    else
    {
        triangle(flagpole.x_pos,
                 floorPos_y-60,
                 flagpole.x_pos,
                 floorPos_y,
                 flagpole.x_pos+80,
                 floorPos_y);
    }
    
    pop(); // using push and pop so that strokeWeight cancel at the end of this drawing
    
}

function checkFlagpole ()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if (d<15)
        {
            flagpole.isReached = true;
        }
    if (flagpole.isReached)
        {
            levelupSound.play();
            isFalling = false;
            isPlummeting=false;
            gameChar_y = floorPos_y;
            isStart = false;
        }
}

function checkPlayerDie()
{
    var isDead= false;
    if (gameChar_y > 650)
        {
            isDead = true;
            lives -= 1;
        }
    if (isDead && lives >0)
        {
            startGame();
        }
    if (isDead)
        {
            deadSound.play();
        }
    if (isDead && lives<1)
        {
            failedSound.play();
            isStart = false;
        }
}



// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    for (var i=0; i<collectables.length;i++)
        {
            fill(231,198,53);
            ellipse(t_collectable.x_pos,
                    t_collectable.y_pos,
                    t_collectable.size,
                    t_collectable.size);
            fill(230,230,126);
            ellipse(t_collectable.x_pos,
                    t_collectable.y_pos,
                    t_collectable.size/2,
                    t_collectable.size/2);
        }
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if (dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos)<50)
        {
            t_collectable.isFound=true;
            game_score += 1;
        }
    if (t_collectable.isFound)
        {
            collectablesSound.play();
        }

}

//Creating Platforms

function createPlatforms(x,y,length)
{
    var platform= 
        {
            x: x,
            y: y,
            length: length,
            draw: function()
            {
                fill(75);
                stroke(100,50,40);
                rect(this.x,this.y,this.length,20);
            },
            checkContact: function(gX,gY)
            {
                if(gX>this.x && gX < this.x+this.length)
                {
                    var distance = this.y - gY;
                    if (distance>=0 && distance<5)
                        {
                            return true;
                        }
                }
                return false;
            }
        }
    return platform;
}

// Creating Enemies
function Enemy (x,y,r)
{
    this.x = x;
    this.y = y;
    this.r = r;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function ()
    {
        if (isStart)
            {
                this.currentX += this.inc;
                if (this.currentX >= this.x + this.r)
                    {
                        this.inc = -1;
                    }
                else if (this.currentX < this.x)
                    {
                        this.inc = 1;
                    }
            }
    }
    this.draw = function ()
    {
        this.update();
        image(enemySprite,this.currentX,this.y,30,30);
    }
    this.checkContact = function(gX,gY)
    {
        var d= dist(gX,gY-27.5,this.currentX,this.y+15);
        if (d<42.5)
            {
                return true;
            }
        return false;
    }
}