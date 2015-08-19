/**
 * Created by Rusty on 8/13/2015.
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";
  export enum AsteroidCategory {
    SMALL,
    MEDIUM,
    LARGE
  }

  export class AsteroidConfig {
    get category(): GAME.AsteroidCategory {
      return this._category;
    }

    set category(value: GAME.AsteroidCategory) {
      this._category = value;
    }

    get width(): number {
      return this._width;
    }

    set width(value: number) {
      this._width = value;
    }

    get height(): number {
      return this._height;
    }

    set height(value: number) {
      this._height = value;
    }

    get halfWidth(): number {
      return this._halfWidth;
    }

    set halfWidth(value: number) {
      this._halfWidth = value;
    }

    get halfHeight(): number {
      return this._halfHeight;
    }

    set halfHeight(value: number) {
      this._halfHeight = value;
    }

    get radius(): number {
      return this._radius;
    }

    set radius(value: number) {
      this._radius = value;
    }

    constructor(width: number, height: number, radius: number, category: AsteroidCategory) {
      this._width = width;
      this._height = height;
      this._halfWidth = width / 2;
      this._halfHeight = height / 2;
      this._radius = radius;
      this._category = category;
    }
    private _width: number;
    private _height: number;
    private _halfWidth: number;
    private _halfHeight: number;
    private _radius: number;
    private _category: AsteroidCategory;
  }

  export class Asteroid implements IDrawable2d, ISimulationObject2d, IRadius, IAlive {
    public static DEFAULT_WIDTH: number = 90;
    public static DEFAULT_HEIGHT: number = 90;
    public static DEFAULT_RADIUS: number = 40;

    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      var asteroidConfig: AsteroidConfig = this.asteroidConfig,
          image: HTMLImageElement;
      context2d.save();
      context2d.translate(this.position.x, this.position.y);
      context2d.rotate(this._angle);

      if (this.asteroidCategory === AsteroidCategory.LARGE) {
        image = GAME.Resources.instance.getImage("images/gameart/asteroid_blue.png");
      } else if (this.asteroidCategory === AsteroidCategory.MEDIUM) {
        image = GAME.Resources.instance.getImage("images/gameart/asteroid_blue_medium.png");
      } else {
        image = GAME.Resources.instance.getImage("images/gameart/asteroid_blue_small.png");
      }

      if (image) {
        context2d.drawImage(
          image,
          0,
          0,
          asteroidConfig.width,
          asteroidConfig.height,
          -asteroidConfig.halfWidth,
          -asteroidConfig.halfHeight,
          asteroidConfig.width,
          asteroidConfig.height
        );
      }
      context2d.restore();
    };

    update: { (dt: number): void } = (dt: number) => {
      // update angle
      this._angle += this._angularVelocity; // * dt;

      this.position.x += this.velocity.x; // * dt;
      this.position.y += this.velocity.y; // * dt;

      if (this.position.x < 0) {
        this.position.x = GAME.SCREEN_WIDTH - this.position.x;
      } else if (this.position.x > GAME.SCREEN_WIDTH) {
        this.position.x = this.position.x - GAME.SCREEN_WIDTH;
      }

      if (this.position.y < 0) {
        this.position.y = GAME.SCREEN_HEIGHT - this.position.y;
      } else if (this.position.y > GAME.SCREEN_HEIGHT) {
        this.position.y = this.position.y - GAME.SCREEN_HEIGHT;
      }
    };

    public position: Vector2d;
    public velocity: Vector2d;

    private _angle: number;
    private _angularVelocity: number;
    private _radius: number;
    private _alive: boolean;
    private _asteroidCategory: AsteroidCategory;
    private _asteroidConfig: AsteroidConfig;

    constructor(asteroidConfig: AsteroidConfig) {
      this.position = new Vector2d(0, 0);
      this.velocity = new Vector2d(0, 0);
      this._angle = 0;
      this._angularVelocity = 0;
      this._radius = Asteroid.DEFAULT_RADIUS;
      this._alive = true;
      this._asteroidCategory = AsteroidCategory.LARGE;
      this._asteroidConfig = asteroidConfig;
    }

    set angle(angle: number) {
      this._angle = angle;
    }

    get angularVelocity(): number{
      return this._angularVelocity;
    }

    set angularVelocity(angularVelocity: number){
      this._angularVelocity = angularVelocity;
    }

    get radius(): number{
      return this._radius;
    }

    set radius(radius: number) {
      this._radius = radius;
    }

    get alive(): boolean{
      return this._alive;
    }

    set alive(isAlive: boolean){
      this._alive = isAlive;
    }

    get asteroidCategory(): GAME.AsteroidCategory {
      return this._asteroidCategory;
    }

    set asteroidCategory(asteroidSize: GAME.AsteroidCategory) {
      this._asteroidCategory = asteroidSize;
    }

    get asteroidConfig(): GAME.AsteroidConfig{
      return this._asteroidConfig;
    }

    set asteroidConfig(asteroidConfig: GAME.AsteroidConfig){
      this._asteroidConfig = asteroidConfig;
      this._radius = asteroidConfig.radius;
      this._asteroidCategory = asteroidConfig.category;
    }
  }

  export var LargeAsteroidConfig: AsteroidConfig =
    new AsteroidConfig(
      Asteroid.DEFAULT_WIDTH,
      Asteroid.DEFAULT_HEIGHT,
      Asteroid.DEFAULT_RADIUS,
      AsteroidCategory.LARGE);

  export var MediumAsteroidConfig: AsteroidConfig =
    new AsteroidConfig(
      Asteroid.DEFAULT_WIDTH * 0.75,
      Asteroid.DEFAULT_HEIGHT * 0.75,
      Asteroid.DEFAULT_RADIUS * 0.75,
      AsteroidCategory.MEDIUM);

  export var SmallAsteroidConfig: AsteroidConfig =
    new AsteroidConfig(
      Asteroid.DEFAULT_WIDTH * 0.5,
      Asteroid.DEFAULT_HEIGHT * 0.5,
      Asteroid.DEFAULT_RADIUS * 0.5,
      AsteroidCategory.SMALL);
}
