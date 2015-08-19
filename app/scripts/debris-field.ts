/**
 * Created by Rusty on 8/16/2015.
 */

/**
 * Created by Rusty on 8/13/2015.
 */

/// <reference path='includes'/>

module GAME {
  "use strict";
  export class DebrisField  implements IDrawable2d {
    private static WIDTH: number = 640;
    private static HEIGHT: number = 480;

    update: { (dt: number): void } = (dt: number) => {
       this.position.x += 1;

       if (this.position.x >= GAME.SCREEN_WIDTH) {
         this.position.x -= GAME.SCREEN_WIDTH;
       }
    };

    render: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      context2d.save();
      context2d.translate(this.position.x, this.position.y);

      var image: HTMLImageElement = GAME.Resources.instance.getImage("images/gameart/debris2_blue.png");

      if (image) {
        context2d.drawImage(
          image,
          0,
          0,
          DebrisField.WIDTH,
          DebrisField.HEIGHT,
          0,
          0,
          GAME.SCREEN_WIDTH,
          GAME.SCREEN_HEIGHT
        );
      }
      context2d.restore();

      context2d.save();
      context2d.translate(this.position.x - GAME.SCREEN_WIDTH, this.position.y);
      if (image) {
        context2d.drawImage(
          image,
          0,
          0,
          DebrisField.WIDTH,
          DebrisField.HEIGHT,
          0,
          0,
          GAME.SCREEN_WIDTH,
          GAME.SCREEN_HEIGHT
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
