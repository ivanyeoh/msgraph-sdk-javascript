"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPClientFactory = void 0;
var tslib_1 = require("tslib");
/**
 * @module HTTPClientFactory
 */
var HTTPClient_1 = require("./HTTPClient");
var AuthenticationHandler_1 = require("./middleware/AuthenticationHandler");
var HTTPMessageHandler_1 = require("./middleware/HTTPMessageHandler");
var RedirectHandlerOptions_1 = require("./middleware/options/RedirectHandlerOptions");
var RetryHandlerOptions_1 = require("./middleware/options/RetryHandlerOptions");
var RedirectHandler_1 = require("./middleware/RedirectHandler");
var RetryHandler_1 = require("./middleware/RetryHandler");
var TelemetryHandler_1 = require("./middleware/TelemetryHandler");
/**
 * @private
 * To check whether the environment is node or not
 * @returns A boolean representing the environment is node or not
 */
var isNodeEnvironment = function () {
    return typeof process === "object" && typeof require === "function";
};
/**
 * @class
 * Class representing HTTPClientFactory
 */
var HTTPClientFactory = /** @class */ (function () {
    function HTTPClientFactory() {
    }
    /**
     * @public
     * @static
     * Creates HTTPClient with default middleware chain
     * @param {AuthenticationProvider} authProvider - The authentication provider instance
     * @returns A HTTPClient instance
     *
     * NOTE: These are the things that we need to remember while doing modifications in the below default pipeline.
     * 		* HTTPMessageHandler should be the last one in the middleware pipeline, because this makes the actual network call of the request
     * 		* TelemetryHandler should be the one prior to the last middleware in the chain, because this is the one which actually collects and appends the usage flag and placing this handler 	*		  before making the actual network call ensures that the usage of all features are recorded in the flag.
     * 		* The best place for AuthenticationHandler is in the starting of the pipeline, because every other handler might have to work for multiple times for a request but the auth token for
     * 		  them will remain same. For example, Retry and Redirect handlers might be working multiple times for a request based on the response but their auth token would remain same.
     */
    HTTPClientFactory.createWithAuthenticationProvider = function (authProvider) {
        var authenticationHandler = new AuthenticationHandler_1.AuthenticationHandler(authProvider);
        var retryHandler = new RetryHandler_1.RetryHandler(new RetryHandlerOptions_1.RetryHandlerOptions());
        var telemetryHandler = new TelemetryHandler_1.TelemetryHandler();
        var httpMessageHandler = new HTTPMessageHandler_1.HTTPMessageHandler();
        authenticationHandler.setNext(retryHandler);
        if (isNodeEnvironment()) {
            var redirectHandler = new RedirectHandler_1.RedirectHandler(new RedirectHandlerOptions_1.RedirectHandlerOptions());
            retryHandler.setNext(redirectHandler);
            redirectHandler.setNext(telemetryHandler);
        }
        else {
            retryHandler.setNext(telemetryHandler);
        }
        telemetryHandler.setNext(httpMessageHandler);
        return HTTPClientFactory.createWithMiddleware(authenticationHandler);
    };
    /**
     * @public
     * @static
     * Creates a middleware chain with the given one
     * @property {...Middleware} middleware - The first middleware of the middleware chain or a sequence of all the Middleware handlers
     * @returns A HTTPClient instance
     */
    HTTPClientFactory.createWithMiddleware = function () {
        var middleware = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middleware[_i] = arguments[_i];
        }
        // Middleware should not empty or undefined. This is check is present in the HTTPClient constructor.
        return new (HTTPClient_1.HTTPClient.bind.apply(HTTPClient_1.HTTPClient, tslib_1.__spreadArray([void 0], middleware, false)))();
    };
    return HTTPClientFactory;
}());
exports.HTTPClientFactory = HTTPClientFactory;
//# sourceMappingURL=HTTPClientFactory.js.map