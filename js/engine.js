/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /** Predefine the variables we'll be using within this scope,
     get the canvas element, grab the 2D context for that canvas
     define the animation request ID to cancel or start the loop on an
     appropriate time
     */
    var doc = global.document,
        win = global.window,
        canvas = document.getElementById("gameCanvas"),
        ctx = canvas.getContext('2d'),
        animReqId,
        lastTime;
    /** define click event handler to restart button:
        1- cancel animation requst
        2- overlay div and messagebox div should disappear
        3- since comming back to main menu then hearts should disappear
        4- redraw the menu
    */
    $(".restartBtn").click(function() {
        win.cancelAnimationFrame(animReqId);
        $(".overlay").css("display", "none");
        $(".messageBox").css("display", "none");
        $(".heart").css("display", "none");
        reset();
    });

    function main() {
        /** Get our time delta information which is required if your game
        requires smooth animation. Because everyone's computer processes
        instructions at different speeds we need a constant value that
        would be the same for everyone (regardless of how fast their
        computer is) - hurray time!
        */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);

        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        animReqId = win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        reset();
        playerChars[0].isSelected();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /** this function calls the collision detect from app.js*/
    function checkCollisions() {
        collisionDetect();
    }
    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update(dt);
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png', // Top row is water
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
                'images/grass-block.png', // Row 1 of 2 of grass
                'images/grass-block.png' // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        renderEntities();
    }
    /** This function draws the menu page in the begining or when the game is over or
        the player has won the game
     */
    function reset() {
        /** Menu background has only the stone image and the characters
            to choose. We draw first character on (50,160) and each character is
            100 pixels apart from the left neighbor
         */
        var rowImage = 'images/stone-block.png',
            numRows = 6,
            numCols = 5,
            row, col, charRow = 160,
            charCol = 50,
            charImages = [
                'images/char-boy.png',
                'images/char-pink-girl.png',
                'images/char-horn-girl.png',
                'images/char-cat-girl.png',
            ];
        /** draw backgroung in 6 rows and 5 columns using stone image */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImage), col * 101, row * 83);
            }
        }
        /** draw characters starting from (50, 160) and 100 pixels apart
            creat a playerChar onject and set its attrs to coordinations of the
            drawn character and push it to playerChars arrays. We use this
            array to figuer out later that where is the location of each character
            to use in canvas click event
        */
        for (var index = 0; index < charImages.length; index++) {
            ctx.drawImage(Resources.get(charImages[index]), charCol, charRow);
            var pc = new playerChar(charCol, charRow, charImages[index]);
            playerChars.push(pc);
            charCol += 100;
        };
        /** Set the first character as a defauly character to play.
            and draw welcome text and instructin text then draw an image as a
            start button
         */
        playerChars[0].selected = true;
        ctx.font = "36pt Impact";
        ctx.textAlign = "center";
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText("WELCOME", 250, 100);
        ctx.font = "20pt Impact";
        ctx.lineWidth = 2;
        ctx.strokeText("Choose your character and start the journey!", 250, 180);
        ctx.drawImage(Resources.get('images/button-next.png'), 215, 385);
    }
    /** Set the click event listner for canvas
        loop through playerChars and call isHovered method of
        playerChar object to see if mouse is over each character, uf
        yes then set the player sprite property to selected playerChar
     */
    canvas.addEventListener('click', function(event) {
        playerChars.forEach(function(pc) {
            if (pc.isHovered(event.clientX, event.clientY, canvas.offsetLeft, canvas.offsetTop)) {
                reset();
                player.sprite = pc.charPath;
                pc.isSelected();

            }
        });
        /** check if mouse is over start button image to find out this
            the circle equation is checked to see if the specified point is
            in the circle or not as follow: (start button width is 72 so r=36)
            circle center: a = 215+36, b = 385+36
            r = 36
            P(x,y) is in a circle if: r^2<(x-a)^2+(x-b)^2 where a,b are circle center
            If the start button is clicke then change the CSS of heartContainer and heart
            to display not equal to none
        */
        if (Math.pow(event.clientX - 251, 2) + Math.pow(event.clientY - 421, 2) < 1296) {
            $(".heartContainer").css("display", "block");
            $(".heart").css("display", "inline");
            main();
        }
    });

    /** This function is called by the render function and is called on each game
        tick. It's purpose is to then call the render functions you have defined
         on your enemy and player entities within app.js
    */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }
    /** Go ahead and load all of the images we know we're going to need to
        draw our game level. Then set init as the callback method, so that when
        all of these images are properly loaded our game will start.
    */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-pink-girl.png',
        'images/char-horn-girl.png',
        'images/char-cat-girl.png',
        'images/Gem Blue.png',
        'images/button-next.png', // icon downloaded from http://www.iconarchive.com/
        'images/Heart.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
