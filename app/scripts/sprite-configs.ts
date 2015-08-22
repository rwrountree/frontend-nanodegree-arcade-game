/**
 * This is a collection of all the sprite configurations used in the game
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";
  /**
   * AnimationInfo class is used to describe animation speed and frame count
   */
  export class AnimationInfo {
    animationSpeed: number;
    numberOfFrames: number;

    /**
     * AnimationInfo class constructor
     * @param animationSpeed
     * @param numberOfFrames
     */
    constructor(animationSpeed: number, numberOfFrames: number) {
      this.animationSpeed = animationSpeed;
      this.numberOfFrames = numberOfFrames;
    }
  }

  /**
   * SpriteInfo class is used to describe source, dimensions, and radius
   * NOTE: Radius is used for simulation objects during collision detection
   */
  export class SpriteInfo {
    url: string;
    width: number;
    height: number;
    halfHeight: number;
    halfWidth: number;
    radius: number;

    /**
     * SpriteInfo class constructor
     * @param url
     * @param width
     * @param height
     * @param radius
     */
    constructor(url: string, width: number, height: number, radius: number = 0) {
      this.url = url;
      this.width = width;
      this.height = height;
      this.halfWidth = this.width / 2;
      this.halfHeight = this.height / 2;
      this.radius = radius;
    }
  }

  /**
   * SpriteConfigs class contains the predefined attributes for the various sprites
   * in the game. SpriteMaker uses these to create the appropriate sprite.
   */
  export class SpriteConfigs {
    // explosion effect configurations
    public static explosionAnimationInfo: AnimationInfo = new AnimationInfo(1, 64);
    public static explosionSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/explosion.hasgraphics.png", 100, 100);

    // shield damage effect configurations
    public static shieldDamageAnimationInfo: AnimationInfo = new AnimationInfo(2, 24);
    public static shieldDamageSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/explosion_alpha.png", 128, 128);

    // asteroid configurations for small, medium, and large sizes
    public static asteroidAnimationInfo: AnimationInfo = new AnimationInfo(3, 24);
    public static asteroidLargeSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/asteroid_large_animated.png", 96, 96, 26);
    public static asteroidMediumSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/asteroid_medium_animated.png", 72, 72, 17);
    public static asteroidSmallSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/asteroid_small_animated.png", 48, 48, 13);

    // missile configuration
    public static missileSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/shot2.png", 10, 10, 9);

    // ship configuration
    public static shipSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/double_ship.png", 90, 90, 30);

    // background image configuration
    public static backgroundSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/nebula_blue.f2014.png", 800, 600);

    // debris field configuration
    public static debrisFieldSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/debris2_blue.png", 640, 480);

    // splash screen configuration
    public static splashSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/splash.png", 400, 300);
  }
}
