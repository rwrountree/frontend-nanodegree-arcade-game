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
      this.update(0);
      this.collisionDetection();
      this.render();
      this.cleanup();
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

    update: { (dt: number): void; } = (dt: number) => {
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

      this.effects.forEach((effect: AnimatedSprite) => {
          if (effect.active) {
            Renderer.instance.pushRenderFunction(effect.render);
          }
      });

      this.spawnTickCounter -= 1;
      if (this.spawnTickCounter < 0) {
        this.spawnAsteroid();
        this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
      }
    };

    render: NO_PARAMS_VOID_RETURN_FUNC = () => {
      Renderer.instance.render();
      Renderer.instance.flush();
    };

    spawnAsteroid: NO_PARAMS_VOID_RETURN_FUNC = () => {
      var asteroid: SimulationObject,
        randomChoice: number = getRandomInt(1, 3);

      if (randomChoice === 1) {
        asteroid =  SpriteMaker.getSprite("asteroid-large", 0, 0);
      } else if (randomChoice === 2) {
        asteroid = SpriteMaker.getSprite("asteroid-medium", 0, 0);
      } else {
        asteroid = SpriteMaker.getSprite("asteroid-small", 0, 0);
      }

      asteroid.position.x = getRandomInt(0, SCREEN_WIDTH);
      asteroid.position.y = getRandomInt(0, SCREEN_HEIGHT);
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
        asteroid: SimulationObject,
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
            }
          }
        }
      }
    };

    handleInput: any = (keyBoardEvent: KeyboardEvent) => {
      var eventType: string = keyBoardEvent.type.toString();
      var keyCode: number = keyBoardEvent.keyCode;

      if (eventType === "keydown") {
        switch (allowedKeys[keyCode]) {
          case "left":
            this.player.angularVelocity = -0.09;
            break;
          case "right":
            this.player.angularVelocity = 0.09;
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

    private background: Background;
    private debrisField: DebrisField;
    private asteroids: Array<SimulationObject>;
    private player: Ship;

    private gameState: GameState;
    private soundTrack: HTMLAudioElement;
    private highScore: number;
    private spawnTickCounter: number;
    private effects: Array<AnimatedSprite>;
    private missiles: Array<Missile>;

    constructor() {
      Resources.instance.load(GAME.Assets.Images.art);
      this.asteroids = [];
      this.effects = [];
      this.missiles = [];
      this.background = SpriteMaker.getSprite("background", 0, 0);
      this.debrisField = SpriteMaker.getSprite("debris-field", 0, 0);
      this.player = SpriteMaker.getSprite("ship", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      this.gameState = GameState.PAUSED;
      this.soundTrack = new Audio("audio/soundtrack.mp3");
      this.soundTrack.loop = true;
      this.highScore = 0;
      this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;

      document.addEventListener("keyup", this.handleInput);
      document.addEventListener("keydown", this.handleInput);
    }

    static collided(obj: SimulationObject, otherObj: SimulationObject): boolean {
      return Vector2d.distance(obj.position, otherObj.position) < obj.radius + otherObj.radius;
    }

    reset(): void {
      this.player.position.x = (SCREEN_WIDTH / 2);
      this.player.position.y = (SCREEN_WIDTH / 2);
      this.missiles = [];
      this.asteroids = [];
      this.effects = [];
      this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
      this.soundTrack.currentTime = 0;
      this.soundTrack.play();
      this.gameState = GameState.RUNNING;
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
