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
var GraphErrorHandler_1 = require("../../../src/GraphErrorHandler");
describe("GraphErrorHandler.ts", function () {
    describe("constructError", function () {
        it("Should return custom error without code", function () {
            var message = "test";
            var error = new Error(message);
            var gError = GraphErrorHandler_1.GraphErrorHandler["constructError"](error);
            chai_1.assert.equal(gError.message, message);
        });
        it("Should return custom error with code and message", function () {
            var message = "test";
            var name = "test_name";
            var error = new Error(message);
            error.name = name;
            var gError = GraphErrorHandler_1.GraphErrorHandler["constructError"](error);
            chai_1.assert.equal(gError.message, message);
            chai_1.assert.equal(gError.code, name);
        });
    });
    describe("constructErrorFromResponse", function () {
        var statusCode = 400;
        var error = {
            error: {
                code: "DataNotAvailable",
                message: "The data that is being requested is not present",
            },
        };
        it("Should construct error for error response without innerError property", function () {
            var gError = GraphErrorHandler_1.GraphErrorHandler["constructErrorFromResponse"](error, statusCode);
            chai_1.assert.isTrue(gError instanceof src_1.GraphError);
            chai_1.assert.equal(gError.statusCode, statusCode);
            chai_1.assert.equal(gError.requestId, null);
        });
        it("Should construct error for the response missing one or more properties in innerError property", function () {
            error.error.innerError = {
                "request-id": "some random id",
            };
            var gError = GraphErrorHandler_1.GraphErrorHandler["constructErrorFromResponse"](error, statusCode);
            chai_1.assert.isTrue(gError instanceof src_1.GraphError);
            chai_1.assert.equal(gError.statusCode, statusCode);
            chai_1.assert.equal(gError.requestId, "some random id");
        });
        it("Should construct error for the complete error response", function () {
            var date = new Date();
            var requestId = "some random id";
            error.error.innerError = {
                "request-id": requestId,
                date: date,
            };
            var gError = GraphErrorHandler_1.GraphErrorHandler["constructErrorFromResponse"](error, statusCode);
            chai_1.assert.isTrue(gError instanceof src_1.GraphError);
            chai_1.assert.equal(gError.statusCode, statusCode);
            chai_1.assert.equal(gError.requestId, "some random id");
            chai_1.assert.equal(gError.date.toUTCString(), date.toUTCString());
        });
    });
    describe("getError", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            it("Should construct error from response", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var errorResponse, gError;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            errorResponse = {
                                error: {
                                    code: "500",
                                    message: "Internal Server Error",
                                    innerError: {
                                        "request-id": "some random id",
                                    },
                                },
                            };
                            return [4 /*yield*/, GraphErrorHandler_1.GraphErrorHandler.getError(errorResponse)];
                        case 1:
                            gError = _a.sent();
                            chai_1.assert.isTrue(gError instanceof src_1.GraphError);
                            chai_1.assert.equal(gError.requestId, "some random id");
                            chai_1.assert.equal(gError.code, "500");
                            chai_1.assert.equal(gError.message, "Internal Server Error");
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should construct error from error object", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var error, gError;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = new Error("Some Error");
                            error.name = "InvalidError";
                            return [4 /*yield*/, GraphErrorHandler_1.GraphErrorHandler.getError(error)];
                        case 1:
                            gError = _a.sent();
                            chai_1.assert.isTrue(gError instanceof src_1.GraphError);
                            chai_1.assert.equal(gError.requestId, null);
                            chai_1.assert.equal(gError.message, "Some Error");
                            chai_1.assert.equal(gError.code, "InvalidError");
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should construct some default error", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var gError;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, GraphErrorHandler_1.GraphErrorHandler.getError()];
                        case 1:
                            gError = _a.sent();
                            chai_1.assert.isTrue(gError instanceof src_1.GraphError);
                            chai_1.assert.equal(gError.message, "");
                            chai_1.assert.equal(gError.statusCode, -1);
                            chai_1.assert.equal(gError.code, null);
                            chai_1.assert.equal(gError.body, null);
                            chai_1.assert.equal(gError.requestId, null);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=GraphErrorHandler.js.map