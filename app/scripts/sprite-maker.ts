/**
 * Created by Rusty on 8/20/2015.
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";
  export type NO_PARAMS_VOID_RETURN_FUNC = { (): void; };
  export type RENDER_FUNC = { (context: CanvasRenderingContext2D): void; };

  export interface ISprite {
    position: Vector2d;
    visible: boolean;
    spriteInfo: SpriteInfo;
    active: boolean;
    render: RENDER_FUNC;
    update: NO_PARAMS_VOID_RETURN_FUNC;
  }

  export interface IAnimated extends ISprite {
    animationInfo: AnimationInfo;
    frame: number;
    tickCount: number;
    finished: boolean;
  }

  export class Sprite implements ISprite {
    public position: Vector2d;
    visible: boolean;
    spriteInfo: SpriteInfo;
    active: boolean;

    constructor(spriteInfo: SpriteInfo, x: number, y: number, visible: boolean = true) {
      this.spriteInfo = spriteInfo;
      this.position = new Vector2d(x, y);
      this.visible = visible;
      this.active = true;
    }

    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      throw {
        error: "Sprite render() not implemented",
        message: "Implement render function in subclass"
      };
    };

    update: NO_PARAMS_VOID_RETURN_FUNC  = () => {
      throw {
        error: "Sprite update() not implemented",
        message: "Implement update function in subclass"
      };
    };
  }

  export class Effect extends Sprite implements IAnimated {
    animationInfo: AnimationInfo;
    spriteInfo: SpriteInfo;
    frame: number;
    tickCount: number;
    finished: boolean;

    constructor(spriteInfo: SpriteInfo, animationInfo: AnimationInfo, x: number, y: number) {
      super(spriteInfo, x, y, true);
      this.animationInfo = animationInfo;
      this.frame = 0;
      this.tickCount = -1;
      this.finished = false;
    }

    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      var image: HTMLImageElement = GAME.Resources.instance.getImage(this.spriteInfo.url),
        xOffset: number,
        yOffset: number;

      if (!this.visible) {
        return;
      }

      if (this.frame === this.animationInfo.numberOfFrames) {
        this.finished = true;
        this.visible = false;
        return;
      }

      this.tickCount += 1;
      if (this.tickCount % this.animationInfo.animationSpeed === 0) {
        this.frame += 1;
      }

      xOffset = (this.frame % 9) * this.spriteInfo.width;
      yOffset = Math.floor(this.frame / 9) * this.spriteInfo.height;

      context2d.save();
      context2d.translate(this.position.x, this.position.y);
      if (image) {
        context2d.drawImage(
          image,
          xOffset, yOffset,
          this.spriteInfo.width, this.spriteInfo.height,
          -this.spriteInfo.halfWidth, -this.spriteInfo.halfHeight,
          this.spriteInfo.width, this.spriteInfo.height
        );
      }
      context2d.restore();
    };
  }

  export class  Background extends Sprite {
    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
    }
    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      context2d.save();
      var image: HTMLImageElement = GAME.Resources.instance.getImage(this.spriteInfo.url);

      if (image) {
        context2d.drawImage(
          image,
          0, 0,
          this.spriteInfo.width, this.spriteInfo.height,
          0, 0,
          GAME.SCREEN_WIDTH, GAME.SCREEN_HEIGHT
        );
      }
      context2d.restore();
    };
  }

  export class DebrisField extends Sprite {
    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
    }
    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      var image: HTMLImageElement = GAME.Resources.instance.getImage(this.spriteInfo.url),
          repeat: number = 2,
          xOffset: number = this.position.x;

      if (image) {
        while (repeat > 0) {
          context2d.save();
          context2d.translate(xOffset, this.position.y);
          context2d.drawImage(
              image,
              0, 0,
              this.spriteInfo.width,
              this.spriteInfo.height,
              0, 0,
              GAME.SCREEN_WIDTH, GAME.SCREEN_HEIGHT
            );
          context2d.restore();
          xOffset -= GAME.SCREEN_WIDTH;
          repeat -= 1;
        }
      }
    };

    update: NO_PARAMS_VOID_RETURN_FUNC  = () => {
      this.position.x += 1;

      if (this.position.x >= GAME.SCREEN_WIDTH) {
        this.position.x -= GAME.SCREEN_WIDTH;
      }
    };
  }

  export class SimulationObject extends Sprite {
    velocity: Vector2d;
    angle: number;
    angularVelocity: number;
    radius: number;

    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
      this.velocity = new Vector2d(0, 0);
      this.angle = 0;
      this.angularVelocity = 0;
      this.radius = spriteInfo.radius;
    }

    wrap: NO_PARAMS_VOID_RETURN_FUNC = () => {
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

    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      if (!this.visible) {
        return;
      }

      context2d.save();
      context2d.translate(this.position.x, this.position.y);
      context2d.rotate(this.angle);
      var image: HTMLImageElement = GAME.Resources.instance.getImage(this.spriteInfo.url);

      if (image) {
        context2d.drawImage(
          image,
          0, 0,
          this.spriteInfo.width, this.spriteInfo.height,
          -this.spriteInfo.halfWidth, -this.spriteInfo.halfHeight,
          this.spriteInfo.width, this.spriteInfo.height
        );
      }
      context2d .restore();
    };

    update: NO_PARAMS_VOID_RETURN_FUNC  = () => {
      this.preUpdate();

      if (!this.active) {
        return;
      }

      this.angle += this.angularVelocity;

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      this.wrap();

      this.postUpdate();
    };

    preUpdate: NO_PARAMS_VOID_RETURN_FUNC = () => {
      // no op
    };
    postUpdate: NO_PARAMS_VOID_RETURN_FUNC = () => {
      // no op
    };
  }

  export class Missile extends SimulationObject{
    preUpdate: NO_PARAMS_VOID_RETURN_FUNC = () => {
      this.ticksToLive -= 1;

      if (this.ticksToLive <= 0) {
        this.active = false;
        this.visible = false;
        return;
      }
    };

    private ticksToLive: number;

    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
      this.ticksToLive = 60;
    }
  }

  export class Asteroid extends SimulationObject implements IAnimated {
    animationInfo: AnimationInfo;
    frame: number;
    tickCount: number;
    finished: boolean;

    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      var image: HTMLImageElement = GAME.Resources.instance.getImage(this.spriteInfo.url),
        xOffset: number,
        yOffset: number;

      if (!this.visible) {
        return;
      }

      if (this.frame === this.animationInfo.numberOfFrames) {
        this.frame = 0;
      }

      this.tickCount += 1;
      if (this.tickCount % this.animationInfo.animationSpeed === 0) {
        this.frame += 1;
      }

      xOffset = (this.frame % 9) * this.spriteInfo.width;
      yOffset = 0;

      context2d.save();
      context2d.translate(this.position.x, this.position.y);
      if (image) {
        context2d.drawImage(
          image,
          xOffset, yOffset,
          this.spriteInfo.width, this.spriteInfo.height,
          -this.spriteInfo.halfWidth, -this.spriteInfo.halfHeight,
          this.spriteInfo.width, this.spriteInfo.height
        );
      }
      context2d.restore();
    };

    constructor(spriteInfo: SpriteInfo, animationInfo: AnimationInfo, x: number, y: number) {
      super(spriteInfo, x, y);
      this.animationInfo = animationInfo;
      this.frame = 0;
      this.tickCount = -1;
      this.finished = false;
    }
  }

  export class Ship extends SimulationObject {
    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      var image: HTMLImageElement = GAME.Resources.instance.getImage(this.spriteInfo.url);

      context2d.save();
      context2d.translate(this.position.x, this.position.y);
      context2d.rotate(this.angle);
      if (image) {
        context2d.drawImage(
          image,
          (this.thrusting ? this.spriteInfo.width : 0), 0,
          this.spriteInfo.width, this.spriteInfo.height,
          -this.spriteInfo.halfWidth, -this.spriteInfo.halfHeight,
          this.spriteInfo.width, this.spriteInfo.height
        );
      }
      context2d.restore();
    };

    postUpdate: NO_PARAMS_VOID_RETURN_FUNC = () => {
      var acceleration: Vector2d;

      if (this.thrusting) {
        acceleration = Vector2d.angleToVector2d(this.angle);
        this.velocity.x += acceleration.x * this.accelerationClamp;
        this.velocity.y += acceleration.y * this.accelerationClamp;
      }

      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;
    };

    public thrusting: boolean;
    private accelerationClamp: number = 0.3;
    private friction: number = 0.95;

    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
      this.thrusting = false;
    }
  }

  export class SpriteMaker {
    static getSprite(what: string, x: number, y: number): any {
      switch (what) {
        case "asteroid-small":
          return new Asteroid(
            SpriteConfigs.asteroidSmallSpriteInfo,
            SpriteConfigs.asteroidAnimationInfo,
            x, y);
        case "asteroid-medium":
          return new Asteroid(
            SpriteConfigs.asteroidMediumSpriteInfo,
            SpriteConfigs.asteroidAnimationInfo,
            x, y);
        case "asteroid-large":
          return new Asteroid(
            SpriteConfigs.asteroidLargeSpriteInfo,
            SpriteConfigs.asteroidAnimationInfo,
            x, y);
        case "missile":
          return new Missile(SpriteConfigs.missileSpriteInfo, x, y);
        case "ship":
          return new Ship(SpriteConfigs.shipSpriteInfo, x, y);
        case "explosion":
          return new Effect(
            SpriteConfigs.explosionSpriteInfo,
            SpriteConfigs.explosionAnimationInfo,
            x, y );
        case "shield-damage":
          return new Effect(
            SpriteConfigs.shieldDamageSpriteInfo,
            SpriteConfigs.shieldDamageAnimationInfo,
            x, y);
        case "background":
          return new Background(SpriteConfigs.backgroundSpriteInfo, x, y);
        case "debris-field":
          return new DebrisField(SpriteConfigs.debrisFieldSpriteInfo, x, y);
        default:
          throw {
            error: "Invalid Sprite Type",
            message: "No such sprite type exists"
          };
      }
    }
  }
}
