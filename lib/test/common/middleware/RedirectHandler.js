"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var MiddlewareControl_1 = require("../../../src/middleware/MiddlewareControl");
var RedirectHandlerOptions_1 = require("../../../src/middleware/options/RedirectHandlerOptions");
var RedirectHandler_1 = require("../../../src/middleware/RedirectHandler");
var DummyHTTPMessageHandler_1 = require("../../DummyHTTPMessageHandler");
var redirectHandlerOptions = new RedirectHandlerOptions_1.RedirectHandlerOptions();
var redirectHandler = new RedirectHandler_1.RedirectHandler();
describe("RedirectHandler.ts", function () {
    describe("constructor", function () {
        it("Should create an instance with given options", function () {
            var handler = new RedirectHandler_1.RedirectHandler(redirectHandlerOptions);
            chai_1.assert.isDefined(handler["options"]);
        });
        it("Should create an instance with default set of options", function () {
            var handler = new RedirectHandler_1.RedirectHandler();
            chai_1.assert.isDefined(handler["options"]);
        });
    });
    describe("isRedirect", function () {
        it("Should return true for response having 301 status code", function () {
            var response = new Response("Dummy", {
                status: 301,
            });
            chai_1.assert.isTrue(redirectHandler["isRedirect"](response));
        });
        it("Should return true for response having 302 status code", function () {
            var response = new Response("Dummy", {
                status: 302,
            });
            chai_1.assert.isTrue(redirectHandler["isRedirect"](response));
        });
        it("Should return true for response having 303 status code", function () {
            var response = new Response("Dummy", {
                status: 303,
            });
            chai_1.assert.isTrue(redirectHandler["isRedirect"](response));
        });
        it("Should return true for response having 307 status code", function () {
            var response = new Response("Dummy", {
                status: 307,
            });
            chai_1.assert.isTrue(redirectHandler["isRedirect"](response));
        });
        it("Should return true for response having 308 status code", function () {
            var response = new Response("Dummy", {
                status: 308,
            });
            chai_1.assert.isTrue(redirectHandler["isRedirect"](response));
        });
        it("Should return false for non redirect status codes", function () {
            var response = new Response("Dummy", {
                status: 200,
            });
            chai_1.assert.isFalse(redirectHandler["isRedirect"](response));
        });
    });
    describe("hasLocationHeader", function () {
        it("Should return true for response with location header", function () {
            var res = new Response("Dummy", {
                status: 301,
                headers: {
                    location: "https://dummylocation.microsoft.com",
                },
            });
            chai_1.assert.isTrue(redirectHandler["hasLocationHeader"](res));
        });
        it("Should return false for response without location header", function () {
            var res = new Response("Dummy", {
                status: 301,
            });
            chai_1.assert.isFalse(redirectHandler["hasLocationHeader"](res));
        });
    });
    describe("getLocationHeader", function () {
        it("Should return location from response", function () {
            var location = "https://dummylocation.microsoft.com";
            var res = new Response("Dummy", {
                status: 301,
                headers: {
                    location: location,
                },
            });
            chai_1.assert.equal(redirectHandler["getLocationHeader"](res), location);
        });
        it("Should return null for response without location header", function () {
            var res = new Response("Dummy", {
                status: 301,
            });
            chai_1.assert.equal(redirectHandler["getLocationHeader"](res), null);
        });
    });
    describe("isRelativeURL", function () {
        it("Should return true for a relative url", function () {
            var url = "/graphproxy/me";
            chai_1.assert.isTrue(redirectHandler["isRelativeURL"](url));
        });
        it("Should return false for a absolute url", function () {
            var url = "https://graph.microsoft.com/v1.0/graphproxy/me";
            chai_1.assert.isFalse(redirectHandler["isRelativeURL"](url));
        });
    });
    describe("shouldDropAuthorizationHeader", function () {
        it("Should return true for urls with different domain", function () {
            var requestUrl = "https://graph.microsoft.com/v1.0/me";
            var redirectedUrl = "https://graphredirection.microsoft.com/v1.0/me";
            chai_1.assert.isTrue(redirectHandler["shouldDropAuthorizationHeader"](requestUrl, redirectedUrl));
        });
        it("Should return true for urls with different domain and one without path", function () {
            var requestUrl = "https://graph.microsoft.com/v1.0/me";
            var redirectedUrl = "https://graphredirection.microsoft.com/";
            chai_1.assert.isTrue(redirectHandler["shouldDropAuthorizationHeader"](requestUrl, redirectedUrl));
        });
        it("Should return true for urls with different domain without path", function () {
            var requestUrl = "https://graph.microsoft.com/";
            var redirectedUrl = "https://graphredirection.microsoft.com";
            chai_1.assert.isTrue(redirectHandler["shouldDropAuthorizationHeader"](requestUrl, redirectedUrl));
        });
        it("Should return false relative urls", function () {
            var requestUrl = "/graph/me/";
            var redirectedUrl = "/graphRedirection/me";
            chai_1.assert.isFalse(redirectHandler["shouldDropAuthorizationHeader"](requestUrl, redirectedUrl));
        });
        it("Should return false redirect url is relative", function () {
            var requestUrl = "https://graph.microsoft.com/v1.0/me";
            var redirectedUrl = "/graphRedirection";
            chai_1.assert.isFalse(redirectHandler["shouldDropAuthorizationHeader"](requestUrl, redirectedUrl));
        });
        it("Should return false for urls with same domain", function () {
            var requestUrl = "https://graph.microsoft.com/v1.0/me";
            var redirectedUrl = "https://graph.microsoft.com/v2.0/me";
            chai_1.assert.isFalse(redirectHandler["shouldDropAuthorizationHeader"](requestUrl, redirectedUrl));
        });
    });
    describe("getOptions", function () {
        it("Should return the options in the context object", function () {
            var maxRedirects = 10;
            var shouldRedirect = function () { return false; };
            var options = new RedirectHandlerOptions_1.RedirectHandlerOptions(maxRedirects, shouldRedirect);
            var cxt = {
                request: "url",
                middlewareControl: new MiddlewareControl_1.MiddlewareControl([options]),
            };
            var o = redirectHandler["getOptions"](cxt);
            chai_1.assert.equal(o.maxRedirects, maxRedirects);
            chai_1.assert.equal(o.shouldRedirect, shouldRedirect);
        });
        it("Should return the default set of options in the middleware", function () {
            var cxt = {
                request: "url",
            };
            var o = redirectHandler["getOptions"](cxt);
            chai_1.assert.equal(o.maxRedirects, redirectHandler["options"].maxRedirects);
            chai_1.assert.equal(o.shouldRedirect, redirectHandler["options"].shouldRedirect);
        });
    });
    describe("executeWithRedirect", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var context, dummyHTTPHandler, handler;
        return tslib_1.__generator(this, function (_a) {
            context = {
                request: "/me",
                options: {
                    method: "GET",
                },
            };
            dummyHTTPHandler = new DummyHTTPMessageHandler_1.DummyHTTPMessageHandler();
            handler = new RedirectHandler_1.RedirectHandler();
            handler.setNext(dummyHTTPHandler);
            it("Should not redirect for the redirect count equal to maxRedirects", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var maxRedirect, options;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            maxRedirect = 1;
                            options = new RedirectHandlerOptions_1.RedirectHandlerOptions(maxRedirect);
                            dummyHTTPHandler.setResponses([new Response("", { status: 301 }), new Response("ok", { status: 200 })]);
                            return [4 /*yield*/, handler["executeWithRedirect"](context, maxRedirect, options)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(context.response.status, 301);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should not redirect for the non redirect response", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var options;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options = new RedirectHandlerOptions_1.RedirectHandlerOptions();
                            dummyHTTPHandler.setResponses([new Response("", { status: 200 })]);
                            return [4 /*yield*/, handler["executeWithRedirect"](context, 0, options)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(context.response.status, 200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should not redirect for the redirect response without location header", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var options;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options = new RedirectHandlerOptions_1.RedirectHandlerOptions();
                            dummyHTTPHandler.setResponses([new Response("", { status: 301 }), new Response("ok", { status: 200 })]);
                            return [4 /*yield*/, handler["executeWithRedirect"](context, 0, options)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(context.response.status, 301);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should not redirect for shouldRedirect callback returning false", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var options;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options = new RedirectHandlerOptions_1.RedirectHandlerOptions(undefined, function () { return false; });
                            dummyHTTPHandler.setResponses([new Response("", { status: 301 }), new Response("ok", { status: 200 })]);
                            return [4 /*yield*/, handler["executeWithRedirect"](context, 0, options)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(context.response.status, 301);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should drop body and change method to get for SEE_OTHER status code", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var options;
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = new RedirectHandlerOptions_1.RedirectHandlerOptions();
                            dummyHTTPHandler.setResponses([
                                new Response("", {
                                    status: 303,
                                    headers: (_a = {},
                                        _a[RedirectHandler_1.RedirectHandler["LOCATION_HEADER"]] = "/location",
                                        _a),
                                }),
                                new Response("ok", { status: 200 }),
                            ]);
                            return [4 /*yield*/, handler["executeWithRedirect"](context, 0, options)];
                        case 1:
                            _b.sent();
                            chai_1.assert.isUndefined(context.options.body);
                            chai_1.assert.equal(context.options.method, "GET");
                            chai_1.assert.equal(context.response.status, 200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should not drop Authorization header for relative url redirect", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var options, cxt;
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            options = new RedirectHandlerOptions_1.RedirectHandlerOptions();
                            cxt = {
                                request: "/me",
                                options: {
                                    method: "POST",
                                    body: "dummy body",
                                    headers: (_a = {},
                                        _a[RedirectHandler_1.RedirectHandler["AUTHORIZATION_HEADER"]] = "Bearer TEST",
                                        _a),
                                },
                            };
                            dummyHTTPHandler.setResponses([
                                new Response("", {
                                    status: 301,
                                    headers: (_b = {},
                                        _b[RedirectHandler_1.RedirectHandler["LOCATION_HEADER"]] = "/location",
                                        _b),
                                }),
                                new Response("ok", { status: 200 }),
                            ]);
                            return [4 /*yield*/, handler["executeWithRedirect"](cxt, 0, options)];
                        case 1:
                            _c.sent();
                            chai_1.assert.isDefined(cxt.options.headers[RedirectHandler_1.RedirectHandler["AUTHORIZATION_HEADER"]]);
                            chai_1.assert.equal(cxt.response.status, 200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should not drop Authorization header for same authority redirect url", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var options, cxt;
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            options = new RedirectHandlerOptions_1.RedirectHandlerOptions();
                            cxt = {
                                request: "https://graph.microsoft.com/v1.0/me",
                                options: {
                                    method: "POST",
                                    body: "dummy body",
                                    headers: (_a = {},
                                        _a[RedirectHandler_1.RedirectHandler["AUTHORIZATION_HEADER"]] = "Bearer TEST",
                                        _a),
                                },
                            };
                            dummyHTTPHandler.setResponses([
                                new Response("", {
                                    status: 301,
                                    headers: (_b = {},
                                        _b[RedirectHandler_1.RedirectHandler["LOCATION_HEADER"]] = "https://graph.microsoft.com/v2.0/me",
                                        _b),
                                }),
                                new Response("ok", { status: 200 }),
                            ]);
                            return [4 /*yield*/, handler["executeWithRedirect"](cxt, 0, options)];
                        case 1:
                            _c.sent();
                            chai_1.assert.isDefined(cxt.options.headers[RedirectHandler_1.RedirectHandler["AUTHORIZATION_HEADER"]]);
                            chai_1.assert.equal(cxt.response.status, 200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should return success response after successful redirect", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var options, cxt;
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = new RedirectHandlerOptions_1.RedirectHandlerOptions();
                            cxt = {
                                request: "https://graph.microsoft.com/v1.0/me",
                                options: {
                                    method: "POST",
                                    body: "dummy body",
                                },
                            };
                            dummyHTTPHandler.setResponses([
                                new Response(null, {
                                    status: 301,
                                    headers: (_a = {},
                                        _a[RedirectHandler_1.RedirectHandler["LOCATION_HEADER"]] = "https://graphredirect.microsoft.com/v1.0/me",
                                        _a),
                                }),
                                new Response("ok", { status: 200 }),
                            ]);
                            return [4 /*yield*/, handler["executeWithRedirect"](cxt, 0, options)];
                        case 1:
                            _b.sent();
                            chai_1.assert.equal(cxt.response.status, 200);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe("execute", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            it("Should set the redirect value in options to manual", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var context, dummyHTTPHandler, handler;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            context = {
                                request: "/me",
                                options: {
                                    method: "GET",
                                },
                            };
                            dummyHTTPHandler = new DummyHTTPMessageHandler_1.DummyHTTPMessageHandler();
                            handler = new RedirectHandler_1.RedirectHandler();
                            handler.setNext(dummyHTTPHandler);
                            dummyHTTPHandler.setResponses([new Response("", { status: 200 })]);
                            return [4 /*yield*/, handler.execute(context)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(context.options.redirect, RedirectHandler_1.RedirectHandler["MANUAL_REDIRECT"]);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=RedirectHandler.js.map