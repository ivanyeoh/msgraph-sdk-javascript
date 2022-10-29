"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyHandlerOptions = void 0;
/**
 * @class
 * @implements MiddlewareOptions
 * Class for DummyHandlerOptions
 */
var DummyHandlerOptions = /** @class */ (function () {
    /**
     * @public
     * @async
     * To create an instance of DummyHandlerOptions
     * @param {string} dummyString - The dummy string
     * @returns An instance of DummyHandlerOptions
     */
    function DummyHandlerOptions(dummyString) {
        if (dummyString === void 0) { dummyString = "dummy"; }
        this.dummyString = dummyString;
    }
    return DummyHandlerOptions;
}());
exports.DummyHandlerOptions = DummyHandlerOptions;
//# sourceMappingURL=DummyHandlerOptions.js.map