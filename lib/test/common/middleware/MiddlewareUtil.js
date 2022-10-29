"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/* tslint:disable */
var chai_1 = require("chai");
var MiddlewareUtil_1 = require("../../../src/middleware/MiddlewareUtil");
describe("MiddlewareUtil.ts", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    function getMultipleValuesForHeader(headers, key) {
        return headers
            .get(key)
            .split(",")
            .map(function (item) {
            return item.trim();
        });
    }
    return tslib_1.__generator(this, function (_a) {
        describe("getRequestHeader", function () {
            var key = "Content-Type";
            var value = "application/json";
            var url = "dummy_url";
            it("Should get header from request object", function () {
                var _a;
                var request = new Request(url, {
                    method: "test",
                    headers: (_a = {
                            version: "version"
                        },
                        _a[key] = value,
                        _a),
                });
                var headerValue = (0, MiddlewareUtil_1.getRequestHeader)(request, undefined, key);
                chai_1.assert.equal(headerValue, value);
            });
            it("Should get header from headers object", function () {
                var _a;
                var options = {
                    method: "test",
                    headers: (_a = {
                            version: "version"
                        },
                        _a[key] = value,
                        _a),
                };
                var headerValue = (0, MiddlewareUtil_1.getRequestHeader)(url, options, key);
                chai_1.assert.equal(headerValue, value);
            });
            it("Should get header from Headers instance", function () {
                var _a;
                var options = {
                    method: "test",
                    headers: new Headers((_a = {
                            version: "version"
                        },
                        _a[key] = value,
                        _a)),
                };
                var headerValue = (0, MiddlewareUtil_1.getRequestHeader)(url, options, key);
                chai_1.assert.equal(headerValue, value);
            });
            it("Should get header from array of headers", function () {
                var options = {
                    method: "test",
                    headers: [
                        ["version", "version"],
                        [key, value],
                    ],
                };
                var headerValue = (0, MiddlewareUtil_1.getRequestHeader)(url, options, key);
                chai_1.assert.equal(headerValue, value);
            });
        });
        describe("setRequestHeader", function () {
            var key = "Content-Type";
            var value = "application/json";
            var url = "dummy_url";
            it("Should set header in request object", function () {
                var request = new Request(url, {
                    method: "test",
                    headers: {
                        version: "version",
                    },
                });
                (0, MiddlewareUtil_1.setRequestHeader)(request, undefined, key, value);
                chai_1.assert.equal(request.headers.get(key), value);
            });
            it("Should replace header in request object if the header is already present", function () {
                var _a;
                var request = new Request(url, {
                    method: "test",
                    headers: (_a = {
                            version: "version"
                        },
                        _a[key] = value,
                        _a),
                });
                (0, MiddlewareUtil_1.setRequestHeader)(request, undefined, key, value);
                chai_1.assert.equal(request.headers.get(key), value);
            });
            it("Should set header for empty headers", function () {
                var options = {
                    method: "test",
                };
                (0, MiddlewareUtil_1.setRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                chai_1.assert.equal(options.headers.get(key), value);
            });
            it("Should set header in headers object", function () {
                var options = {
                    method: "test",
                    headers: {
                        version: "version",
                    },
                };
                (0, MiddlewareUtil_1.setRequestHeader)(url, options, key, value);
                chai_1.assert.equal(options.headers[key], value);
            });
            it("Should replace header in headers object if header is already present", function () {
                var _a;
                var options = {
                    method: "test",
                    headers: (_a = {
                            version: "version"
                        },
                        _a[key] = value,
                        _a),
                };
                (0, MiddlewareUtil_1.setRequestHeader)(url, options, key, value);
                chai_1.assert.equal(options.headers[key], value);
            });
            it("Should set header in Headers instance", function () {
                var options = {
                    method: "test",
                    headers: new Headers({ version: "version" }),
                };
                (0, MiddlewareUtil_1.setRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                chai_1.assert.equal(options.headers.get(key), value);
            });
            it("Should replace header in Headers instance if header is already present", function () {
                var _a;
                var options = {
                    method: "test",
                    headers: new Headers((_a = { version: "version" }, _a[key] = value, _a)),
                };
                (0, MiddlewareUtil_1.setRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                chai_1.assert.equal(options.headers.get(key), value);
            });
            it("Should set header in array of headers", function () {
                var options = {
                    method: "test",
                    headers: [["version", "version"]],
                };
                (0, MiddlewareUtil_1.setRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                chai_1.assert.equal(options.headers[1][1], value);
            });
            it("Should replace header in array of headers if header is already present", function () {
                var options = {
                    method: "test",
                    headers: [[key, "dummy/type"]],
                };
                (0, MiddlewareUtil_1.setRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                chai_1.assert.equal(options.headers.length, 1);
                chai_1.assert.equal(options.headers[0][0], key);
                chai_1.assert.equal(options.headers[0][1], value);
            });
        });
        describe("appendRequestHeader", function () {
            var key = "Content-Type";
            var value = "application/json";
            var firstValue = "text/html";
            var url = "dummy_url";
            it("Should set header in request object if the header is not present", function () {
                var request = new Request(url, {
                    method: "test",
                    headers: {
                        version: "version",
                    },
                });
                (0, MiddlewareUtil_1.appendRequestHeader)(request, undefined, key, value);
                chai_1.assert.equal(request.headers.get(key), value);
            });
            it("Should append header in request object", function () {
                var _a;
                var request = new Request(url, {
                    method: "test",
                    headers: (_a = {
                            version: "version"
                        },
                        _a[key] = firstValue,
                        _a),
                });
                (0, MiddlewareUtil_1.appendRequestHeader)(request, undefined, key, value);
                var values = getMultipleValuesForHeader(request.headers, key);
                chai_1.assert.equal(values[0], firstValue);
                chai_1.assert.equal(values[1], value);
            });
            it("Should append header in request object even if the value is duplicate", function () {
                var _a;
                var request = new Request(url, {
                    method: "test",
                    headers: (_a = {
                            version: "version"
                        },
                        _a[key] = value,
                        _a),
                });
                (0, MiddlewareUtil_1.appendRequestHeader)(request, undefined, key, value);
                var values = getMultipleValuesForHeader(request.headers, key);
                chai_1.assert.equal(values[0], value);
                chai_1.assert.equal(values[1], value);
            });
            it("Should set header for empty headers", function () {
                var options = {
                    method: "test",
                };
                (0, MiddlewareUtil_1.appendRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                chai_1.assert.equal(options.headers.get(key), value);
            });
            it("Should set header in headers object if header is not present", function () {
                var options = {
                    method: "test",
                    headers: {
                        version: "version",
                    },
                };
                (0, MiddlewareUtil_1.appendRequestHeader)(url, options, key, value);
                chai_1.assert.equal(options.headers[key], value);
            });
            it("Should append header in headers object", function () {
                var _a;
                var options = {
                    method: "test",
                    headers: (_a = {
                            version: "version"
                        },
                        _a[key] = firstValue,
                        _a),
                };
                (0, MiddlewareUtil_1.appendRequestHeader)(url, options, key, value);
                chai_1.assert.equal(options.headers[key], "".concat(firstValue, ", ").concat(value));
            });
            it("Should append header in headers object even if the value is duplicate", function () {
                var _a;
                var options = {
                    method: "test",
                    headers: (_a = {
                            version: "version"
                        },
                        _a[key] = value,
                        _a),
                };
                (0, MiddlewareUtil_1.appendRequestHeader)(url, options, key, value);
                chai_1.assert.equal(options.headers[key], "".concat(value, ", ").concat(value));
            });
            it("Should set header in Headers instance if header is not present", function () {
                var options = {
                    method: "test",
                    headers: new Headers({ version: "version" }),
                };
                (0, MiddlewareUtil_1.appendRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                chai_1.assert.equal(options.headers.get(key), value);
            });
            it("Should append header in Headers instance", function () {
                var _a;
                var options = {
                    method: "test",
                    headers: new Headers((_a = { version: "version" }, _a[key] = firstValue, _a)),
                };
                (0, MiddlewareUtil_1.appendRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                var values = getMultipleValuesForHeader(options.headers, key);
                chai_1.assert.equal(values[0], firstValue);
                chai_1.assert.equal(values[1], value);
            });
            it("Should append header in Headers instance even if the value is duplicate", function () {
                var _a;
                var options = {
                    method: "test",
                    headers: new Headers((_a = { version: "version" }, _a[key] = value, _a)),
                };
                (0, MiddlewareUtil_1.appendRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                var values = getMultipleValuesForHeader(options.headers, key);
                chai_1.assert.equal(values[0], value);
                chai_1.assert.equal(values[1], value);
            });
            it("Should set header in array of headers if the header is not present", function () {
                var options = {
                    method: "test",
                    headers: [["version", "version"]],
                };
                (0, MiddlewareUtil_1.appendRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                chai_1.assert.equal(options.headers[1][1], value);
            });
            it("Should append header in array of headers", function () {
                var options = {
                    method: "test",
                    headers: [[key, firstValue]],
                };
                (0, MiddlewareUtil_1.appendRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                chai_1.assert.equal(options.headers.length, 2);
                chai_1.assert.equal(options.headers[0][0], key);
                chai_1.assert.equal(options.headers[0][1], firstValue);
                chai_1.assert.equal(options.headers[1][0], key);
                chai_1.assert.equal(options.headers[1][1], value);
            });
            it("Should append header in array of headers even if the value is duplicate", function () {
                var options = {
                    method: "test",
                    headers: [[key, value]],
                };
                (0, MiddlewareUtil_1.appendRequestHeader)(url, options, key, value);
                chai_1.assert.isDefined(options.headers);
                chai_1.assert.equal(options.headers.length, 2);
                chai_1.assert.equal(options.headers[0][0], key);
                chai_1.assert.equal(options.headers[0][1], value);
                chai_1.assert.equal(options.headers[1][0], key);
                chai_1.assert.equal(options.headers[1][1], value);
            });
        });
        describe("generateUUID", function () {
            it("Should return the unique uuid", function () {
                var uuid = (0, MiddlewareUtil_1.generateUUID)();
                chai_1.assert.equal(uuid.length, 36);
            });
        });
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=MiddlewareUtil.js.map