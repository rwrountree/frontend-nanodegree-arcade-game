/**
 * A simple 2 dimensional vector class
 */
var GAME;
(function (GAME) {
    "use strict";
    var Vector2d = (function () {
        function Vector2d(x, y) {
            this._x = x;
            this._y = y;
        }
        /**
         * Separate the x and y values of an angle
         * @param angle
         * @returns {GAME.Vector2d}
         */
        Vector2d.angleToVector2d = function (angle) {
            return new Vector2d(Math.cos(angle), Math.sin(angle));
        };
        /**
         * Calculate the distance between 2 points
         * @param p
         * @param q
         * @returns {number}
         */
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