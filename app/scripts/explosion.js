/**
 * Created by Rusty on 8/18/2015.
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    var Explosion = (function () {
        function Explosion(x, y) {
            var _this = this;
            this.render = function (context2d) {
                var image = GAME.Resources.instance.getImage("images/gameart/explosion.hasgraphics.png"), xOffset, yOffset;
                if (_this._currentFrame === Explosion.NUM_FRAMES) {
                    _this._alive = false;
                    return;
                }
                _this._currentTickCount += 1;
                if (_this._currentTickCount % Explosion.ANIMATION_SPEED === 0) {
                    _this._currentFrame += 1;
                }
                yOffset = Math.floor(_this._currentFrame / 9) * Explosion.HEIGHT;
                xOffset = (_this._currentFrame % 9) * Explosion.WIDTH;
                context2d.save();
                context2d.translate(_this.position.x, _this.position.y);
                if (image) {
                    context2d.drawImage(image, xOffset, yOffset, Explosion.WIDTH, Explosion.HEIGHT, -Explosion.HALF_WIDTH, -Explosion.HALF_HEIGHT, Explosion.WIDTH, Explosion.HEIGHT);
                }
                context2d.restore();
            };
            this.position = new GAME.Vector2d(0, 0);
            this.alive = true;
            this._currentTickCount = -1;
            this._currentFrame = 0;
            this.position.set(x, y);
        }
        Object.defineProperty(Explosion.prototype, "alive", {
            get: function () {
                return this._alive;
            },
            set: function (isAlive) {
                this._alive = isAlive;
            },
            enumerable: true,
            configurable: true
        });
        Explosion.ANIMATION_SPEED = 1;
        Explosion.NUM_FRAMES = 64;
        // private static SPRITE_SHEET_WIDTH: number = 900;
        // private static SPRITE_SHEET_HEIGHT: number = 900;
        Explosion.WIDTH = 100;
        Explosion.HEIGHT = 100;
        Explosion.HALF_WIDTH = Explosion.WIDTH / 2;
        Explosion.HALF_HEIGHT = Explosion.HEIGHT / 2;
        return Explosion;
    })();
    GAME.Explosion = Explosion;
})(GAME || (GAME = {}));
//# sourceMappingURL=explosion.js.map