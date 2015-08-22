/**
 * Created by Rusty on 8/20/2015.
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";
  export class AnimationInfo {
    animationSpeed: number;
    numberOfFrames: number;

    constructor(animationSpeed: number, numberOfFrames: number) {
      this.animationSpeed = animationSpeed;
      this.numberOfFrames = numberOfFrames;
    }
  }

  export class SpriteInfo {
    url: string;
    width: number;
    height: number;
    halfHeight: number;
    halfWidth: number;
    radius: number;

    // constructor(url: string, x: number, y: number, width: number, height: number) {
    constructor(url: string, width: number, height: number, radius: number = 0) {
      this.url = url;
      // this.position = new Vector2d(x, y);
      this.width = width;
      this.height = height;
      this.halfWidth = this.width / 2;
      this.halfHeight = this.height / 2;
      this.radius = radius;
    }
  }

  export class SpriteConfigs {
    public static explosionAnimationInfo: AnimationInfo = new AnimationInfo(1, 64);
    public static explosionSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/explosion.hasgraphics.png", 100, 100);

    public static shieldDamageAnimationInfo: AnimationInfo = new AnimationInfo(2, 24);
    public static shieldDamageSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/explosion_alpha.png", 128, 128);

    public static asteroidAnimationInfo: AnimationInfo = new AnimationInfo(3, 24);
    public static asteroidLargeSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/asteroid_large_animated.png", 96, 96, 26);
    public static asteroidMediumSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/asteroid_medium_animated.png", 72, 72, 17);
    public static asteroidSmallSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/asteroid_small_animated.png", 48, 48, 13);

    public static missileSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/shot2.png", 10, 10, 9);

    public static shipSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/double_ship.png", 90, 90, 30);

    public static backgroundSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/nebula_blue.f2014.png", 800, 600);

    public static debrisFieldSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/debris2_blue.png", 640, 480);

    public static splashSpriteInfo: SpriteInfo = new SpriteInfo(
      "images/gameart/splash.png", 400, 300);
  }
}
