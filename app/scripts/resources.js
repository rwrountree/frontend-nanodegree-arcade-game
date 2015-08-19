/**
 * Created by Rusty on 8/13/2015.
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    (function (Sounds) {
        Sounds[Sounds["MISSILE"] = 0] = "MISSILE";
        Sounds[Sounds["EXPLOSION"] = 1] = "EXPLOSION";
        Sounds[Sounds["SOUNDTRACK"] = 2] = "SOUNDTRACK";
        Sounds[Sounds["THRUST"] = 3] = "THRUST";
    })(GAME.Sounds || (GAME.Sounds = {}));
    var Sounds = GAME.Sounds;
    /* This is a Singleton that represents the Resources class. Only one instance
     * of Resources can exist.
     */
    var Resources = (function () {
        function Resources() {
            var _this = this;
            this.getImage = function (url) {
                return _this.resourceCache[url];
            };
            this.isReady = function () {
                for (var k in _this.resourceCache) {
                    if (_this.resourceCache.hasOwnProperty(k) && !_this.resourceCache[k]) {
                        return false;
                    }
                }
                return true;
            };
            // onReady: any = (func: { (): void; }) => {
            this.onReady = function (func) {
                _this.readyCallbacks.push(func);
            };
            // loadAudio: any = (audioAssets: NodeListOf<HTMLAudioElement>) => {
            //  this.audioCache = audioAssets;
            // };
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