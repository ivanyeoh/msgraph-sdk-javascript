"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyAuthenticationProvider = void 0;
var tslib_1 = require("tslib");
/**
 * @class
 * @implements AuthenticationProvider
 * Class representing DummyAuthenticationProvider
 */
var DummyAuthenticationProvider = /** @class */ (function () {
    function DummyAuthenticationProvider() {
    }
    /**
     * @public
     * @async
     * To get the access token
     * @returns The promise that resolves to an access token
     */
    DummyAuthenticationProvider.prototype.getAccessToken = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var token;
            return tslib_1.__generator(this, function (_a) {
                token = "DUMMY_TOKEN";
                return [2 /*return*/, Promise.resolve(token)];
            });
        });
    };
    return DummyAuthenticationProvider;
}());
exports.DummyAuthenticationProvider = DummyAuthenticationProvider;
//# sourceMappingURL=DummyAuthenticationProvider.js.map