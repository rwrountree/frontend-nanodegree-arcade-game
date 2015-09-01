/**
 * This is a modified version of resource manager from Udacity
 */

/// <reference path='includes.ts'/>

module GAME {
  "use strict";
  /* This is a Singleton that represents the Resources class. Only one instance
   * of Resources can exist.
   */
  export class Resources {
    private static _instance: Resources = null;

    /**
     * Retrieves an image based off of its URL
     * @param url
     * @returns {any}
     */
    getImage: any = (url: string) => {
      return this.resourceCache[url];
    };

    /**
     * Checks to see if a resource has been loaded
     * @returns {boolean}
     */
    isReady: any = () => {
      for (var k in this.resourceCache) {
        if (this.resourceCache.hasOwnProperty(k) && !this.resourceCache[k]) {
          return false;
        }
      }
      return true;
    };

    /**
     * When resources are loaded, the supplied function will be executed
     * @param func
     */
    onReady: any = (func: any) => {
      this.readyCallbacks.push(func);
    };

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

    private resourceCache: {};
    private readyCallbacks: { (): void; }[];

    /**
     * Resources constructor
     * NOTE: This should not be called directly. Use the instance property.
     */
    constructor() {
      if (Resources._instance) {
        throw new Error("Error: Instantiation failed: Use Resources.instance instead of new.");
      }

      this.resourceCache = {};
      this.readyCallbacks = [];
      Resources._instance = this;
    }

    /**
     * Returns the single instance of this class
     * @returns {Resources}
     */
    public static get instance(): Resources {
      if (Resources._instance === null) {
        Resources._instance = new Resources();
      }

      return Resources._instance;
    }
  }
}
