/**
 * Created by Rusty on 8/16/2015.
 */
/**
 * Created by Rusty on 8/13/2015.
 */
/// <reference path='includes'/>
var GAME;
(function (GAME) {
    "use strict";
    var DebrisField = (function () {
        function DebrisField() {
            var _this = this;
            this.update = function (dt) {
                _this.position.x += 1;
                if (_this.position.x >= GAME.SCREEN_WIDTH) {
                    _this.position.x -= GAME.SCREEN_WIDTH;
                }
            };
            this.render = function (context2d) {
                context2d.save();
                context2d.translate(_this.position.x, _this.position.y);
                var image = GAME.Resources.instance.getImage("images/gameart/debris2_blue.png");
                if (image) {
                    context2d.drawImage(image, 0, 0, DebrisField.WIDTH, DebrisField.HEIGHT, 0, 0, GAME.SCREEN_WIDTH, GAME.SCREEN_HEIGHT);
                }
                context2d.restore();
                context2d.save();
                context2d.translate(_this.position.x - GAME.SCREEN_WIDTH, _this.position.y);
                if (image) {
                    context2d.drawImage(image, 0, 0, DebrisField.WIDTH, DebrisField.HEIGHT, 0, 0, GAME.SCREEN_WIDTH, GAME.SCREEN_HEIGHT);
                }
                context2d.restore();
            };
            this.position = null;
            this.position = new GAME.Vector2d(0, 0);
        }
        DebrisField.WIDTH = 640;
        DebrisField.HEIGHT = 480;
        return DebrisField;
    })();
    GAME.DebrisField = DebrisField;
})(GAME || (GAME = {}));
//# sourceMappingURL=debris-field.js.map