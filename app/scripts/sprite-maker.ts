/**
 * This is a collection of all the sprite types used in the game.
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

  /**
   * The base sprite class that all Sprites derive from
   */
  export class Sprite implements ISprite {
    position: Vector2d;
    visible: boolean;
    spriteInfo: SpriteInfo;
    active: boolean;

    /**
     * Sprite class constructor
     * @param spriteInfo
     * @param x
     * @param y
     * @param visible
     */
    constructor(spriteInfo: SpriteInfo, x: number, y: number, visible: boolean = true) {
      this.spriteInfo = spriteInfo;
      this.position = new Vector2d(x, y);
      this.visible = visible;
      this.active = true;
    }

    /**
     * This function must be overridden in a subclass if used
     * @param context2d
     */
    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      throw {
        error: "Sprite render() not implemented",
        message: "Implement render function in subclass"
      };
    };

    /**
     * This function must be overridden in a subclass if used
     */
    update: NO_PARAMS_VOID_RETURN_FUNC  = () => {
      throw {
        error: "Sprite update() not implemented",
        message: "Implement update function in subclass"
      };
    };
  }

  /**
   * Sprite class for animated effects
   */
  export class Effect extends Sprite implements IAnimated {
    animationInfo: AnimationInfo;
    spriteInfo: SpriteInfo;
    frame: number;
    tickCount: number;
    finished: boolean;

    /**
     * Effect class constructor
     * @param spriteInfo
     * @param animationInfo
     * @param x
     * @param y
     */
    constructor(spriteInfo: SpriteInfo, animationInfo: AnimationInfo, x: number, y: number) {
      super(spriteInfo, x, y, true);
      this.animationInfo = animationInfo;
      this.frame = 0;
      this.tickCount = -1;
      this.finished = false;
    }

    /**
     * Effect render function
     * @param context2d
     */
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

  /**
   * Background class for space nebula
   */
  export class  Background extends Sprite {
    /**
     * Background class constructor
     * @param spriteInfo
     * @param x
     * @param y
     */
    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
    }

    /**
     * Background render function
     * @param context2d
     */
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

  /**
   * Splash class for splash screen
   */
  export class Splash extends Sprite {
    /**
     * Splash constructor
     * @param spriteInfo
     * @param x
     * @param y
     */
    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
    }

    /**
     * Splash render function
     * @param context2d
     */
    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      context2d.save();
      var image: HTMLImageElement = GAME.Resources.instance.getImage(this.spriteInfo.url);

      if (image) {
        context2d.drawImage(
          image,
          0, 0,
          this.spriteInfo.width, this.spriteInfo.height,
          this.position.x - this.spriteInfo.halfWidth, this.position.y - this.spriteInfo.halfHeight,
          this.spriteInfo.width, this.spriteInfo.height
        );
      }
      context2d.restore();
    };
  }

  /**
   * DebrisField class for asteroid debris belt
   */
  export class DebrisField extends Sprite {
    /**
     * DebrisField constructor
     * @param spriteInfo
     * @param x
     * @param y
     */
    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
    }

    /**
     * DebrisField render function
     * @param context2d
     */
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

    /**
     * DebrisField update function
     */
    update: NO_PARAMS_VOID_RETURN_FUNC  = () => {
      this.position.x += 1;

      if (this.position.x >= GAME.SCREEN_WIDTH) {
        this.position.x -= GAME.SCREEN_WIDTH;
      }
    };
  }

  /**
   * SimulationObject class used for objects that utilize basic physics
   */
  export class SimulationObject extends Sprite {
    velocity: Vector2d;
    angle: number;
    angularVelocity: number;
    radius: number;

    /**
     * SimulationObject constructor
     * @param spriteInfo
     * @param x
     * @param y
     */
    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
      this.velocity = new Vector2d(0, 0);
      this.angle = 0;
      this.angularVelocity = 0;
      this.radius = spriteInfo.radius;
    }

    /**
     * wrap function used to make sure objects stay on screen
     */
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

    /**
     * SimulationObject render function
     * @param context2d
     */
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

    /**
     * update function to move objects
     * NOTE: There are preUpdate and postUpdate function calls that can be overridden
     * in a subclass to do processing before and after (Template Pattern)
     */
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

    /**
     * Called before position and angle have been updated
     * NOTE: Override this in a subclass if needed
     */
    preUpdate: NO_PARAMS_VOID_RETURN_FUNC = () => {
      // no op
    };

    /**
     * Called after position and angle have been updated
     * NOTE: Override this in a subclass if needed
     */
    postUpdate: NO_PARAMS_VOID_RETURN_FUNC = () => {
      // no op
    };
  }

  /**
   * Missile class
   */
  export class Missile extends SimulationObject{
    /**
     * Overridden function that processes how many ticks until it deactivates
     */
    preUpdate: NO_PARAMS_VOID_RETURN_FUNC = () => {
      this.ticksToLive -= 1;

      if (this.ticksToLive <= 0) {
        this.active = false;
        this.visible = false;
        return;
      }
    };

    private ticksToLive: number;

    /**
     * Missile class constructor
     * @param spriteInfo
     * @param x
     * @param y
     */
    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
      this.ticksToLive = 60;
    }
  }

  /**
   * Asteroid class
   */
  export class Asteroid extends SimulationObject implements IAnimated {
    animationInfo: AnimationInfo;
    frame: number;
    tickCount: number;
    finished: boolean;
    damage: number;
    points: number;

    /**
     * Asteroid render function
     * @param context2d
     */
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

    /**
     * Asteroid class constructor
     * @param spriteInfo
     * @param animationInfo
     * @param x
     * @param y
     * @param damage
     * @param points
     */
    constructor(spriteInfo: SpriteInfo, animationInfo: AnimationInfo, x: number, y: number, damage: number, points: number) {
      super(spriteInfo, x, y);
      this.animationInfo = animationInfo;
      this.frame = 0;
      this.tickCount = -1;
      this.finished = false;
      this.damage = damage;
      this.points = points;
    }
  }

  /**
   * Ship class that represents the player in the game
   */
  export class Ship extends SimulationObject {
    /**
     * Ship render function
     * @param context2d
     */
    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      var image: HTMLImageElement = GAME.Resources.instance.getImage(this.spriteInfo.url);

      context2d.save();
      context2d.translate(this.position.x, this.position.y);
      context2d.rotate(this.angle);
      if (image) {
        context2d.drawImage(
          image,
          // if thrusting, use the 2nd frame in the ship image
          (this.thrusting ? this.spriteInfo.width : 0), 0,
          this.spriteInfo.width, this.spriteInfo.height,
          -this.spriteInfo.halfWidth, -this.spriteInfo.halfHeight,
          this.spriteInfo.width, this.spriteInfo.height
        );
      }
      context2d.restore();
    };

    /**
     * Adjusts velocity and acceleration
     */
    postUpdate: NO_PARAMS_VOID_RETURN_FUNC = () => {
      var acceleration: Vector2d;

      /**
       * Calculate velocity when thrusting using an acceleration clamp to limit
       * maximum velocity
       */
      if (this.thrusting) {
        acceleration = Vector2d.angleToVector2d(this.angle);
        this.velocity.x += acceleration.x * this.accelerationClamp;
        this.velocity.y += acceleration.y * this.accelerationClamp;
      }

      /**
       * Apply friction (not realistic in space!) so the ship will slowly come
       * to a stop when not thrusting
       */
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;
    };

    thrusting: boolean;
    maxShields: number;
    score: number;
    private _shields: number;
    private accelerationClamp: number = 0.3; // acceleration limiter
    private friction: number = 0.95; // friction used to slow ship down

    /**
     * Ship class constructor
     * @param spriteInfo
     * @param x
     * @param y
     */
    constructor(spriteInfo: SpriteInfo, x: number, y: number) {
      super(spriteInfo, x, y);
      this.thrusting = false;
      this.maxShields = 100;
      this._shields = this.maxShields;
      this.score = 0;
      this.angle = Math.PI * (3 / 2);
    }

    /**
     * Gets the number of hit points remaining in the shield
     * @returns {number}
     */
    get shields(): number{
      return this._shields;
    }

    /**
     * Sets the number of hit points for the shield
     * @param value
     */
    set shields(value: number){
      this._shields = value;
      if (this._shields < 0) {
        this._shields = 0;
      }
    }

    /**
     * Retrieves the percentage left for the shield
     * @returns {number}
     */
    getShieldPercentage(): number {
      return this.shields / this.maxShields;
    }
  }

  /**
   * SpriteMaker class is used as a sprite factory (Factory Pattern)
   * All sprites in the game are generated through this class
   */
  export class SpriteMaker {
    static getSprite(what: string, x: number, y: number): any {
      switch (what) {
        case "asteroid-small":
          return new Asteroid(
            SpriteConfigs.asteroidSmallSpriteInfo,
            SpriteConfigs.asteroidAnimationInfo,
            x, y,
            2, 300);
        case "asteroid-medium":
          return new Asteroid(
            SpriteConfigs.asteroidMediumSpriteInfo,
            SpriteConfigs.asteroidAnimationInfo,
            x, y,
            4, 200);
        case "asteroid-large":
          return new Asteroid(
            SpriteConfigs.asteroidLargeSpriteInfo,
            SpriteConfigs.asteroidAnimationInfo,
            x, y,
            6, 100);
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
        case "splash":
          return new Splash(SpriteConfigs.splashSpriteInfo, x, y);
        default:
          throw {
            error: "Invalid Sprite Type",
            message: "No such sprite type exists"
          };
      }
    }
  }
}
