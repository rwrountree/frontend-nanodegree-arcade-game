/**
 * Created by Rusty on 8/14/2015.
 */
var GAME;
(function (GAME) {
    "use strict";
    var Vector2d = (function () {
        function Vector2d(x, y) {
            this._x = x;
            this._y = y;
        }
        Vector2d.angleToVector2d = function (angle) {
            return new Vector2d(Math.cos(angle), Math.sin(angle));
        };
        Vector2d.distance = function (p, q) {
            return Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2));
        };
        Vector2d.prototype.set = function (x, y) {
            this._x = x;
            this._y = y;
        };
        Object.defineProperty(Vector2d.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (x) {
                this._x = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2d.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (y) {
                this._y = y;
            },
            enumerable: true,
            configurable: true
        });
        return Vector2d;
    })();
    GAME.Vector2d = Vector2d;
})(GAME || (GAME = {}));
//# sourceMappingURL=vector2d.js.map