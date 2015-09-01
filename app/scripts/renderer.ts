/**
 * This is the Render object that is used to manage draw calls
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

    /**
     * Render functions from sprites are pushed into an array to create a list of
     * render commands
     * @param renderFunc
     */
    pushRenderFunction: { (renderFunc: RENDER_FUNC): void } = (renderFunc: RENDER_FUNC) => {
      this.renderFunctionList.push(renderFunc);
    };

    /**
     * Runs through all the render calls that have been pushed to the list
     */
    render: NO_PARAMS_VOID_RETURN_FUNC = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderFunctionList.forEach((renderFunc: RENDER_FUNC): void => {
        renderFunc(this.context);
      });
    };

    private renderFunctionList: Array<RENDER_FUNC> = [];
    private context: CanvasRenderingContext2D = null;
    private canvas: HTMLCanvasElement = null;

    /**
     * Renderer constructor
     * NOTE: Do not call this directly. Use the instance property.
     */
    constructor() {
      if (Renderer._instance) {
        throw new Error(Renderer.ERROR_DO_NOT_CALL_CONSTRUCTOR);
      }

      Renderer._instance = this;
    }

    /**
     * Retrieves the single instance of the Renderer
     * @returns {Renderer}
     */
    static get instance(): Renderer {
      if (Renderer._instance === null) {
        Renderer._instance = new Renderer();
      }

      return Renderer._instance;
    }

    setContext(context: CanvasRenderingContext2D): void {
      this.context = context;
    }

    setCanvas(canvas: HTMLCanvasElement): void {
      this.canvas = canvas;
    }

    flush(): void {
      this.renderFunctionList = [];
    }
  }
}
