"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var MiddlewareControl_1 = require("../../../src/middleware/MiddlewareControl");
var TelemetryHandlerOptions_1 = require("../../../src/middleware/options/TelemetryHandlerOptions");
describe("TelemetryHandlerOptions.ts", function () {
    describe("constructor", function () {
        it("Should initialize the feature usage flag with NONE flag", function () {
            var telemetryOptions = new TelemetryHandlerOptions_1.TelemetryHandlerOptions();
            chai_1.assert.equal(telemetryOptions["featureUsage"], TelemetryHandlerOptions_1.FeatureUsageFlag.NONE);
        });
    });
    describe("updateFeatureUsageFlag", function () {
        it("Should update feature usage flag for middleware control without telemetry handler option", function () {
            var context = {
                request: "url",
                middlewareControl: new MiddlewareControl_1.MiddlewareControl(),
            };
            TelemetryHandlerOptions_1.TelemetryHandlerOptions.updateFeatureUsageFlag(context, TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
            var options = context.middlewareControl.getMiddlewareOptions(TelemetryHandlerOptions_1.TelemetryHandlerOptions);
            chai_1.assert.equal(options["featureUsage"], TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
        });
        it("Should update feature usage flag for middleware control with telemetry handler option", function () {
            var context = {
                request: "url",
                middlewareControl: new MiddlewareControl_1.MiddlewareControl([new TelemetryHandlerOptions_1.TelemetryHandlerOptions()]),
            };
            TelemetryHandlerOptions_1.TelemetryHandlerOptions.updateFeatureUsageFlag(context, TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
            var options = context.middlewareControl.getMiddlewareOptions(TelemetryHandlerOptions_1.TelemetryHandlerOptions);
            chai_1.assert.equal(options["featureUsage"], TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
        });
        it("Should update feature usage flag for context object without middleware control object", function () {
            var context = {
                request: "url",
            };
            TelemetryHandlerOptions_1.TelemetryHandlerOptions.updateFeatureUsageFlag(context, TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
            var options = context.middlewareControl.getMiddlewareOptions(TelemetryHandlerOptions_1.TelemetryHandlerOptions);
            chai_1.assert.equal(options["featureUsage"], TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
        });
    });
    describe("setFeatureUsage", function () {
        it("Should set a given flags", function () {
            var telemetryOptions = new TelemetryHandlerOptions_1.TelemetryHandlerOptions();
            telemetryOptions["setFeatureUsage"](TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
            telemetryOptions["setFeatureUsage"](TelemetryHandlerOptions_1.FeatureUsageFlag.RETRY_HANDLER_ENABLED);
            chai_1.assert.equal(telemetryOptions["featureUsage"] & TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED, TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
            chai_1.assert.equal(telemetryOptions["featureUsage"] & TelemetryHandlerOptions_1.FeatureUsageFlag.RETRY_HANDLER_ENABLED, TelemetryHandlerOptions_1.FeatureUsageFlag.RETRY_HANDLER_ENABLED);
            chai_1.assert.equal(telemetryOptions["featureUsage"] & TelemetryHandlerOptions_1.FeatureUsageFlag.REDIRECT_HANDLER_ENABLED, TelemetryHandlerOptions_1.FeatureUsageFlag.NONE);
        });
    });
    describe("getFeatureUsage", function () {
        it("Should return the feature usage in hexadecimal string", function () {
            var telemetryOptions = new TelemetryHandlerOptions_1.TelemetryHandlerOptions();
            telemetryOptions["setFeatureUsage"](TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
            telemetryOptions["setFeatureUsage"](TelemetryHandlerOptions_1.FeatureUsageFlag.RETRY_HANDLER_ENABLED);
            var usageFlag = telemetryOptions.getFeatureUsage();
            chai_1.assert.equal(usageFlag, "6");
        });
    });
});
//# sourceMappingURL=TelemetryHandlerOptions.js.map