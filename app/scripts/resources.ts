/**
 * Created by Rusty on 8/13/2015.
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";

  export enum Sounds {
    MISSILE = 0,
    EXPLOSION = 1,
    SOUNDTRACK = 2,
    THRUST = 3
  }

  /* This is a Singleton that represents the Resources class. Only one instance
   * of Resources can exist.
   */
  export class Resources {
    private static _instance: Resources = null;

    getImage: any = (url: string) => {
      return this.resourceCache[url];
    };

    isReady: any = () => {
      for (var k in this.resourceCache) {
        if (this.resourceCache.hasOwnProperty(k) && !this.resourceCache[k]) {
          return false;
        }
      }
      return true;
    };

    // onReady: any = (func: { (): void; }) => {
    onReady: any = (func: any) => {
      this.readyCallbacks.push(func);
    };

    // loadAudio: any = (audioAssets: NodeListOf<HTMLAudioElement>) => {
    //  this.audioCache = audioAssets;
    // };

    load: any = (urlOrArr: any) => {
      var that: any = this;
      if (urlOrArr instanceof Array) {
        /* If the developer passed in an array of images
         * loop through each value and call our image
         * loader on that image file
         */
        urlOrArr.forEach(function (url: string): void {
          that.loadInternally(url);
        });
      } else {
        /* The developer did not pass an array to this function,
         * assume the value is a string and call our image loader
         * directly.
         */
        this.loadInternally(urlOrArr);
      }
    };

    loadInternally: any = (url: string) => {
      var that: Resources = this;
      var image: any = null;

      if (this.resourceCache[url]) {
        /* If this URL has been previously loaded it will exist within
         * our resourceCache array. Just return that image rather
         * re-loading the image.
         */
        return this.resourceCache[url];
      } else {
        /* This URL has not been previously loaded and is not present
         * within our cache; we'll need to load this image.
         */
        image = new Image();
        image.onload = function (): void {
          /* Once our image has properly loaded, add it to our cache
           * so that we can simply return this image if the developer
           * attempts to load this file in the future.
           */
          that.resourceCache[url] = image;

          /* Once the image is actually loaded and properly cached,
           * call all of the onReady() callbacks we have defined.
           */
          if (that.isReady()) {
            that.readyCallbacks.forEach(function (func: {(): void; }): void {
              func();
            });
          }
        };

        this.resourceCache[url] = false;
        image.src = url;
      }
    };

    // public audioCache: NodeListOf<HTMLAudioElement> = [];

    private resourceCache: {};
    private readyCallbacks: { (): void; }[];

    constructor() {
      if (Resources._instance) {
        throw new Error("Error: Instantiation failed: Use Resources.instance instead of new.");
      }

      this.resourceCache = {};
      this.readyCallbacks = [];
      Resources._instance = this;
    }

    public static get instance(): Resources {
      if (Resources._instance === null) {
        Resources._instance = new Resources();
      }

      return Resources._instance;
    }
  }
}
