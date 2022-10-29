"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectHandler = void 0;
var tslib_1 = require("tslib");
var RequestMethod_1 = require("../RequestMethod");
var MiddlewareControl_1 = require("./MiddlewareControl");
var MiddlewareUtil_1 = require("./MiddlewareUtil");
var RedirectHandlerOptions_1 = require("./options/RedirectHandlerOptions");
var TelemetryHandlerOptions_1 = require("./options/TelemetryHandlerOptions");
/**
 * @class
 * Class
 * @implements Middleware
 * Class representing RedirectHandler
 */
var RedirectHandler = /** @class */ (function () {
    /**
     * @public
     * @constructor
     * To create an instance of RedirectHandler
     * @param {RedirectHandlerOptions} [options = new RedirectHandlerOptions()] - The redirect handler options instance
     * @returns An instance of RedirectHandler
     */
    function RedirectHandler(options) {
        if (options === void 0) { options = new RedirectHandlerOptions_1.RedirectHandlerOptions(); }
        this.options = options;
    }
    /**
     * @private
     * To check whether the response has the redirect status code or not
     * @param {Response} response - The response object
     * @returns A boolean representing whether the response contains the redirect status code or not
     */
    RedirectHandler.prototype.isRedirect = function (response) {
        return RedirectHandler.REDIRECT_STATUS_CODES.indexOf(response.status) !== -1;
    };
    /**
     * @private
     * To check whether the response has location header or not
     * @param {Response} response - The response object
     * @returns A boolean representing the whether the response has location header or not
     */
    RedirectHandler.prototype.hasLocationHeader = function (response) {
        return response.headers.has(RedirectHandler.LOCATION_HEADER);
    };
    /**
     * @private
     * To get the redirect url from location header in response object
     * @param {Response} response - The response object
     * @returns A redirect url from location header
     */
    RedirectHandler.prototype.getLocationHeader = function (response) {
        return response.headers.get(RedirectHandler.LOCATION_HEADER);
    };
    /**
     * @private
     * To check whether the given url is a relative url or not
     * @param {string} url - The url string value
     * @returns A boolean representing whether the given url is a relative url or not
     */
    RedirectHandler.prototype.isRelativeURL = function (url) {
        return url.indexOf("://") === -1;
    };
    /**
     * @private
     * To check whether the authorization header in the request should be dropped for consequent redirected requests
     * @param {string} requestUrl - The request url value
     * @param {string} redirectUrl - The redirect url value
     * @returns A boolean representing whether the authorization header in the request should be dropped for consequent redirected requests
     */
    RedirectHandler.prototype.shouldDropAuthorizationHeader = function (requestUrl, redirectUrl) {
        var schemeHostRegex = /^[A-Za-z].+?:\/\/.+?(?=\/|$)/;
        var requestMatches = schemeHostRegex.exec(requestUrl);
        var requestAuthority;
        var redirectAuthority;
        if (requestMatches !== null) {
            requestAuthority = requestMatches[0];
        }
        var redirectMatches = schemeHostRegex.exec(redirectUrl);
        if (redirectMatches !== null) {
            redirectAuthority = redirectMatches[0];
        }
        return typeof requestAuthority !== "undefined" && typeof redirectAuthority !== "undefined" && requestAuthority !== redirectAuthority;
    };
    /**
     * @private
     * @async
     * To update a request url with the redirect url
     * @param {string} redirectUrl - The redirect url value
     * @param {Context} context - The context object value
     * @returns Nothing
     */
    RedirectHandler.prototype.updateRequestUrl = function (redirectUrl, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = context;
                        if (!(typeof context.request === "string")) return [3 /*break*/, 1];
                        _b = redirectUrl;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, (0, MiddlewareUtil_1.cloneRequestWithNewUrl)(redirectUrl, context.request)];
                    case 2:
                        _b = _c.sent();
                        _c.label = 3;
                    case 3:
                        _a.request = _b;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @private
     * To get the options for execution of the middleware
     * @param {Context} context - The context object
     * @returns A options for middleware execution
     */
    RedirectHandler.prototype.getOptions = function (context) {
        var options;
        if (context.middlewareControl instanceof MiddlewareControl_1.MiddlewareControl) {
            options = context.middlewareControl.getMiddlewareOptions(RedirectHandlerOptions_1.RedirectHandlerOptions);
        }
        if (typeof options === "undefined") {
            options = Object.assign(new RedirectHandlerOptions_1.RedirectHandlerOptions(), this.options);
        }
        return options;
    };
    /**
     * @private
     * @async
     * To execute the next middleware and to handle in case of redirect response returned by the server
     * @param {Context} context - The context object
     * @param {number} redirectCount - The redirect count value
     * @param {RedirectHandlerOptions} options - The redirect handler options instance
     * @returns A promise that resolves to nothing
     */
    RedirectHandler.prototype.executeWithRedirect = function (context, redirectCount, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, redirectUrl;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nextMiddleware.execute(context)];
                    case 1:
                        _a.sent();
                        response = context.response;
                        if (!(redirectCount < options.maxRedirects && this.isRedirect(response) && this.hasLocationHeader(response) && options.shouldRedirect(response))) return [3 /*break*/, 6];
                        ++redirectCount;
                        if (!(response.status === RedirectHandler.STATUS_CODE_SEE_OTHER)) return [3 /*break*/, 2];
                        context.options.method = RequestMethod_1.RequestMethod.GET;
                        delete context.options.body;
                        return [3 /*break*/, 4];
                    case 2:
                        redirectUrl = this.getLocationHeader(response);
                        if (!this.isRelativeURL(redirectUrl) && this.shouldDropAuthorizationHeader(response.url, redirectUrl)) {
                            delete context.options.headers[RedirectHandler.AUTHORIZATION_HEADER];
                        }
                        return [4 /*yield*/, this.updateRequestUrl(redirectUrl, context)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.executeWithRedirect(context, redirectCount, options)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6: return [2 /*return*/];
                    case 7: return [2 /*return*/];
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
    RedirectHandler.prototype.execute = function (context) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var redirectCount, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        redirectCount = 0;
                        options = this.getOptions(context);
                        context.options.redirect = RedirectHandler.MANUAL_REDIRECT;
                        TelemetryHandlerOptions_1.TelemetryHandlerOptions.updateFeatureUsageFlag(context, TelemetryHandlerOptions_1.FeatureUsageFlag.REDIRECT_HANDLER_ENABLED);
                        return [4 /*yield*/, this.executeWithRedirect(context, redirectCount, options)];
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
    RedirectHandler.prototype.setNext = function (next) {
        this.nextMiddleware = next;
    };
    /**
     * @private
     * @static
     * A member holding the array of redirect status codes
     */
    RedirectHandler.REDIRECT_STATUS_CODES = [
        301,
        302,
        303,
        307,
        308, // Moved Permanently
    ];
    /**
     * @private
     * @static
     * A member holding SeeOther status code
     */
    RedirectHandler.STATUS_CODE_SEE_OTHER = 303;
    /**
     * @private
     * @static
     * A member holding the name of the location header
     */
    RedirectHandler.LOCATION_HEADER = "Location";
    /**
     * @private
     * @static
     * A member representing the authorization header name
     */
    RedirectHandler.AUTHORIZATION_HEADER = "Authorization";
    /**
     * @private
     * @static
     * A member holding the manual redirect value
     */
    RedirectHandler.MANUAL_REDIRECT = "manual";
    return RedirectHandler;
}());
exports.RedirectHandler = RedirectHandler;
//# sourceMappingURL=RedirectHandler.js.map