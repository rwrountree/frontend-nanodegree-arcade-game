/**
 * This a web adaptation of the Rice Rocks game that I created in
 * Coursera's Introduction to Interactive Python course.
 * It is an Asteroids(ish) clone :)
 */

/// <reference path='includes.ts' />

module GAME {
  "use strict";
  /**
   * The game states that are valid in the game
   */
  enum GameState {
    RUNNING,
    SPLASH
  }

  /**
   * Keyboard keys that are used in the game
   */
  enum allowedKeys {
    space = 32,
    left = 37,
    up = 38,
    right = 39,
    down = 40
  }

  /**
   * The screen dimensions used throughout the game
   */
  export var SCREEN_WIDTH: number = 800,
             SCREEN_HEIGHT: number = 800;

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * Using Math.round() will give you a non-uniform distribution!
   */
  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * This is the game!
   */
  export class RiceRocks {
    private static ASTEROID_RESPAWN_TIME: number = 15;

    /**
     * Starts the game initially
     */
    init: NO_PARAMS_VOID_RETURN_FUNC = (): void => {
      this.reset();
    };

    /**
     * The main game loop that utilizes game states
     */
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

    /**
     * Removes any unused effects, asteroids, and missiles and keeps
     * the ones that are still in play
     */
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

    /**
     * Used to update the render list for the splash screen during the GameState.SPLASH state
     */
    updateSplash: { (dt: number): void; } = () => {
      // push the background to the render list first
      Renderer.instance.pushRenderFunction(this.background.render);
      // update the scrolling debris field
      this.debrisField.update();
      // push the debris field
      Renderer.instance.pushRenderFunction(this.debrisField.render);
      // push the splash screen
      Renderer.instance.pushRenderFunction(this.splash.render);
      // finally, push the UI (user interface)
      Renderer.instance.pushRenderFunction(this.renderUI);
    };

    /**
     * Used to update game objects and the render list during the GameState.RUNNING state
     */
    update: { (dt: number): void; } = () => {
      // push the background to the render list first
      Renderer.instance.pushRenderFunction(this.background.render);

      // update the scrolling debris field
      this.debrisField.update();
      // push the debris field
      Renderer.instance.pushRenderFunction(this.debrisField.render);

      // update and push all the active missiles to the render list
      this.missiles.forEach((missile: Missile) => {
        if (missile.active) {
          missile.update();
          Renderer.instance.pushRenderFunction(missile.render);
        }
      });

      // update the player
      this.player.update();
      // push the player to the render list
      Renderer.instance.pushRenderFunction(this.player.render);

      // update and push all the active asteroids to the render list
      this.asteroids.forEach((asteroid: Asteroid) => {
        if (asteroid.active) {
          asteroid.update();
          Renderer.instance.pushRenderFunction(asteroid.render);
        }
      });

      // push all the active effects to the render list
      this.effects.forEach((effect: Effect) => {
          if (effect.active) {
            Renderer.instance.pushRenderFunction(effect.render);
          }
      });

      // update the asteroid respawn tick counter
      this.spawnTickCounter -= 1;
      if (this.spawnTickCounter < 0) {
        // if tick counter has expired, spawna  new asteroid
        this.spawnAsteroid();
        // reset the spawn timer
        this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
      }

      // finally, push the UI (user interface) to the render list
      Renderer.instance.pushRenderFunction(this.renderUI);
    };

    /**
     * The game's render function
     */
    render: NO_PARAMS_VOID_RETURN_FUNC = () => {
      // execute all render calls pushed to the Renderer object
      Renderer.instance.render();
      // clear the renderer's draw list
      Renderer.instance.flush();
    };

    /**
     * Create a new asteroid!
     */
    spawnAsteroid: NO_PARAMS_VOID_RETURN_FUNC = () => {
      var asteroid: Asteroid,
        randomChoice: number = getRandomInt(1, 3);

      // randomly create a large, medium, or small asteroid
      if (randomChoice === 1) {
        asteroid = SpriteMaker.getSprite("asteroid-large", 0, 0);
      } else if (randomChoice === 2) {
        asteroid = SpriteMaker.getSprite("asteroid-medium", 0, 0);
      } else {
        asteroid = SpriteMaker.getSprite("asteroid-small", 0, 0);
      }

      // determine if the asteroid starts on the left or right side of the screen
      var positionX: number = getRandomInt(1, 2);
      // determine if the asteroid starts on the top or bottom side of the screen
      var positionY: number = getRandomInt(1, 2);
      positionX = positionX === 1 ? 0 : SCREEN_WIDTH;
      positionY = positionY === 1 ? 0 : SCREEN_HEIGHT;
      asteroid.position.x = positionX;
      asteroid.position.y = positionY;

      // randomly generate x and y velocities for the asteroid
      asteroid.velocity.x = getRandomInt(-300, 300) / 100;
      asteroid.velocity.y = getRandomInt(-300, 300) / 100;

      // randomly generate angular velocity
      asteroid.angularVelocity = getRandomInt(-10, 10) / 100;

      // mark it as in play
      asteroid.active = true;

      // put it in the asteroids list
      this.asteroids.push(asteroid);
    };

    /**
     * Determine asteroid-player and asteroid-missile collisions
     */
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

        // determine if an asteroid struck the player
        if (player.active) {
          if (asteroid.active && RiceRocks.collided(player, asteroid)) {
            asteroid.active = false;

            // hit was detected, create shield damage effect
            this.effects[this.effects.length] =
              SpriteMaker.getSprite("shield-damage", player.position.x, player.position.y);

            // hit was detected, create an explosion effect
            this.effects[this.effects.length] =
              SpriteMaker.getSprite("explosion", asteroid.position.x, asteroid.position.y);

            // play explosion sound
            new Audio("audio/explosion.mp3").play();

            // update player's remaining shields
            this.player.shields -= asteroid.damage;
            // player still gets points for destroying an asteroid with his/her ship!
            this.player.score += asteroid.points;
          }
        }

        // determine if an asteroid struck a missile
        if (asteroid.active) {
          for (missileIndex = 0; missileIndex < numMissiles; missileIndex++) {
            missile = missiles[missileIndex];

            if (missile.active && RiceRocks.collided(missile, asteroid)) {
              missile.active = false;
              asteroid.active = false;

              // hit was detected, create an explosion effect
              this.effects[this.effects.length] =
                SpriteMaker.getSprite("explosion", asteroid.position.x, asteroid.position.y);

              // play explosion sound
              new Audio("audio/explosion.mp3").play();
              // give points to player
              this.player.score += asteroid.points;
            }
          }
        }
      }

      // adjust high score if player has exceeded it
      if (this.player.score > this.highScore) {
        this.highScore = this.player.score;
      }

      // end game if player has been eliminated
      if (this.player.shields === 0) {
        this.gameState = GameState.SPLASH;
        this.reset();
        return;
      }
    };

    /**
     * Processes the allowed keys and mouse input for the game
     * @param event
     */
    handleInput: any = (event: any) => {
      var eventType: string = event.type.toString();
      var keyCode: number = event.keyCode;

      if (eventType === "mousedown") {
        if (this.gameState === GameState.SPLASH) {
          this.gameState = GameState.RUNNING;
        }
      }

      if (eventType === "keydown") {
        switch (allowedKeys[keyCode]) {
          case "left":
            // turn left
            this.player.angularVelocity = -0.10;
            break;
          case "right":
            // turn right
            this.player.angularVelocity = 0.10;
            break;
          case "up":
            // toggle ship thrust
            this.player.thrusting = true;
            break;
          default:
        }
      }

      if (eventType === "keyup") {
        switch (allowedKeys[keyCode]) {
          case "left":
          case "right":
            // stop turning
            this.player.angularVelocity = 0;
            break;
          case "up":
            // stop ship thrust
            this.player.thrusting = false;
            break;
          case "space":
            // shoot a missile
            this.shoot();
            break;
          default:
        }
      }
    };

    /**
     * Render the simple UI for the game which includes:
     * shield gauge, score, and high score
     * @param context2d
     */
    renderUI: RENDER_FUNC = (context2d: CanvasRenderingContext2D) => {
      var width: number = (SCREEN_WIDTH * 0.2),
          height: number = 20,
          x: number = (SCREEN_WIDTH / 2) - (width / 2),
          y: number = 20,
          lineWidth: number = 4,
          percentLeft: number = this.player.getShieldPercentage();

      // draw the interior of the shield gauge
      context2d.save();
      context2d.fillStyle = this.getShieldRGBA();
      context2d.fillRect(
        x + (width - (width * percentLeft)),
        y,
        width * percentLeft,
        height
      );
      context2d.restore();

      // draw the percentage remaining of the shield text
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

      // draw the border of the shield gauge
      context2d.save();
      context2d.lineWidth = lineWidth;
      context2d.strokeStyle = "rgba(255,255,255,0.75)";
      context2d.strokeRect(x, y, width, height);
      context2d.restore();

      // draw the score and high score text
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

    /**
     * RiceRocks constructor
     */
    constructor() {
      Resources.instance.load(GAME.Assets.Images.art);
      this.asteroids = [];
      this.effects = [];
      this.missiles = [];
      this.background = SpriteMaker.getSprite("background", 0, 0);
      this.debrisField = SpriteMaker.getSprite("debris-field", 0, 0);
      // start player in the center of the screen
      this.player = SpriteMaker.getSprite("ship", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      this.gameState = GameState.SPLASH;
      this.soundTrack = new Audio("audio/soundtrack.mp3");
      this.soundTrack.loop = true;
      this.soundTrack.play();
      this.highScore = 0;
      this.spawnTickCounter = RiceRocks.ASTEROID_RESPAWN_TIME;
      // center the splash screen
      this.splash = SpriteMaker.getSprite("splash", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);

      // add event handlers
      document.addEventListener("keyup", this.handleInput);
      document.addEventListener("keydown", this.handleInput);
      document.addEventListener("mousedown", this.handleInput);
    }

    /**
     * Test to see whether or not 2 objects collided based on their radii
     * @param obj
     * @param otherObj
     * @returns {boolean}
     */
    static collided(obj: SimulationObject, otherObj: SimulationObject): boolean {
      return Vector2d.distance(obj.position, otherObj.position) < obj.radius + otherObj.radius;
    }

    /**
     * Return the RGBA value that represents the player's shield condition
     * @returns {string}
     */
    getShieldRGBA(): string {
      var r: number,
          g: number,
          b: number = 0,
          a: number = 0.75,
          rgba: Array<number>,
          percentLeft: number = this.player.getShieldPercentage();

      if (Math.floor(percentLeft * 100) > 50) {
        // when above 50% shield max, move from green to yellow
        r = (255 - Math.floor(percentLeft * 255)) * 2;
        g = 255;
      } else {
        // when below 50% shield max, move from yellow to red
        r = 255;
        g = Math.floor(percentLeft * 255) * 2;
      }

      rgba = [r, g, b, a];

      return "rgba(" + rgba.join(",") + ")";
    }

    /**
     * Make way for a new game!
     */
    reset(): void {
      this.asteroids = [];
      this.effects = [];
      this.missiles = [];
      this.background = SpriteMaker.getSprite("background", 0, 0);
      this.player = SpriteMaker.getSprite("ship", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      this.soundTrack.currentTime = 0;
      this.soundTrack.play();
    }

    /**
     * Fire a missile
     */
    shoot(): void {
      var forwardVector2d: Vector2d,
        player: Ship = this.player,
        missile: Missile = SpriteMaker.getSprite("missile", 0, 0);

      // get the direction the ship is facing
      forwardVector2d = Vector2d.angleToVector2d(this.player.angle);
      // set missile's position based on player's orientation
      missile.position.set(
        player.position.x + player.radius * forwardVector2d.x,
        player.position.y + player.radius * forwardVector2d.y
      );
      // set missile's velocity based on player's orientation
      missile.velocity.set(
        player.velocity.x + 6 * forwardVector2d.x,
        player.velocity.y + 6 * forwardVector2d.y
      );
      // copy player's angle into missle's
      missile.angle = player.angle;
      // push the new missile into the missile list
      this.missiles.push(missile);
      // play missile sound
      new Audio("audio/missile.mp3").play();
    }
  }
}

/**
 * When the page is finished loading, begin the game
 */
window.onload = () => {
  var riceRocks: GAME.RiceRocks = new GAME.RiceRocks(),
      doc: Document = document,
      canvas: HTMLCanvasElement = doc.createElement("canvas"),
      context2D: CanvasRenderingContext2D = canvas.getContext("2d");

  canvas.width = GAME.SCREEN_WIDTH;
  canvas.height = GAME.SCREEN_HEIGHT;
  doc.body.appendChild(canvas);

  // prepare renderer
  GAME.Renderer.instance.setCanvas(canvas);
  GAME.Renderer.instance.setContext(context2D);
  // when resources are ready, execute init
  GAME.Resources.instance.onReady(riceRocks.init);

  // let the games begin!
  riceRocks.main();
};
