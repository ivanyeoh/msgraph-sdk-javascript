"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var RetryHandlerOptions_1 = require("../../../src/middleware/options/RetryHandlerOptions");
describe("RetryHandlerOptions.ts", function () {
    describe("Constructor", function () {
        it("Should use default values if not given", function () {
            var options = new RetryHandlerOptions_1.RetryHandlerOptions();
            chai_1.assert.equal(options["delay"], RetryHandlerOptions_1.RetryHandlerOptions["DEFAULT_DELAY"]);
            chai_1.assert.equal(options["maxRetries"], RetryHandlerOptions_1.RetryHandlerOptions["DEFAULT_MAX_RETRIES"]);
            chai_1.assert.equal(options["shouldRetry"], RetryHandlerOptions_1.RetryHandlerOptions["defaultShouldRetry"]);
        });
        it("Should throw error for both delay and maxRetries are higher than the limit", function () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var options = new RetryHandlerOptions_1.RetryHandlerOptions(1000, 1000);
                throw new Error("Test Failed - Something wrong with the delay and maxRetries max limit validation");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "MaxLimitExceeded");
            }
        });
        it("Should throw error for delay is higher than the limit", function () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var options = new RetryHandlerOptions_1.RetryHandlerOptions(1000, 2);
                throw new Error("Test Failed - Test Failed - Something wrong with the delay max limit validation");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "MaxLimitExceeded");
            }
        });
        it("Should throw error for maxRetries is higher than the limit", function () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var options = new RetryHandlerOptions_1.RetryHandlerOptions(1, 2000);
                throw new Error("Test Failed - Something wrong with the maxRetries max limit validation");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "MaxLimitExceeded");
            }
        });
        it("Should throw error for both delay and maxRetries are negative", function () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var options = new RetryHandlerOptions_1.RetryHandlerOptions(-1, -100);
                throw new Error("Test Failed - Something wrong with the delay and maxRetries max limit validation");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "MinExpectationNotMet");
            }
        });
        it("Should throw error for delay is negative", function () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var options = new RetryHandlerOptions_1.RetryHandlerOptions(-5, 2);
                throw new Error("Test Failed - Something wrong with the delay max limit validation");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "MinExpectationNotMet");
            }
        });
        it("Should throw error for maxRetries is negative", function () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var options = new RetryHandlerOptions_1.RetryHandlerOptions(1, -10);
                throw new Error("Test Failed - Something wrong with the maxRetries max limit validation");
            }
            catch (error) {
                chai_1.assert.equal(error.name, "MinExpectationNotMet");
            }
        });
        it("Should accept all the given values", function () {
            var delay = 1;
            var maxRetries = 3;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            var shouldRetry = function (d, a, req, o, res) {
                return false;
            };
            var options = new RetryHandlerOptions_1.RetryHandlerOptions(delay, maxRetries, shouldRetry);
            chai_1.assert.equal(options.delay, delay);
            chai_1.assert.equal(options.maxRetries, maxRetries);
            chai_1.assert.equal(options.shouldRetry, shouldRetry);
        });
    });
    describe("getMaxDelay", function () {
        it("Should return the max delay value", function () {
            var options = new RetryHandlerOptions_1.RetryHandlerOptions();
            chai_1.assert.equal(options.getMaxDelay(), RetryHandlerOptions_1.RetryHandlerOptions["MAX_DELAY"]);
        });
    });
});
//# sourceMappingURL=RetryHandlerOptions.js.map