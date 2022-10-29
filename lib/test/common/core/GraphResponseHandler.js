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
var GraphResponseHandler_1 = require("../../../src/GraphResponseHandler");
var ResponseType_1 = require("../../../src/ResponseType");
describe("GraphResponseHandler.ts", function () {
    var htmlString = "<!DOCTYPE html>\n                        <html lang=\"en\">\n                            <head>\n                                <meta charset=\"UTF-8\">\n                                <title>Testing Document</title>\n                            </head>\n                            <body>\n                                <h1 id=\"test\">Testing</h1>\n                            </body>\n                        </html>";
    var status200 = {
        status: 200,
        statusText: "OK",
    };
    var status204 = {
        status: 204,
        statusText: "OK",
    };
    var status500 = {
        status: 500,
        statusText: "Internal Server Error",
    };
    var status202 = {
        status: 202,
        statusText: "OK",
    };
    var status200Text = {
        status: 200,
        stautsText: "OK",
        headers: {
            "Content-Type": "text/plain",
        },
    };
    var status200Json = {
        status: 200,
        stautsText: "OK",
        headers: {
            "Content-Type": "application/json",
        },
    };
    var status200Unknown = {
        status: 200,
        statusText: "OK",
        headers: {
            "Content-Type": "dummy/unknown",
        },
    };
    /* tslint:disable: no-string-literal */
    describe("convertResponse", function () {
        it("Should return empty response for the NO CONTENT (204 response)", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new Response(undefined, status204);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["convertResponse"](response)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.isUndefined(responseValue);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return internal server error (500 response)", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new Response(undefined, status500);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["convertResponse"](response)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.isNull(responseValue);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return empty text value for empty response", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new Response(undefined, status202);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["convertResponse"](response)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.isNull(responseValue);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return text data for text/plain content-type", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var data, response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = "text data";
                        response = new Response(data, status200Text);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["convertResponse"](response)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.equal(responseValue, data);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return json data for application/json content-type", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var data, response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            test: "test",
                        };
                        response = new Response(JSON.stringify(data), status200Json);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["convertResponse"](response)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.equal(responseValue.test, data.test);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return raw response incase of unknown content-type", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var data, response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = "test data";
                        response = new Response(data, status200Unknown);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["convertResponse"](response)];
                    case 1:
                        responseValue = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return response value as text", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new Response(htmlString, status200);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["convertResponse"](response, ResponseType_1.ResponseType.TEXT)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.isDefined(responseValue);
                        chai_1.assert.equal(typeof responseValue, "string");
                        chai_1.assert.equal(responseValue, htmlString);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return response value as json", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var json, response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json = { test: "test" };
                        response = new Response(JSON.stringify(json), status200);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["convertResponse"](response, ResponseType_1.ResponseType.JSON)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.isDefined(responseValue);
                        chai_1.assert.equal(responseValue.test, "test");
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return response value as text for default response type", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new Response(htmlString, status200);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["convertResponse"](response)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.isDefined(responseValue);
                        chai_1.assert.equal(typeof responseValue, "string");
                        chai_1.assert.equal(responseValue, htmlString);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("getResponse", function () {
        it("Should return a raw response", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new Response(htmlString, status200);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler.getResponse(response, ResponseType_1.ResponseType.RAW)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.isDefined(responseValue);
                        chai_1.assert.isTrue(responseValue instanceof Response);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return valid 200 OK response", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new Response(htmlString, status200);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler.getResponse(response, ResponseType_1.ResponseType.TEXT)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.isDefined(responseValue);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=GraphResponseHandler.js.map