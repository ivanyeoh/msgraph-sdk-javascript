"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module MiddlewareControl
 */
require("isomorphic-fetch");
var chai_1 = require("chai");
var MiddlewareControl_1 = require("../../../src/middleware/MiddlewareControl");
var DummyHandlerOptions_1 = require("../../DummyHandlerOptions");
describe("MiddlewareControl.ts", function () {
    var dummyHandlerOption = new DummyHandlerOptions_1.DummyHandlerOptions();
    describe("constructor", function () {
        it("Should populate its middleware options map", function () {
            var middlewareControl = new MiddlewareControl_1.MiddlewareControl([dummyHandlerOption]);
            chai_1.assert.isDefined(middlewareControl["middlewareOptions"]);
            chai_1.assert.equal(middlewareControl["middlewareOptions"].size, 1);
        });
        it("Should create empty middleware options map  by default", function () {
            var middlewareControl = new MiddlewareControl_1.MiddlewareControl();
            chai_1.assert.isDefined(middlewareControl["middlewareOptions"]);
            chai_1.assert.equal(middlewareControl["middlewareOptions"].size, 0);
        });
    });
    describe("getMiddlewareOption", function () {
        it("Should return the middleware option for a given class name", function () {
            var middlewareControl = new MiddlewareControl_1.MiddlewareControl([dummyHandlerOption]);
            var retryOptions = middlewareControl.getMiddlewareOptions(dummyHandlerOption.constructor);
            chai_1.assert.isDefined(retryOptions);
            chai_1.assert.equal(dummyHandlerOption, retryOptions);
        });
        it("Should return undefined for unknown class name", function () {
            var middlewareControl = new MiddlewareControl_1.MiddlewareControl([dummyHandlerOption]);
            var retryOptions = middlewareControl.getMiddlewareOptions(function () { return "NotAvailableHandlerOption"; });
            chai_1.assert.isUndefined(retryOptions);
        });
    });
});
//# sourceMappingURL=MiddlewareControl.js.map