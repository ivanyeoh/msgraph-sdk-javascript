"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var ChaosHandler_1 = require("../../../src/middleware/ChaosHandler");
var MiddlewareControl_1 = require("../../../src/middleware/MiddlewareControl");
var ChaosHandlerOptions_1 = require("../../../src/middleware/options/ChaosHandlerOptions");
var ChaosStrategy_1 = require("../../../src/middleware/options/ChaosStrategy");
var RequestMethod_1 = require("../../../src/RequestMethod");
var DummyHTTPMessageHandler_1 = require("../../DummyHTTPMessageHandler");
var chaosHandlerOptions = new ChaosHandlerOptions_1.ChaosHandlerOptions();
var chaosHandler = new ChaosHandler_1.ChaosHandler();
describe("ChaosHandler.ts", function () {
    describe("constructor", function () {
        it("Should create an instance with given options", function () {
            var handler = new ChaosHandler_1.ChaosHandler(chaosHandlerOptions);
            chai_1.assert.isDefined(handler["options"]);
        });
        it("Should create an instance with default set of options", function () {
            var handler = new ChaosHandler_1.ChaosHandler();
            chai_1.assert.isDefined(handler["options"]);
        });
    });
    describe("createResponseHeaders", function () {
        it("Should have request-id for every random statusCode", function () {
            var options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "testStatusCode", 204);
            var responseHeader = chaosHandler["createResponseHeaders"](options, "xxxxxxxxxxxxxxxx", new Date().toString());
            chai_1.assert.isDefined(responseHeader.get("request-id"));
        });
        it("Should have retry-after for 429 case", function () {
            var options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "testStatusCode", 429);
            var responseHeader = chaosHandler["createResponseHeaders"](options, "xxxxxxxxxxxxxxxx", new Date().toString());
            chai_1.assert.isDefined(responseHeader.get("retry-after"));
        });
    });
    describe("createResponseBody", function () {
        it("Should return error in response body for error scenarios", function () {
            var options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Not Found", 404);
            var responseBody = chaosHandler["createResponseBody"](options, "xxxxxxxxxxxxxx", new Date().toString());
            chai_1.assert.isDefined(responseBody["error"]);
        });
        it("Should return empty response body for success scenarios", function () {
            var options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Not Found", 200);
            var responseBody = chaosHandler["createResponseBody"](options, "xxxxxxxxxxxxxx", new Date().toString());
            chai_1.assert.equal(Object.keys(responseBody).length, 0);
        });
    });
    describe("createResponse", function () {
        var cxt = {
            request: "https://graph.microsoft.com/v1.0/me",
            options: {
                method: "GET",
            },
        };
        it("Should return a valid response object for MANUAL case", function () {
            chaosHandler["createResponse"](new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Manual response", 404), cxt);
            chai_1.assert.isDefined(cxt.response);
        });
        it("Should return a valid response object for RANDOM case", function () {
            chaosHandler["createResponse"](new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.RANDOM), cxt);
            chai_1.assert.isDefined(cxt.response);
        });
    });
    describe("sendRequest", function () {
        var cxt = {
            request: "https://graph.microsoft.com/v1.0/me",
            options: {
                method: "GET",
            },
        };
        var manualMap = new Map([["/me", new Map([["GET", 500]])]]);
        var tempManualOptions = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, undefined, undefined, 100);
        var tempChaosHandler = new ChaosHandler_1.ChaosHandler(tempManualOptions, manualMap);
        var dummyHTTPHandler = new DummyHTTPMessageHandler_1.DummyHTTPMessageHandler();
        var handler = new ChaosHandler_1.ChaosHandler();
        handler.setNext(dummyHTTPHandler);
        it("Should return a response after creating it", function () {
            tempChaosHandler["sendRequest"](tempManualOptions, cxt);
            chai_1.assert.isDefined(cxt.response);
        });
        it("Should send the request to the graph", function () {
            handler["sendRequest"](new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.RANDOM, "I generated the error", undefined, 100), cxt);
            chai_1.assert.isDefined(cxt.response);
        });
    });
    describe("getRandomStatusCode", function () {
        it("Should return a status code for GET method", function () {
            chai_1.assert.isDefined(chaosHandler["getRandomStatusCode"](RequestMethod_1.RequestMethod.GET));
        });
        it("Should return a status code for POST method", function () {
            chai_1.assert.isDefined(chaosHandler["getRandomStatusCode"](RequestMethod_1.RequestMethod.POST));
        });
        it("Should return a status code for PUT method", function () {
            chai_1.assert.isDefined(chaosHandler["getRandomStatusCode"](RequestMethod_1.RequestMethod.PUT));
        });
        it("Should return a status code for PATCH method", function () {
            chai_1.assert.isDefined(chaosHandler["getRandomStatusCode"](RequestMethod_1.RequestMethod.PATCH));
        });
        it("Should return a status code for DELETE method", function () {
            chai_1.assert.isDefined(chaosHandler["getRandomStatusCode"](RequestMethod_1.RequestMethod.DELETE));
        });
    });
    describe("getRelativeURL", function () {
        it("Should return a relative URL for the complete URL", function () {
            chai_1.assert.equal(chaosHandler["getRelativeURL"]("https://graph.microsoft.com/v1.0/me"), "/me");
        });
        it("Should return a relative URL for the complete URL with filter", function () {
            chai_1.assert.equal(chaosHandler["getRelativeURL"]("https://graph.microsoft.com/v1.0/me/messages?filter=emailAddress eq 'jon@contoso.com'"), "/me/messages");
        });
        it("Should return a relative URL for the complete URL with ids", function () {
            chai_1.assert.equal(chaosHandler["getRelativeURL"]("https://graph.microsoft.com/v1.0/me/messages/q1abcxx-xxxxxx-xxxxabc"), "/me/messages/q1abcxx-xxxxxx-xxxxabc");
        });
        it("Should return a relative URL for the complete URL in case of beta", function () {
            chai_1.assert.equal(chaosHandler["getRelativeURL"]("https://graph.microsoft.com/beta/me/messages"), "/me/messages");
        });
    });
    describe("setStatusCode", function () {
        var manualMap = new Map([
            [
                "/me/messages/.*",
                new Map([
                    ["GET", 500],
                    ["PATCH", 201],
                ]),
            ],
            [
                "/me",
                new Map([
                    ["GET", 500],
                    ["PATCH", 201],
                ]),
            ],
        ]);
        var tempManualOptions = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL);
        var tempManualOptionsRegex = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL);
        var tempChaosHandlerManual = new ChaosHandler_1.ChaosHandler(tempManualOptions, manualMap);
        var tempChaosHandlerManualRegex = new ChaosHandler_1.ChaosHandler(tempManualOptionsRegex, manualMap);
        it("Should set a statusCode for MANUAL mode", function () {
            var tempOptions = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Set status code", 404);
            chaosHandler["setStatusCode"](tempOptions, "https://graph.microsoft.com/v1.0/me", RequestMethod_1.RequestMethod.GET);
            chai_1.assert.isDefined(tempOptions.statusCode);
        });
        it("Should  set a statusCode for RANDOM mode", function () {
            var tempOptions = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.RANDOM, "I generated the error", undefined, 100);
            chaosHandler["setStatusCode"](tempOptions, "https://graph.microsoft.com/v1.0/me", RequestMethod_1.RequestMethod.POST);
            chai_1.assert.isDefined(tempOptions.statusCode);
        });
        it("Should set a statusCode for MANUAL mode with manualMap", function () {
            tempChaosHandlerManual["setStatusCode"](tempManualOptions, "https://graph.microsoft.com/v1.0/me", RequestMethod_1.RequestMethod.PATCH);
            chai_1.assert.equal(tempManualOptions.statusCode, 201);
        });
        it("Should set a statusCode for MANUAL mode with manualMap matching regex", function () {
            tempChaosHandlerManualRegex["setStatusCode"](tempManualOptionsRegex, "https://graph.microsoft.com/v1.0/me/messages/abc123-xxxxx-xxxxx", RequestMethod_1.RequestMethod.GET);
            chai_1.assert.equal(tempManualOptionsRegex.statusCode, 500);
        });
    });
    describe("getOptions", function () {
        it("Should return the options in the context object", function () {
            var options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Get options", 405);
            var cxt = {
                request: "url",
                middlewareControl: new MiddlewareControl_1.MiddlewareControl([options]),
            };
            var o = chaosHandler["getOptions"](cxt);
            chai_1.assert.equal(o.chaosStrategy, ChaosStrategy_1.ChaosStrategy.MANUAL);
            chai_1.assert.equal(o.statusCode, 405);
        });
        it("Should return the default set of options with RANDOM in the middleware", function () {
            var cxt = {
                request: "url",
            };
            var o = chaosHandler["getOptions"](cxt);
            chai_1.assert.equal(o.chaosStrategy, ChaosStrategy_1.ChaosStrategy.RANDOM);
            chai_1.assert.equal(o.statusCode, undefined);
        });
        it("Should return the default set of options with DEFAULT in the middleware", function () {
            var tempChaosHandler = new ChaosHandler_1.ChaosHandler(new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL));
            var cxt = {
                request: "url",
            };
            var o = tempChaosHandler["getOptions"](cxt);
            chai_1.assert.equal(o.chaosStrategy, ChaosStrategy_1.ChaosStrategy.MANUAL);
            chai_1.assert.equal(o.statusCode, undefined);
        });
    });
    describe("execute", function () {
        var manualMap = new Map([
            [
                "/me",
                new Map([
                    ["GET", 500],
                    ["PATCH", 201],
                ]),
            ],
        ]);
        var dummyHTTPHandler = new DummyHTTPMessageHandler_1.DummyHTTPMessageHandler();
        var tempChaosHandlerDefault = new ChaosHandler_1.ChaosHandler(new ChaosHandlerOptions_1.ChaosHandlerOptions());
        var tempChaosHandlerRandom = new ChaosHandler_1.ChaosHandler(new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.RANDOM));
        var tempChaosHandlerManual = new ChaosHandler_1.ChaosHandler(new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL), manualMap);
        tempChaosHandlerDefault.setNext(dummyHTTPHandler);
        tempChaosHandlerRandom.setNext(dummyHTTPHandler);
        tempChaosHandlerManual.setNext(dummyHTTPHandler);
        it("Should return response for Default Case", function () {
            var options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.RANDOM);
            var cxt = {
                request: "https://graph.microsoft.com/v1.0/me",
                options: {
                    method: "GET",
                },
                middlewareControl: new MiddlewareControl_1.MiddlewareControl([options]),
            };
            chai_1.assert.isDefined(tempChaosHandlerDefault["execute"](cxt));
        });
        it("Should return response for Random case", function () {
            var cxt = {
                request: "https://graph.microsoft.com/v1.0/me",
                options: {
                    method: "GET",
                },
            };
            chai_1.assert.isDefined(tempChaosHandlerRandom["execute"](cxt));
        });
        it("Should return response for Manual Global case", function () {
            var cxt = {
                request: "https://graph.microsoft.com/v1.0/me",
                options: {
                    method: "GET",
                },
            };
            chai_1.assert.isDefined(tempChaosHandlerManual["execute"](cxt));
        });
        it("Should return response for Manual Request Level case", function () {
            var options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Manual Request level case", 200);
            var cxt = {
                request: "https://graph.microsoft.com/v1.0/me",
                options: {
                    method: "GET",
                },
                middlewareControl: new MiddlewareControl_1.MiddlewareControl([options]),
            };
            chai_1.assert.isDefined(tempChaosHandlerManual["execute"](cxt));
        });
        it("Should return response for Manual Request Level case 100%", function () {
            var options = new ChaosHandlerOptions_1.ChaosHandlerOptions(ChaosStrategy_1.ChaosStrategy.MANUAL, "Manual Request level case", 429, 100);
            var cxt = {
                request: "https://graph.microsoft.com/v1.0/me",
                options: {
                    method: "GET",
                },
                middlewareControl: new MiddlewareControl_1.MiddlewareControl([options]),
            };
            chai_1.assert.isDefined(tempChaosHandlerManual["execute"](cxt));
        });
    });
});
//# sourceMappingURL=ChaosHandler.js.map