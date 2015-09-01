/**
 * This is a modified version of resource manager from Udacity
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    /* This is a Singleton that represents the Resources class. Only one instance
     * of Resources can exist.
     */
    var Resources = (function () {
        /**
         * Resources constructor
         * NOTE: This should not be called directly. Use the instance property.
         */
        function Resources() {
            var _this = this;
            /**
             * Retrieves an image based off of its URL
             * @param url
             * @returns {any}
             */
            this.getImage = function (url) {
                return _this.resourceCache[url];
            };
            /**
             * Checks to see if a resource has been loaded
             * @returns {boolean}
             */
            this.isReady = function () {
                for (var k in _this.resourceCache) {
                    if (_this.resourceCache.hasOwnProperty(k) && !_this.resourceCache[k]) {
                        return false;
                    }
                }
                return true;
            };
            /**
             * When resources are loaded, the supplied function will be executed
             * @param func
             */
            this.onReady = function (func) {
                _this.readyCallbacks.push(func);
            };
            this.load = function (urlOrArr) {
                var that = _this;
                if (urlOrArr instanceof Array) {
                    /* If the developer passed in an array of images
                     * loop through each value and call our image
                     * loader on that image file
                     */
                    urlOrArr.forEach(function (url) {
                        that.loadInternally(url);
                    });
                }
                else {
                    /* The developer did not pass an array to this function,
                     * assume the value is a string and call our image loader
                     * directly.
                     */
                    _this.loadInternally(urlOrArr);
                }
            };
            this.loadInternally = function (url) {
                var that = _this;
                var image = null;
                if (_this.resourceCache[url]) {
                    /* If this URL has been previously loaded it will exist within
                     * our resourceCache array. Just return that image rather
                     * re-loading the image.
                     */
                    return _this.resourceCache[url];
                }
                else {
                    /* This URL has not been previously loaded and is not present
                     * within our cache; we'll need to load this image.
                     */
                    image = new Image();
                    image.onload = function () {
                        /* Once our image has properly loaded, add it to our cache
                         * so that we can simply return this image if the developer
                         * attempts to load this file in the future.
                         */
                        that.resourceCache[url] = image;
                        /* Once the image is actually loaded and properly cached,
                         * call all of the onReady() callbacks we have defined.
                         */
                        if (that.isReady()) {
                            that.readyCallbacks.forEach(function (func) {
                                func();
                            });
                        }
                    };
                    _this.resourceCache[url] = false;
                    image.src = url;
                }
            };
            if (Resources._instance) {
                throw new Error("Error: Instantiation failed: Use Resources.instance instead of new.");
            }
            this.resourceCache = {};
            this.readyCallbacks = [];
            Resources._instance = this;
        }
        Object.defineProperty(Resources, "instance", {
            /**
             * Returns the single instance of this class
             * @returns {Resources}
             */
            get: function () {
                if (Resources._instance === null) {
                    Resources._instance = new Resources();
                }
                return Resources._instance;
            },
            enumerable: true,
            configurable: true
        });
        Resources._instance = null;
        return Resources;
    })();
    GAME.Resources = Resources;
})(GAME || (GAME = {}));
//# sourceMappingURL=resources.js.map