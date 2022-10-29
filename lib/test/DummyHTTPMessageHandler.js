"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyHTTPMessageHandler = void 0;
var tslib_1 = require("tslib");
/**
 * @class
 * @implements Middleware
 * Class representing DummyHTTPMessageHandler
 */
var DummyHTTPMessageHandler = /** @class */ (function () {
    /**
     * @public
     * @constructor
     * To create an instance of DummyHTTPMessageHandler
     * @param {Response[]} [responses = []] - The array of response objects
     * @returns An instance of DummyHTTPMessageHandler
     */
    function DummyHTTPMessageHandler(responses) {
        if (responses === void 0) { responses = []; }
        this.responses = responses;
    }
    /**
     * @public
     * To set the array of responses
     * @param {Response[]} response - The array of responses
     * @returns Nothing
     */
    DummyHTTPMessageHandler.prototype.setResponses = function (responses) {
        this.responses = responses;
    };
    /**
     * @public
     * @async
     * To execute the current middleware
     * @param {Context} context - The request context object
     * @returns A promise that resolves to nothing
     */
    DummyHTTPMessageHandler.prototype.execute = function (context) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                context.response = this.responses.shift();
                return [2 /*return*/];
            });
        });
    };
    return DummyHTTPMessageHandler;
}());
exports.DummyHTTPMessageHandler = DummyHTTPMessageHandler;
//# sourceMappingURL=DummyHTTPMessageHandler.js.map