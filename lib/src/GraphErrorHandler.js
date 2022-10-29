"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphErrorHandler = void 0;
var tslib_1 = require("tslib");
/**
 * @module GraphErrorHandler
 */
var GraphError_1 = require("./GraphError");
/**
 * @class
 * Class for GraphErrorHandler
 */
var GraphErrorHandler = /** @class */ (function () {
    function GraphErrorHandler() {
    }
    /**
     * @private
     * @static
     * Populates the GraphError instance with Error instance values
     * @param {Error} error - The error returned by graph service or some native error
     * @param {number} [statusCode] - The status code of the response
     * @returns The GraphError instance
     */
    GraphErrorHandler.constructError = function (error, statusCode) {
        var gError = new GraphError_1.GraphError(statusCode, "", error);
        if (error.name !== undefined) {
            gError.code = error.name;
        }
        gError.body = error.toString();
        gError.date = new Date();
        return gError;
    };
    /**
     * @private
     * @static
     * @async
     * Populates the GraphError instance from the Error returned by graph service
     * @param {GraphAPIErrorResponse} graphError - The error possibly returned by graph service or some native error
     * @param {number} statusCode - The status code of the response
     * @returns A promise that resolves to GraphError instance
     *
     * Example error for https://graph.microsoft.com/v1.0/me/events?$top=3&$search=foo
     * {
     *      "error": {
     *          "code": "SearchEvents",
     *          "message": "The parameter $search is not currently supported on the Events resource.",
     *          "innerError": {
     *              "request-id": "b31c83fd-944c-4663-aa50-5d9ceb367e19",
     *              "date": "2016-11-17T18:37:45"
     *          }
     *      }
     *  }
     */
    GraphErrorHandler.constructErrorFromResponse = function (graphError, statusCode) {
        var error = graphError.error;
        var gError = new GraphError_1.GraphError(statusCode, error.message);
        gError.code = error.code;
        if (error.innerError !== undefined) {
            gError.requestId = error.innerError["request-id"];
            gError.date = new Date(error.innerError.date);
        }
        gError.body = JSON.stringify(error);
        return gError;
    };
    /**
     * @public
     * @static
     * @async
     * To get the GraphError object
     * Reference - https://docs.microsoft.com/en-us/graph/errors
     * @param {any} [error = null] - The error returned by graph service or some native error
     * @param {number} [statusCode = -1] - The status code of the response
     * @param {GraphRequestCallback} [callback] - The graph request callback function
     * @returns A promise that resolves to GraphError instance
     */
    GraphErrorHandler.getError = function (error, statusCode, callback) {
        if (error === void 0) { error = null; }
        if (statusCode === void 0) { statusCode = -1; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var gError;
            return tslib_1.__generator(this, function (_a) {
                if (error && error.error) {
                    gError = GraphErrorHandler.constructErrorFromResponse(error, statusCode);
                }
                else if (error instanceof Error) {
                    gError = GraphErrorHandler.constructError(error, statusCode);
                }
                else {
                    gError = new GraphError_1.GraphError(statusCode);
                    gError.body = error; // if a custom error is passed which is not instance of Error object or a graph API response
                }
                if (typeof callback === "function") {
                    callback(gError, null);
                }
                else {
                    return [2 /*return*/, gError];
                }
                return [2 /*return*/];
            });
        });
    };
    return GraphErrorHandler;
}());
exports.GraphErrorHandler = GraphErrorHandler;
//# sourceMappingURL=GraphErrorHandler.js.map