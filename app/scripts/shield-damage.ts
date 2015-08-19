/**
 * Created by Rusty on 8/18/2015.
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";
  export class ShieldDamage implements IAnimatedSprite {
    private static ANIMATION_SPEED: number = 1 ;
    private static NUM_FRAMES: number = 24;
    // private static SPRITE_SHEET_WIDTH: number = 900;
    // private static SPRITE_SHEET_HEIGHT: number = 900;
    private static WIDTH: number = 128;
    private static HEIGHT: number = 128;
    private static HALF_WIDTH: number = ShieldDamage.WIDTH / 2;
    private static HALF_HEIGHT: number = ShieldDamage.HEIGHT / 2;

    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      var image: HTMLImageElement = GAME.Resources.instance.getImage("images/gameart/explosion_alpha.png"),
        xOffset: number,
        yOffset: number;

      if (this._currentFrame === ShieldDamage.NUM_FRAMES) {
        this._alive = false;
        return;
      }

      this._currentTickCount += 1;
      if (this._currentTickCount % ShieldDamage.ANIMATION_SPEED === 0) {
        this._currentFrame += 1;
      }

      yOffset = 0; // nMath.floor(this._currentFrame / 9) * ShieldDamage.HEIGHT;
      xOffset = (this._currentFrame % 24) * ShieldDamage.WIDTH;

      context2d.save();
      context2d.translate(this.position.x, this.position.y);
      if (image) {
        context2d.drawImage(
          image,
          xOffset,
          yOffset,
          ShieldDamage.WIDTH,
          ShieldDamage.HEIGHT,
          -ShieldDamage.HALF_WIDTH,
          -ShieldDamage.HALF_HEIGHT,
          ShieldDamage.WIDTH,
          ShieldDamage.HEIGHT
        );
      }
      context2d.restore();
    };

    public position: Vector2d;

    private _alive: boolean;
    private _currentFrame: number;
    private _currentTickCount: number;

    public constructor(x: number, y: number) {
      this.position = new Vector2d(0, 0);
      this.alive = true;
      this._currentTickCount = -1;
      this._currentFrame = 0;
      this.position.set(x, y);
    }

    get alive(): boolean{
      return this._alive;
    }

    set alive(isAlive: boolean){
      this._alive = isAlive;
    }
  }
}
