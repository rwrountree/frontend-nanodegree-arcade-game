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
    private static MAX_ASTEROIDS: number = 24;
    private static ASTEROID_RESPAWN_TIME: number = 30;

    init: NO_PARAMS_VOID_RETURN_FUNC = (): void => {
      this.reset();
      this._last = Date.now();
    };

    main: NO_PARAMS_VOID_RETURN_FUNC = () => {
      window.requestAnimationFrame(this.main);
      this.update(0);
      this.collisionDetection();
      this.render();
      this.cleanup();
    };

    cleanup: NO_PARAMS_VOID_RETURN_FUNC = () => {
      var arrayLength: number = this._animations.length,
        index: number,
        keeperAnimations: Array<IAnimatedSprite> = [];

      for (index = 0; index < arrayLength; index++) {
        if (this._animations[index].alive) {
          keeperAnimations.push(this._animations[index]);
        }
      }
      this._animations = keeperAnimations;
    };

    update: { (dt: number): void; } = (dt: number) => {
      Renderer.instance.pushRenderFunction(this._background.render);

      this._debrisField.update(dt);
      Renderer.instance.pushRenderFunction(this._debrisField.render);

      this._player.missiles.forEach((missile: Missile) => {
        if (missile.alive) {
          missile.update(dt);
          Renderer.instance.pushRenderFunction(missile.render);
        }
      });

      this._player.update(dt);
      Renderer.instance.pushRenderFunction(this._player.render);

      this._asteroids.forEach((asteroid: Asteroid) => {
        if (asteroid.alive) {
          asteroid.update(dt);
          Renderer.instance.pushRenderFunction(asteroid.render);
        }
      });

      this._animations.forEach((explosion: Explosion) => {
        if (explosion.alive) {
          Renderer.instance.pushRenderFunction(explosion.render);
        }
      });

      this._spawnAsteroidTime -= 1;
      if (this._spawnAsteroidTime < 0) {
        var randomChoice: number = getRandomInt(1, 3);
        if (randomChoice === 1) {
          this.spawnAsteroid(GAME.LargeAsteroidConfig);
        } else if (randomChoice === 2) {
          this.spawnAsteroid(GAME.MediumAsteroidConfig);
        } else {
          this.spawnAsteroid(GAME.SmallAsteroidConfig);
        }

        this._spawnAsteroidTime = RiceRocks.ASTEROID_RESPAWN_TIME;
      }
    };

    render: NO_PARAMS_VOID_RETURN_FUNC = () => {
      Renderer.instance.render();
      Renderer.instance.flush();
    };

    createAsteroids: NO_PARAMS_VOID_RETURN_FUNC = () => {
      for (var index: number = 0; index < RiceRocks.MAX_ASTEROIDS; index++) {
        this._asteroids[this._asteroids.length] = new Asteroid(GAME.LargeAsteroidConfig);
      }
    };

    collisionDetection: NO_PARAMS_VOID_RETURN_FUNC = () => {
      var missiles: Array<Missile> = this._player.missiles,
        asteroidIndex: number,
        missileIndex: number,
        missile: Missile,
        asteroid: Asteroid,
        numAsteroids: number = this._asteroids.length,
        numMissiles: number = missiles.length,
        player: Player = this._player,
        animations: Array<IAnimatedSprite> = this._animations;

      for (asteroidIndex = 0; asteroidIndex < numAsteroids; asteroidIndex++) {
        asteroid = this._asteroids[asteroidIndex];

        if (player.alive) {
          if (asteroid.alive && RiceRocks.collided(player, asteroid)) {
            player.lives -= 1;
            asteroid.alive = false;
            animations[animations.length] = new ShieldDamage(player.position.x, player.position.y);
            animations[animations.length] = new Explosion(asteroid.position.x, asteroid.position.y);
            new Audio("audio/explosion.mp3").play();
          }
        }

        if (asteroid.alive) {
          for (missileIndex = 0; missileIndex < numMissiles; missileIndex++) {
            missile = missiles[missileIndex];

            if (missile.alive && RiceRocks.collided(missile, asteroid)) {
              missile.alive = false;
              asteroid.alive = false;
              player.score += 100;
              animations[animations.length] = new Explosion(asteroid.position.x, asteroid.position.y);
              new Audio("audio/explosion.mp3").play();
            }
          }
        }
      }
    };

    private _background: Background;
    private _debrisField: DebrisField;
    private _asteroids: Array<Asteroid> = [];
    private _animations: Array<IAnimatedSprite> = [];
    private _player: Player;
    private _last: number;
    private _gameState: GameState;
    private _soundTrack: HTMLAudioElement;
    private _highScore: number;
    private _spawnAsteroidTime: number;

    constructor() {
      Resources.instance.load(GAME.Assets.Images.art);
      this._background = new Background();
      this._debrisField = new DebrisField();
      this.createAsteroids();
      this._player = new Player();
      this._player.position.set(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      this._last = 0;
      this._gameState = GameState.PAUSED;
      this._soundTrack = new Audio("audio/soundtrack.mp3");
      this._soundTrack.loop = true;
      this._highScore = 0;
      this._spawnAsteroidTime = RiceRocks.ASTEROID_RESPAWN_TIME;

      document.addEventListener("keyup", this._player.handleInput);
      document.addEventListener("keydown", this._player.handleInput);
    }

    static collided(obj: ICollisionObject2d, otherObj: ICollisionObject2d): boolean {
      return Vector2d.distance(obj.position, otherObj.position) < obj.radius + otherObj.radius;
    }

    reset(): void {
      var player: Player = this._player,
          missileIndex: number,
          missiles: Array<Missile> = player.missiles,
          missileArrayLength: number = missiles.length,
          asteroidArrayLength: number = this._asteroids.length,
          asteroidIndex: number;

      player.score = 0;
      player.lives = 3;
      player.position.x = (SCREEN_WIDTH / 2);
      player.position.y = (SCREEN_WIDTH / 2);

      for (missileIndex = 0; missileIndex < missileArrayLength; missileIndex++) {
        missiles[missileIndex].alive = false;
      }

      for (asteroidIndex = 0; asteroidIndex < asteroidArrayLength; asteroidIndex++) {
        this._asteroids[asteroidIndex].alive = false;
      }
      this._spawnAsteroidTime = RiceRocks.ASTEROID_RESPAWN_TIME;

      this._soundTrack.currentTime = 0;
      this._soundTrack.play();
      this._gameState = GameState.RUNNING;
    }

    findAvailableAsteroid(): Asteroid {
      var asteroidIndex: number;

      for (asteroidIndex = 0; asteroidIndex < RiceRocks.MAX_ASTEROIDS; asteroidIndex++) {
        if (!this._asteroids[asteroidIndex].alive) {
          return this._asteroids[asteroidIndex];
        }
      }
      return null;
    }

    spawnAsteroid(asteroidConfig: GAME.AsteroidConfig): void {
      var asteroid: Asteroid = this.findAvailableAsteroid();

      if (asteroid) {
        asteroid.position.x = getRandomInt(0, SCREEN_WIDTH);
        asteroid.position.y = getRandomInt(0, SCREEN_HEIGHT);
        asteroid.velocity.x = getRandomInt(-300, 300) / 100;
        asteroid.velocity.y = getRandomInt(-300, 300) / 100;
        asteroid.angularVelocity = getRandomInt(-10, 10) / 100;
        asteroid.alive = true;
        asteroid.asteroidConfig = asteroidConfig;
      }
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
