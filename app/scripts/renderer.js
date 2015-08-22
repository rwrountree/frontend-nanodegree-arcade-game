/**
 * Created by Rusty on 8/13/2015.
 */
/// <reference path='includes.ts'/>
var GAME;
(function (GAME) {
    "use strict";
    /* This is a Singleton that represents the Renderer class. Only one instance
     * of Renderer can exist.
     */
    var Renderer = (function () {
        function Renderer() {
            var _this = this;
            this.pushRenderFunction = function (renderFunc) {
                _this.renderFunctionList.push(renderFunc);
            };
            this.render = function () {
                // this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
                // this._context.save();
                _this.renderFunctionList.forEach(function (renderFunc) {
                    renderFunc(_this.context);
                });
                // this._context.restore();
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