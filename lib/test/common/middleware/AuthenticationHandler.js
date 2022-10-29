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
var src_1 = require("../../../src");
var Constants_1 = require("../../../src/Constants");
var AuthenticationHandler_1 = require("../../../src/middleware/AuthenticationHandler");
var DummyAuthenticationProvider_1 = require("../../DummyAuthenticationProvider");
var dummyAuthProvider = new DummyAuthenticationProvider_1.DummyAuthenticationProvider();
var authHandler = new AuthenticationHandler_1.AuthenticationHandler(dummyAuthProvider);
var chaosHandler = new src_1.ChaosHandler(new src_1.ChaosHandlerOptions(src_1.ChaosStrategy.MANUAL, "TEST_MESSAGE", 200));
describe("AuthenticationHandler.ts", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        describe("Constructor", function () {
            it("Should return an AuthenticationHandler for given AuthenticationProvider", function () {
                chai_1.assert.isTrue(authHandler instanceof AuthenticationHandler_1.AuthenticationHandler);
                chai_1.assert.equal(authHandler["authenticationProvider"], dummyAuthProvider);
            });
        });
        describe("Auth Headers", function () {
            it("Should delete Auth header when Request object is passed with non Graph URL", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var request, context;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            request = new Request("test_url");
                            context = {
                                request: request,
                                options: {
                                    headers: {
                                        Authorization: "TEST_VALUE",
                                    },
                                },
                            };
                            authHandler.setNext(chaosHandler);
                            return [4 /*yield*/, authHandler.execute(context)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(context.options.headers["Authorization"], undefined);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should contain Auth header when Request object is passed with custom URL", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var request, context, accessToken;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            request = new Request("https://custom/");
                            context = {
                                request: request,
                                customHosts: new Set(["custom"]),
                                options: {
                                    headers: {},
                                },
                            };
                            accessToken = "Bearer DUMMY_TOKEN";
                            return [4 /*yield*/, authHandler.execute(context)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(request.headers.get("Authorization"), accessToken);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should contain Auth header when Request object is passed with a valid Graph URL", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var request, context, accessToken;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            request = new Request(Constants_1.GRAPH_BASE_URL);
                            context = {
                                request: request,
                                customHosts: new Set(["custom"]),
                                options: {
                                    headers: {},
                                },
                            };
                            accessToken = "Bearer DUMMY_TOKEN";
                            return [4 /*yield*/, authHandler.execute(context)];
                        case 1:
                            _a.sent();
                            chai_1.assert.equal(request.headers.get("Authorization"), accessToken);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=AuthenticationHandler.js.map