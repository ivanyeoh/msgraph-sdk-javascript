import { __awaiter } from "tslib";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/* tslint:disable */
import { assert } from "chai";
import { appendRequestHeader, generateUUID, getRequestHeader, setRequestHeader } from "../../../src/middleware/MiddlewareUtil";
describe("MiddlewareUtil.ts", () => __awaiter(void 0, void 0, void 0, function* () {
    function getMultipleValuesForHeader(headers, key) {
        return headers
            .get(key)
            .split(",")
            .map(function (item) {
            return item.trim();
        });
    }
    describe("getRequestHeader", () => {
        const key = "Content-Type";
        const value = "application/json";
        const url = "dummy_url";
        it("Should get header from request object", () => {
            const request = new Request(url, {
                method: "test",
                headers: {
                    version: "version",
                    [key]: value,
                },
            });
            const headerValue = getRequestHeader(request, undefined, key);
            assert.equal(headerValue, value);
        });
        it("Should get header from headers object", () => {
            const options = {
                method: "test",
                headers: {
                    version: "version",
                    [key]: value,
                },
            };
            const headerValue = getRequestHeader(url, options, key);
            assert.equal(headerValue, value);
        });
        it("Should get header from Headers instance", () => {
            const options = {
                method: "test",
                headers: new Headers({
                    version: "version",
                    [key]: value,
                }),
            };
            const headerValue = getRequestHeader(url, options, key);
            assert.equal(headerValue, value);
        });
        it("Should get header from array of headers", () => {
            const options = {
                method: "test",
                headers: [
                    ["version", "version"],
                    [key, value],
                ],
            };
            const headerValue = getRequestHeader(url, options, key);
            assert.equal(headerValue, value);
        });
    });
    describe("setRequestHeader", () => {
        const key = "Content-Type";
        const value = "application/json";
        const url = "dummy_url";
        it("Should set header in request object", () => {
            const request = new Request(url, {
                method: "test",
                headers: {
                    version: "version",
                },
            });
            setRequestHeader(request, undefined, key, value);
            assert.equal(request.headers.get(key), value);
        });
        it("Should replace header in request object if the header is already present", () => {
            const request = new Request(url, {
                method: "test",
                headers: {
                    version: "version",
                    [key]: value,
                },
            });
            setRequestHeader(request, undefined, key, value);
            assert.equal(request.headers.get(key), value);
        });
        it("Should set header for empty headers", () => {
            const options = {
                method: "test",
            };
            setRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            assert.equal(options.headers.get(key), value);
        });
        it("Should set header in headers object", () => {
            const options = {
                method: "test",
                headers: {
                    version: "version",
                },
            };
            setRequestHeader(url, options, key, value);
            assert.equal(options.headers[key], value);
        });
        it("Should replace header in headers object if header is already present", () => {
            const options = {
                method: "test",
                headers: {
                    version: "version",
                    [key]: value,
                },
            };
            setRequestHeader(url, options, key, value);
            assert.equal(options.headers[key], value);
        });
        it("Should set header in Headers instance", () => {
            const options = {
                method: "test",
                headers: new Headers({ version: "version" }),
            };
            setRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            assert.equal(options.headers.get(key), value);
        });
        it("Should replace header in Headers instance if header is already present", () => {
            const options = {
                method: "test",
                headers: new Headers({ version: "version", [key]: value }),
            };
            setRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            assert.equal(options.headers.get(key), value);
        });
        it("Should set header in array of headers", () => {
            const options = {
                method: "test",
                headers: [["version", "version"]],
            };
            setRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            assert.equal(options.headers[1][1], value);
        });
        it("Should replace header in array of headers if header is already present", () => {
            const options = {
                method: "test",
                headers: [[key, "dummy/type"]],
            };
            setRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            assert.equal(options.headers.length, 1);
            assert.equal(options.headers[0][0], key);
            assert.equal(options.headers[0][1], value);
        });
    });
    describe("appendRequestHeader", () => {
        const key = "Content-Type";
        const value = "application/json";
        const firstValue = "text/html";
        const url = "dummy_url";
        it("Should set header in request object if the header is not present", () => {
            const request = new Request(url, {
                method: "test",
                headers: {
                    version: "version",
                },
            });
            appendRequestHeader(request, undefined, key, value);
            assert.equal(request.headers.get(key), value);
        });
        it("Should append header in request object", () => {
            const request = new Request(url, {
                method: "test",
                headers: {
                    version: "version",
                    [key]: firstValue,
                },
            });
            appendRequestHeader(request, undefined, key, value);
            const values = getMultipleValuesForHeader(request.headers, key);
            assert.equal(values[0], firstValue);
            assert.equal(values[1], value);
        });
        it("Should append header in request object even if the value is duplicate", () => {
            const request = new Request(url, {
                method: "test",
                headers: {
                    version: "version",
                    [key]: value,
                },
            });
            appendRequestHeader(request, undefined, key, value);
            const values = getMultipleValuesForHeader(request.headers, key);
            assert.equal(values[0], value);
            assert.equal(values[1], value);
        });
        it("Should set header for empty headers", () => {
            const options = {
                method: "test",
            };
            appendRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            assert.equal(options.headers.get(key), value);
        });
        it("Should set header in headers object if header is not present", () => {
            const options = {
                method: "test",
                headers: {
                    version: "version",
                },
            };
            appendRequestHeader(url, options, key, value);
            assert.equal(options.headers[key], value);
        });
        it("Should append header in headers object", () => {
            const options = {
                method: "test",
                headers: {
                    version: "version",
                    [key]: firstValue,
                },
            };
            appendRequestHeader(url, options, key, value);
            assert.equal(options.headers[key], `${firstValue}, ${value}`);
        });
        it("Should append header in headers object even if the value is duplicate", () => {
            const options = {
                method: "test",
                headers: {
                    version: "version",
                    [key]: value,
                },
            };
            appendRequestHeader(url, options, key, value);
            assert.equal(options.headers[key], `${value}, ${value}`);
        });
        it("Should set header in Headers instance if header is not present", () => {
            const options = {
                method: "test",
                headers: new Headers({ version: "version" }),
            };
            appendRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            assert.equal(options.headers.get(key), value);
        });
        it("Should append header in Headers instance", () => {
            const options = {
                method: "test",
                headers: new Headers({ version: "version", [key]: firstValue }),
            };
            appendRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            const values = getMultipleValuesForHeader(options.headers, key);
            assert.equal(values[0], firstValue);
            assert.equal(values[1], value);
        });
        it("Should append header in Headers instance even if the value is duplicate", () => {
            const options = {
                method: "test",
                headers: new Headers({ version: "version", [key]: value }),
            };
            appendRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            const values = getMultipleValuesForHeader(options.headers, key);
            assert.equal(values[0], value);
            assert.equal(values[1], value);
        });
        it("Should set header in array of headers if the header is not present", () => {
            const options = {
                method: "test",
                headers: [["version", "version"]],
            };
            appendRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            assert.equal(options.headers[1][1], value);
        });
        it("Should append header in array of headers", () => {
            const options = {
                method: "test",
                headers: [[key, firstValue]],
            };
            appendRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            assert.equal(options.headers.length, 2);
            assert.equal(options.headers[0][0], key);
            assert.equal(options.headers[0][1], firstValue);
            assert.equal(options.headers[1][0], key);
            assert.equal(options.headers[1][1], value);
        });
        it("Should append header in array of headers even if the value is duplicate", () => {
            const options = {
                method: "test",
                headers: [[key, value]],
            };
            appendRequestHeader(url, options, key, value);
            assert.isDefined(options.headers);
            assert.equal(options.headers.length, 2);
            assert.equal(options.headers[0][0], key);
            assert.equal(options.headers[0][1], value);
            assert.equal(options.headers[1][0], key);
            assert.equal(options.headers[1][1], value);
        });
    });
    describe("generateUUID", () => {
        it("Should return the unique uuid", () => {
            const uuid = generateUUID();
            assert.equal(uuid.length, 36);
        });
    });
}));
//# sourceMappingURL=MiddlewareUtil.js.map