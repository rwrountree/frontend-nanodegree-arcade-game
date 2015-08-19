/**
 * Created by Rusty on 8/13/2015.
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    var Missile = (function () {
        function Missile() {
            var _this = this;
            this.render = function (context2d) {
                context2d.save();
                context2d.translate(_this.position.x, _this.position.y);
                context2d.rotate(_this.angle);
                var image = GAME.Resources.instance.getImage("images/gameart/shot2.png");
                if (image) {
                    context2d.drawImage(image, 0, 0, Missile.WIDTH, Missile.HEIGHT, -Missile.HALF_WIDTH, -Missile.HALF_HEIGHT, Missile.WIDTH, Missile.HEIGHT);
                }
                context2d.restore();
            };
            this.update = function (dt) {
                _this._lifeTime -= 1; // dt;
                if (_this._lifeTime <= 0) {
                    _this.alive = false;
                    _this._lifeTime = Missile.BASE_VELOCITY;
                    return;
                }
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
            this._lifeTime = Missile.LIFE_TIME;
            this._alive = false;
            this._radius = Missile.RADIUS;
        }
        Missile.prototype.resurrect = function () {
            this._alive = true;
            this._lifeTime = Missile.LIFE_TIME;
        };
        Object.defineProperty(Missile.prototype, "alive", {
            get: function () {
                return this._alive;
            },
            set: function (isAlive) {
                this._alive = isAlive;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Missile.prototype, "angle", {
            get: function () {
                return this._angle;
            },
            set: function (angle) {
                this._angle = angle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Missile.prototype, "angularVelocity", {
            get: function () {
                return this._angularVelocity;
            },
            set: function (angularVelocity) {
                this._angularVelocity = angularVelocity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Missile.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (radius) {
                this._radius = radius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Missile.prototype, "lifeTime", {
            get: function () {
                return this._lifeTime;
            },
            set: function (lifeTime) {
                this._lifeTime = lifeTime;
            },
            enumerable: true,
            configurable: true
        });
        Missile.BASE_VELOCITY = 8;
        Missile.LIFE_TIME = 30;
        Missile.WIDTH = 10;
        Missile.HEIGHT = 10;
        Missile.HALF_WIDTH = Missile.WIDTH / 2;
        Missile.HALF_HEIGHT = Missile.HEIGHT / 2;
        Missile.RADIUS = 3;
        return Missile;
    })();
    GAME.Missile = Missile;
})(GAME || (GAME = {}));
//# sourceMappingURL=missile.js.map