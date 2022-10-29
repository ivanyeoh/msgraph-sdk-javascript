"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var RedirectHandlerOptions_1 = require("../../../src/middleware/options/RedirectHandlerOptions");
describe("RedirectHandlerOptions.ts", function () {
    describe("constructor", function () {
        it("Should initialize the instance with given options", function () {
            var shouldRedirect = function (response) {
                if (response.status === 301) {
                    return true;
                }
                return false;
            };
            var maxRedirects = 5;
            var options = new RedirectHandlerOptions_1.RedirectHandlerOptions(maxRedirects, shouldRedirect);
            chai_1.assert.equal(options.maxRedirects, maxRedirects);
            chai_1.assert.equal(options.shouldRedirect, shouldRedirect);
        });
        it("Should throw error for setting max redirects more than allowed", function () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var options = new RedirectHandlerOptions_1.RedirectHandlerOptions(100);
                throw new Error("Test Failed - Something wrong with the max redirects value redirection");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "MaxLimitExceeded");
            }
        });
        it("Should throw error for setting max redirects to negative", function () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var options = new RedirectHandlerOptions_1.RedirectHandlerOptions(-10);
                throw new Error(" Test Failed - Something wrong with the max redirects value redirection");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "MinExpectationNotMet");
            }
        });
        it("Should initialize instance with default options", function () {
            var options = new RedirectHandlerOptions_1.RedirectHandlerOptions();
            chai_1.assert.equal(options.maxRedirects, RedirectHandlerOptions_1.RedirectHandlerOptions["DEFAULT_MAX_REDIRECTS"]);
            chai_1.assert.equal(options.shouldRedirect, RedirectHandlerOptions_1.RedirectHandlerOptions["defaultShouldRedirect"]);
        });
    });
});
//# sourceMappingURL=RedirectHandlerOptions.js.map