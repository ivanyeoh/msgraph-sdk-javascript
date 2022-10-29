"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneRequestWithNewUrl = exports.appendRequestHeader = exports.setRequestHeader = exports.getRequestHeader = exports.generateUUID = void 0;
var tslib_1 = require("tslib");
/**
 * @constant
 * To generate the UUID
 * @returns The UUID string
 */
var generateUUID = function () {
    var uuid = "";
    for (var j = 0; j < 32; j++) {
        if (j === 8 || j === 12 || j === 16 || j === 20) {
            uuid += "-";
        }
        uuid += Math.floor(Math.random() * 16).toString(16);
    }
    return uuid;
};
exports.generateUUID = generateUUID;
/**
 * @constant
 * To get the request header from the request
 * @param {RequestInfo} request - The request object or the url string
 * @param {FetchOptions|undefined} options - The request options object
 * @param {string} key - The header key string
 * @returns A header value for the given key from the request
 */
var getRequestHeader = function (request, options, key) {
    var value = null;
    if (typeof Request !== "undefined" && request instanceof Request) {
        value = request.headers.get(key);
    }
    else if (typeof options !== "undefined" && options.headers !== undefined) {
        if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
            value = options.headers.get(key);
        }
        else if (options.headers instanceof Array) {
            var headers = options.headers;
            for (var i = 0, l = headers.length; i < l; i++) {
                if (headers[i][0] === key) {
                    value = headers[i][1];
                    break;
                }
            }
        }
        else if (options.headers[key] !== undefined) {
            value = options.headers[key];
        }
    }
    return value;
};
exports.getRequestHeader = getRequestHeader;
/**
 * @constant
 * To set the header value to the given request
 * @param {RequestInfo} request - The request object or the url string
 * @param {FetchOptions|undefined} options - The request options object
 * @param {string} key - The header key string
 * @param {string } value - The header value string
 * @returns Nothing
 */
var setRequestHeader = function (request, options, key, value) {
    var _a, _b;
    if (typeof Request !== "undefined" && request instanceof Request) {
        request.headers.set(key, value);
    }
    else if (typeof options !== "undefined") {
        if (options.headers === undefined) {
            options.headers = new Headers((_a = {},
                _a[key] = value,
                _a));
        }
        else {
            if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
                options.headers.set(key, value);
            }
            else if (options.headers instanceof Array) {
                var i = 0;
                var l = options.headers.length;
                for (; i < l; i++) {
                    var header = options.headers[i];
                    if (header[0] === key) {
                        header[1] = value;
                        break;
                    }
                }
                if (i === l) {
                    options.headers.push([key, value]);
                }
            }
            else {
                Object.assign(options.headers, (_b = {}, _b[key] = value, _b));
            }
        }
    }
};
exports.setRequestHeader = setRequestHeader;
/**
 * @constant
 * To append the header value to the given request
 * @param {RequestInfo} request - The request object or the url string
 * @param {FetchOptions|undefined} options - The request options object
 * @param {string} key - The header key string
 * @param {string } value - The header value string
 * @returns Nothing
 */
var appendRequestHeader = function (request, options, key, value) {
    var _a, _b;
    if (typeof Request !== "undefined" && request instanceof Request) {
        request.headers.append(key, value);
    }
    else if (typeof options !== "undefined") {
        if (options.headers === undefined) {
            options.headers = new Headers((_a = {},
                _a[key] = value,
                _a));
        }
        else {
            if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
                options.headers.append(key, value);
            }
            else if (options.headers instanceof Array) {
                options.headers.push([key, value]);
            }
            else if (options.headers === undefined) {
                options.headers = (_b = {}, _b[key] = value, _b);
            }
            else if (options.headers[key] === undefined) {
                options.headers[key] = value;
            }
            else {
                options.headers[key] += ", ".concat(value);
            }
        }
    }
};
exports.appendRequestHeader = appendRequestHeader;
/**
 * @constant
 * To clone the request with the new url
 * @param {string} url - The new url string
 * @param {Request} request - The request object
 * @returns A promise that resolves to request object
 */
var cloneRequestWithNewUrl = function (newUrl, request) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var body, _a, method, headers, referrer, referrerPolicy, mode, credentials, cache, redirect, integrity, keepalive, signal;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!request.headers.get("Content-Type")) return [3 /*break*/, 2];
                return [4 /*yield*/, request.blob()];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, Promise.resolve(undefined)];
            case 3:
                _a = _b.sent();
                _b.label = 4;
            case 4:
                body = _a;
                method = request.method, headers = request.headers, referrer = request.referrer, referrerPolicy = request.referrerPolicy, mode = request.mode, credentials = request.credentials, cache = request.cache, redirect = request.redirect, integrity = request.integrity, keepalive = request.keepalive, signal = request.signal;
                return [2 /*return*/, new Request(newUrl, { method: method, headers: headers, body: body, referrer: referrer, referrerPolicy: referrerPolicy, mode: mode, credentials: credentials, cache: cache, redirect: redirect, integrity: integrity, keepalive: keepalive, signal: signal })];
        }
    });
}); };
exports.cloneRequestWithNewUrl = cloneRequestWithNewUrl;
//# sourceMappingURL=MiddlewareUtil.js.map