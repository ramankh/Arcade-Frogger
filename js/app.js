'use strict';
/**
 * @class creates an enemy object
 * @param {number} index
 * @param {number} x x-location of enemy
 * @param {number} y y-location of enemy
 * @param {number} speed How fast enemy should move
 */
var Enemy = function(x, y, speed) {
    /**
     * Enemy has 3 sets of cordinations:
     * (startX,startY) are the starting point of the enemy
     * (x,y) are current location of enemy
     * (rx,ry) are the coordinations of right-bottom corner of enemy rectangle which
     * are calcualted by adding the current location to width and height of the image
     * respectively. Note that we do not include white spaces around image.
     */
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.rx = this.x + 94;
    this.ry = this.y + 67;
    this.speed = speed;
    this.name = name;
    this.sprite = 'images/enemy-bug.png';
};
/**
 * @memberOf Enemy
 * @function update enemys location
 * @param  {number} dt It's a time delta between ticks for smooth movement of enemies
 * You should multiply any movement by the dt parameter which will
 * ensure the game runs at the same speed for all computers.
 */
Enemy.prototype.update = function(dt) {
    /**
     * if statment checks if the enemy cross the canvas or not and updates
     * its location.
     */
    if (this.x + diff[0] > ctx.canvas.width) {
        this.x = this.startX;
        this.rx = this.x + 94;
        this.y = this.startY;
    } else {
        this.x += this.speed * dt;
        this.rx = this.x + 94;
    }
};

/**
 * @memberOf Enemy
 * @function draws enemy on screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @class This class creates player object
 * @param {number} x x-location of player
 * @param {nmber} y y-location of player
 */
var Player = function(x, y) {
    /**
     * Player has 2 sets of cordinations:
     * (x,y) are current location of player
     * (rx,ry) are the coordinations of right-bottom corner of player rectangle which
     * are calcualted by adding the current location to width and height of the image
     * respectively. Note that we do not include white spaces around image.
     * lives represents how many times player can loose!
     * sprite store the player character image and by default is char-boy
     * wonPlaces keeps the water blocks already occupied by player
     */
    this.x = x;
    this.y = y;
    this.rx = this.x + 68;
    this.ry = this.y + 77;
    this.lives = 5;
    this.sprite = 'images/char-boy.png';
    this.wonPlaces = [];
};

/**
 * @memberOf Player
 * @function Draws Player on screen ans also draw player
 * character on all won places
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.wonPlaces.forEach(function(won) {
        ctx.drawImage(Resources.get(player.sprite), won.x, won.y);
    });
};

/**
 * @memberOf Player
 * @function update players location
 * @param  {number} time delta
 */
Player.prototype.update = function(dt) {
    /**
     * checks if the player cross the borders or not
     */
    if (this.x >= ctx.canvas.width - 65) {
        this.x -= 95;
    } else if (this.x <= 0) {
        this.x += 95;
    } else if (this.y <= 0) {
        this.y = -10;
        /**
         * checks if player wants to move to already won water block or not
         * if yes then fire resetLocation to start over
         * if not then push the new water block as a new won place
         */
        if (!this.wonPlaceExist(this.wonPlaces, this.x, this.y)) {
            this.wonPlaces.push({
                x: this.x,
                y: this.y
            });
        }
        this.resetLocation();
    }
    if (this.y >= ctx.canvas.height - 171) {
        this.y -= 95;
    }
    this.rx = this.x + 68;
    this.ry = this.y + 77;

    /**
     * checks if the player has already occupied all water blocks if
     * wonPlaces length is 5 then he wins and message box should apppear in 3 steps:
     * 1- Since game is over Hearts should disapear
     * 2- overlay div should appear for dark background
     * 3- winbox div should pops up width white bg and winning message
     * we also need to reset wonplaces and lives to start a new game
     */
    if (this.wonPlaces.length === 5) {
        $(".heartContainer").css("display", "none");
        $(".overlay").css("display", "block");
        $("#winBox").css("display", "block");
        this.wonPlaces = [];
        this.lives = 5;
    }
};

/**
 * @memberOf Player
 * @function handels keyboard inputs regarding to player location and
 * call the update method when it's done
 * @param  {string} inp keyboard arrows representitive
 */
Player.prototype.handleInput = function(inp) {
    /**
     * move represents number of pixels that player moves every
     * time user push arrow keys
     */
    var mov = 95;
    switch (inp) {
        case 'left':
            this.x -= mov;
            break;
        case 'right':
            this.x += mov;
            break;
        case 'up':
            this.y -= mov;
            break;
        case 'down':
            this.y += mov;
            break;
        default:
            break;
    }
    this.update();
};

/**
 * @memberOf Player
 * @function update number of hearts should appear in top left coner of screen
 * and also check if the user has lost the game by checking lives number equal to 0.
 * @param  {numbers} lives is the number of hearts should appear
 */
Player.prototype.updateLives = function(lives) {
    switch (lives) {
        case 4:
            $("#heart-five").css("display", "none");
            break;
        case 3:
            $("#heart-four").css("display", "none");
            break;
        case 2:
            $("#heart-three").css("display", "none");
            break;
        case 1:
            $("#heart-two").css("display", "none");
            break;
        case 0:
            player.lives = 5;
            $(".heartContainer").css("display", "none");
            $(".overlay").css("display", "block");
            $("#lostBox").css("display", "block");
            break;
        default:
            break;
    }
};

/**
 *@memberOf Player
 *@function reset players location to start point
 */
Player.prototype.resetLocation = function() {
    /**
     * to get the middle of the context we need to divide the ctx length
     * over 2 and subtract 1/2 player image width from it
     */
    this.x = ctx.canvas.width / 2 - 53.5;
    this.y = 430;
    this.render();
};

/**
 * @memberOf Player
 * @function checks if player has already occupied (x,y) location of water block
 * @param  {Array} places contains all water blocks occupies by player
 * @param  {number} x players x cordination
 * @param  {number} y players y cordination
 * @return {bool} true if player already occupied this location and false otherwise
 */
Player.prototype.wonPlaceExist = function(places, x, y) {
    for (var i = 0; i < places.length; i++) {
        if (places[i].x == x && places[i].y == y) {
            return true;
        }
    }
    return false;
};

/**
 * diff represents the white spaces length around each character (to find exact collision):
 *  diff[0] -> enemies x-whiteSpace/2
 *  diff[1] -> enemies y-whiteSpaces/2
 *  diff[2] -> players x-whiteSpaces/2
 *  diff[3] -> players y-whiteSpaces/2
 * @type {Array}
 */
var diff = [0, 53, 18, 45];

/**
 * @function check if collision occurs between player and enemy
 */
function collisionDetect() {
    allEnemies.forEach(function(enemy) {
        /**
         * this condition checks either one rectangles is on the left side of
         * the other one or is below that using two up-left coordinate and the bottom-right
         * coordinate. If these two main conditions doesnt meet means that two rects
         * are overlapped
         * if collision occures then subtracy one frome player lives and call resetLocation
         * to start from starting point
         */
        if (!(enemy.ry < player.y + diff[3] || player.ry < enemy.y + diff[1] ||
                enemy.rx < player.x + diff[2] || player.rx < enemy.x + diff[0])) {
            player.lives--;
            player.updateLives(player.lives);
            player.resetLocation();
        }
    });
}

/**
 * @class represents every palyer character
 * @param  {number} x x-location of the character
 * @param  {number} y y-location of the character
 * @param  {charPath} path of the character image
 */
var playerChar = function(x, y, charPath) {
    this.charPath = charPath;
    this.x = x;
    this.y = y;
    /**
     * if the character is selected to represent player in the game
     * @type {Boolean}
     */
    this.selected = false;


    /**
     * @memberOf playerChar
     * @method isHovered
     * @param  {number} mouseX cursor x coordination
     * @param  {number} mouseY cursor y coordination
     * @param  {number} offsetLeft canvas offset left
     * @param  {number} offsetTop canvas offset top
     * @return {Boolean}
     * @description
     * this function checks if the character is hovered
     * to find out if the cursor is on the char we need to check if the cursor is
     * between X and Y coordinates! for concise result we need to remove white spaces around
     * each character from accepted hovered space using diff array
     */
    this.isHovered = function(mouseX, mouseY, offsetLeft, offsetTop) {
        if ((mouseX > this.x + diff[2] + offsetLeft && mouseX < this.x + diff[2] + offsetLeft + 68) &&
            (mouseY > this.y + diff[3] + offsetTop && mouseY < this.y + diff[3] + offsetTop + 77)) {
            return true;
        } else {
            return false;
        }
    };
    /**
     * @memberOf playerChar
     * @method isSelected
     * @return {Boolean}
     * @description this method draws a yellow border around the selected character
     */
    this.isSelected = function() {
        this.selected = true;
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y + diff[3], 68 + 2 * diff[2], 77 + diff[3]);
    };
};


/**
 * Keeps every player characters
 * @type {Array}
 */
var playerChars = [];

/**
 * Keeps all enemies objects
 * @type {Array}
 */
var allEnemies = [];
/**
 * instanciate player
 * @type {Player}
 */
var player = new Player(ctx.canvas.width / 2 - 53.5, 430);
/**
 * instanciate enemies
 * @type {Enemy}
 */
var enemy = new Enemy(-101, 60, 80);
var enemy2 = new Enemy(-101, 150, 50);
var enemy3 = new Enemy(-101, 240, 120);
/**
 * push all enemies in allEnemies array
 */
allEnemies.push(enemy);
allEnemies.push(enemy2);
allEnemies.push(enemy3);
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

/**
 * keyup event listener which calls player input handler
 * when a key is pressed
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});