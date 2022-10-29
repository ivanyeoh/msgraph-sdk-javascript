"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var AuthenticationHandlerOptions_1 = require("../../../src/middleware/options/AuthenticationHandlerOptions");
var DummyAuthenticationProvider_1 = require("../../DummyAuthenticationProvider");
describe("AuthenticationHandlerOptions.ts", function () {
    var dummyAuthProvider = new DummyAuthenticationProvider_1.DummyAuthenticationProvider();
    var authOptions = { scopes: ["test"] };
    it("Should create an instance with all the given options", function () {
        var options = new AuthenticationHandlerOptions_1.AuthenticationHandlerOptions(dummyAuthProvider, authOptions);
        chai_1.assert.equal(options.authenticationProvider, dummyAuthProvider);
        chai_1.assert.equal(options.authenticationProviderOptions, authOptions);
    });
    it("Should be undefined value if no value is passed", function () {
        var options = new AuthenticationHandlerOptions_1.AuthenticationHandlerOptions(undefined, authOptions);
        chai_1.assert.isUndefined(options.authenticationProvider);
        chai_1.assert.equal(options.authenticationProviderOptions, authOptions);
    });
});
//# sourceMappingURL=AuthenticationHandlerOptions.js.map