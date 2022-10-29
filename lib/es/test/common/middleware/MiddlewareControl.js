/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module MiddlewareControl
 */
import "isomorphic-fetch";
import { assert } from "chai";
import { MiddlewareControl } from "../../../src/middleware/MiddlewareControl";
import { DummyHandlerOptions } from "../../DummyHandlerOptions";
describe("MiddlewareControl.ts", () => {
    const dummyHandlerOption = new DummyHandlerOptions();
    describe("constructor", () => {
        it("Should populate its middleware options map", () => {
            const middlewareControl = new MiddlewareControl([dummyHandlerOption]);
            assert.isDefined(middlewareControl["middlewareOptions"]);
            assert.equal(middlewareControl["middlewareOptions"].size, 1);
        });
        it("Should create empty middleware options map  by default", () => {
            const middlewareControl = new MiddlewareControl();
            assert.isDefined(middlewareControl["middlewareOptions"]);
            assert.equal(middlewareControl["middlewareOptions"].size, 0);
        });
    });
    describe("getMiddlewareOption", () => {
        it("Should return the middleware option for a given class name", () => {
            const middlewareControl = new MiddlewareControl([dummyHandlerOption]);
            const retryOptions = middlewareControl.getMiddlewareOptions(dummyHandlerOption.constructor);
            assert.isDefined(retryOptions);
            assert.equal(dummyHandlerOption, retryOptions);
        });
        it("Should return undefined for unknown class name", () => {
            const middlewareControl = new MiddlewareControl([dummyHandlerOption]);
            const retryOptions = middlewareControl.getMiddlewareOptions(() => "NotAvailableHandlerOption");
            assert.isUndefined(retryOptions);
        });
    });
});
//# sourceMappingURL=MiddlewareControl.js.map