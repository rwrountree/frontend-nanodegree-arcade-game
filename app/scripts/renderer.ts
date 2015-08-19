/**
 * Created by Rusty on 8/13/2015.
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";
  /* This is a Singleton that represents the Renderer class. Only one instance
   * of Renderer can exist.
   */
  export class Renderer {
    private static ERROR_DO_NOT_CALL_CONSTRUCTOR: string =
      "Error: Instantiation failed: Use Resources.instance instead of new.";

    private static _instance: Renderer = null;

    pushRenderFunction: { (renderFunc: RENDER_FUNC): void } = (renderFunc: RENDER_FUNC) => {
      this._renderFunctionList.push(renderFunc);
    };

    render: NO_PARAMS_VOID_RETURN_FUNC = () => {
      // this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
      // this._context.save();
      this._renderFunctionList.forEach((renderFunc: RENDER_FUNC): void => {
        renderFunc(this._context);
      });
      // this._context.restore();
    };

    private _renderFunctionList: Array<RENDER_FUNC> = [];
    private _context: CanvasRenderingContext2D = null;
    private _canvas: HTMLCanvasElement = null;

    constructor() {
      if (Renderer._instance) {
        throw new Error(Renderer.ERROR_DO_NOT_CALL_CONSTRUCTOR);
      }

      Renderer._instance = this;
    }

    static get instance(): Renderer {
      if (Renderer._instance === null) {
        Renderer._instance = new Renderer();
      }

      return Renderer._instance;
    }

    setContext(context: CanvasRenderingContext2D): void {
      this._context = context;
    }

    setCanvas(canvas: HTMLCanvasElement): void {
      this._canvas = canvas;
    }

    flush(): void {
      this._renderFunctionList = [];
    }
  }
}
