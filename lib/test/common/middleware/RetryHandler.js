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
var MiddlewareControl_1 = require("../../../src/middleware/MiddlewareControl");
var RetryHandlerOptions_1 = require("../../../src/middleware/options/RetryHandlerOptions");
var RetryHandler_1 = require("../../../src/middleware/RetryHandler");
var DummyHTTPMessageHandler_1 = require("../../DummyHTTPMessageHandler");
describe("RetryHandler.ts", function () {
    var _this = this;
    this.timeout(20 * 1000);
    var retryHandler = new RetryHandler_1.RetryHandler();
    var retryHandlerOptions = new RetryHandlerOptions_1.RetryHandlerOptions();
    var tooManyRequestsResponseWithRetryAfterDelay = new Response("", {
        status: 429,
        statusText: "TooManyRequests",
        headers: {
            "Retry-After": "10",
        },
    });
    var tooManyRequestsResponseWithRetyAfterDate = new Response("", {
        status: 429,
        statusText: "TooManyRequests",
        headers: {
            "Retry-After": new Date(Date.now() + 10000).toUTCString(),
        },
    });
    var serviceUnavailableResponse = new Response("", {
        status: 503,
        statusText: "ServiceUnavailable",
    });
    var gatewayTimeoutResponse = new Response("", {
        status: 504,
        statusText: "GatewayTimeout",
    });
    var nonRetryResponse = new Response("", {
        status: 200,
        statusText: "OK",
    });
    describe("constructor", function () {
        it("Should set the option member with retryHanderOptions", function () {
            var handler = new RetryHandler_1.RetryHandler(retryHandlerOptions);
            chai_1.assert.isDefined(handler["options"]);
        });
        it("Should create retryHandler instance with default retryHandlerOptions", function () {
            var handler = new RetryHandler_1.RetryHandler();
            chai_1.assert.isDefined(handler["options"]);
        });
    });
    describe("isRetry", function () {
        it("Should return true for 429 response", function () {
            chai_1.assert.isTrue(retryHandler["isRetry"](tooManyRequestsResponseWithRetryAfterDelay));
        });
        it("Should return true for 503 response", function () {
            chai_1.assert.isTrue(retryHandler["isRetry"](serviceUnavailableResponse));
        });
        it("Should return true for 504 response", function () {
            chai_1.assert.isTrue(retryHandler["isRetry"](gatewayTimeoutResponse));
        });
        it("Should return false for non retry response", function () {
            chai_1.assert.isFalse(retryHandler["isRetry"](nonRetryResponse));
        });
    });
    describe("isBuffered", function () {
        var url = "dummy_url";
        it("Should succeed for non post, patch, put requests", function () {
            var options = {
                method: "GET",
            };
            chai_1.assert.isTrue(retryHandler["isBuffered"](url, options));
        });
        it("Should succeed for post request with non stream request", function () {
            var options = {
                method: "POST",
                body: "test",
            };
            chai_1.assert.isTrue(retryHandler["isBuffered"](url, options));
        });
        it("Should fail for stream request", function () {
            var options = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
            };
            chai_1.assert.isFalse(retryHandler["isBuffered"](url, options));
        });
    });
    describe("getDelay", function () {
        it("Should return retry delay from the response header", function () {
            var delay = retryHandler["getDelay"](tooManyRequestsResponseWithRetryAfterDelay, 1, 5);
            chai_1.assert.equal(delay, 10);
        });
        it("Should return retry delay from the response header mentioning delay time", function () {
            var delay = retryHandler["getDelay"](tooManyRequestsResponseWithRetyAfterDate, 1, 5);
            chai_1.assert.isDefined(delay);
        });
        it("Should return delay without exponential backoff", function () {
            var delay = retryHandler["getDelay"](gatewayTimeoutResponse, 1, 10);
            chai_1.assert.isAbove(delay, 10);
            chai_1.assert.isBelow(delay, 11);
        });
        it("Should return delay with exponential backoff", function () {
            var delay = retryHandler["getDelay"](gatewayTimeoutResponse, 2, 10);
            chai_1.assert.isAbove(delay, 12);
            chai_1.assert.isBelow(delay, 13);
        });
        it("Should return max delay for if the calculated delay is more", function () {
            var delay = retryHandler["getDelay"](gatewayTimeoutResponse, 10, 100);
            chai_1.assert.isAbove(delay, 180);
            chai_1.assert.isBelow(delay, 181);
        });
    });
    describe("getExponentialBackOffTime", function () {
        it("Should return 0 delay for 0th attempt i.e for a fresh request", function () {
            var time = retryHandler["getExponentialBackOffTime"](0);
            chai_1.assert.equal(time, 0);
        });
        it("Should return attempt time", function () {
            var time = retryHandler["getExponentialBackOffTime"](1);
            chai_1.assert.equal(time, 1);
        });
    });
    describe("sleep", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            it("Should run the sleep method for 1 second", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, retryHandler["sleep"](1)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe("getOptions", function () {
        it("Should return the options in the context object", function () {
            var delay = 10;
            var maxRetries = 8;
            var shouldRetry = function () { return false; };
            var options = new RetryHandlerOptions_1.RetryHandlerOptions(delay, maxRetries, shouldRetry);
            var cxt = {
                request: "url",
                middlewareControl: new MiddlewareControl_1.MiddlewareControl([options]),
            };
            var o = retryHandler["getOptions"](cxt);
            chai_1.assert.equal(o.delay, delay);
            chai_1.assert.equal(o.maxRetries, maxRetries);
            chai_1.assert.equal(o.shouldRetry, shouldRetry);
        });
        it("Should return the default set of options in the middleware", function () {
            var cxt = {
                request: "url",
            };
            var o = retryHandler["getOptions"](cxt);
            chai_1.assert.equal(o.delay, retryHandler["options"].delay);
            chai_1.assert.equal(o.maxRetries, retryHandler["options"].maxRetries);
            chai_1.assert.equal(o.shouldRetry, retryHandler["options"].shouldRetry);
        });
    });
    describe("executeWithRetry", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var options, handler, dummyHTTPHandler, cxt;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            options = new RetryHandlerOptions_1.RetryHandlerOptions();
            handler = new RetryHandler_1.RetryHandler(options);
            dummyHTTPHandler = new DummyHTTPMessageHandler_1.DummyHTTPMessageHandler();
            handler.setNext(dummyHTTPHandler);
            cxt = {
                request: "url",
                options: {
                    method: "GET",
                },
            };
            it("Should return non retried response incase of maxRetries busted out", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dummyHTTPHandler.setResponses([new Response(null, { status: 429 }), new Response("ok", { status: 200 })]);
                            return [4 /*yield*/, handler["executeWithRetry"](cxt, RetryHandlerOptions_1.RetryHandlerOptions["MAX_MAX_RETRIES"], options)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(cxt.response.status, 429);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should return succeeded response for non retry response", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dummyHTTPHandler.setResponses([new Response("ok", { status: 200 })]);
                            return [4 /*yield*/, handler["executeWithRetry"](cxt, 0, options)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(cxt.response.status, 200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should return non retried response for streaming request", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var c;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            c = {
                                request: "url",
                                options: {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/octet-stream",
                                    },
                                },
                            };
                            dummyHTTPHandler.setResponses([new Response(null, { status: 429 }), new Response("ok", { status: 200 })]);
                            return [4 /*yield*/, handler["executeWithRetry"](c, 0, options)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(c.response.status, 429);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should successfully retry and return ok response", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var opts;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            opts = new RetryHandlerOptions_1.RetryHandlerOptions(1);
                            dummyHTTPHandler.setResponses([new Response(null, { status: 429 }), new Response(null, { status: 429 }), new Response("ok", { status: 200 })]);
                            return [4 /*yield*/, handler["executeWithRetry"](cxt, 0, opts)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(cxt.response.status, 200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should fail by exceeding max retries", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var opts;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            opts = new RetryHandlerOptions_1.RetryHandlerOptions(1, 2);
                            dummyHTTPHandler.setResponses([new Response(null, { status: 429 }), new Response(null, { status: 429 }), new Response(null, { status: 429 }), new Response("ok", { status: 200 })]);
                            return [4 /*yield*/, handler["executeWithRetry"](cxt, 0, opts)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(cxt.response.status, 429);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=RetryHandler.js.map