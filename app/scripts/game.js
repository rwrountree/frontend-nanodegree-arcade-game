/**
 * Created by Rusty on 8/13/2015.
 */
/// <reference path='includes.ts' />
var GAME;
(function (GAME) {
    "use strict";
    var GameState;
    (function (GameState) {
        GameState[GameState["PAUSED"] = 0] = "PAUSED";
        GameState[GameState["RUNNING"] = 1] = "RUNNING";
        GameState[GameState["GAME_OVER"] = 2] = "GAME_OVER";
        GameState[GameState["SPLASH"] = 3] = "SPLASH";
        GameState[GameState["MENU"] = 4] = "MENU";
    })(GameState || (GameState = {}));
    var allowedKeys;
    (function (allowedKeys) {
        allowedKeys[allowedKeys["space"] = 32] = "space";
        allowedKeys[allowedKeys["left"] = 37] = "left";
        allowedKeys[allowedKeys["up"] = 38] = "up";
        allowedKeys[allowedKeys["right"] = 39] = "right";
        allowedKeys[allowedKeys["down"] = 40] = "down";
    })(allowedKeys || (allowedKeys = {}));
    GAME.SCREEN_WIDTH = 800, GAME.SCREEN_HEIGHT = 800;
    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var RiceRocks = (function () {
        function RiceRocks() {
            var _this = this;
            this.init = function () {
                _this.reset();
            };
            this.main = function () {
                window.requestAnimationFrame(_this.main);
                _this.update(0);
                _this.collisionDetection();
                _this.render();
                _this.cleanup();
            };
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
            this.update = function (dt) {
                GAME.Renderer.instance.pushRenderFunction(_this.background.render);
                _this.debrisField.update();
                GAME.Renderer.instance.pushRenderFunction(_this.debrisField.render);
                _this.missiles.forEach(function (missile) {
                    if (missile.active) {
                        missile.update();
                        GAME.Renderer.instance.pushRenderFunction(missile.render);
                    }
                });
                _this.player.update();
                GAME.Renderer.instance.pushRenderFunction(_this.player.render);
                _this.asteroids.forEach(function (asteroid) {
                    if (asteroid.active) {
                        asteroid.update();
                        GAME.Renderer.instance.pushRenderFunction(asteroid.render);
                    }
                });
                _this.effects.forEach(function (effect) {
                    if (effect.active) {
                        GAME.Renderer.instance.pushRenderFunction(effect.render);
                    }
                });
                _this.spawnTickCounter -= 1;
                if (_this.spawnTickCounter < 0) {
                    _this.spawnAsteroid();
                    _this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
                }
            };
            this.render = function () {
                GAME.Renderer.instance.render();
                GAME.Renderer.instance.flush();
            };
            this.spawnAsteroid = function () {
                var asteroid, randomChoice = getRandomInt(1, 3);
                if (randomChoice === 1) {
                    asteroid = GAME.SpriteMaker.getSprite("asteroid-large", 0, 0);
                }
                else if (randomChoice === 2) {
                    asteroid = GAME.SpriteMaker.getSprite("asteroid-medium", 0, 0);
                }
                else {
                    asteroid = GAME.SpriteMaker.getSprite("asteroid-small", 0, 0);
                }
                asteroid.position.x = getRandomInt(0, GAME.SCREEN_WIDTH);
                asteroid.position.y = getRandomInt(0, GAME.SCREEN_HEIGHT);
                asteroid.velocity.x = getRandomInt(-300, 300) / 100;
                asteroid.velocity.y = getRandomInt(-300, 300) / 100;
                asteroid.angularVelocity = getRandomInt(-10, 10) / 100;
                asteroid.active = true;
                _this.asteroids.push(asteroid);
            };
            this.collisionDetection = function () {
                var missiles = _this.missiles, asteroidIndex, missileIndex, missile, asteroid, numAsteroids = _this.asteroids.length, numMissiles = missiles.length, player = _this.player;
                for (asteroidIndex = 0; asteroidIndex < numAsteroids; asteroidIndex++) {
                    asteroid = _this.asteroids[asteroidIndex];
                    if (player.active) {
                        if (asteroid.active && RiceRocks.collided(player, asteroid)) {
                            asteroid.active = false;
                            _this.effects[_this.effects.length] =
                                GAME.SpriteMaker.getSprite("shield-damage", player.position.x, player.position.y);
                            _this.effects[_this.effects.length] =
                                GAME.SpriteMaker.getSprite("explosion", asteroid.position.x, asteroid.position.y);
                            new Audio("audio/explosion.mp3").play();
                        }
                    }
                    if (asteroid.active) {
                        for (missileIndex = 0; missileIndex < numMissiles; missileIndex++) {
                            missile = missiles[missileIndex];
                            if (missile.active && RiceRocks.collided(missile, asteroid)) {
                                missile.active = false;
                                asteroid.active = false;
                                _this.effects[_this.effects.length] =
                                    GAME.SpriteMaker.getSprite("explosion", asteroid.position.x, asteroid.position.y);
                                new Audio("audio/explosion.mp3").play();
                            }
                        }
                    }
                }
            };
            this.handleInput = function (keyBoardEvent) {
                var eventType = keyBoardEvent.type.toString();
                var keyCode = keyBoardEvent.keyCode;
                if (eventType === "keydown") {
                    switch (allowedKeys[keyCode]) {
                        case "left":
                            _this.player.angularVelocity = -0.09;
                            break;
                        case "right":
                            _this.player.angularVelocity = 0.09;
                            break;
                        case "up":
                            _this.player.thrusting = true;
                            break;
                        default:
                    }
                }
                if (eventType === "keyup") {
                    switch (allowedKeys[keyCode]) {
                        case "left":
                        case "right":
                            _this.player.angularVelocity = 0;
                            break;
                        case "up":
                            _this.player.thrusting = false;
                            break;
                        case "space":
                            _this.shoot();
                            break;
                        default:
                    }
                }
            };
            GAME.Resources.instance.load(GAME.Assets.Images.art);
            this.asteroids = [];
            this.effects = [];
            this.missiles = [];
            this.background = GAME.SpriteMaker.getSprite("background", 0, 0);
            this.debrisField = GAME.SpriteMaker.getSprite("debris-field", 0, 0);
            this.player = GAME.SpriteMaker.getSprite("ship", GAME.SCREEN_WIDTH / 2, GAME.SCREEN_HEIGHT / 2);
            this.gameState = GameState.PAUSED;
            this.soundTrack = new Audio("audio/soundtrack.mp3");
            this.soundTrack.loop = true;
            this.highScore = 0;
            this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
            document.addEventListener("keyup", this.handleInput);
            document.addEventListener("keydown", this.handleInput);
        }
        RiceRocks.prototype.shoot = function () {
            var forwardVector2d, player = this.player, missile = GAME.SpriteMaker.getSprite("missile", 0, 0);
            forwardVector2d = GAME.Vector2d.angleToVector2d(this.player.angle);
            missile.position.set(player.position.x + player.radius * forwardVector2d.x, player.position.y + player.radius * forwardVector2d.y);
            missile.velocity.set(player.velocity.x + 6 * forwardVector2d.x, player.velocity.y + 6 * forwardVector2d.y);
            missile.angle = player.angle;
            this.missiles.push(missile);
            new Audio("audio/missile.mp3").play();
        };
        RiceRocks.collided = function (obj, otherObj) {
            return GAME.Vector2d.distance(obj.position, otherObj.position) < obj.radius + otherObj.radius;
        };
        RiceRocks.prototype.reset = function () {
            this.player.position.x = (GAME.SCREEN_WIDTH / 2);
            this.player.position.y = (GAME.SCREEN_WIDTH / 2);
            this.missiles = [];
            this.asteroids = [];
            this.effects = [];
            this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
            this.soundTrack.currentTime = 0;
            this.soundTrack.play();
            this.gameState = GameState.RUNNING;
        };
        RiceRocks.ASTEROID_RESPAWN_TIME = 30;
        return RiceRocks;
    })();
    GAME.RiceRocks = RiceRocks;
})(GAME || (GAME = {}));
window.onload = function () {
    var riceRocks = new GAME.RiceRocks(), doc = document, canvas = doc.createElement("canvas"), context2D = canvas.getContext("2d");
    canvas.width = GAME.SCREEN_WIDTH;
    canvas.height = GAME.SCREEN_HEIGHT;
    doc.body.appendChild(canvas);
    GAME.Renderer.instance.setCanvas(canvas);
    GAME.Renderer.instance.setContext(context2D);
    GAME.Resources.instance.onReady(riceRocks.init);
    riceRocks.main();
};
//# sourceMappingURL=game.js.map