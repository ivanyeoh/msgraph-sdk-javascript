"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = exports.getClient = void 0;
var index_1 = require("../src/index");
var DummyAuthenticationProvider_1 = require("./DummyAuthenticationProvider");
function getClient() {
    return index_1.Client.initWithMiddleware({
        authProvider: new DummyAuthenticationProvider_1.DummyAuthenticationProvider(),
    });
}
exports.getClient = getClient;
function randomString() {
    return Math.random()
        .toString(36)
        .substring(7);
}
exports.randomString = randomString;
//# sourceMappingURL=test-helper.js.map