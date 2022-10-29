"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var GraphClientError_1 = require("../../../src/GraphClientError");
describe("GraphClientError", function () {
    var message = "test";
    var name = "test_name";
    it("Should return GraphClientError error with message set", function () {
        var gError = new GraphClientError_1.GraphClientError(message);
        chai_1.assert.equal(gError.message, message);
    });
    it("Should return GraphClientError when Error object is passed", function () {
        var errorParameter = new Error(message);
        errorParameter.name = name;
        var gError = GraphClientError_1.GraphClientError.setGraphClientError(errorParameter);
        chai_1.assert.equal(gError.message, message);
        chai_1.assert.equal(gError.name, name);
    });
    it("Should return GraphClientError when custom error object is passed", function () {
        var customErrorParameter = { errorName: name, errorMessage: message };
        var gError = GraphClientError_1.GraphClientError.setGraphClientError(customErrorParameter);
        chai_1.assert.isDefined(gError.customError);
        chai_1.assert.equal(gError.customError, customErrorParameter);
    });
});
//# sourceMappingURL=GraphClientError.js.map