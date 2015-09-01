/**
 * This is a collection of all the sprite types used in the game.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    /**
     * The base sprite class that all Sprites derive from
     */
    var Sprite = (function () {
        /**
         * Sprite class constructor
         * @param spriteInfo
         * @param x
         * @param y
         * @param visible
         */
        function Sprite(spriteInfo, x, y, visible) {
            if (visible === void 0) { visible = true; }
            /**
             * This function must be overridden in a subclass if used
             * @param context2d
             */
            this.render = function (context2d) {
                throw {
                    error: "Sprite render() not implemented",
                    message: "Implement render function in subclass"
                };
            };
            /**
             * This function must be overridden in a subclass if used
             */
            this.update = function () {
                throw {
                    error: "Sprite update() not implemented",
                    message: "Implement update function in subclass"
                };
            };
            this.spriteInfo = spriteInfo;
            this.position = new GAME.Vector2d(x, y);
            this.visible = visible;
            this.active = true;
        }
        return Sprite;
    })();
    GAME.Sprite = Sprite;
    /**
     * Sprite class for animated effects
     */
    var Effect = (function (_super) {
        __extends(Effect, _super);
        /**
         * Effect class constructor
         * @param spriteInfo
         * @param animationInfo
         * @param x
         * @param y
         */
        function Effect(spriteInfo, animationInfo, x, y) {
            var _this = this;
            _super.call(this, spriteInfo, x, y, true);
            /**
             * Effect render function
             * @param context2d
             */
            this.render = function (context2d) {
                var image = GAME.Resources.instance.getImage(_this.spriteInfo.url), xOffset, yOffset;
                if (!_this.visible) {
                    return;
                }
                if (_this.frame === _this.animationInfo.numberOfFrames) {
                    _this.finished = true;
                    _this.visible = false;
                    return;
                }
                _this.tickCount += 1;
                if (_this.tickCount % _this.animationInfo.animationSpeed === 0) {
                    _this.frame += 1;
                }
                xOffset = (_this.frame % 9) * _this.spriteInfo.width;
                yOffset = Math.floor(_this.frame / 9) * _this.spriteInfo.height;
                context2d.save();
                context2d.translate(_this.position.x, _this.position.y);
                if (image) {
                    context2d.drawImage(image, xOffset, yOffset, _this.spriteInfo.width, _this.spriteInfo.height, -_this.spriteInfo.halfWidth, -_this.spriteInfo.halfHeight, _this.spriteInfo.width, _this.spriteInfo.height);
                }
                context2d.restore();
            };
            this.animationInfo = animationInfo;
            this.frame = 0;
            this.tickCount = -1;
            this.finished = false;
        }
        return Effect;
    })(Sprite);
    GAME.Effect = Effect;
    /**
     * Background class for space nebula
     */
    var Background = (function (_super) {
        __extends(Background, _super);
        /**
         * Background class constructor
         * @param spriteInfo
         * @param x
         * @param y
         */
        function Background(spriteInfo, x, y) {
            var _this = this;
            _super.call(this, spriteInfo, x, y);
            /**
             * Background render function
             * @param context2d
             */
            this.render = function (context2d) {
                context2d.save();
                var image = GAME.Resources.instance.getImage(_this.spriteInfo.url);
                if (image) {
                    context2d.drawImage(image, 0, 0, _this.spriteInfo.width, _this.spriteInfo.height, 0, 0, GAME.SCREEN_WIDTH, GAME.SCREEN_HEIGHT);
                }
                context2d.restore();
            };
        }
        return Background;
    })(Sprite);
    GAME.Background = Background;
    /**
     * Splash class for splash screen
     */
    var Splash = (function (_super) {
        __extends(Splash, _super);
        /**
         * Splash constructor
         * @param spriteInfo
         * @param x
         * @param y
         */
        function Splash(spriteInfo, x, y) {
            var _this = this;
            _super.call(this, spriteInfo, x, y);
            /**
             * Splash render function
             * @param context2d
             */
            this.render = function (context2d) {
                context2d.save();
                var image = GAME.Resources.instance.getImage(_this.spriteInfo.url);
                if (image) {
                    context2d.drawImage(image, 0, 0, _this.spriteInfo.width, _this.spriteInfo.height, _this.position.x - _this.spriteInfo.halfWidth, _this.position.y - _this.spriteInfo.halfHeight, _this.spriteInfo.width, _this.spriteInfo.height);
                }
                context2d.restore();
            };
        }
        return Splash;
    })(Sprite);
    GAME.Splash = Splash;
    /**
     * DebrisField class for asteroid debris belt
     */
    var DebrisField = (function (_super) {
        __extends(DebrisField, _super);
        /**
         * DebrisField constructor
         * @param spriteInfo
         * @param x
         * @param y
         */
        function DebrisField(spriteInfo, x, y) {
            var _this = this;
            _super.call(this, spriteInfo, x, y);
            /**
             * DebrisField render function
             * @param context2d
             */
            this.render = function (context2d) {
                var image = GAME.Resources.instance.getImage(_this.spriteInfo.url), repeat = 2, xOffset = _this.position.x;
                if (image) {
                    while (repeat > 0) {
                        context2d.save();
                        context2d.translate(xOffset, _this.position.y);
                        context2d.drawImage(image, 0, 0, _this.spriteInfo.width, _this.spriteInfo.height, 0, 0, GAME.SCREEN_WIDTH, GAME.SCREEN_HEIGHT);
                        context2d.restore();
                        xOffset -= GAME.SCREEN_WIDTH;
                        repeat -= 1;
                    }
                }
            };
            /**
             * DebrisField update function
             */
            this.update = function () {
                _this.position.x += 1;
                if (_this.position.x >= GAME.SCREEN_WIDTH) {
                    _this.position.x -= GAME.SCREEN_WIDTH;
                }
            };
        }
        return DebrisField;
    })(Sprite);
    GAME.DebrisField = DebrisField;
    /**
     * SimulationObject class used for objects that utilize basic physics
     */
    var SimulationObject = (function (_super) {
        __extends(SimulationObject, _super);
        /**
         * SimulationObject constructor
         * @param spriteInfo
         * @param x
         * @param y
         */
        function SimulationObject(spriteInfo, x, y) {
            var _this = this;
            _super.call(this, spriteInfo, x, y);
            /**
             * wrap function used to make sure objects stay on screen
             */
            this.wrap = function () {
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
            /**
             * SimulationObject render function
             * @param context2d
             */
            this.render = function (context2d) {
                if (!_this.visible) {
                    return;
                }
                context2d.save();
                context2d.translate(_this.position.x, _this.position.y);
                context2d.rotate(_this.angle);
                var image = GAME.Resources.instance.getImage(_this.spriteInfo.url);
                if (image) {
                    context2d.drawImage(image, 0, 0, _this.spriteInfo.width, _this.spriteInfo.height, -_this.spriteInfo.halfWidth, -_this.spriteInfo.halfHeight, _this.spriteInfo.width, _this.spriteInfo.height);
                }
                context2d.restore();
            };
            /**
             * update function to move objects
             * NOTE: There are preUpdate and postUpdate function calls that can be overridden
             * in a subclass to do processing before and after (Template Pattern)
             */
            this.update = function () {
                _this.preUpdate();
                if (!_this.active) {
                    return;
                }
                _this.angle += _this.angularVelocity;
                _this.position.x += _this.velocity.x;
                _this.position.y += _this.velocity.y;
                _this.wrap();
                _this.postUpdate();
            };
            /**
             * Called before position and angle have been updated
             * NOTE: Override this in a subclass if needed
             */
            this.preUpdate = function () {
                // no op
            };
            /**
             * Called after position and angle have been updated
             * NOTE: Override this in a subclass if needed
             */
            this.postUpdate = function () {
                // no op
            };
            this.velocity = new GAME.Vector2d(0, 0);
            this.angle = 0;
            this.angularVelocity = 0;
            this.radius = spriteInfo.radius;
        }
        return SimulationObject;
    })(Sprite);
    GAME.SimulationObject = SimulationObject;
    /**
     * Missile class
     */
    var Missile = (function (_super) {
        __extends(Missile, _super);
        /**
         * Missile class constructor
         * @param spriteInfo
         * @param x
         * @param y
         */
        function Missile(spriteInfo, x, y) {
            var _this = this;
            _super.call(this, spriteInfo, x, y);
            /**
             * Overridden function that processes how many ticks until it deactivates
             */
            this.preUpdate = function () {
                _this.ticksToLive -= 1;
                if (_this.ticksToLive <= 0) {
                    _this.active = false;
                    _this.visible = false;
                    return;
                }
            };
            this.ticksToLive = 60;
        }
        return Missile;
    })(SimulationObject);
    GAME.Missile = Missile;
    /**
     * Asteroid class
     */
    var Asteroid = (function (_super) {
        __extends(Asteroid, _super);
        /**
         * Asteroid class constructor
         * @param spriteInfo
         * @param animationInfo
         * @param x
         * @param y
         * @param damage
         * @param points
         */
        function Asteroid(spriteInfo, animationInfo, x, y, damage, points) {
            var _this = this;
            _super.call(this, spriteInfo, x, y);
            /**
             * Asteroid render function
             * @param context2d
             */
            this.render = function (context2d) {
                var image = GAME.Resources.instance.getImage(_this.spriteInfo.url), xOffset, yOffset;
                if (!_this.visible) {
                    return;
                }
                if (_this.frame === _this.animationInfo.numberOfFrames) {
                    _this.frame = 0;
                }
                _this.tickCount += 1;
                if (_this.tickCount % _this.animationInfo.animationSpeed === 0) {
                    _this.frame += 1;
                }
                xOffset = (_this.frame % 9) * _this.spriteInfo.width;
                yOffset = 0;
                context2d.save();
                context2d.translate(_this.position.x, _this.position.y);
                if (image) {
                    context2d.drawImage(image, xOffset, yOffset, _this.spriteInfo.width, _this.spriteInfo.height, -_this.spriteInfo.halfWidth, -_this.spriteInfo.halfHeight, _this.spriteInfo.width, _this.spriteInfo.height);
                }
                context2d.restore();
            };
            this.animationInfo = animationInfo;
            this.frame = 0;
            this.tickCount = -1;
            this.finished = false;
            this.damage = damage;
            this.points = points;
        }
        return Asteroid;
    })(SimulationObject);
    GAME.Asteroid = Asteroid;
    /**
     * Ship class that represents the player in the game
     */
    var Ship = (function (_super) {
        __extends(Ship, _super);
        /**
         * Ship class constructor
         * @param spriteInfo
         * @param x
         * @param y
         */
        function Ship(spriteInfo, x, y) {
            var _this = this;
            _super.call(this, spriteInfo, x, y);
            /**
             * Ship render function
             * @param context2d
             */
            this.render = function (context2d) {
                var image = GAME.Resources.instance.getImage(_this.spriteInfo.url);
                context2d.save();
                context2d.translate(_this.position.x, _this.position.y);
                context2d.rotate(_this.angle);
                if (image) {
                    context2d.drawImage(image, 
                    // if thrusting, use the 2nd frame in the ship image
                    (_this.thrusting ? _this.spriteInfo.width : 0), 0, _this.spriteInfo.width, _this.spriteInfo.height, -_this.spriteInfo.halfWidth, -_this.spriteInfo.halfHeight, _this.spriteInfo.width, _this.spriteInfo.height);
                }
                context2d.restore();
            };
            /**
             * Adjusts velocity and acceleration
             */
            this.postUpdate = function () {
                var acceleration;
                /**
                 * Calculate velocity when thrusting using an acceleration clamp to limit
                 * maximum velocity
                 */
                if (_this.thrusting) {
                    acceleration = GAME.Vector2d.angleToVector2d(_this.angle);
                    _this.velocity.x += acceleration.x * _this.accelerationClamp;
                    _this.velocity.y += acceleration.y * _this.accelerationClamp;
                }
                /**
                 * Apply friction (not realistic in space!) so the ship will slowly come
                 * to a stop when not thrusting
                 */
                _this.velocity.x *= _this.friction;
                _this.velocity.y *= _this.friction;
            };
            this.accelerationClamp = 0.3; // acceleration limiter
            this.friction = 0.95; // friction used to slow ship down
            this.thrusting = false;
            this.maxShields = 100;
            this._shields = this.maxShields;
            this.score = 0;
            this.angle = Math.PI * (3 / 2);
        }
        Object.defineProperty(Ship.prototype, "shields", {
            /**
             * Gets the number of hit points remaining in the shield
             * @returns {number}
             */
            get: function () {
                return this._shields;
            },
            /**
             * Sets the number of hit points for the shield
             * @param value
             */
            set: function (value) {
                this._shields = value;
                if (this._shields < 0) {
                    this._shields = 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Retrieves the percentage left for the shield
         * @returns {number}
         */
        Ship.prototype.getShieldPercentage = function () {
            return this.shields / this.maxShields;
        };
        return Ship;
    })(SimulationObject);
    GAME.Ship = Ship;
    /**
     * SpriteMaker class is used as a sprite factory (Factory Pattern)
     * All sprites in the game are generated through this class
     */
    var SpriteMaker = (function () {
        function SpriteMaker() {
        }
        SpriteMaker.getSprite = function (what, x, y) {
            switch (what) {
                case "asteroid-small":
                    return new Asteroid(GAME.SpriteConfigs.asteroidSmallSpriteInfo, GAME.SpriteConfigs.asteroidAnimationInfo, x, y, 2, 300);
                case "asteroid-medium":
                    return new Asteroid(GAME.SpriteConfigs.asteroidMediumSpriteInfo, GAME.SpriteConfigs.asteroidAnimationInfo, x, y, 4, 200);
                case "asteroid-large":
                    return new Asteroid(GAME.SpriteConfigs.asteroidLargeSpriteInfo, GAME.SpriteConfigs.asteroidAnimationInfo, x, y, 6, 100);
                case "missile":
                    return new Missile(GAME.SpriteConfigs.missileSpriteInfo, x, y);
                case "ship":
                    return new Ship(GAME.SpriteConfigs.shipSpriteInfo, x, y);
                case "explosion":
                    return new Effect(GAME.SpriteConfigs.explosionSpriteInfo, GAME.SpriteConfigs.explosionAnimationInfo, x, y);
                case "shield-damage":
                    return new Effect(GAME.SpriteConfigs.shieldDamageSpriteInfo, GAME.SpriteConfigs.shieldDamageAnimationInfo, x, y);
                case "background":
                    return new Background(GAME.SpriteConfigs.backgroundSpriteInfo, x, y);
                case "debris-field":
                    return new DebrisField(GAME.SpriteConfigs.debrisFieldSpriteInfo, x, y);
                case "splash":
                    return new Splash(GAME.SpriteConfigs.splashSpriteInfo, x, y);
                default:
                    throw {
                        error: "Invalid Sprite Type",
                        message: "No such sprite type exists"
                    };
            }
        };
        return SpriteMaker;
    })();
    GAME.SpriteMaker = SpriteMaker;
})(GAME || (GAME = {}));
//# sourceMappingURL=sprite-maker.js.map