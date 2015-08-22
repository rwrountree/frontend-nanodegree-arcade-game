/**
 * This a web adaptation of the Rice Rocks game that I created in
 * Coursera's Introduction to Interactive Python course.
 * It is an Asteroids(ish) clone :)
 */
/// <reference path='includes.ts' />
var GAME;
(function (GAME) {
    "use strict";
    /**
     * The game states that are valid in the game
     */
    var GameState;
    (function (GameState) {
        GameState[GameState["RUNNING"] = 0] = "RUNNING";
        GameState[GameState["SPLASH"] = 1] = "SPLASH";
    })(GameState || (GameState = {}));
    /**
     * Keyboard keys that are used in the game
     */
    var allowedKeys;
    (function (allowedKeys) {
        allowedKeys[allowedKeys["space"] = 32] = "space";
        allowedKeys[allowedKeys["left"] = 37] = "left";
        allowedKeys[allowedKeys["up"] = 38] = "up";
        allowedKeys[allowedKeys["right"] = 39] = "right";
        allowedKeys[allowedKeys["down"] = 40] = "down";
    })(allowedKeys || (allowedKeys = {}));
    /**
     * The screen dimensions used throughout the game
     */
    GAME.SCREEN_WIDTH = 800, GAME.SCREEN_HEIGHT = 800;
    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * This is the game!
     */
    var RiceRocks = (function () {
        /**
         * RiceRocks constructor
         */
        function RiceRocks() {
            var _this = this;
            /**
             * Starts the game initially
             */
            this.init = function () {
                _this.reset();
            };
            /**
             * The main game loop that utilizes game states
             */
            this.main = function () {
                window.requestAnimationFrame(_this.main);
                switch (_this.gameState) {
                    case GameState.SPLASH:
                        _this.updateSplash(0);
                        _this.render();
                        break;
                    case GameState.RUNNING:
                        _this.update(0);
                        _this.collisionDetection();
                        _this.render();
                        _this.cleanup();
                        break;
                    default:
                        throw {
                            error: "Invalid Game State",
                            message: "Check the GameState enumeration for valid states"
                        };
                }
            };
            /**
             * Removes any unused effects, asteroids, and missiles and keeps
             * the ones that are still in play
             */
            this.cleanup = function () {
                var arrayLength, index, keepers;
                keepers = [];
                arrayLength = _this.effects.length;
                for (index = 0; index < arrayLength; index++) {
                    if (_this.effects[index].active) {
                        keepers.push(_this.effects[index]);
                    }
                }
                _this.effects = keepers;
                keepers = [];
                arrayLength = _this.asteroids.length;
                for (index = 0; index < arrayLength; index++) {
                    if (_this.asteroids[index].active) {
                        keepers.push(_this.asteroids[index]);
                    }
                }
                _this.asteroids = keepers;
                keepers = [];
                arrayLength = _this.missiles.length;
                for (index = 0; index < arrayLength; index++) {
                    if (_this.missiles[index].active) {
                        keepers.push(_this.missiles[index]);
                    }
                }
                _this.missiles = keepers;
            };
            /**
             * Used to update the render list for the splash screen during the GameState.SPLASH state
             */
            this.updateSplash = function () {
                // push the background to the render list first
                GAME.Renderer.instance.pushRenderFunction(_this.background.render);
                // update the scrolling debris field
                _this.debrisField.update();
                // push the debris field
                GAME.Renderer.instance.pushRenderFunction(_this.debrisField.render);
                // push the splash screen
                GAME.Renderer.instance.pushRenderFunction(_this.splash.render);
                // finally, push the UI (user interface)
                GAME.Renderer.instance.pushRenderFunction(_this.renderUI);
            };
            /**
             * Used to update game objects and the render list during the GameState.RUNNING state
             */
            this.update = function () {
                // push the background to the render list first
                GAME.Renderer.instance.pushRenderFunction(_this.background.render);
                // update the scrolling debris field
                _this.debrisField.update();
                // push the debris field
                GAME.Renderer.instance.pushRenderFunction(_this.debrisField.render);
                // update and push all the active missiles to the render list
                _this.missiles.forEach(function (missile) {
                    if (missile.active) {
                        missile.update();
                        GAME.Renderer.instance.pushRenderFunction(missile.render);
                    }
                });
                // update the player
                _this.player.update();
                // push the player to the render list
                GAME.Renderer.instance.pushRenderFunction(_this.player.render);
                // update and push all the active asteroids to the render list
                _this.asteroids.forEach(function (asteroid) {
                    if (asteroid.active) {
                        asteroid.update();
                        GAME.Renderer.instance.pushRenderFunction(asteroid.render);
                    }
                });
                // push all the active effects to the render list
                _this.effects.forEach(function (effect) {
                    if (effect.active) {
                        GAME.Renderer.instance.pushRenderFunction(effect.render);
                    }
                });
                // update the asteroid respawn tick counter
                _this.spawnTickCounter -= 1;
                if (_this.spawnTickCounter < 0) {
                    // if tick counter has expired, spawna  new asteroid
                    _this.spawnAsteroid();
                    // reset the spawn timer
                    _this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
                }
                // finally, push the UI (user interface) to the render list
                GAME.Renderer.instance.pushRenderFunction(_this.renderUI);
            };
            /**
             * The game's render function
             */
            this.render = function () {
                // execute all render calls pushed to the Renderer object
                GAME.Renderer.instance.render();
                // clear the renderer's draw list
                GAME.Renderer.instance.flush();
            };
            /**
             * Create a new asteroid!
             */
            this.spawnAsteroid = function () {
                var asteroid, randomChoice = getRandomInt(1, 3);
                // randomly create a large, medium, or small asteroid
                if (randomChoice === 1) {
                    asteroid = GAME.SpriteMaker.getSprite("asteroid-large", 0, 0);
                }
                else if (randomChoice === 2) {
                    asteroid = GAME.SpriteMaker.getSprite("asteroid-medium", 0, 0);
                }
                else {
                    asteroid = GAME.SpriteMaker.getSprite("asteroid-small", 0, 0);
                }
                // determine if the asteroid starts on the left or right side of the screen
                var positionX = getRandomInt(1, 2);
                // determine if the asteroid starts on the top or bottom side of the screen
                var positionY = getRandomInt(1, 2);
                positionX = positionX === 1 ? 0 : GAME.SCREEN_WIDTH;
                positionY = positionY === 1 ? 0 : GAME.SCREEN_HEIGHT;
                asteroid.position.x = positionX;
                asteroid.position.y = positionY;
                // randomly generate x and y velocities for the asteroid
                asteroid.velocity.x = getRandomInt(-300, 300) / 100;
                asteroid.velocity.y = getRandomInt(-300, 300) / 100;
                // randomly generate angular velocity
                asteroid.angularVelocity = getRandomInt(-10, 10) / 100;
                // mark it as in play
                asteroid.active = true;
                // put it in the asteroids list
                _this.asteroids.push(asteroid);
            };
            /**
             * Determine asteroid-player and asteroid-missile collisions
             */
            this.collisionDetection = function () {
                var missiles = _this.missiles, asteroidIndex, missileIndex, missile, asteroid, numAsteroids = _this.asteroids.length, numMissiles = missiles.length, player = _this.player;
                for (asteroidIndex = 0; asteroidIndex < numAsteroids; asteroidIndex++) {
                    asteroid = _this.asteroids[asteroidIndex];
                    // determine if an asteroid struck the player
                    if (player.active) {
                        if (asteroid.active && RiceRocks.collided(player, asteroid)) {
                            asteroid.active = false;
                            // hit was detected, create shield damage effect
                            _this.effects[_this.effects.length] =
                                GAME.SpriteMaker.getSprite("shield-damage", player.position.x, player.position.y);
                            // hit was detected, create an explosion effect
                            _this.effects[_this.effects.length] =
                                GAME.SpriteMaker.getSprite("explosion", asteroid.position.x, asteroid.position.y);
                            // play explosion sound
                            new Audio("audio/explosion.mp3").play();
                            // update player's remaining shields
                            _this.player.shields -= asteroid.damage;
                            // player still gets points for destroying an asteroid with his/her ship!
                            _this.player.score += asteroid.points;
                        }
                    }
                    // determine if an asteroid struck a missile
                    if (asteroid.active) {
                        for (missileIndex = 0; missileIndex < numMissiles; missileIndex++) {
                            missile = missiles[missileIndex];
                            if (missile.active && RiceRocks.collided(missile, asteroid)) {
                                missile.active = false;
                                asteroid.active = false;
                                // hit was detected, create an explosion effect
                                _this.effects[_this.effects.length] =
                                    GAME.SpriteMaker.getSprite("explosion", asteroid.position.x, asteroid.position.y);
                                // play explosion sound
                                new Audio("audio/explosion.mp3").play();
                                // give points to player
                                _this.player.score += asteroid.points;
                            }
                        }
                    }
                }
                // adjust high score if player has exceeded it
                if (_this.player.score > _this.highScore) {
                    _this.highScore = _this.player.score;
                }
                // end game if player has been eliminated
                if (_this.player.shields === 0) {
                    _this.gameState = GameState.SPLASH;
                    _this.reset();
                    return;
                }
            };
            /**
             * Processes the allowed keys and mouse input for the game
             * @param event
             */
            this.handleInput = function (event) {
                var eventType = event.type.toString();
                var keyCode = event.keyCode;
                if (eventType === "mousedown") {
                    if (_this.gameState === GameState.SPLASH) {
                        _this.gameState = GameState.RUNNING;
                    }
                }
                if (eventType === "keydown") {
                    switch (allowedKeys[keyCode]) {
                        case "left":
                            // turn left
                            _this.player.angularVelocity = -0.10;
                            break;
                        case "right":
                            // turn right
                            _this.player.angularVelocity = 0.10;
                            break;
                        case "up":
                            // toggle ship thrust
                            _this.player.thrusting = true;
                            break;
                        default:
                    }
                }
                if (eventType === "keyup") {
                    switch (allowedKeys[keyCode]) {
                        case "left":
                        case "right":
                            // stop turning
                            _this.player.angularVelocity = 0;
                            break;
                        case "up":
                            // stop ship thrust
                            _this.player.thrusting = false;
                            break;
                        case "space":
                            // shoot a missile
                            _this.shoot();
                            break;
                        default:
                    }
                }
            };
            /**
             * Render the simple UI for the game which includes:
             * shield gauge, score, and high score
             * @param context2d
             */
            this.renderUI = function (context2d) {
                var width = (GAME.SCREEN_WIDTH * 0.2), height = 20, x = (GAME.SCREEN_WIDTH / 2) - (width / 2), y = 20, lineWidth = 4, percentLeft = _this.player.getShieldPercentage();
                // draw the interior of the shield gauge
                context2d.save();
                context2d.fillStyle = _this.getShieldRGBA();
                context2d.fillRect(x + (width - (width * percentLeft)), y, width * percentLeft, height);
                context2d.restore();
                // draw the percentage remaining of the shield text
                context2d.save();
                context2d.font = "18px Arial";
                context2d.textAlign = "left";
                context2d.fillStyle = "white";
                context2d.fillText(Math.floor(percentLeft * 100).toString() + "%", x + (lineWidth), y + (lineWidth * 4));
                context2d.stroke();
                context2d.restore();
                // draw the border of the shield gauge
                context2d.save();
                context2d.lineWidth = lineWidth;
                context2d.strokeStyle = "rgba(255,255,255,0.75)";
                context2d.strokeRect(x, y, width, height);
                context2d.restore();
                // draw the score and high score text
                context2d.save();
                context2d.font = "20px Arial";
                context2d.fillStyle = "rgba(255,255,255,0.75)";
                context2d.fillText("Score: " + _this.player.score, 20, 37);
                context2d.fillText("Hi: " + _this.highScore, GAME.SCREEN_WIDTH - context2d.measureText("Hi: " + _this.highScore).width - 20, 37);
                context2d.restore();
            };
            GAME.Resources.instance.load(GAME.Assets.Images.art);
            this.asteroids = [];
            this.effects = [];
            this.missiles = [];
            this.background = GAME.SpriteMaker.getSprite("background", 0, 0);
            this.debrisField = GAME.SpriteMaker.getSprite("debris-field", 0, 0);
            // start player in the center of the screen
            this.player = GAME.SpriteMaker.getSprite("ship", GAME.SCREEN_WIDTH / 2, GAME.SCREEN_HEIGHT / 2);
            this.gameState = GameState.SPLASH;
            this.soundTrack = new Audio("audio/soundtrack.mp3");
            this.soundTrack.loop = true;
            this.highScore = 0;
            this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
            // center the splash screen
            this.splash = GAME.SpriteMaker.getSprite("splash", GAME.SCREEN_WIDTH / 2, GAME.SCREEN_HEIGHT / 2);
            // add event handlers
            document.addEventListener("keyup", this.handleInput);
            document.addEventListener("keydown", this.handleInput);
            document.addEventListener("mousedown", this.handleInput);
        }
        /**
         * Test to see whether or not 2 objects collided based on their radii
         * @param obj
         * @param otherObj
         * @returns {boolean}
         */
        RiceRocks.collided = function (obj, otherObj) {
            return GAME.Vector2d.distance(obj.position, otherObj.position) < obj.radius + otherObj.radius;
        };
        /**
         * Return the RGBA value that represents the player's shield condition
         * @returns {string}
         */
        RiceRocks.prototype.getShieldRGBA = function () {
            var r, g, b = 0, a = 0.75, rgba, percentLeft = this.player.getShieldPercentage();
            if (Math.floor(percentLeft * 100) > 50) {
                // when above 50% shield max, move from green to yellow
                r = (255 - Math.floor(percentLeft * 255)) * 2;
                g = 255;
            }
            else {
                // when below 50% shield max, move from yellow to red
                r = 255;
                g = Math.floor(percentLeft * 255) * 2;
            }
            rgba = [r, g, b, a];
            return "rgba(" + rgba.join(",") + ")";
        };
        /**
         * Make way for a new game!
         */
        RiceRocks.prototype.reset = function () {
            this.asteroids = [];
            this.effects = [];
            this.missiles = [];
            this.background = GAME.SpriteMaker.getSprite("background", 0, 0);
            this.player = GAME.SpriteMaker.getSprite("ship", GAME.SCREEN_WIDTH / 2, GAME.SCREEN_HEIGHT / 2);
            this.soundTrack.currentTime = 0;
        };
        /**
         * Fire a missile
         */
        RiceRocks.prototype.shoot = function () {
            var forwardVector2d, player = this.player, missile = GAME.SpriteMaker.getSprite("missile", 0, 0);
            // get the direction the ship is facing
            forwardVector2d = GAME.Vector2d.angleToVector2d(this.player.angle);
            // set missile's position based on player's orientation
            missile.position.set(player.position.x + player.radius * forwardVector2d.x, player.position.y + player.radius * forwardVector2d.y);
            // set missile's velocity based on player's orientation
            missile.velocity.set(player.velocity.x + 6 * forwardVector2d.x, player.velocity.y + 6 * forwardVector2d.y);
            // copy player's angle into missle's
            missile.angle = player.angle;
            // push the new missile into the missile list
            this.missiles.push(missile);
            // play missile sound
            new Audio("audio/missile.mp3").play();
        };
        RiceRocks.ASTEROID_RESPAWN_TIME = 30;
        return RiceRocks;
    })();
    GAME.RiceRocks = RiceRocks;
})(GAME || (GAME = {}));
/**
 * When the page is finished loading, begin the game
 */
window.onload = function () {
    var riceRocks = new GAME.RiceRocks(), doc = document, canvas = doc.createElement("canvas"), context2D = canvas.getContext("2d");
    canvas.width = GAME.SCREEN_WIDTH;
    canvas.height = GAME.SCREEN_HEIGHT;
    doc.body.appendChild(canvas);
    // prepare renderer
    GAME.Renderer.instance.setCanvas(canvas);
    GAME.Renderer.instance.setContext(context2D);
    // when resources are ready, execute init
    GAME.Resources.instance.onReady(riceRocks.init);
    // let the games begin!
    riceRocks.main();
};
//# sourceMappingURL=game.js.map