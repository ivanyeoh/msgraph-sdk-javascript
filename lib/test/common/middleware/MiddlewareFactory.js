"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var src_1 = require("../../../src");
var MiddlewareFactory_1 = require("../../../src/middleware/MiddlewareFactory");
describe("MiddlewareFactory", function () {
    it("Should return the default pipeline", function () {
        var provider = function (done) {
            done(null, "dummy_token");
        };
        var defaultMiddleWareArray = MiddlewareFactory_1.MiddlewareFactory.getDefaultMiddlewareChain(new src_1.CustomAuthenticationProvider(provider));
        chai_1.assert.isTrue(defaultMiddleWareArray[0] instanceof src_1.AuthenticationHandler);
        chai_1.assert.isTrue(defaultMiddleWareArray[1] instanceof src_1.RetryHandler);
        chai_1.assert.isTrue(defaultMiddleWareArray[2] instanceof src_1.RedirectHandler);
        chai_1.assert.isTrue(defaultMiddleWareArray[3] instanceof src_1.TelemetryHandler);
        chai_1.assert.isTrue(defaultMiddleWareArray[4] instanceof src_1.HTTPMessageHandler);
    });
});
//# sourceMappingURL=MiddlewareFactory.js.map