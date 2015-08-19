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
                _this._last = Date.now();
            };
            this.main = function () {
                window.requestAnimationFrame(_this.main);
                _this.update(0);
                _this.collisionDetection();
                _this.render();
                _this.cleanup();
            };
            this.cleanup = function () {
                var arrayLength = _this._animations.length, index, keeperAnimations = [];
                for (index = 0; index < arrayLength; index++) {
                    if (_this._animations[index].alive) {
                        keeperAnimations.push(_this._animations[index]);
                    }
                }
                _this._animations = keeperAnimations;
            };
            this.update = function (dt) {
                GAME.Renderer.instance.pushRenderFunction(_this._background.render);
                _this._debrisField.update(dt);
                GAME.Renderer.instance.pushRenderFunction(_this._debrisField.render);
                _this._player.missiles.forEach(function (missile) {
                    if (missile.alive) {
                        missile.update(dt);
                        GAME.Renderer.instance.pushRenderFunction(missile.render);
                    }
                });
                _this._player.update(dt);
                GAME.Renderer.instance.pushRenderFunction(_this._player.render);
                _this._asteroids.forEach(function (asteroid) {
                    if (asteroid.alive) {
                        asteroid.update(dt);
                        GAME.Renderer.instance.pushRenderFunction(asteroid.render);
                    }
                });
                _this._animations.forEach(function (explosion) {
                    if (explosion.alive) {
                        GAME.Renderer.instance.pushRenderFunction(explosion.render);
                    }
                });
                _this._spawnAsteroidTime -= 1;
                if (_this._spawnAsteroidTime < 0) {
                    var randomChoice = getRandomInt(1, 3);
                    if (randomChoice === 1) {
                        _this.spawnAsteroid(GAME.LargeAsteroidConfig);
                    }
                    else if (randomChoice === 2) {
                        _this.spawnAsteroid(GAME.MediumAsteroidConfig);
                    }
                    else {
                        _this.spawnAsteroid(GAME.SmallAsteroidConfig);
                    }
                    _this._spawnAsteroidTime = RiceRocks.ASTEROID_RESPAWN_TIME;
                }
            };
            this.render = function () {
                GAME.Renderer.instance.render();
                GAME.Renderer.instance.flush();
            };
            this.createAsteroids = function () {
                for (var index = 0; index < RiceRocks.MAX_ASTEROIDS; index++) {
                    _this._asteroids[_this._asteroids.length] = new GAME.Asteroid(GAME.LargeAsteroidConfig);
                }
            };
            this.collisionDetection = function () {
                var missiles = _this._player.missiles, asteroidIndex, missileIndex, missile, asteroid, numAsteroids = _this._asteroids.length, numMissiles = missiles.length, player = _this._player, animations = _this._animations;
                for (asteroidIndex = 0; asteroidIndex < numAsteroids; asteroidIndex++) {
                    asteroid = _this._asteroids[asteroidIndex];
                    if (player.alive) {
                        if (asteroid.alive && RiceRocks.collided(player, asteroid)) {
                            player.lives -= 1;
                            asteroid.alive = false;
                            animations[animations.length] = new GAME.ShieldDamage(player.position.x, player.position.y);
                            animations[animations.length] = new GAME.Explosion(asteroid.position.x, asteroid.position.y);
                            new Audio("audio/explosion.mp3").play();
                        }
                    }
                    if (asteroid.alive) {
                        for (missileIndex = 0; missileIndex < numMissiles; missileIndex++) {
                            missile = missiles[missileIndex];
                            if (missile.alive && RiceRocks.collided(missile, asteroid)) {
                                missile.alive = false;
                                asteroid.alive = false;
                                player.score += 100;
                                animations[animations.length] = new GAME.Explosion(asteroid.position.x, asteroid.position.y);
                                new Audio("audio/explosion.mp3").play();
                            }
                        }
                    }
                }
            };
            this._asteroids = [];
            this._animations = [];
            GAME.Resources.instance.load(GAME.Assets.Images.art);
            this._background = new GAME.Background();
            this._debrisField = new GAME.DebrisField();
            this.createAsteroids();
            this._player = new GAME.Player();
            this._player.position.set(GAME.SCREEN_WIDTH / 2, GAME.SCREEN_HEIGHT / 2);
            this._last = 0;
            this._gameState = GameState.PAUSED;
            this._soundTrack = new Audio("audio/soundtrack.mp3");
            this._soundTrack.loop = true;
            this._highScore = 0;
            this._spawnAsteroidTime = RiceRocks.ASTEROID_RESPAWN_TIME;
            document.addEventListener("keyup", this._player.handleInput);
            document.addEventListener("keydown", this._player.handleInput);
        }
        RiceRocks.collided = function (obj, otherObj) {
            return GAME.Vector2d.distance(obj.position, otherObj.position) < obj.radius + otherObj.radius;
        };
        RiceRocks.prototype.reset = function () {
            var player = this._player, missileIndex, missiles = player.missiles, missileArrayLength = missiles.length, asteroidArrayLength = this._asteroids.length, asteroidIndex;
            player.score = 0;
            player.lives = 3;
            player.position.x = (GAME.SCREEN_WIDTH / 2);
            player.position.y = (GAME.SCREEN_WIDTH / 2);
            for (missileIndex = 0; missileIndex < missileArrayLength; missileIndex++) {
                missiles[missileIndex].alive = false;
            }
            for (asteroidIndex = 0; asteroidIndex < asteroidArrayLength; asteroidIndex++) {
                this._asteroids[asteroidIndex].alive = false;
            }
            this._spawnAsteroidTime = RiceRocks.ASTEROID_RESPAWN_TIME;
            this._soundTrack.currentTime = 0;
            this._soundTrack.play();
            this._gameState = GameState.RUNNING;
        };
        RiceRocks.prototype.findAvailableAsteroid = function () {
            var asteroidIndex;
            for (asteroidIndex = 0; asteroidIndex < RiceRocks.MAX_ASTEROIDS; asteroidIndex++) {
                if (!this._asteroids[asteroidIndex].alive) {
                    return this._asteroids[asteroidIndex];
                }
            }
            return null;
        };
        RiceRocks.prototype.spawnAsteroid = function (asteroidConfig) {
            var asteroid = this.findAvailableAsteroid();
            if (asteroid) {
                asteroid.position.x = getRandomInt(0, GAME.SCREEN_WIDTH);
                asteroid.position.y = getRandomInt(0, GAME.SCREEN_HEIGHT);
                asteroid.velocity.x = getRandomInt(-300, 300) / 100;
                asteroid.velocity.y = getRandomInt(-300, 300) / 100;
                asteroid.angularVelocity = getRandomInt(-10, 10) / 100;
                asteroid.alive = true;
                asteroid.asteroidConfig = asteroidConfig;
            }
        };
        RiceRocks.MAX_ASTEROIDS = 24;
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