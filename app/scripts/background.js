/**
 * Created by Rusty on 8/13/2015.
 */
/// <reference path='includes'/>
var GAME;
(function (GAME) {
    "use strict";
    var Background = (function () {
        function Background() {
            this.render = function (context2d) {
                context2d.save();
                var image = GAME.Resources.instance.getImage("images/gameart/nebula_blue.f2014.png");
                if (image) {
                    context2d.drawImage(image, 0, 0, Background.WIDTH, Background.HEIGHT, 0, 0, GAME.SCREEN_WIDTH, GAME.SCREEN_HEIGHT // nBackground.HEIGHT
                    );
                }
                context2d.restore();
            };
            this.position = null;
            this.position = new GAME.Vector2d(0, 0);
        }
        Background.WIDTH = 800;
        Background.HEIGHT = 600;
        return Background;
    })();
    GAME.Background = Background;
})(GAME || (GAME = {}));
//# sourceMappingURL=background.js.map