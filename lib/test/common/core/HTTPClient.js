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
var HTTPClient_1 = require("../../../src/HTTPClient");
var DummyHTTPMessageHandler_1 = require("../../DummyHTTPMessageHandler");
describe("HTTPClient.ts", function () {
    var httpMessageHandler = new DummyHTTPMessageHandler_1.DummyHTTPMessageHandler();
    var httpClient = new HTTPClient_1.HTTPClient(httpMessageHandler);
    describe("constructor", function () {
        it("Should create an instance and populate middleware member", function () {
            chai_1.assert.isDefined(httpClient["middleware"]);
            chai_1.assert.equal(httpClient["middleware"], httpMessageHandler);
        });
        it("Should create an instance and populate middleware member when passing a middleware array", function () {
            var client = new (HTTPClient_1.HTTPClient.bind.apply(HTTPClient_1.HTTPClient, tslib_1.__spreadArray([void 0], [httpMessageHandler], false)))();
            chai_1.assert.isDefined(client["middleware"]);
            chai_1.assert.equal(client["middleware"], httpMessageHandler);
        });
        it("Should throw an error if middleware is undefined", function () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var client = new HTTPClient_1.HTTPClient();
                throw new Error("Test failed - Expected error was not thrown");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "InvalidMiddlewareChain");
            }
        });
        it("Should throw an error if middleware is passed as an empty array", function () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var client = new (HTTPClient_1.HTTPClient.bind.apply(HTTPClient_1.HTTPClient, tslib_1.__spreadArray([void 0], [], false)))();
                throw new Error("Test failed - Expected error was not thrown");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "InvalidMiddlewareChain");
            }
        });
    });
    describe("sendRequest", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            it("Should throw error for invalid request options incase if the url and options are passed", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var url, context_1, error_1;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            url = "dummy_url";
                            context_1 = {
                                request: url,
                            };
                            return [4 /*yield*/, httpClient.sendRequest(context_1)];
                        case 1:
                            _a.sent();
                            throw new Error("Test Failed - Something wrong with the context validation");
                        case 2:
                            error_1 = _a.sent();
                            chai_1.assert.equal(error_1.name, "InvalidRequestOptions");
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            it("Should execute for context object with Request instance", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var request, context;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            request = new Request("dummy_url", {
                                method: "GET",
                            });
                            context = {
                                request: request,
                            };
                            return [4 /*yield*/, httpClient.sendRequest(context)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should execute for context object with request uri and options", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var url, options, context;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = "dummy_url";
                            options = {
                                method: "GET",
                            };
                            context = {
                                request: url,
                                options: options,
                            };
                            return [4 /*yield*/, httpClient.sendRequest(context)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=HTTPClient.js.map