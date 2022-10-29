"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryHandler = void 0;
var tslib_1 = require("tslib");
var RequestMethod_1 = require("../RequestMethod");
var MiddlewareControl_1 = require("./MiddlewareControl");
var MiddlewareUtil_1 = require("./MiddlewareUtil");
var RetryHandlerOptions_1 = require("./options/RetryHandlerOptions");
var TelemetryHandlerOptions_1 = require("./options/TelemetryHandlerOptions");
/**
 * @class
 * @implements Middleware
 * Class for RetryHandler
 */
var RetryHandler = /** @class */ (function () {
    /**
     * @public
     * @constructor
     * To create an instance of RetryHandler
     * @param {RetryHandlerOptions} [options = new RetryHandlerOptions()] - The retry handler options value
     * @returns An instance of RetryHandler
     */
    function RetryHandler(options) {
        if (options === void 0) { options = new RetryHandlerOptions_1.RetryHandlerOptions(); }
        this.options = options;
    }
    /**
     *
     * @private
     * To check whether the response has the retry status code
     * @param {Response} response - The response object
     * @returns Whether the response has retry status code or not
     */
    RetryHandler.prototype.isRetry = function (response) {
        return RetryHandler.RETRY_STATUS_CODES.indexOf(response.status) !== -1;
    };
    /**
     * @private
     * To check whether the payload is buffered or not
     * @param {RequestInfo} request - The url string or the request object value
     * @param {FetchOptions} options - The options of a request
     * @returns Whether the payload is buffered or not
     */
    RetryHandler.prototype.isBuffered = function (request, options) {
        var method = typeof request === "string" ? options.method : request.method;
        var isPutPatchOrPost = method === RequestMethod_1.RequestMethod.PUT || method === RequestMethod_1.RequestMethod.PATCH || method === RequestMethod_1.RequestMethod.POST;
        if (isPutPatchOrPost) {
            var isStream = (0, MiddlewareUtil_1.getRequestHeader)(request, options, "Content-Type") === "application/octet-stream";
            if (isStream) {
                return false;
            }
        }
        return true;
    };
    /**
     * @private
     * To get the delay for a retry
     * @param {Response} response - The response object
     * @param {number} retryAttempts - The current attempt count
     * @param {number} delay - The delay value in seconds
     * @returns A delay for a retry
     */
    RetryHandler.prototype.getDelay = function (response, retryAttempts, delay) {
        var getRandomness = function () { return Number(Math.random().toFixed(3)); };
        var retryAfter = response.headers !== undefined ? response.headers.get(RetryHandler.RETRY_AFTER_HEADER) : null;
        var newDelay;
        if (retryAfter !== null) {
            if (Number.isNaN(Number(retryAfter))) {
                newDelay = Math.round((new Date(retryAfter).getTime() - Date.now()) / 1000);
            }
            else {
                newDelay = Number(retryAfter);
            }
        }
        else {
            // Adding randomness to avoid retrying at a same
            newDelay = retryAttempts >= 2 ? this.getExponentialBackOffTime(retryAttempts) + delay + getRandomness() : delay + getRandomness();
        }
        return Math.min(newDelay, this.options.getMaxDelay() + getRandomness());
    };
    /**
     * @private
     * To get an exponential back off value
     * @param {number} attempts - The current attempt count
     * @returns An exponential back off value
     */
    RetryHandler.prototype.getExponentialBackOffTime = function (attempts) {
        return Math.round((1 / 2) * (Math.pow(2, attempts) - 1));
    };
    /**
     * @private
     * @async
     * To add delay for the execution
     * @param {number} delaySeconds - The delay value in seconds
     * @returns Nothing
     */
    RetryHandler.prototype.sleep = function (delaySeconds) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var delayMilliseconds;
            return tslib_1.__generator(this, function (_a) {
                delayMilliseconds = delaySeconds * 1000;
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, delayMilliseconds); })];
            });
        });
    };
    RetryHandler.prototype.getOptions = function (context) {
        var options;
        if (context.middlewareControl instanceof MiddlewareControl_1.MiddlewareControl) {
            options = context.middlewareControl.getMiddlewareOptions(this.options.constructor);
        }
        if (typeof options === "undefined") {
            options = Object.assign(new RetryHandlerOptions_1.RetryHandlerOptions(), this.options);
        }
        return options;
    };
    /**
     * @private
     * @async
     * To execute the middleware with retries
     * @param {Context} context - The context object
     * @param {number} retryAttempts - The current attempt count
     * @param {RetryHandlerOptions} options - The retry middleware options instance
     * @returns A Promise that resolves to nothing
     */
    RetryHandler.prototype.executeWithRetry = function (context, retryAttempts, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var delay;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nextMiddleware.execute(context)];
                    case 1:
                        _a.sent();
                        if (!(retryAttempts < options.maxRetries && this.isRetry(context.response) && this.isBuffered(context.request, context.options) && options.shouldRetry(options.delay, retryAttempts, context.request, context.options, context.response))) return [3 /*break*/, 4];
                        ++retryAttempts;
                        (0, MiddlewareUtil_1.setRequestHeader)(context.request, context.options, RetryHandler.RETRY_ATTEMPT_HEADER, retryAttempts.toString());
                        delay = this.getDelay(context.response, retryAttempts, options.delay);
                        return [4 /*yield*/, this.sleep(delay)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.executeWithRetry(context, retryAttempts, options)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * To execute the current middleware
     * @param {Context} context - The context object of the request
     * @returns A Promise that resolves to nothing
     */
    RetryHandler.prototype.execute = function (context) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var retryAttempts, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retryAttempts = 0;
                        options = this.getOptions(context);
                        TelemetryHandlerOptions_1.TelemetryHandlerOptions.updateFeatureUsageFlag(context, TelemetryHandlerOptions_1.FeatureUsageFlag.RETRY_HANDLER_ENABLED);
                        return [4 /*yield*/, this.executeWithRetry(context, retryAttempts, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @public
     * To set the next middleware in the chain
     * @param {Middleware} next - The middleware instance
     * @returns Nothing
     */
    RetryHandler.prototype.setNext = function (next) {
        this.nextMiddleware = next;
    };
    /**
     * @private
     * @static
     * A list of status codes that needs to be retried
     */
    RetryHandler.RETRY_STATUS_CODES = [
        429,
        503,
        504, // Gateway timeout
    ];
    /**
     * @private
     * @static
     * A member holding the name of retry attempt header
     */
    RetryHandler.RETRY_ATTEMPT_HEADER = "Retry-Attempt";
    /**
     * @private
     * @static
     * A member holding the name of retry after header
     */
    RetryHandler.RETRY_AFTER_HEADER = "Retry-After";
    return RetryHandler;
}());
exports.RetryHandler = RetryHandler;
//# sourceMappingURL=RetryHandler.js.map