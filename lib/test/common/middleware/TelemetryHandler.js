"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var Constants_1 = require("../../../src/Constants");
var MiddlewareControl_1 = require("../../../src/middleware/MiddlewareControl");
var TelemetryHandlerOptions_1 = require("../../../src/middleware/options/TelemetryHandlerOptions");
var TelemetryHandler_1 = require("../../../src/middleware/TelemetryHandler");
var Version_1 = require("../../../src/Version");
var DummyHTTPMessageHandler_1 = require("../../DummyHTTPMessageHandler");
describe("TelemetryHandler.ts", function () {
    describe("execute", function () {
        var _this = this;
        this.timeout(20 * 1000);
        var telemetryHandler = new TelemetryHandler_1.TelemetryHandler();
        var dummyHTTPHandler = new DummyHTTPMessageHandler_1.DummyHTTPMessageHandler();
        var uuid = "dummy_uuid";
        var sdkVersion = "dummy_version";
        telemetryHandler.setNext(dummyHTTPHandler);
        var okayResponse = new Response("", {
            status: 200,
            statusText: "OK",
        });
        it("Should not disturb client-request-id in the header", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var context;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = {
                            request: Constants_1.GRAPH_BASE_URL,
                            options: {
                                headers: {
                                    "client-request-id": uuid,
                                },
                            },
                        };
                        dummyHTTPHandler.setResponses([okayResponse]);
                        return [4 /*yield*/, telemetryHandler.execute(context)];
                    case 1:
                        _a.sent();
                        chai_1.assert.equal(context.options.headers["client-request-id"], uuid);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should create client-request-id if one is not present in the request header", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var context;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = {
                            request: "https://GRAPH.microsoft.com:443/",
                            options: {
                                headers: {
                                    method: "GET",
                                },
                            },
                        };
                        dummyHTTPHandler.setResponses([okayResponse]);
                        return [4 /*yield*/, telemetryHandler.execute(context)];
                    case 1:
                        _a.sent();
                        chai_1.assert.isDefined(context.options.headers["client-request-id"]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should set sdk version header without feature flag usage if telemetry options is not present", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var context;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = {
                            request: Constants_1.GRAPH_BASE_URL,
                            options: {
                                headers: {
                                    method: "GET",
                                },
                            },
                        };
                        dummyHTTPHandler.setResponses([okayResponse]);
                        return [4 /*yield*/, telemetryHandler.execute(context)];
                    case 1:
                        _a.sent();
                        chai_1.assert.equal(context.options.headers["SdkVersion"], "graph-js/".concat(Version_1.PACKAGE_VERSION));
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should set sdk version header with feature flag", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var telemetryOptions, context;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        telemetryOptions = new TelemetryHandlerOptions_1.TelemetryHandlerOptions();
                        telemetryOptions["setFeatureUsage"](TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
                        context = {
                            request: Constants_1.GRAPH_BASE_URL,
                            options: {
                                headers: {
                                    method: "GET",
                                },
                            },
                            middlewareControl: new MiddlewareControl_1.MiddlewareControl([telemetryOptions]),
                        };
                        dummyHTTPHandler.setResponses([okayResponse]);
                        return [4 /*yield*/, telemetryHandler.execute(context)];
                    case 1:
                        _a.sent();
                        chai_1.assert.equal(context.options.headers["SdkVersion"], "graph-js/".concat(Version_1.PACKAGE_VERSION, " (featureUsage=").concat(TelemetryHandlerOptions_1.FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED.toString(16), ")"));
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should not set telemetry for non-graph url", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var context;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = {
                            request: "test url",
                            options: {
                                headers: {
                                    method: "GET",
                                },
                            },
                            middlewareControl: new MiddlewareControl_1.MiddlewareControl(),
                        };
                        dummyHTTPHandler.setResponses([okayResponse]);
                        return [4 /*yield*/, telemetryHandler.execute(context)];
                    case 1:
                        _a.sent();
                        chai_1.assert.equal(context.options.headers["client-request-id"], undefined);
                        chai_1.assert.equal(context.options.headers["SdkVersion"], undefined);
                        chai_1.assert.equal(context.options.headers["setFeatureUsage"], undefined);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should not disturb client-request-id in the header when Request object is passed with Graph URL", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var request, context;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new Request(Constants_1.GRAPH_BASE_URL);
                        context = {
                            request: request,
                            options: {
                                headers: {
                                    "client-request-id": uuid,
                                    SdkVersion: sdkVersion,
                                },
                            },
                        };
                        dummyHTTPHandler.setResponses([okayResponse]);
                        return [4 /*yield*/, telemetryHandler.execute(context)];
                    case 1:
                        _a.sent();
                        chai_1.assert.equal(context.options.headers["client-request-id"], uuid);
                        chai_1.assert.equal(context.options.headers["SdkVersion"], sdkVersion);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should delete Telemetry in the header when Request object is passed with non Graph URL", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var request, context;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new Request("test_url");
                        context = {
                            request: request,
                            options: {
                                headers: {
                                    "client-request-id": uuid,
                                    SdkVersion: "test_version",
                                },
                            },
                        };
                        dummyHTTPHandler.setResponses([okayResponse]);
                        return [4 /*yield*/, telemetryHandler.execute(context)];
                    case 1:
                        _a.sent();
                        chai_1.assert.equal(context.options.headers["client-request-id"], undefined);
                        chai_1.assert.equal(context.options.headers["SdkVersion"], undefined);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=TelemetryHandler.js.map