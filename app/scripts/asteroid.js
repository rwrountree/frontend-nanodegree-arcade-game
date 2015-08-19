/**
 * Created by Rusty on 8/13/2015.
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    (function (AsteroidCategory) {
        AsteroidCategory[AsteroidCategory["SMALL"] = 0] = "SMALL";
        AsteroidCategory[AsteroidCategory["MEDIUM"] = 1] = "MEDIUM";
        AsteroidCategory[AsteroidCategory["LARGE"] = 2] = "LARGE";
    })(GAME.AsteroidCategory || (GAME.AsteroidCategory = {}));
    var AsteroidCategory = GAME.AsteroidCategory;
    var AsteroidConfig = (function () {
        function AsteroidConfig(width, height, radius, category) {
            this._width = width;
            this._height = height;
            this._halfWidth = width / 2;
            this._halfHeight = height / 2;
            this._radius = radius;
            this._category = category;
        }
        Object.defineProperty(AsteroidConfig.prototype, "category", {
            get: function () {
                return this._category;
            },
            set: function (value) {
                this._category = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AsteroidConfig.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                this._width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AsteroidConfig.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                this._height = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AsteroidConfig.prototype, "halfWidth", {
            get: function () {
                return this._halfWidth;
            },
            set: function (value) {
                this._halfWidth = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AsteroidConfig.prototype, "halfHeight", {
            get: function () {
                return this._halfHeight;
            },
            set: function (value) {
                this._halfHeight = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AsteroidConfig.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (value) {
                this._radius = value;
            },
            enumerable: true,
            configurable: true
        });
        return AsteroidConfig;
    })();
    GAME.AsteroidConfig = AsteroidConfig;
    var Asteroid = (function () {
        function Asteroid(asteroidConfig) {
            var _this = this;
            this.render = function (context2d) {
                var asteroidConfig = _this.asteroidConfig, image;
                context2d.save();
                context2d.translate(_this.position.x, _this.position.y);
                context2d.rotate(_this._angle);
                if (_this.asteroidCategory === AsteroidCategory.LARGE) {
                    image = GAME.Resources.instance.getImage("images/gameart/asteroid_blue.png");
                }
                else if (_this.asteroidCategory === AsteroidCategory.MEDIUM) {
                    image = GAME.Resources.instance.getImage("images/gameart/asteroid_blue_medium.png");
                }
                else {
                    image = GAME.Resources.instance.getImage("images/gameart/asteroid_blue_small.png");
                }
                if (image) {
                    context2d.drawImage(image, 0, 0, asteroidConfig.width, asteroidConfig.height, -asteroidConfig.halfWidth, -asteroidConfig.halfHeight, asteroidConfig.width, asteroidConfig.height);
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
            };
            this.position = new GAME.Vector2d(0, 0);
            this.velocity = new GAME.Vector2d(0, 0);
            this._angle = 0;
            this._angularVelocity = 0;
            this._radius = Asteroid.DEFAULT_RADIUS;
            this._alive = true;
            this._asteroidCategory = AsteroidCategory.LARGE;
            this._asteroidConfig = asteroidConfig;
        }
        Object.defineProperty(Asteroid.prototype, "angle", {
            set: function (angle) {
                this._angle = angle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asteroid.prototype, "angularVelocity", {
            get: function () {
                return this._angularVelocity;
            },
            set: function (angularVelocity) {
                this._angularVelocity = angularVelocity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asteroid.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (radius) {
                this._radius = radius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asteroid.prototype, "alive", {
            get: function () {
                return this._alive;
            },
            set: function (isAlive) {
                this._alive = isAlive;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asteroid.prototype, "asteroidCategory", {
            get: function () {
                return this._asteroidCategory;
            },
            set: function (asteroidSize) {
                this._asteroidCategory = asteroidSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asteroid.prototype, "asteroidConfig", {
            get: function () {
                return this._asteroidConfig;
            },
            set: function (asteroidConfig) {
                this._asteroidConfig = asteroidConfig;
                this._radius = asteroidConfig.radius;
                this._asteroidCategory = asteroidConfig.category;
            },
            enumerable: true,
            configurable: true
        });
        Asteroid.DEFAULT_WIDTH = 90;
        Asteroid.DEFAULT_HEIGHT = 90;
        Asteroid.DEFAULT_RADIUS = 40;
        return Asteroid;
    })();
    GAME.Asteroid = Asteroid;
    GAME.LargeAsteroidConfig = new AsteroidConfig(Asteroid.DEFAULT_WIDTH, Asteroid.DEFAULT_HEIGHT, Asteroid.DEFAULT_RADIUS, AsteroidCategory.LARGE);
    GAME.MediumAsteroidConfig = new AsteroidConfig(Asteroid.DEFAULT_WIDTH * 0.75, Asteroid.DEFAULT_HEIGHT * 0.75, Asteroid.DEFAULT_RADIUS * 0.75, AsteroidCategory.MEDIUM);
    GAME.SmallAsteroidConfig = new AsteroidConfig(Asteroid.DEFAULT_WIDTH * 0.5, Asteroid.DEFAULT_HEIGHT * 0.5, Asteroid.DEFAULT_RADIUS * 0.5, AsteroidCategory.SMALL);
})(GAME || (GAME = {}));
//# sourceMappingURL=asteroid.js.map