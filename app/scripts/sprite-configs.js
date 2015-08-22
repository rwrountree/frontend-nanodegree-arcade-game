/**
 * This is a collection of all the sprite configurations used in the game
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    /**
     * AnimationInfo class is used to describe animation speed and frame count
     */
    var AnimationInfo = (function () {
        /**
         * AnimationInfo class constructor
         * @param animationSpeed
         * @param numberOfFrames
         */
        function AnimationInfo(animationSpeed, numberOfFrames) {
            this.animationSpeed = animationSpeed;
            this.numberOfFrames = numberOfFrames;
        }
        return AnimationInfo;
    })();
    GAME.AnimationInfo = AnimationInfo;
    /**
     * SpriteInfo class is used to describe source, dimensions, and radius
     * NOTE: Radius is used for simulation objects during collision detection
     */
    var SpriteInfo = (function () {
        /**
         * SpriteInfo class constructor
         * @param url
         * @param width
         * @param height
         * @param radius
         */
        function SpriteInfo(url, width, height, radius) {
            if (radius === void 0) { radius = 0; }
            this.url = url;
            this.width = width;
            this.height = height;
            this.halfWidth = this.width / 2;
            this.halfHeight = this.height / 2;
            this.radius = radius;
        }
        return SpriteInfo;
    })();
    GAME.SpriteInfo = SpriteInfo;
    /**
     * SpriteConfigs class contains the predefined attributes for the various sprites
     * in the game. SpriteMaker uses these to create the appropriate sprite.
     */
    var SpriteConfigs = (function () {
        function SpriteConfigs() {
        }
        // explosion effect configurations
        SpriteConfigs.explosionAnimationInfo = new AnimationInfo(1, 64);
        SpriteConfigs.explosionSpriteInfo = new SpriteInfo("images/gameart/explosion.hasgraphics.png", 100, 100);
        // shield damage effect configurations
        SpriteConfigs.shieldDamageAnimationInfo = new AnimationInfo(2, 24);
        SpriteConfigs.shieldDamageSpriteInfo = new SpriteInfo("images/gameart/explosion_alpha.png", 128, 128);
        // asteroid configurations for small, medium, and large sizes
        SpriteConfigs.asteroidAnimationInfo = new AnimationInfo(3, 24);
        SpriteConfigs.asteroidLargeSpriteInfo = new SpriteInfo("images/gameart/asteroid_large_animated.png", 96, 96, 26);
        SpriteConfigs.asteroidMediumSpriteInfo = new SpriteInfo("images/gameart/asteroid_medium_animated.png", 72, 72, 17);
        SpriteConfigs.asteroidSmallSpriteInfo = new SpriteInfo("images/gameart/asteroid_small_animated.png", 48, 48, 13);
        // missile configuration
        SpriteConfigs.missileSpriteInfo = new SpriteInfo("images/gameart/shot2.png", 10, 10, 9);
        // ship configuration
        SpriteConfigs.shipSpriteInfo = new SpriteInfo("images/gameart/double_ship.png", 90, 90, 30);
        // background image configuration
        SpriteConfigs.backgroundSpriteInfo = new SpriteInfo("images/gameart/nebula_blue.f2014.png", 800, 600);
        // debris field configuration
        SpriteConfigs.debrisFieldSpriteInfo = new SpriteInfo("images/gameart/debris2_blue.png", 640, 480);
        // splash screen configuration
        SpriteConfigs.splashSpriteInfo = new SpriteInfo("images/gameart/splash.png", 400, 300);
        return SpriteConfigs;
    })();
    GAME.SpriteConfigs = SpriteConfigs;
})(GAME || (GAME = {}));
//# sourceMappingURL=sprite-configs.js.map