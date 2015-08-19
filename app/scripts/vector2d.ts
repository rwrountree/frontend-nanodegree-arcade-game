/**
 * Created by Rusty on 8/14/2015.
 */

module GAME {
  "use strict";
  export class Vector2d {
    private _x: number;
    private _y: number;

    public static angleToVector2d(angle: number): Vector2d {
      return new Vector2d(Math.cos(angle), Math.sin(angle));
    }

    public static distance(p: Vector2d, q: Vector2d): number {
      return Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2));
    }

    constructor(x: number, y: number) {
      this._x = x;
      this._y = y;
    }

    public set(x: number, y: number): void {
      this._x = x;
      this._y = y;
    }

    get x(): number {
      return this._x;
    }

    set x(x: number) {
      this._x = x;
    }

    get y(): number {
      return this._y;
    }

    set y(y: number) {
      this._y = y;
    }
  }
}
