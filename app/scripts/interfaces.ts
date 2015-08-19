/**
 * Created by Rusty on 8/15/2015.
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";

  export type NO_PARAMS_VOID_RETURN_FUNC = { (): void; };
  export type RENDER_FUNC = { (context: CanvasRenderingContext2D): void; };

  export interface IDrawable2d {
    render(context: CanvasRenderingContext2D): void;
  }

  export interface ISimulationObject2d {
    position: Vector2d;
    velocity: Vector2d;
    angle: number;
    angularVelocity: number;
    update(dt: number): void;
  }

  export interface IRadius {
    radius: number;
  }

  export interface ICollisionObject2d extends ISimulationObject2d, IRadius {
    //
  }

  export interface IAlive {
    alive: boolean;
  }

  export interface IAnimatedSprite extends IDrawable2d, IAlive {
    //
  }
}
