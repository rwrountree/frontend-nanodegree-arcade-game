/**
 * Created by Rusty on 8/20/2015.
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    var AnimationInfo = (function () {
        function AnimationInfo(animationSpeed, numberOfFrames) {
            this.animationSpeed = animationSpeed;
            this.numberOfFrames = numberOfFrames;
        }
        return AnimationInfo;
    })();
    GAME.AnimationInfo = AnimationInfo;
    var SpriteInfo = (function () {
        // constructor(url: string, x: number, y: number, width: number, height: number) {
        function SpriteInfo(url, width, height, radius) {
            if (radius === void 0) { radius = 0; }
            this.url = url;
            // this.position = new Vector2d(x, y);
            this.width = width;
            this.height = height;
            this.halfWidth = this.width / 2;
            this.halfHeight = this.height / 2;
            this.radius = radius;
        }
        return SpriteInfo;
    })();
    GAME.SpriteInfo = SpriteInfo;
    var SpriteConfigs = (function () {
        function SpriteConfigs() {
        }
        SpriteConfigs.explosionAnimationInfo = new AnimationInfo(1, 64);
        SpriteConfigs.explosionSpriteInfo = new SpriteInfo("images/gameart/explosion.hasgraphics.png", 100, 100);
        SpriteConfigs.shieldDamageAnimationInfo = new AnimationInfo(2, 24);
        SpriteConfigs.shieldDamageSpriteInfo = new SpriteInfo("images/gameart/explosion_alpha.png", 128, 128);
        SpriteConfigs.asteroidAnimationInfo = new AnimationInfo(3, 24);
        SpriteConfigs.asteroidLargeSpriteInfo = new SpriteInfo("images/gameart/asteroid_large_animated.png", 96, 96, 40);
        SpriteConfigs.asteroidMediumSpriteInfo = new SpriteInfo("images/gameart/asteroid_medium_animated.png", 72, 72, 30);
        SpriteConfigs.asteroidSmallSpriteInfo = new SpriteInfo("images/gameart/asteroid_small_animated.png", 48, 48, 20);
        SpriteConfigs.missileSpriteInfo = new SpriteInfo("images/gameart/shot2.png", 10, 10, 3);
        SpriteConfigs.shipSpriteInfo = new SpriteInfo("images/gameart/double_ship.png", 90, 90, 35);
        SpriteConfigs.backgroundSpriteInfo = new SpriteInfo("images/gameart/nebula_blue.f2014.png", 800, 600);
        SpriteConfigs.debrisFieldSpriteInfo = new SpriteInfo("images/gameart/debris2_blue.png", 640, 480);
        return SpriteConfigs;
    })();
    GAME.SpriteConfigs = SpriteConfigs;
})(GAME || (GAME = {}));
//# sourceMappingURL=sprite-configs.js.map