/**
 * Created by Rusty on 8/13/2015.
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";

  enum allowedKeys {
    space = 32,
    left = 37,
    up = 38,
    right = 39,
    down = 40
  }

  export class Player implements IDrawable2d, ISimulationObject2d, IRadius, IAlive{
    private static ACCELERATION_CLAMP: number = 0.3;
    private static FRICTION: number = 0.95;
    private static ANGULAR_VELOCITY: number = 0.09;
    private static RADIUS: number = 35;
    private static WIDTH: number = 90;
    private static HEIGHT: number = 90;
    private static HALF_WIDTH: number = Player.WIDTH / 2;
    private static HALF_HEIGHT: number = Player.HEIGHT / 2;

    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      var image: HTMLImageElement = GAME.Resources.instance.getImage("images/gameart/double_ship.png");

      context2d.save();
      context2d.translate(this.position.x, this.position.y);
      context2d.rotate(this._angle);
      if (image) {
        context2d.drawImage(
          image,
          (this._isThrusting ? Player.WIDTH : 0),
          0,
          Player.WIDTH,
          Player.HEIGHT,
          -Player.HALF_WIDTH,
          -Player.HALF_HEIGHT,
          Player.WIDTH,
          Player.HEIGHT
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

      if (this._isThrusting) {
        var acceleration: Vector2d = Vector2d.angleToVector2d(this._angle);
        this.velocity.x += acceleration.x * Player.ACCELERATION_CLAMP; // * dt;
        this.velocity.y += acceleration.y * Player.ACCELERATION_CLAMP; // * dt;
      }

      this.velocity.x *= Player.FRICTION;
      this.velocity.y *= Player.FRICTION;
    };

    handleInput: any = (keyBoardEvent: KeyboardEvent) => {
      var eventType: string = keyBoardEvent.type.toString();
      var keyCode: number = keyBoardEvent.keyCode;

      if (eventType === "keydown") {
        switch (allowedKeys[keyCode]) {
          case "left":
            this.setAngularVelocity(-Player.ANGULAR_VELOCITY);
            break;
          case "right":
            this.setAngularVelocity(Player.ANGULAR_VELOCITY);
            break;
          case "up":
            if (!this._isThrusting) {
              this.setThrust(true);
            }
            break;
          default:
        }
      }

      if (eventType === "keyup") {
        switch (allowedKeys[keyCode]) {
          case "left":
          case "right":
            this.setAngularVelocity(0);
            break;
          case "up":
            this.setThrust(false);
            break;
          case "space":
            this.shootMissile();
            break;
          default:
        }
      }
    };

    createMissiles: NO_PARAMS_VOID_RETURN_FUNC = () => {
      for (var index: number = 0; index < 10; index++) {
        this._missiles.push(new Missile());
      }
    };

    public position: Vector2d;
    public velocity: Vector2d;
    private _alive: boolean;
    private _angle: number;
    private _angularVelocity: number;
    private _radius: number;
    private _isThrusting: boolean;
    private _missiles: Array<Missile> = [];
    private _score: number;
    private _lives: number;
    private _thrustSound: HTMLAudioElement;

    constructor() {
      this.position = new Vector2d(0, 0);
      this.velocity = new Vector2d(0, 0);
      this._angle = 0;
      this._angularVelocity = 0;
      this._radius = Player.RADIUS;
      this._isThrusting = false;
      this._score = 0;
      this._lives = 0;
      this.createMissiles();
      this._thrustSound = new Audio("audio/thrust.mp3");
      this._thrustSound.loop = true;
      this._alive = true;
    }

    get missiles(): Array<GAME.Missile>{
      return this._missiles;
    }

    set missiles(missiles: Array<GAME.Missile>){
      this._missiles = missiles;
    }

    private setAngularVelocity(angularVelocity: number): void {
      this._angularVelocity = angularVelocity;
    }

    private setThrust(onOrOff: boolean): void {
      this._isThrusting = onOrOff;
      if (this._isThrusting) {
        this._thrustSound.currentTime = 0;
        this._thrustSound.play();
      } else {
        this._thrustSound.pause();
      }
    }

    private getAvailableMissile(): Missile {
      var index: number = 0,
          length: number = this._missiles.length;
      for (; index < length; index++) {
        if (!this._missiles[index].alive) {
          return this._missiles[index];
        }
      }
      return null;
    };

    private shootMissile(): void {
      var missile: Missile = this.getAvailableMissile(),
          forwardVector2d: Vector2d,
          missileSound: HTMLAudioElement;

      if (!missile) {
        return;
      }

      forwardVector2d = Vector2d.angleToVector2d(this._angle);
      missile.position.set(this.position.x + this._radius * forwardVector2d.x,
                           this.position.y + this._radius * forwardVector2d.y);
      missile.velocity.set(this.velocity.x + Missile.BASE_VELOCITY * forwardVector2d.x,
                           this.velocity.y + Missile.BASE_VELOCITY * forwardVector2d.y);
      missile.angle = this._angle;
      missile.resurrect();

      missileSound = new Audio("audio/missile.mp3");
      missileSound.play();
    }

    get lives(): number {
      return this._lives;
    }

    set lives(value: number) {
      this._lives = value;
    }

    get score(): number {
      return this._score;
    }

    set score(value: number) {
      this._score = value;
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

    get alive(): boolean{
      return this._alive;
    }

    set alive(isAlive: boolean){
      this._alive = isAlive;
    }

    get isThrusting(): boolean{
      return this._isThrusting;
    }

    set isThrusting(isThrusting: boolean){
      this._isThrusting = isThrusting;
    }
  }
}
