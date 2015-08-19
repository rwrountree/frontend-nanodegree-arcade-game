/**
 * Created by Rusty on 8/13/2015.
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    var allowedKeys;
    (function (allowedKeys) {
        allowedKeys[allowedKeys["space"] = 32] = "space";
        allowedKeys[allowedKeys["left"] = 37] = "left";
        allowedKeys[allowedKeys["up"] = 38] = "up";
        allowedKeys[allowedKeys["right"] = 39] = "right";
        allowedKeys[allowedKeys["down"] = 40] = "down";
    })(allowedKeys || (allowedKeys = {}));
    var Player = (function () {
        function Player() {
            var _this = this;
            this.render = function (context2d) {
                var image = GAME.Resources.instance.getImage("images/gameart/double_ship.png");
                context2d.save();
                context2d.translate(_this.position.x, _this.position.y);
                context2d.rotate(_this._angle);
                if (image) {
                    context2d.drawImage(image, (_this._isThrusting ? Player.WIDTH : 0), 0, Player.WIDTH, Player.HEIGHT, -Player.HALF_WIDTH, -Player.HALF_HEIGHT, Player.WIDTH, Player.HEIGHT);
                }
                context2d.restore();
            };
            this.update = function (dt) {
                // update angle
                _this._angle += _this._angularVelocity; // * dt;
                _this.position.x += _this.velocity.x; // * dt;
                _this.position.y += _this.velocity.y; // * dt;
                if (_this.position.x < 0) {
                    _this.position.x = GAME.SCREEN_WIDTH - _this.position.x;
                }
                else if (_this.position.x > GAME.SCREEN_WIDTH) {
                    _this.position.x = _this.position.x - GAME.SCREEN_WIDTH;
                }
                if (_this.position.y < 0) {
                    _this.position.y = GAME.SCREEN_HEIGHT - _this.position.y;
                }
                else if (_this.position.y > GAME.SCREEN_HEIGHT) {
                    _this.position.y = _this.position.y - GAME.SCREEN_HEIGHT;
                }
                if (_this._isThrusting) {
                    var acceleration = GAME.Vector2d.angleToVector2d(_this._angle);
                    _this.velocity.x += acceleration.x * Player.ACCELERATION_CLAMP; // * dt;
                    _this.velocity.y += acceleration.y * Player.ACCELERATION_CLAMP; // * dt;
                }
                _this.velocity.x *= Player.FRICTION;
                _this.velocity.y *= Player.FRICTION;
            };
            this.handleInput = function (keyBoardEvent) {
                var eventType = keyBoardEvent.type.toString();
                var keyCode = keyBoardEvent.keyCode;
                if (eventType === "keydown") {
                    switch (allowedKeys[keyCode]) {
                        case "left":
                            _this.setAngularVelocity(-Player.ANGULAR_VELOCITY);
                            break;
                        case "right":
                            _this.setAngularVelocity(Player.ANGULAR_VELOCITY);
                            break;
                        case "up":
                            if (!_this._isThrusting) {
                                _this.setThrust(true);
                            }
                            break;
                        default:
                    }
                }
                if (eventType === "keyup") {
                    switch (allowedKeys[keyCode]) {
                        case "left":
                        case "right":
                            _this.setAngularVelocity(0);
                            break;
                        case "up":
                            _this.setThrust(false);
                            break;
                        case "space":
                            _this.shootMissile();
                            break;
                        default:
                    }
                }
            };
            this.createMissiles = function () {
                for (var index = 0; index < 10; index++) {
                    _this._missiles.push(new GAME.Missile());
                }
            };
            this._missiles = [];
            this.position = new GAME.Vector2d(0, 0);
            this.velocity = new GAME.Vector2d(0, 0);
            this._angle = 0;
            this._angularVelocity = 0;
            this._radius = Player.RADIUS;
            this._isThrusting = false;
            this._score = 0;
            this._lives = 0;
            this.createMissiles();
            this._thrustSound = new Audio("audio/thrust.mp3");
            this._thrustSound.loop = true;
            this._alive = true;
        }
        Object.defineProperty(Player.prototype, "missiles", {
            get: function () {
                return this._missiles;
            },
            set: function (missiles) {
                this._missiles = missiles;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.setAngularVelocity = function (angularVelocity) {
            this._angularVelocity = angularVelocity;
        };
        Player.prototype.setThrust = function (onOrOff) {
            this._isThrusting = onOrOff;
            if (this._isThrusting) {
                this._thrustSound.currentTime = 0;
                this._thrustSound.play();
            }
            else {
                this._thrustSound.pause();
            }
        };
        Player.prototype.getAvailableMissile = function () {
            var index = 0, length = this._missiles.length;
            for (; index < length; index++) {
                if (!this._missiles[index].alive) {
                    return this._missiles[index];
                }
            }
            return null;
        };
        ;
        Player.prototype.shootMissile = function () {
            var missile = this.getAvailableMissile(), forwardVector2d, missileSound;
            if (!missile) {
                return;
            }
            forwardVector2d = GAME.Vector2d.angleToVector2d(this._angle);
            missile.position.set(this.position.x + this._radius * forwardVector2d.x, this.position.y + this._radius * forwardVector2d.y);
            missile.velocity.set(this.velocity.x + GAME.Missile.BASE_VELOCITY * forwardVector2d.x, this.velocity.y + GAME.Missile.BASE_VELOCITY * forwardVector2d.y);
            missile.angle = this._angle;
            missile.resurrect();
            missileSound = new Audio("audio/missile.mp3");
            missileSound.play();
        };
        Object.defineProperty(Player.prototype, "lives", {
            get: function () {
                return this._lives;
            },
            set: function (value) {
                this._lives = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "score", {
            get: function () {
                return this._score;
            },
            set: function (value) {
                this._score = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "angle", {
            set: function (angle) {
                this._angle = angle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "angularVelocity", {
            get: function () {
                return this._angularVelocity;
            },
            set: function (angularVelocity) {
                this._angularVelocity = angularVelocity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (radius) {
                this._radius = radius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "alive", {
            get: function () {
                return this._alive;
            },
            set: function (isAlive) {
                this._alive = isAlive;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isThrusting", {
            get: function () {
                return this._isThrusting;
            },
            set: function (isThrusting) {
                this._isThrusting = isThrusting;
            },
            enumerable: true,
            configurable: true
        });
        Player.ACCELERATION_CLAMP = 0.3;
        Player.FRICTION = 0.95;
        Player.ANGULAR_VELOCITY = 0.09;
        Player.RADIUS = 35;
        Player.WIDTH = 90;
        Player.HEIGHT = 90;
        Player.HALF_WIDTH = Player.WIDTH / 2;
        Player.HALF_HEIGHT = Player.HEIGHT / 2;
        return Player;
    })();
    GAME.Player = Player;
})(GAME || (GAME = {}));
//# sourceMappingURL=player.js.map