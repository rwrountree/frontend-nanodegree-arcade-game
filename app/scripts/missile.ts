/**
 * Created by Rusty on 8/13/2015.
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";
  export class Missile implements IDrawable2d, ISimulationObject2d, IRadius, IAlive {
    public static BASE_VELOCITY: number = 8;
    public static LIFE_TIME: number = 30;
    private static WIDTH: number = 10;
    private static HEIGHT: number = 10;
    private static HALF_WIDTH: number = Missile.WIDTH / 2;
    private static HALF_HEIGHT: number = Missile.HEIGHT / 2;
    private static RADIUS: number = 3;

    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      context2d.save();
      context2d.translate(this.position.x, this.position.y);
      context2d.rotate(this.angle);
      var image: HTMLImageElement = GAME.Resources.instance.getImage("images/gameart/shot2.png");

      if (image) {
        context2d.drawImage(
          image,
          0,
          0,
          Missile.WIDTH,
          Missile.HEIGHT,
          -Missile.HALF_WIDTH,
          -Missile.HALF_HEIGHT,
          Missile.WIDTH,
          Missile.HEIGHT
        );
      }
      context2d .restore();
    };

    update: { (dt: number): void } = (dt: number) => {
      this._lifeTime -= 1; // dt;

      if (this._lifeTime <= 0) {
        this.alive = false;
        this._lifeTime = Missile.BASE_VELOCITY;
        return;
      }

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
    private _lifeTime: number;

    constructor() {
      this.position = new Vector2d(0, 0);
      this.velocity = new Vector2d(0, 0);
      this._angle = 0;
      this._angularVelocity = 0;
      this._lifeTime = Missile.LIFE_TIME;
      this._alive = false;
      this._radius = Missile.RADIUS;
    }

    resurrect(): void {
      this._alive = true;
      this._lifeTime = Missile.LIFE_TIME;
    }

    get alive(): boolean {
      return this._alive;
    }

    set alive(isAlive: boolean) {
      this._alive = isAlive;
    }

    get angle(): number {
      return this._angle;
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

    set radius(radius: number){
      this._radius = radius;
    }

    get lifeTime(): number{
      return this._lifeTime;
    }

    set lifeTime(lifeTime: number){
      this._lifeTime = lifeTime;
    }
  }
}
