/**
 * Created by Rusty on 8/13/2015.
 */

/// <reference path='includes'/>

module GAME {
  "use strict";
  export class Background  implements IDrawable2d {
    private static WIDTH: number = 800;
    private static HEIGHT: number = 600;

    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      context2d.save();
      var image: HTMLImageElement = GAME.Resources.instance.getImage("images/gameart/nebula_blue.f2014.png");

      if (image) {
        context2d.drawImage(
          image,
          0,
          0,
          Background.WIDTH,
          Background.HEIGHT,
          0,
          0,
          GAME.SCREEN_WIDTH, // nBackground.WIDTH,
          GAME.SCREEN_HEIGHT // nBackground.HEIGHT
        );
      }
      context2d.restore();
    };

    position: Vector2d = null;

    constructor() {
      this.position = new Vector2d(0, 0);
    }
  }
}
