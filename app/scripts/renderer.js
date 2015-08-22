/**
 * This is the Render object that is used to manage draw calls
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    /* This is a Singleton that represents the Renderer class. Only one instance
     * of Renderer can exist.
     */
    var Renderer = (function () {
        /**
         * Renderer constructor
         * NOTE: Do not call this directly. Use the instance property.
         */
        function Renderer() {
            var _this = this;
            /**
             * Render functions from sprites are pushed into an array to create a list of
             * render commands
             * @param renderFunc
             */
            this.pushRenderFunction = function (renderFunc) {
                _this.renderFunctionList.push(renderFunc);
            };
            /**
             * Runs through all the render calls that have been pushed to the list
             */
            this.render = function () {
                _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                _this.renderFunctionList.forEach(function (renderFunc) {
                    renderFunc(_this.context);
                });
            };
            this.renderFunctionList = [];
            this.context = null;
            this.canvas = null;
            if (Renderer._instance) {
                throw new Error(Renderer.ERROR_DO_NOT_CALL_CONSTRUCTOR);
            }
            Renderer._instance = this;
        }
        Object.defineProperty(Renderer, "instance", {
            /**
             * Retrieves the single instance of the Renderer
             * @returns {Renderer}
             */
            get: function () {
                if (Renderer._instance === null) {
                    Renderer._instance = new Renderer();
                }
                return Renderer._instance;
            },
            enumerable: true,
            configurable: true
        });
        Renderer.prototype.setContext = function (context) {
            this.context = context;
        };
        Renderer.prototype.setCanvas = function (canvas) {
            this.canvas = canvas;
        };
        Renderer.prototype.flush = function () {
            this.renderFunctionList = [];
        };
        Renderer.ERROR_DO_NOT_CALL_CONSTRUCTOR = "Error: Instantiation failed: Use Resources.instance instead of new.";
        Renderer._instance = null;
        return Renderer;
    })();
    GAME.Renderer = Renderer;
})(GAME || (GAME = {}));
//# sourceMappingURL=renderer.js.map