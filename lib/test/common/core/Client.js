"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("isomorphic-fetch");
var chai_1 = require("chai");
var sinon = require("sinon");
var src_1 = require("../../../src");
var Client_1 = require("../../../src/Client");
var GraphClientError_1 = require("../../../src/GraphClientError");
var AuthenticationHandler_1 = require("../../../src/middleware/AuthenticationHandler");
var ChaosHandler_1 = require("../../../src/middleware/ChaosHandler");
var ChaosHandlerOptions_1 = require("../../../src/middleware/options/ChaosHandlerOptions");
var ChaosStrategy_1 = require("../../../src/middleware/options/ChaosStrategy");
var DummyAuthenticationProvider_1 = require("../../DummyAuthenticationProvider");
var DummyHTTPMessageHandler_1 = require("../../DummyHTTPMessageHandler");
describe("Client.ts", function () {
    describe("initWithMiddleware", function () {
        var dummyAuthProvider = new DummyAuthenticationProvider_1.DummyAuthenticationProvider();
        var dummyHTTPHandler = new DummyHTTPMessageHandler_1.DummyHTTPMessageHandler();
        it("Should throw an error in case if both auth provider and custom middleware is passed", function () {
            try {
                var options = {
                    authProvider: dummyAuthProvider,
                    middleware: dummyHTTPHandler,
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var client = Client_1.Client.initWithMiddleware(options);
                throw new Error("Test Failed - Something wrong with the ambiguity check");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "AmbiguityInInitialization");
            }
        });
        it("Should return client instance for an authentication provider", function () {
            var options = {
                authProvider: dummyAuthProvider,
            };
            var client = Client_1.Client.initWithMiddleware(options);
            chai_1.assert.isTrue(client instanceof Client_1.Client);
            chai_1.assert.isDefined(client["httpClient"]);
        });
        it("Should return client instance for a custom middleware chain", function () {
            var options = {
                middleware: dummyHTTPHandler,
            };
            var client = Client_1.Client.initWithMiddleware(options);
            chai_1.assert.isTrue(client instanceof Client_1.Client);
            chai_1.assert.isDefined(client["httpClient"]);
        });
        it("Should throw error in case of neither auth provider nor custom middleware is passed", function () {
            try {
                var options = {};
                Client_1.Client.initWithMiddleware(options);
                throw new Error("Test Failed - Something wrong with the client initialization check");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "InvalidMiddlewareChain");
            }
        });
        it("Init middleware using a middleware array", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var provider, authHandler, responseBody, options, middlewareArray, client, response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = function (done) {
                            done(null, "dummy_token");
                        };
                        authHandler = new AuthenticationHandler_1.AuthenticationHandler(new src_1.CustomAuthenticationProvider(provider));
                        responseBody = "Test response body";
                        options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Testing middleware array", 200, 100, responseBody);
                        middlewareArray = [authHandler, new ChaosHandler_1.ChaosHandler(options)];
                        client = Client_1.Client.initWithMiddleware({ middleware: middlewareArray });
                        return [4 /*yield*/, client.api("me").get()];
                    case 1:
                        response = _a.sent();
                        chai_1.assert.equal(response, responseBody);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Init middleware using a chained middleware array", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var provider, authHandler, responseBody, options, chaosHandler, telemetryHandler, middlewareArray, client, response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = function (done) {
                            done(null, "dummy_token");
                        };
                        authHandler = new AuthenticationHandler_1.AuthenticationHandler(new src_1.CustomAuthenticationProvider(provider));
                        responseBody = "Test response body";
                        options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Testing chained middleware array", 200, 100, responseBody);
                        chaosHandler = new ChaosHandler_1.ChaosHandler(options);
                        telemetryHandler = new src_1.TelemetryHandler();
                        authHandler.setNext(telemetryHandler);
                        telemetryHandler.setNext(chaosHandler);
                        middlewareArray = [authHandler];
                        client = Client_1.Client.initWithMiddleware({ middleware: middlewareArray });
                        return [4 /*yield*/, client.api("me").get()];
                    case 1:
                        response = _a.sent();
                        chai_1.assert.equal(response, responseBody);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should throw error in case the access token is undefined", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var options, getTokenFunction_1, client, res, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        options = {
                            defaultVersion: "v1.0",
                            debugLogging: true,
                            authProvider: function (done) {
                                done(null, getTokenFunction_1());
                            },
                        };
                        getTokenFunction_1 = function () {
                            return undefined;
                        };
                        client = Client_1.Client.init(options);
                        return [4 /*yield*/, client.api("/test").get()];
                    case 1:
                        res = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        chai_1.assert.isTrue(error_1 instanceof GraphClientError_1.GraphClientError);
                        chai_1.assert.isDefined(error_1.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("Should throw error in case the access token is empty", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var customError, options, getTokenFunction_2, client, res, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customError = { message: "Token is empty" };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        options = {
                            defaultVersion: "v1.0",
                            debugLogging: true,
                            authProvider: function (done) {
                                done(customError, getTokenFunction_2());
                            },
                        };
                        getTokenFunction_2 = function () {
                            return "";
                        };
                        client = Client_1.Client.init(options);
                        return [4 /*yield*/, client.api("/test").get()];
                    case 2:
                        res = _a.sent();
                        throw new Error("Test failed - Expected error was not thrown");
                    case 3:
                        error_2 = _a.sent();
                        chai_1.assert.isTrue(error_2 instanceof GraphClientError_1.GraphClientError);
                        chai_1.assert.equal(error_2.customError, customError);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it("Init middleware with custom hosts", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var accessToken, provider, options, chaosHandler, authHandler, telemetry, middleware, customHost, customHosts, client, spy, response, context;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accessToken = "DUMMY_TOKEN";
                        provider = function (done) {
                            done(null, "DUMMY_TOKEN");
                        };
                        options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Testing chained middleware array", 200, 100, "");
                        chaosHandler = new ChaosHandler_1.ChaosHandler(options);
                        authHandler = new AuthenticationHandler_1.AuthenticationHandler(new src_1.CustomAuthenticationProvider(provider));
                        telemetry = new src_1.TelemetryHandler();
                        middleware = [authHandler, telemetry, chaosHandler];
                        customHost = "test_custom";
                        customHosts = new Set([customHost]);
                        client = Client_1.Client.initWithMiddleware({ middleware: middleware, customHosts: customHosts });
                        spy = sinon.spy(telemetry, "execute");
                        return [4 /*yield*/, client.api("https://".concat(customHost, "/v1.0/me")).get()];
                    case 1:
                        response = _a.sent();
                        context = spy.getCall(0).args[0];
                        chai_1.assert.equal(context.options.headers["Authorization"], "Bearer ".concat(accessToken));
                        return [2 /*return*/];
                }
            });
        }); });
        it("Pass invalid custom hosts", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var accessToken, provider, options, chaosHandler, authHandler, telemetry, middleware, customHost, customHosts, client, response, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accessToken = "DUMMY_TOKEN";
                        provider = function (done) {
                            done(null, "DUMMY_TOKEN");
                        };
                        options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Testing chained middleware array", 200, 100, "");
                        chaosHandler = new ChaosHandler_1.ChaosHandler(options);
                        authHandler = new AuthenticationHandler_1.AuthenticationHandler(new src_1.CustomAuthenticationProvider(provider));
                        telemetry = new src_1.TelemetryHandler();
                        middleware = [authHandler, telemetry, chaosHandler];
                        customHost = "https://test_custom";
                        customHosts = new Set([customHost]);
                        client = Client_1.Client.initWithMiddleware({ middleware: middleware, customHosts: customHosts });
                        return [4 /*yield*/, client.api("https://".concat(customHost, "/v1.0/me")).get()];
                    case 1:
                        response = _a.sent();
                        throw new Error("Test fails - Error expected when custom host is not valid");
                    case 2:
                        error_3 = _a.sent();
                        chai_1.assert.isDefined(error_3);
                        chai_1.assert.isDefined(error_3.message);
                        chai_1.assert.equal(error_3.message, "Please add only hosts or hostnames to the CustomHosts config. If the url is `http://example.com:3000/`, host is `example:3000`");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    describe("init", function () {
        it("Should return a client instance with default authentication provider and default middleware chain", function () {
            var provider = function (done) {
                done(null, "dummy_token");
            };
            var options = {
                authProvider: provider,
            };
            var client = Client_1.Client.init(options);
            chai_1.assert.isDefined(client["httpClient"]);
        });
    });
});
//# sourceMappingURL=Client.js.map