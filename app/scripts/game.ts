/**
 * Created by Rusty on 8/13/2015.
 */

/// <reference path='includes.ts' />

module GAME {
  "use strict";
  enum GameState {
    PAUSED,
    RUNNING,
    GAME_OVER,
    SPLASH,
    MENU
  }

  enum allowedKeys {
    space = 32,
    left = 37,
    up = 38,
    right = 39,
    down = 40
  }

  export var SCREEN_WIDTH: number = 800,
             SCREEN_HEIGHT: number = 800;

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * Using Math.round() will give you a non-uniform distribution!
   */
  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  export class RiceRocks {
    private static ASTEROID_RESPAWN_TIME: number = 30;

    init: NO_PARAMS_VOID_RETURN_FUNC = (): void => {
      this.reset();
    };

    main: NO_PARAMS_VOID_RETURN_FUNC = () => {
      window.requestAnimationFrame(this.main);

      switch (this.gameState) {
        case GameState.SPLASH:
          this.updateSplash(0);
          this.render();
          break;
        case GameState.RUNNING:
          this.update(0);
          this.collisionDetection();
          this.render();
          this.cleanup();
          break;
        default:
          throw {
            error: "Invalid Game State",
            message: "Check the GameState enumeration for valid states"
          };
      }
    };

    cleanup: NO_PARAMS_VOID_RETURN_FUNC = () => {
      var arrayLength: number,
        index: number,
        keepers: Array<any>;

      keepers = [];
      arrayLength = this.effects.length;
      for (index = 0; index < arrayLength; index++) {
        if (this.effects[index].active) {
          keepers.push(this.effects[index]);
        }
      }
      this.effects = keepers;

      keepers = [];
      arrayLength = this.asteroids.length;
      for (index = 0; index < arrayLength; index++) {
        if (this.asteroids[index].active) {
          keepers.push(this.asteroids[index]);
        }
      }
      this.asteroids = keepers;

      keepers = [];
      arrayLength = this.missiles.length;
      for (index = 0; index < arrayLength; index++) {
        if (this.missiles[index].active) {
          keepers.push(this.missiles[index]);
        }
      }
      this.missiles = keepers;
    };

    updateSplash: { (dt: number): void; } = () => {
      Renderer.instance.pushRenderFunction(this.background.render);
      this.debrisField.update();
      Renderer.instance.pushRenderFunction(this.debrisField.render);
      Renderer.instance.pushRenderFunction(this.splash.render);
      Renderer.instance.pushRenderFunction(this.renderUI);
    };

    update: { (dt: number): void; } = () => {
      Renderer.instance.pushRenderFunction(this.background.render);

      this.debrisField.update();
      Renderer.instance.pushRenderFunction(this.debrisField.render);

      this.missiles.forEach((missile: Missile) => {
        if (missile.active) {
          missile.update();
          Renderer.instance.pushRenderFunction(missile.render);
        }
      });

      this.player.update();
      Renderer.instance.pushRenderFunction(this.player.render);

      this.asteroids.forEach((asteroid: SimulationObject) => {
        if (asteroid.active) {
          asteroid.update();
          Renderer.instance.pushRenderFunction(asteroid.render);
        }
      });

      this.effects.forEach((effect: Effect) => {
          if (effect.active) {
            Renderer.instance.pushRenderFunction(effect.render);
          }
      });

      this.spawnTickCounter -= 1;
      if (this.spawnTickCounter < 0) {
        this.spawnAsteroid();
        this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
      }

      Renderer.instance.pushRenderFunction(this.renderUI);
    };

    render: NO_PARAMS_VOID_RETURN_FUNC = () => {
      Renderer.instance.render();
      Renderer.instance.flush();
    };

    spawnAsteroid: NO_PARAMS_VOID_RETURN_FUNC = () => {
      var asteroid: Asteroid,
        randomChoice: number = getRandomInt(1, 3);

      if (randomChoice === 1) {
        asteroid = SpriteMaker.getSprite("asteroid-large", 0, 0);
      } else if (randomChoice === 2) {
        asteroid = SpriteMaker.getSprite("asteroid-medium", 0, 0);
      } else {
        asteroid = SpriteMaker.getSprite("asteroid-small", 0, 0);
      }

      var positionX: number = getRandomInt(1, 2);
      var positionY: number = getRandomInt(1, 2);
      positionX = positionX === 1 ? 0 : SCREEN_WIDTH;
      positionY = positionY === 1 ? 0 : SCREEN_HEIGHT;
      asteroid.position.x = positionX; // getRandomInt(0, SCREEN_WIDTH);
      asteroid.position.y = positionY; // getRandomInt(0, SCREEN_HEIGHT);
      asteroid.velocity.x = getRandomInt(-300, 300) / 100;
      asteroid.velocity.y = getRandomInt(-300, 300) / 100;
      asteroid.angularVelocity = getRandomInt(-10, 10) / 100;
      asteroid.active = true;

      this.asteroids.push(asteroid);
    };

    collisionDetection: NO_PARAMS_VOID_RETURN_FUNC = () => {
      var missiles: Array<Missile> = this.missiles,
        asteroidIndex: number,
        missileIndex: number,
        missile: Missile,
        asteroid: Asteroid,
        numAsteroids: number = this.asteroids.length,
        numMissiles: number = missiles.length,
        player: Ship = this.player;

      for (asteroidIndex = 0; asteroidIndex < numAsteroids; asteroidIndex++) {
        asteroid = this.asteroids[asteroidIndex];

        if (player.active) {
          if (asteroid.active && RiceRocks.collided(player, asteroid)) {
            asteroid.active = false;
            this.effects[this.effects.length] =
              SpriteMaker.getSprite("shield-damage", player.position.x, player.position.y);
            this.effects[this.effects.length] =
              SpriteMaker.getSprite("explosion", asteroid.position.x, asteroid.position.y);
            new Audio("audio/explosion.mp3").play();
            this.player.shields -= asteroid.damage;
            this.player.score += asteroid.points;
          }
        }

        if (asteroid.active) {
          for (missileIndex = 0; missileIndex < numMissiles; missileIndex++) {
            missile = missiles[missileIndex];

            if (missile.active && RiceRocks.collided(missile, asteroid)) {
              missile.active = false;
              asteroid.active = false;
              this.effects[this.effects.length] =
                SpriteMaker.getSprite("explosion", asteroid.position.x, asteroid.position.y);
              new Audio("audio/explosion.mp3").play();
              this.player.score += asteroid.points;
            }
          }
        }
      }

      if (this.player.score > this.highScore) {
        this.highScore = this.player.score;
      }

      if (this.player.shields === 0) {
        this.gameState = GameState.SPLASH;
        this.reset();
        return;
      }
    };

    handleInput: any = (keyBoardEvent: KeyboardEvent) => {
      var eventType: string = keyBoardEvent.type.toString();
      var keyCode: number = keyBoardEvent.keyCode;

      if (eventType === "mousedown") {
        if (this.gameState === GameState.SPLASH) {
          this.gameState = GameState.RUNNING;
        }
      }

      if (eventType === "keydown") {
        switch (allowedKeys[keyCode]) {
          case "left":
            this.player.angularVelocity = -0.10;
            break;
          case "right":
            this.player.angularVelocity = 0.10;
            break;
          case "up":
            this.player.thrusting = true;
            break;
          default:
        }
      }

      if (eventType === "keyup") {
        switch (allowedKeys[keyCode]) {
          case "left":
          case "right":
            this.player.angularVelocity = 0;
            break;
          case "up":
            this.player.thrusting = false;
            break;
          case "space":
            this.shoot();
            break;
          default:
        }
      }
    };

    renderUI: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      var width: number = (SCREEN_WIDTH * 0.2),
          height: number = 20,
          x: number = (SCREEN_WIDTH / 2) - (width / 2),
          y: number = 20,
          lineWidth: number = 4,
          percentLeft: number = this.player.getShieldPercentage();

      context2d.save();
      context2d.fillStyle = this.getShieldRGBA();
      context2d.fillRect(
        x + (width - (width * percentLeft)),
        y,
        width * percentLeft,
        height
      );
      context2d.restore();

      context2d.save();
      context2d.font = "18px Arial";
      context2d.textAlign = "left";
      context2d.fillStyle = "white";
      context2d.fillText(
        Math.floor(percentLeft * 100).toString() + "%",
        x + (lineWidth),
        y + (lineWidth * 4)
      );
      context2d.stroke();
      context2d.restore();

      context2d.save();
      context2d.lineWidth = lineWidth;
      context2d.strokeStyle = "rgba(255,255,255,0.75)";
      context2d.strokeRect(x, y, width, height);
      context2d.restore();

      context2d.save();
      context2d.font = "20px Arial";
      context2d.fillStyle = "rgba(255,255,255,0.75)";
      context2d.fillText("Score: " + this.player.score, 20, 37);
      context2d.fillText(
        "Hi: " + this.highScore,
        SCREEN_WIDTH - context2d.measureText("Hi: " + this.highScore).width - 20,
        37);
      context2d.restore();
    };

    private splash: Splash;
    private background: Background;
    private debrisField: DebrisField;
    private asteroids: Array<Asteroid>;
    private player: Ship;

    private gameState: GameState;
    private soundTrack: HTMLAudioElement;
    private spawnTickCounter: number;
    private effects: Array<Effect>;
    private missiles: Array<Missile>;
    private highScore: number;

    constructor() {
      Resources.instance.load(GAME.Assets.Images.art);
      this.asteroids = [];
      this.effects = [];
      this.missiles = [];
      this.background = SpriteMaker.getSprite("background", 0, 0);
      this.debrisField = SpriteMaker.getSprite("debris-field", 0, 0);
      this.player = SpriteMaker.getSprite("ship", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      this.gameState = GameState.SPLASH;
      this.soundTrack = new Audio("audio/soundtrack.mp3");
      this.soundTrack.loop = true;
      this.highScore = 0;
      this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
      this.splash = SpriteMaker.getSprite("splash", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);

      document.addEventListener("keyup", this.handleInput);
      document.addEventListener("keydown", this.handleInput);
      document.addEventListener("mousedown", this.handleInput);
    }

    static collided(obj: SimulationObject, otherObj: SimulationObject): boolean {
      return Vector2d.distance(obj.position, otherObj.position) < obj.radius + otherObj.radius;
    }

    getShieldRGBA(): string {
      var r: number,
          g: number,
          b: number = 0,
          a: number = 0.75,
          rgba: Array<number>,
          percentLeft: number = this.player.getShieldPercentage();

      if (Math.floor(percentLeft * 100) > 50) {
        r = (255 - Math.floor(percentLeft * 255)) * 2;
        g = 255;
      } else {
        r = 255;
        g = Math.floor(percentLeft * 255) * 2;
      }

      rgba = [r, g, b, a];

      return "rgba(" + rgba.join(",") + ")";
    }

    reset(): void {
      this.asteroids = [];
      this.effects = [];
      this.missiles = [];
      this.background = SpriteMaker.getSprite("background", 0, 0);
      this.player = SpriteMaker.getSprite("ship", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      this.soundTrack.currentTime = 0;
    }

    shoot(): void {
      var forwardVector2d: Vector2d,
        player: Ship = this.player,
        missile: Missile = SpriteMaker.getSprite("missile", 0, 0);

      forwardVector2d = Vector2d.angleToVector2d(this.player.angle);
      missile.position.set(
        player.position.x + player.radius * forwardVector2d.x,
        player.position.y + player.radius * forwardVector2d.y
      );
      missile.velocity.set(
        player.velocity.x + 6 * forwardVector2d.x,
        player.velocity.y + 6 * forwardVector2d.y
      );
      missile.angle = player.angle;
      this.missiles.push(missile);
      new Audio("audio/missile.mp3").play();
    }
  }
}

window.onload = () => {
  var riceRocks: GAME.RiceRocks = new GAME.RiceRocks(),
      doc: Document = document,
      canvas: HTMLCanvasElement = doc.createElement("canvas"),
      context2D: CanvasRenderingContext2D = canvas.getContext("2d");

  canvas.width = GAME.SCREEN_WIDTH;
  canvas.height = GAME.SCREEN_HEIGHT;
  doc.body.appendChild(canvas);

  GAME.Renderer.instance.setCanvas(canvas);
  GAME.Renderer.instance.setContext(context2D);
  GAME.Resources.instance.onReady(riceRocks.init);

  riceRocks.main();
};
