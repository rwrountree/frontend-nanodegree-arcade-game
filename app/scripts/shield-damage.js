/**
 * Created by Rusty on 8/18/2015.
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    var ShieldDamage = (function () {
        function ShieldDamage(x, y) {
            var _this = this;
            this.render = function (context2d) {
                var image = GAME.Resources.instance.getImage("images/gameart/explosion_alpha.png"), xOffset, yOffset;
                if (_this._currentFrame === ShieldDamage.NUM_FRAMES) {
                    _this._alive = false;
                    return;
                }
                _this._currentTickCount += 1;
                if (_this._currentTickCount % ShieldDamage.ANIMATION_SPEED === 0) {
                    _this._currentFrame += 1;
                }
                yOffset = 0; // nMath.floor(this._currentFrame / 9) * ShieldDamage.HEIGHT;
                xOffset = (_this._currentFrame % 24) * ShieldDamage.WIDTH;
                context2d.save();
                context2d.translate(_this.position.x, _this.position.y);
                if (image) {
                    context2d.drawImage(image, xOffset, yOffset, ShieldDamage.WIDTH, ShieldDamage.HEIGHT, -ShieldDamage.HALF_WIDTH, -ShieldDamage.HALF_HEIGHT, ShieldDamage.WIDTH, ShieldDamage.HEIGHT);
                }
                context2d.restore();
            };
            this.position = new GAME.Vector2d(0, 0);
            this.alive = true;
            this._currentTickCount = -1;
            this._currentFrame = 0;
            this.position.set(x, y);
        }
        Object.defineProperty(ShieldDamage.prototype, "alive", {
            get: function () {
                return this._alive;
            },
            set: function (isAlive) {
                this._alive = isAlive;
            },
            enumerable: true,
            configurable: true
        });
        ShieldDamage.ANIMATION_SPEED = 1;
        ShieldDamage.NUM_FRAMES = 24;
        // private static SPRITE_SHEET_WIDTH: number = 900;
        // private static SPRITE_SHEET_HEIGHT: number = 900;
        ShieldDamage.WIDTH = 128;
        ShieldDamage.HEIGHT = 128;
        ShieldDamage.HALF_WIDTH = ShieldDamage.WIDTH / 2;
        ShieldDamage.HALF_HEIGHT = ShieldDamage.HEIGHT / 2;
        return ShieldDamage;
    })();
    GAME.ShieldDamage = ShieldDamage;
})(GAME || (GAME = {}));
//# sourceMappingURL=shield-damage.js.map